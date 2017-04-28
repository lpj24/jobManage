package com.hbgj.bi.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class UtilHelper {
	
	private static volatile ObjectMapper objectMapper;
	
	private static ObjectMapper getObjectMapper() {
		if (objectMapper == null) {
			synchronized (UtilHelper.class) {
				if (objectMapper == null) {
					objectMapper = new ObjectMapper();
				}
			}
		}
		
		return objectMapper;
	}
    public static String toJsonString(Object value) throws JsonProcessingException {
		return UtilHelper.getObjectMapper().writeValueAsString(value);
	}
    
    //清除process的标准输出与错误输出的缓冲区
    public static void clearInputAndErrorBuffer(Process process) {
		 final InputStream is1 = process.getInputStream();   

		 final InputStream is2 = process.getErrorStream();  
		 new Thread() {  
		    public void run() {  
		       BufferedReader br1 = new BufferedReader(new InputStreamReader(is1));  
		        try {  
		            String line1 = null;  
		            while ((line1 = br1.readLine()) != null) {  
		                  if (line1 != null){}  
		              }  
		        } catch (IOException e) {  
		             e.printStackTrace();  
		        }  
		        finally{  
		             try {  
		               is1.close();  
		             } catch (IOException e) {  
		                e.printStackTrace();  
		            }  
		          }  
		        }  
		     }.start();
		     
		     new Thread() {   
		         public void  run() {   
		          BufferedReader br2 = new  BufferedReader(new  InputStreamReader(is2));   
		             try {   
		                String line2 = null ;   
		                while ((line2 = br2.readLine()) !=  null ) {   
		                     if (line2 != null){}  
		                }   
		              } catch (IOException e) {   
		                    e.printStackTrace();  
		              }   
		             finally{  
		                try {  
		                    is2.close();  
		                } catch (IOException e) {  
		                    e.printStackTrace();  
		                }  
		              }  
		           }   
		         }.start(); 
    }
}