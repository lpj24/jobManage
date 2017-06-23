package com.hbgj.bi.controller;

import java.io.IOException;
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
	 * 更新当前全部记录
	 * @throws InterruptedException 
	 * @throws IOException 
	 */
	@RequestMapping(value= "/updateAllRecord", method=RequestMethod.POST)
	public String updateAllRecord(@RequestBody List<Object> updateRecordList) throws IOException, InterruptedException {
		String executeFile = getExecuteFile();
		for(int i=0; i < updateRecordList.size(); i++) {
			HashMap<String, String> allRecord = (HashMap<String, String>) updateRecordList.get(i);
			executePy(allRecord.get("jobTable"), allRecord.get("jobPath"), allRecord.get("jobName"), 
					allRecord.get("jobDay"), allRecord.get("jobType"), executeFile);

		}
		return "index";
	}
	
}
