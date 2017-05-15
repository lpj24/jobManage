package com.hbgj.bi.mapper;

import java.util.List;

import com.hbgj.bi.model.BiJob;

public interface BiJobMapper {
	public List<BiJob> selectAllJobByType(int jobType);
	public List<BiJob> selectAllJobByTable(String tableName);
	public List<BiJob> selectErrorUpdateLast(List<String> jobList);
	public List<String> selectErrorJobTable(String sDay);
}