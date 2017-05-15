package com.hbgj.bi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hbgj.bi.mapper.BiJobMapper;
import com.hbgj.bi.model.BiJob;

@Service
public class BiJobService {
	@Autowired
	BiJobMapper biJobMapper;
	
	public List<BiJob> selectAllJobByType(int jobType) {
		return biJobMapper.selectAllJobByType(jobType);
	}
	
	public List<BiJob> selectAllJobByTable(String tableName) {
		return biJobMapper.selectAllJobByTable(tableName);
	}
	
	public List selectErrorUpdateLast(String sDay) {
		List<String> errorJobTable = biJobMapper.selectErrorJobTable(sDay);
		if(!errorJobTable.isEmpty()) {
			return biJobMapper.selectErrorUpdateLast(errorJobTable);
		}else{
			return errorJobTable;
		}
		
	}
}
