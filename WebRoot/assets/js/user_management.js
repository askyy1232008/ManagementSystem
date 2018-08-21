$(function() {
	var basePath = "/ManagementSystem"; //javaProject
	var token = $.cookie('__token__');
	//列设置
	var columns = [
		{
			"id" : 0,
			"name_zh_cn" : "用户ID",
			"name_en_us" : "userID",
			"property" : {
				"display" : "none"
			}
		},
		{
			"id" : 1,
			"name_zh_cn" : "用户姓名",
			"name_en_us" : "userName",
			"property" : {
				"display" : ""
			}
		},
		{
			"id" : 2,
			"name_zh_cn" : "手机号码",
			"name_en_us" : "phoneNumber",
			"property" : {
				"display" : ""
			}
		},
		{
			"id" : 3,
			"name_zh_cn" : "用户密码",
			"name_en_us" : "password",
			"property" : {
				"display" : "none"
			}
		},
		{
			"id" : 4,
			"name_zh_cn" : "组织",
			"name_en_us" : "organization",
			"property" : {
				"display" : ""
			}
		},
		{
			"id" : 5,
			"name_zh_cn" : "注册日期",
			"name_en_us" : "createTime",
			"property" : {
				"display" : "",
				"timestampToTime" : true
			}
		},
		{
			"id" : 6,
			"name_zh_cn" : "最后登录日期",
			"name_en_us" : "lastLoginTime",
			"property" : {
				"display" : "",
				"timestampToTime" : true
			}
		},
		{
			"id" : 7,
			"name_zh_cn" : "账号状态",
			"name_en_us" : "status",
			"property" : {
				"display" : "",
				"radio" : {
					"value" : "Integer",
					"one" : "启用",
					"zero" : "禁用"
				}
			}
		},
		{
			"id" : 8,
			"name_zh_cn" : "登录状态",
			"name_en_us" : "isOnline",
			"property" : {
				"display" : "",
				"radio" : {
					"value" : "Boolean",
					"yes" : "在线",
					"not" : "离线"
				}
			}
		}
	];
	//设置高度和宽度
	$('.main-box').width($('body').width() - 40);
	$('.main-box').height($('body').height() - 20);
	$('.table-td').width(($('.main-box').width() - 27) / 7);
	$('.nav-tools').width($('.main-box').width());
	//设置组织下拉框
	$('#organization').combobox({
		valueField : 'id',
		textField : 'text',
		editable : false,
		data : [ {
			"id" : 1,
			"text" : "全部",
			"selected" : true
		}, {
			"id" : 2,
			"text" : "宜春行者"
		}, {
			"id" : 3,
			"text" : "广州行者"
		}, {
			"id" : 4,
			"text" : "高安行者"
		} ]
	});
	//设置账号状态下拉框
	$('#status').combobox({
		valueField : 'id',
		textField : 'text',
		editable : false,
		data : [ {
			"id" : 1,
			"text" : "全部",
			"selected" : true
		}, {
			"id" : 2,
			"text" : "启用"
		}, {
			"id" : 3,
			"text" : "禁用"
		} ]
	});
	//登录状态下拉框
	$('#isOnline').combobox({
		valueField : 'id',
		textField : 'text',
		editable : false,
		data : [ {
			"id" : 1,
			"text" : "全部",
			"selected" : true
		}, {
			"id" : 2,
			"text" : "在线"
		}, {
			"id" : 3,
			"text" : "离线"
		} ]
	});
	//设置注册日期时间选择插件
	register_start = $("#register-start");
	register_end = $("#register-end");
	login_start = $("#login-start");
	login_end = $("#login-end");
	register_start.datetimebox({
		editable : false,
		showSeconds : false,
		formatter : formatter,
		parser : parser
	});
	register_end.datetimebox({
		editable : false,
		showSeconds : false,
		formatter : formatter,
		parser : parser
	});
	login_start.datetimebox({
		editable : false,
		showSeconds : false,
		formatter : formatter,
		parser : parser
	});
	login_end.datetimebox({
		editable : false,
		showSeconds : false,
		formatter : formatter,
		parser : parser
	});
	//展开隐藏
	$('.toggle-btn').click(function() {
		var inner_text = $(this).html();
		switch (inner_text) {
		case "展开":
			$(this).html("隐藏");
			$('.table').children('.table-tr:last').css('display', 'table-row');
			$('.sreach1').hide();
			break;
		case "隐藏":
			$(this).html("展开");
			$('.table').children('.table-tr:last').css('display', 'none');
			$('.sreach1').show();
			break;
		}
	});
	//查询
	$('.sreach1,.sreach2').click(function() {
		$('.loading').show();
		var userName = $('#userName').val();
		var phoneNumber = $('#phoneNumber').val();
		var organization = $('#organization').combobox('getText');
		
		var status = $('#status').combobox('getText');
		if(status != "全部"){
			status = $('#status').combobox('getText') == "启用" ? 1 : 0
		}else{
			status = -1;
		}
		var registerStart = $('#register-start').datetimebox('getValue');
		if(registerStart == ""){
		 	registerStart = "2000-01-01 00:00:00";
		}
		var registerEnd = $('#register-end').datetimebox('getValue');
		if(registerEnd == ""){
			registerEnd = "2222-01-01 00:00:00";
		}
		var isOnline = $('#isOnline').combobox('getText');
		if(isOnline !="全部"){
			isOnline = $('#isOnline').combobox('getText') == "在线" ? 1 : 0;
		}else{
			isOnline = -1;
		}
		var loginStart = $('#login-start').datetimebox('getValue');
		if(loginStart == ""){
			loginStart = "2000-01-01 00:00:00";
		}
		var loginEnd = $('#login-end').datetimebox('getValue');
		if(loginEnd == ""){
			loginEnd = "2222-01-01 00:00:00";
		}
		if(new Date(registerEnd).getTime()<new Date(registerStart).getTime()){
			alert('注册起始日期必然小于结束日期！日期选择错误！');
			return false;
		}
		if(new Date(loginEnd).getTime()<new Date(loginStart).getTime()){
			alert('最后登录起始日期必然小于结束日期！日期选择错误！');
			return false;
		}
		var userParams = {
			userName : userName,
			phoneNumber : phoneNumber,
			organization : organization,
			status : status,
			registerStart : registerStart,
			registerEnd : registerEnd,
			isOnline : isOnline,
			loginStart : loginStart,
			loginEnd : loginEnd
		};
		$.ajax({
			type : 'get',
			url : basePath + "/user/page_toolbar",
			dataType : 'json',
			data : {
				token : token == 'undefined' ? "" : token,
				params :JSON.stringify(userParams)
			},
			cache : false,
			success : function(data) {
				if (data == "null") {
					alert('您没有权限获取该信息，请联系管理人员！');
					return false;
				}
				if (data.code == 200) {
					var number = data.data;
					var lastPage = Math.ceil(number / 10);
					$('.pageNumber').html(lastPage);
					var pageNumber = lastPage;
					//data load
					loadDatagrid(basePath, 7, pageNumber, 1, 1, columns, "/user/user_management", userParams);
				} else {
					alert(data.message);
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				if (textStatus == "error") {
					alert("服务器无法正常连接！请联系开发人员！");
				}
			}
		});
	});
});