package com.lee.service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

import com.lee.entity.User;
import com.lee.entity.UserParams;

public interface UserService {
	/**
	 * 用户登录
	 * @param userName
	 * @param password
	 * @return
	 * @throws UnsupportedEncodingException 
	 */
	Map<String,Object> login(String userName,String password,String system,String time) throws UnsupportedEncodingException;
	
	/**
	 * 更改用户信息
	 * @param u
	 */
	void updateUser(User u);
	/**
	 * 验证token
	 * @param userID
	 * @return
	 * @throws IOException
	 * @throws UnsupportedEncodingException
	 */
	boolean checkToken(String userIDToken) throws IOException, UnsupportedEncodingException;
	/**
	 * 移除用户的token
	 * @param userIDToken
	 * @throws UnsupportedEncodingException 
	 * @throws IOException 
	 */
	void removeUserToken(String userIDToken) throws IOException, UnsupportedEncodingException;
	/**
	 * 获取信息  分页
	 * @return
	 */
	List<Object> getObjects(String obj,String page,String pageSize,UserParams params);
	/**
	 * 获得信息的数量
	 * @param obj
	 * @param userParams  用户查询参数
	 * @return
	 * @throws Exception 
	 */
	Integer getObjectsCount(String obj,UserParams userParams) throws Exception;
}
