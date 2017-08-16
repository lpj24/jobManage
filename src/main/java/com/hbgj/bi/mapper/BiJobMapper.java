package com.hbgj.bi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.ResultMap;
import org.apache.ibatis.annotations.Select;

import com.hbgj.bi.model.BiJob;

public interface BiJobMapper {
	public List<BiJob> selectAllJobByType(int jobType);
	public List<BiJob> selectAllJobByTable(String tableName);
	public List<BiJob> selectErrorUpdateLast(List<String> jobList);
	public List<String> selectErrorJobTable(String sDay);
	
	@Select("select id, job_name, job_path, job_doc, job_table, job_type, renewable from bi_execute_job where id=#{id}")
	@ResultMap("biJobDto")
	public BiJob selectJobInfoById(String jobId);
}