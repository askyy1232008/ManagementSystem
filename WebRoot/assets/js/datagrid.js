/**
 * datagrid
 */
$(function() {
	//载入方式
	/*
	 * <div class="main-box">
	 * 	<div class="datagrid">
	 * 		//data
	 * 	</div>
	 * 	<div class='page'>
			<nav role='navigation'>
				<ul class='cd-pagination no-space'>
					<li class='button'><a class='disabled previous-page'>上一页</a></li>
					<li><a class='current'>1</a></li>
					<li class='button'><a class="next-page">下一页</a></li>
				</ul>
				<span class="pageNumber" style="display:none;"></span>
				<span class="params" style="display:none;"></span>
			</nav>
		</div>
	 * </div>
	 * datagird.css
	 * paging_toolbar.css
	 * */

	/*
	 * 参数设置--------------------------开始   
	 * */
	var basePath = "/ManagementSystem"; //设置系统根
	var loadUser = "/user/user_management";
	var loadPageToolbar = "/user/page_toolbar";
	//设置展示列的名称
	/*
	 * id：列index
	 * name_zh_cn：中文名
	 * name_en_us：英文名 
	 * property：属性
	 * 		display：是否显示
	 * 		timestampToTime：是否进行timestampToTime处理
	 * 		radio：单选属性描述    value 标识布尔型还是数值型   
	 * */
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
	//首次载入无筛选条件    -1代表全部
	var userParams = {
		userName : "",
		phoneNumber : "",
		organization : "",
		status : -1,
		registerStart : "2000-01-01 00:00:00",
		registerEnd : "2222-01-01 00:00:00",
		isOnline : -1,
		loginStart : "2000-01-01 00:00:00",
		loginEnd : "2222-01-01 00:00:00"
	};
	//token
	var token = $.cookie("__token__");
	/*
	 * 设置参数-------------------------结束
	 * */
	//展示列数
	var lNumber = 0;
	var columnsLen = columns.length;
	for (var i = 0; i < columnsLen; i++) {
		if (columns[i].property.display == "") {
			lNumber += 1;
		}
	}
	$('.loading').show();
	//page toolbar  load
	$.ajax({
		type : 'get',
		url : basePath + loadPageToolbar,
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
				loadDatagrid(basePath, lNumber, pageNumber, 1, 1, columns, "/user/user_management", userParams);
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

	//datagrid  单选
	$('body').on('click', '.my-tr', function(event) {
		var len = $('.datagrid').children('.my-tr').length;
		var b = true;
		//单行选中取消
		var check = $(this).find("input[type='checkbox']");
		if (check) {
			var flag = check[0].checked;
			if (flag) {
				check[0].checked = false;
				$(this).removeClass('selected-tr');
				//取消全选按钮选中
				var has1 = new Array();
				for (var i = 0; i < len; i++) {
					has1[i] = $('.datagrid').children('.my-tr').eq(i).hasClass('selected-tr');
					//如果有一条取消选中则取消全选
					if (!has1[i]) {
						$(".column input[type='checkbox']").prop("checked", false);
					}
				}
			} else {
				check[0].checked = true;
				$(this).addClass('selected-tr');
				//全选按钮选中
				var has2 = new Array();
				for (var i = 0; i < len; i++) {
					has2[i] = $('.datagrid').children('.my-tr').eq(i).hasClass('selected-tr');
					//如果有一个为false 则b=false
					if (!has2[i]) {
						b = has2[i];
					}
				}
				if (b) {
					$(".column input[type='checkbox']").prop("checked", true);
				}
			}
		}
	});
	/*
	 * datagrid 全选/全不选
	 * 原因是jQuery自1.6.1开始增加了一个prop()方法，
	 * 关于attr和prop的使用区别总结起来就是具有 true 和 false 两个属性的属性，如 checked, selected 或者 disabled 使用prop()，
	 * 其他的使用 attr()
	 * */
	$('body').on('change', ".column input[type='checkbox']", function() {
		var flag = $(this).get(0).checked;
		if (flag) {
			$('.ck').children('input').prop("checked", true);
			$('.my-tr').addClass('selected-tr');
		} else {
			$('.ck').children('input').prop("checked", false);
			$('.my-tr').removeClass('selected-tr');
		}
	});

	//page toolbar 
	$('.page ul li a').click(function() {
		$('.loading').show();
		var content = $(this).html();
		var pageNumber = parseInt($('.pageNumber').html());
		var page = parseInt($('.current').html());
		var params = $('.params').html();
		loadDatagrid(basePath, lNumber, pageNumber, page, content, columns, loadUser, JSON.parse(params));
	});
});

//load datagrid
/*
 * 加载datagrid
 * @param basePath 项目根
 * @param lNumber 需要显示的列数
 * @param pageNumber 总页数
 * @param page 现在显示的页码
 * @param content 将要执行的页码动作  比如：下一页 、上一页、 第content页
 * @param columns 列头
 * @param local 请求的详细地址
 * */
function loadDatagrid(basePath, lNumber, pageNumber, page, content, columns, loadUser, params) {
	var token = $.cookie("__token__");
	switch (content) {
	case "上一页":
		page = page - 1;
		if (page < 2) {
			page = 1;
			$('.previous-page').addClass('disabled');
			$('.next-page').removeClass('disabled');
		} else {
			$('.previous-page').removeClass('disabled');
			$('.next-page').removeClass('disabled');
		}
		break;
	case "下一页":
		page = page + 1;
		if (page > pageNumber - 1) {
			page = pageNumber;
			$('.next-page').addClass('disabled');
			$('.previous-page').removeClass('disabled');
		} else {
			$('.next-page').removeClass('disabled');
			$('.previous-page').removeClass('disabled');
		}
		break;
	case "undefined":
		page = 1;
		break;
	default:
		page = content;
		break;
	}
	$.ajax({
		type : 'get',
		url : basePath + loadUser,
		dataType : 'json',
		data : {
			token : token == 'undefined' ? "" : token,
			page : page,
			pageSize : "10",
			params :JSON.stringify(params)
		},
		cache : false,
		success : function(data) {
			if (data == "null") {
				alert('您没有权限获取该信息，请联系管理人员！');
				return false;
			}
			if (data.code == 200) {
				$('.datagrid').html("");
				var buffer = '';
				var len1 = columns.length;
				buffer += "<div class='column'>";
				buffer += "<div class='column-th ck'><input type='checkbox' /></div>";
				for (var i = 0; i < len1; i++) {
					buffer += "<div id='" + columns[i].id + "' class='column-th' style='display:" + columns[i].property.display + ";'>" + columns[i].name_zh_cn + "</div>";
				}
				buffer += "</div>";
				var len2 = data.data.length;
				for (var i = 0; i < len2; i++) {
					buffer += "<div class='my-tr'>";
					buffer += "<div class='my-td ck'><input type='checkbox' /></div>";
					for (var j = 0; j < len1; j++) {
						buffer += "<div class='my-td' style='display:" + columns[j].property.display + ";'>" + columnFiltering(data, i, columns, j) + "</div>";
					}
					buffer += "</div>"
				}
				$('.datagrid').append(buffer);
				$('.current').html(page);
				$('.params').html(JSON.stringify(params));
				if($('.pageNumber').html() == "1"){
					$('.previous-page').addClass('disabled');
					$('.next-page').addClass('disabled');
				}else{
					$('.next-page').removeClass('disabled');
				}
			} else {
				alert(data.message);
			}
			//设置datagrid的行宽 和 checkbox的宽度    datagrid必须在div class=main-box中
			$('.column-th').width(($('.main-box').width() - 27) / lNumber);
			$('.ck').width(27);
			$('.loading').hide();
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			if (textStatus == "error") {
				alert("服务器无法正常连接！请联系开发人员！");
				$('.loading').hide();
			}
		}
	});
}
/*
 * 对数据进行展示过滤  按照columns属性的要求
 * @param data  数据源
 * @param i 数据源对象的index
 * @param columns 列对象列表
 * @param index 列对象的index
 * */
function columnFiltering(data, i, columns, index) {
	var column = data.data[i][columns[index].name_en_us];
	var hasTimestampToTime = columns[index].property.timestampToTime;
	var hasRadio = columns[index].property.radio;
	if (hasTimestampToTime != 'undefined' && hasTimestampToTime != " " && hasTimestampToTime != null) {
		if (hasTimestampToTime == true) {
			return timestampToTime(column);
		}
	}
	if (hasRadio != 'undefined' && hasRadio != " " && hasRadio != null) {
		if (hasRadio.value == "Integer") {
			if (column == "1") {
				column = hasRadio.one;
			} else {
				column = hasRadio.zero;
			}
			return column;
		}
		if (hasRadio.value == "Boolean") {
			if (column == true) {
				column = hasRadio.yes;
			} else {
				column = hasRadio.not;
			}
			return column;
		}
	}
	return column;
}