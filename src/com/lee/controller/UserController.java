package com.lee.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.sql.Timestamp;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.lee.entity.Result;
import com.lee.entity.User;
import com.lee.entity.UserParams;
import com.lee.service.UserService;

@Controller
@RequestMapping(value = "/user")
public class UserController {

	String basePath = System.getProperty("managementsystem-sqlserver");

	@Autowired
	private UserService userService;
	@SuppressWarnings("rawtypes")
	@Autowired
	private Result result;

	/**
	 * 登录
	 * 
	 * @param userName
	 * @param password
	 * @param sys
	 * @return
	 */
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	@ResponseBody
	public Object login(@RequestParam("username") String userName, @RequestParam("password") String password,
			@RequestParam("system") String system, @RequestParam("time") String time) {
		userName = userName.trim();
		password = password.trim();
		if (userName.equals("") || password.equals("d41d8cd98f00b204e9800998ecf8427e")) {
			result = Result.newFailure(400, Result.getCodeMessage(400), basePath + "/user/login");
			return result;
		}
		Map<String, Object> s;
		try {
			s = userService.login(userName, password, system, time);
			User u = (User) s.get("user");
			if (u == null) {
				result = Result.newFailure(401, Result.getCodeMessage(401), basePath + "/user/login");
				return result;
			} else {
				// 设置为在线 并设置最后登录时间
				u.setIsOnline(true);
				u.setLastLoginTime(new Timestamp(System.currentTimeMillis()));
				// 修改用户登录状态和时间
				userService.updateUser(u);
				// 移除用户信息
				s.remove("user");
				result = Result.newSuccess(200, Result.getCodeMessage(200), s, basePath + "/user/login");
				return result;
			}
		} catch (UnsupportedEncodingException e) {
			return Result.newException(e);
		} catch (Exception e) {
			return Result.newException(e);
		}
	}

	/***
	 * 验证用户token
	 * 
	 * @param token
	 * @return
	 */
	@RequestMapping(value = "/checkToken", method = RequestMethod.GET)
	@ResponseBody
	public Object checkToken(@RequestParam("token") String token) {
		String userIDToken = StringUtils.substringBefore(token, ".");
		boolean b;
		try {
			b = userService.checkToken(userIDToken);
			result = Result.newSuccess(200, Result.getCodeMessage(200), b, basePath + "/user/checkToken");
			return result;
		} catch (UnsupportedEncodingException e) {
			return Result.newException(e);
		} catch (IOException e) {
			return Result.newException(e);
		} catch (Exception e) {
			return Result.newException(e);
		}
	}

	/***
	 * 退出登录
	 * 
	 * @param token
	 * @return
	 */
	@RequestMapping(value = "/login_out", method = RequestMethod.GET)
	@ResponseBody
	public Object loginOut(@RequestParam("token") String token) {
		String userIDToken = StringUtils.substringBefore(token, ".");
		try {
			userService.removeUserToken(userIDToken);
			return Result.newSuccess();
		} catch (UnsupportedEncodingException e) {
			return Result.newException(e);
		} catch (IOException e) {
			return Result.newException(e);
		} catch (Exception e) {
			return Result.newException(e);
		}
	}

	/***
	 * 用户管理datagird
	 * 
	 * @param token
	 *            param
	 * @return
	 */
	@RequestMapping(value = "/user_management", method = RequestMethod.GET)
	@ResponseBody
	public Object userManagement(@RequestParam("token") String token, @RequestParam("page") String page,
			@RequestParam("pageSize") String pageSize,@RequestParam("params") String params) {
		String userIDToken = StringUtils.substringBefore(token, ".");
		UserParams userParams = JSON.parseObject(params, UserParams.class);
		try {
			boolean b = userService.checkToken(userIDToken);
			if (b) {
				return Result.newSuccess(200, Result.getCodeMessage(200), userService.getObjects("User",page, pageSize,userParams),
						basePath + "/user/user_management");
			} else {
				return null;
			}
		} catch (UnsupportedEncodingException e) {
			return Result.newException(e);
		} catch (IOException e) {
			return Result.newException(e);
		} catch (Exception e) {
			return Result.newException(e);
		}
	}
	/**
	 * 获取分页条数据
	 * @param token
	 * @return
	 */
	@RequestMapping(value = "/page_toolbar", method = RequestMethod.GET)
	@ResponseBody
	public Object pageToolbar(@RequestParam("token") String token,
			@RequestParam("params") String params){
		String userIDToken = StringUtils.substringBefore(token, ".");
		UserParams userParams = JSON.parseObject(params, UserParams.class);
		try {
			boolean b = userService.checkToken(userIDToken);
			if (b) {
				return Result.newSuccess(200, Result.getCodeMessage(200), 
						userService.getObjectsCount("User",userParams),
						basePath + "/user/page_toolbar");
			} else {
				return null;
			}
		} catch (UnsupportedEncodingException e) {
			return Result.newException(e);
		} catch (IOException e) {
			return Result.newException(e);
		} catch (Exception e) {
			return Result.newException(e);
		}
	}
}
