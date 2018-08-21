package com.lee.service.impl;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import sun.misc.BASE64Encoder; 
import sun.misc.BASE64Decoder;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lee.dao.BaseDao;
import com.lee.entity.User;
import com.lee.entity.UserParams;
import com.lee.service.UserService;
import com.lee.util.RedisUtil;

@Service
public class UserServiceImpl implements UserService {

	private static Random rand = new Random(System.currentTimeMillis());
	private static int token_seed = 0;

	@Autowired
	private BaseDao baseDao;
	@Autowired
	private User u;
	@Autowired
	private RedisUtil redisUtil;

	@Override
	public Map<String, Object> login(String userName, String password, String system , String time)
			throws UnsupportedEncodingException {
		int expiresDate = Integer.parseInt(time);
		Map<String, Object> m = new HashMap<String, Object>();
		String[] systemNamePC = { "Mac", "Unix", "Linux", "Win2000", "WinXP", "Win2003", "WinVista", "Win7", "Win10",
				"other" };
		String[] systemNameMoveDevice = { "IOS", "Android", "Ipad" };
		int lengthPC = systemNamePC.length;
		int lengthMoveDevice = systemNameMoveDevice.length;
		String hql = " from User where userName='" + userName + "' and password='" + password + "'";
		List<Object> list = baseDao.list(hql);
		int len = list.size();
		for (int i = 0; i < len; i++) {
			u = (User) list.get(i);
		}
		String token = getToken(u.getUserID().toString());
		if (len > 0) {
			m.put("user", u);
			m.put("token", token);
			for (int i = 0; i < lengthPC; i++) {
				if (system.equals(systemNamePC[i])) {
					redisUtil.set("token"+u.getUserID(), token, expiresDate * 60 * 60L); // 设定redis token . expiresDate=1   生存周期时长为1小时
					redisUtil.set("user"+u.getUserID(), u, expiresDate * 60 * 60L);
				}
			}
			for (int i = 0; i < lengthMoveDevice; i++) {
				if (system.equals(systemNameMoveDevice[i])) {
					redisUtil.set("token"+u.getUserID(), token, 60L);
					redisUtil.set("user"+u.getUserID(), u, 60L);
				}
			}
		} else {
			m.put("user", null);
		}

		return m;
	}

	/**
	 * 获取Token
	 * 
	 * @return
	 */
	public String getToken(String userID) {
		String token = Integer.toString(rand.nextInt(9999));

		synchronized (this) {
			token += Integer.toString(token_seed);
			token_seed = (token_seed + 1) % 9999;
			// 确定计算方法
			MessageDigest md5;
			try {
				//MD5 加密系统秘钥
				md5 = MessageDigest.getInstance("MD5");
				final Base64.Encoder encoderMD5 = Base64.getEncoder();
				String mmsToken = encoderMD5.encodeToString(md5.digest("lifu".getBytes("UTF-8")));
				//base64 加密userID
				final BASE64Encoder encoder = new BASE64Encoder();
				String userIDToken = encoder.encode(userID.getBytes("UTF-8"));
				//组成完整的token
				token = userIDToken + "."+ token + mmsToken;
			} catch (NoSuchAlgorithmException e) {
				e.printStackTrace();
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		}
		return token;
	}

	@Override
	public void updateUser(User u) {
		baseDao.update(u);
	}

	@Override
	public boolean checkToken(String userIDToken) throws IOException,UnsupportedEncodingException {
		//base64 解密userID
		final BASE64Decoder decoder = new BASE64Decoder();
		String s = new String(decoder.decodeBuffer(userIDToken), "UTF-8");
		return redisUtil.hasKey("token"+s);
	}

	@Override
	public void removeUserToken(String userIDToken)  throws IOException,UnsupportedEncodingException {
		final BASE64Decoder decoder = new BASE64Decoder();
		String s = new String(decoder.decodeBuffer(userIDToken), "UTF-8");
		redisUtil.del("token"+s);
		redisUtil.del("user"+s);
	}

	@Override
	public List<Object> getObjects(String obj,String page,String pageSize,UserParams params) {
		int number = (Integer.parseInt(page)-1) * Integer.parseInt(pageSize);
		String hql = "";
		if(obj.equals("User")){
			hql = " from User where userName = '"+ params.getUserName() +"'";
			hql += " and phoneNumber = '" + params.getPhoneNumber() + "'";
			hql += " and organization = '" + params.getOrganization() + "'";
			hql += " and status = " + Integer.parseInt(params.getStatus()) + "";
			hql += " and createTime > '" + params.getRegisterStart() + "'";
			hql += " and createTime < '" + params.getRegisterEnd() + "'";
			hql += " and isOnline = " + Integer.parseInt(params.getIsOnline()) + "";
			hql += " and lastLoginTime > '" + params.getLoginStart() + "'";
			hql += " and lastLoginTime < '" + params.getLoginEnd() + "'";
			hql = userLikeSreach(hql,params);
			hql = hql + " order by userID desc ";
		}
		if(Integer.parseInt(page) == 1){
			@SuppressWarnings("unchecked")
			List<Object> list = (List<Object>) baseDao.execQuery(hql,0,Integer.parseInt(pageSize));
			return list;
		}else{
			@SuppressWarnings("unchecked")
			List<Object> list = (List<Object>) baseDao.execQuery(hql,number,Integer.parseInt(pageSize));
			return list;
		}
		
	}

	//var params = [userName,phoneNumber,organization,status,registerStart,registerEnd,online,loginStart,loginEnd];
	@Override
	public Integer getObjectsCount(String obj,UserParams params) throws Exception {
		String hql = "";
		if(obj.equals("User")){
			hql = "select count(*) from User where userName = '"+ params.getUserName() +"'";
			hql += " and phoneNumber = '" + params.getPhoneNumber() + "'";
			hql += " and organization = '" + params.getOrganization() + "'";
			hql += " and status = " + Integer.parseInt(params.getStatus()) + "";
			hql += " and createTime > '" + params.getRegisterStart() + "'";
			hql += " and createTime < '" + params.getRegisterEnd() + "'";
			hql += " and isOnline = " + Integer.parseInt(params.getIsOnline()) + "";
			hql += " and lastLoginTime > '" + params.getLoginStart() + "'";
			hql += " and lastLoginTime < '" + params.getLoginEnd() + "'";
			hql = userLikeSreach(hql,params);
		}
		return baseDao.execQuery(hql);
	}
	
	/***
	 * 判断该对象是否: 返回ture表示所有属性为null  返回false表示不是所有属性都是null
	 * @param obj
	 * @return
	 * @throws Exception
	 */
    @SuppressWarnings("null")
	public static boolean isAllFieldNull(Object obj) throws Exception{
        Class<? extends Object> stuCla = (Class<? extends Object>) obj.getClass();// 得到类对象
        Field[] fs = stuCla.getDeclaredFields();//得到属性集合
        boolean flag = true;
        for (Field f : fs) {//遍历属性
            f.setAccessible(true); // 设置属性是可以访问的(私有的也可以)
            Object val = f.get(obj);// 得到此属性的值
            if(val !=null || !val.equals("")) {//只要有1个属性不为空,那么就不是所有的属性值都为空
                flag = false;
                break;
            }
        }
        return flag;
    }
    /***
     * 对用户表的条件模糊查询hql字符串截取
     * @param hql
     * @param params
     * @return
     */
    public static String userLikeSreach(String hql,UserParams params){
    	//全部原始hql字符长度
		int lenAll = hql.length();
		int lenHeader = 0;
		if(params.getUserName().equals("")){
			String header = StringUtils.substringBefore(hql, "userName");
			lenHeader = header.length();
			int self = "userName = '' and".length();
			hql = hql.substring(0, lenHeader) + hql.substring(lenHeader+self,lenAll);
			lenAll = lenAll - self;
		}
		if(params.getPhoneNumber().equals("")){
			String header = StringUtils.substringBefore(hql, "phoneNumber");
			lenHeader = header.length();
			int self = "phoneNumber = '' and".length();
			hql = hql.substring(0, lenHeader) + hql.substring(lenHeader+self,lenAll);
			lenAll = lenAll - self;
		}
		if(params.getOrganization().equals("")){
			String header = StringUtils.substringBefore(hql, "organization");
			lenHeader = header.length();
			int self = "organization = '' and".length();
			hql = hql.substring(0, lenHeader) + hql.substring(lenHeader+self,lenAll);
			lenAll = lenAll - self;
		}
		if(params.getStatus().equals("")){
			String header = StringUtils.substringBefore(hql, "status");
			lenHeader = header.length();
			int self = "status =  and".length();
			hql = hql.substring(0, lenHeader) + hql.substring(lenHeader+self,lenAll);
			lenAll = lenAll - self;
		}
		if(params.getRegisterStart().equals("")){
			String header = StringUtils.substringBefore(hql, "createTime");
			lenHeader = header.length();
			int self = "createTime > '' and".length();
			hql = hql.substring(0, lenHeader) + hql.substring(lenHeader+self,lenAll);
			lenAll = lenAll - self;
		}
		if(params.getRegisterEnd().equals("")){
			String header = StringUtils.substringBefore(hql, "createTime");
			lenHeader = header.length();
			int self = "createTime < '' and".length();
			hql = hql.substring(0, lenHeader) + hql.substring(lenHeader+self,lenAll);
			lenAll = lenAll - self;
		}
		if(params.getIsOnline().equals("")){
			String header = StringUtils.substringBefore(hql, "isOnline");
			lenHeader = header.length();
			int self = "isOnline =  and".length();
			hql = hql.substring(0, lenHeader) + hql.substring(lenHeader+self,lenAll);
			lenAll = lenAll - self;
		}
		if(params.getLoginStart().equals("")){
			String header = StringUtils.substringBefore(hql, "lastLoginTime");
			lenHeader = header.length();
			int self = "lastLoginTime > '' and".length();
			hql = hql.substring(0, lenHeader) + hql.substring(lenHeader+self,lenAll);
			lenAll = lenAll - self;
		}
		if(params.getLoginEnd().equals("")){
			String header = StringUtils.substringBefore(hql, "lastLoginTime");
			lenHeader = header.length();
			int self = "lastLoginTime < ''".length();
			hql = hql.substring(0, lenHeader) + hql.substring(lenHeader+self,lenAll);
			lenAll = lenAll - self;
		}
		
		if(params.getOrganization().equals("全部")){
			String header = StringUtils.substringBefore(hql, "organization");
			lenHeader = header.length();
			int self = "organization = '全部' and".length();
			hql = hql.substring(0, lenHeader) + hql.substring(lenHeader+self,lenAll);
			lenAll = lenAll - self;
		}
		if(params.getStatus().equals("-1")){
			String header = StringUtils.substringBefore(hql, "status");
			lenHeader = header.length();
			int self = "status = -1 and".length();
			hql = hql.substring(0, lenHeader) + hql.substring(lenHeader+self,lenAll);
			lenAll = lenAll - self;
		}
		if(params.getIsOnline().equals("-1")){
			String header = StringUtils.substringBefore(hql, "isOnline");
			lenHeader = header.length();
			int self = "isOnline = -1 and".length();
			hql = hql.substring(0, lenHeader) + hql.substring(lenHeader+self,lenAll);
			lenAll = lenAll - self;
		}
		String lastHeader = StringUtils.substringBefore(hql, "where");
		int lenLastHeader = lastHeader.length();
		int lenWhere = "where".length();
		String nullString = hql.substring(lenLastHeader+lenWhere, lenAll);
		if(nullString.trim().equals("")){
			hql = hql.substring(0, lenLastHeader);
		}else{
			hql = StringUtils.substringBeforeLast(hql, "and");
		}
		return hql;
    }
}
