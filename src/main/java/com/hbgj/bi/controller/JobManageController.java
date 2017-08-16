package com.hbgj.bi.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hbgj.bi.model.BiJob;
import com.hbgj.bi.service.BiJobService;
import com.hbgj.bi.utils.UtilHelper;

@Controller
@RequestMapping("/v1")
public class JobManageController {
	
	@Autowired
	BiJobService biJobService;
	
	@RequestMapping(value = "/index", method=RequestMethod.GET)
	public String index(Model model) {
		List<BiJob> jobList = biJobService.selectAllJobByType(1);
		model.addAttribute("jobList", jobList);
		return "index";
	}
	
	@RequestMapping(value= "/dayJob", method=RequestMethod.POST)
	@ResponseBody
	public String executeDayJob(HttpServletRequest httpRequest) throws JsonProcessingException {
		Map<String, String> resultMap = new HashMap<String, String>(); 
		String tableName = (String) httpRequest.getParameter("tableName");
		String jobPath = (String) httpRequest.getParameter("jobPath");
		String jobName = (String) httpRequest.getParameter("jobName");
		String executeDay = (String) httpRequest.getParameter("executeDay");
		String jobType = httpRequest.getParameter("jobType");
		try {
			String executeFile = getExecuteFile();

			int executeResult = executePy(tableName, jobPath, jobName, executeDay, jobType, executeFile);
			if(executeResult == 1) {
				//执行失败
				resultMap.put("status", "0");
				resultMap.put("result", "更新失败, 请手动更新");
			}else {
				resultMap.put("status", "1");
				resultMap.put("result", "更新成功, 检查数据表" + tableName);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return UtilHelper.toJsonString(resultMap);
	}

	private String getExecuteFile() {
		String os_name = System.getProperty("os.name");
		String executeFile = "";
		if(os_name.contains("Windows")) {
			executeFile = "C:\\Users\\Administrator\\PycharmProjects"
			+ "\\hbgj_statistics\\dbClient\\utils.py";
		}else{
			executeFile = "/home/huolibi/local/hbgj_statistics/dbClient/utils.py";
		}
		return executeFile;
	}

	private int executePy(String tableName, String jobPath, String jobName, String executeDay, String jobType,
			String executeFile) throws IOException, InterruptedException {
		Process process = Runtime.getRuntime().exec("python " +executeFile +" -table " 
				+ tableName + " -path " + jobPath + " -name " 
				+ jobName + " -day " + executeDay + " -jobType " + jobType);
		System.out.println("python " +executeFile +" -table " 
				+ tableName + " -path " + jobPath + " -name " 
				+ jobName + " -day " + executeDay + " -jobType " + jobType);
		UtilHelper.clearInputAndErrorBuffer(process);
		int executeResult = process.waitFor();
		process.destroy();
		return executeResult;
	}
	
	@RequestMapping(value= "/fuzzy", method=RequestMethod.GET)
	public String queryJobByTable(HttpServletRequest httpRequest, Model model) {
		String tableName = (String) httpRequest.getParameter("fuzzyKey");
		List<BiJob> jobList = biJobService.selectAllJobByTable(tableName);
		model.addAttribute("jobList", jobList);
		return "index";
	}
	
	/*
	 *  获取昨日未更新记录
	 */
	@RequestMapping(value= "/last_updateJob", method=RequestMethod.GET)
	public String queryLastUpdate(HttpServletRequest httpRequest, Model model) {
		String s_day = UtilHelper.getDateStr(-1, "yyyy-MM-dd");
		List errorJobList = biJobService.selectErrorUpdateLast(s_day);
		model.addAttribute("jobList", errorJobList);
		model.addAttribute("jobListSize", errorJobList.size());
		return "index";
	}
	
	/**
	 * 更新某一时间段的所有数据, 只能更新一些只更新一天数据的定时任务, 更新多天的不能使用
	 * @throws InterruptedException 
	 * @throws IOException 
	 */
	@RequestMapping(value= "/addMoreTimeJob", method=RequestMethod.POST)
	public String updateMoreTimeJob(HttpServletRequest httpRequest, Model model) throws InterruptedException, IOException {
		String jobId = (String) httpRequest.getParameter("jobId");
		String startDate = (String) httpRequest.getParameter("startDate");
		String endDate = (String) httpRequest.getParameter("endDate");
		BiJob bj = biJobService.selectJobInfoById(jobId);
		int betweenDays = UtilHelper.countDiffDay(startDate, endDate);
		HashMap<String, String> updateRecord = new HashMap<String, String>();
		updateRecord.put("jobName", bj.getJobName());
		updateRecord.put("jobPath", bj.getJobPath());
		updateRecord.put("jobTable", bj.getJobTable());
		updateRecord.put("jobType", String.valueOf(bj.getJobType()));
		
		String executeFile = getExecuteFile();
		ArrayList<Thread> threadList = new ArrayList<Thread>();
		for(int i=1; i <= betweenDays; i++) {
			int re = executePy(bj.getJobTable(), bj.getJobPath(), bj.getJobName(), String.valueOf(i), bj.getJobTable(), executeFile);
			
		}
		
		
		return "index";
	}
	
	/**
	 * 更新当前全部记录
	 * @throws InterruptedException 
	 * @throws IOException 
	 */
	@RequestMapping(value= "/updateAllRecord", method=RequestMethod.POST)
	public String updateAllRecord(@RequestBody List<Object> updateRecordList) throws IOException, InterruptedException {
		String executeFile = getExecuteFile();
		ArrayList<Thread> threadList = new ArrayList<Thread>();
		for(int i=0; i < updateRecordList.size(); i++) {
			HashMap<String, String> allRecord = (HashMap<String, String>) updateRecordList.get(i);
//			executePy(allRecord.get("jobTable"), allRecord.get("jobPath"), allRecord.get("jobName"), 
//					allRecord.get("jobDay"), allRecord.get("jobType"), executeFile);
			Thread newThread = new Thread(new MyRunable(allRecord, executeFile));
			newThread.start();
			threadList.add(newThread);

		}
		
		for(Thread thread: threadList) {
			thread.join();
		} 
		
		System.out.println("主线程执行完毕");
		return "index";
	}
	
	class MyRunable implements Runnable {
		
		private String executeFile;
		private Map<String, String> executeParams;
		
		public MyRunable(Map executeParams, String executeFile) {
			// TODO Auto-generated constructor stub
			this.executeParams = executeParams;
			this.executeFile = executeFile;
		}
		
		public void setExecuteFile(String executeFile) {
			this.executeFile = executeFile;
		}
		
		public String getExecuteFile() {
			return executeFile;
		}

		@Override
		public void run() {
			// TODO Auto-generated method stub
			Map<String, String> executeParams = this.getExecuteParams();
			try {
				executePy(executeParams.get("jobTable"), 
						executeParams.get("jobPath"), executeParams.get("jobName"), 
						executeParams.get("jobDay"), executeParams.get("jobType"), 
						this.getExecuteFile());
			} catch (IOException | InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		public Map<String, String> getExecuteParams() {
			return executeParams;
		}

		public void setExecuteParams(Map<String, String> executeParams) {
			this.executeParams = executeParams;
		}
		
	}
}
