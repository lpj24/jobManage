package com.hbgj.bi;

import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//
@MapperScan("com.hbgj.bi.mapper")
@SpringBootApplication
public class JobManageApplication {
	private final static Logger logger = LoggerFactory.getLogger(JobManageApplication.class);  

	public static void main(String[] args) {
		logger.debug("server is running");
		SpringApplication.run(JobManageApplication.class, args);

	}
}
