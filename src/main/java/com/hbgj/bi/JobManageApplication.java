package com.hbgj.bi;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//
@MapperScan("com.hbgj.bi.mapper")
@SpringBootApplication
public class JobManageApplication {

	public static void main(String[] args) {
		SpringApplication.run(JobManageApplication.class, args);

	}
}
