/**
 * for login.html
 */
var basePath = "/ManagementSystem";


$(function() {
	//按回车登录
	document.onkeydown = function(e) {
		var ev = document.all ? window.event : e;
		if (ev.keyCode == 13) {
			login();
		}
	};
	
	var token = $.cookie("__token__");
	if (token != null) {
		$('.loading').show();
		$.ajax({
			type : 'get',
			url : basePath + '/user/checkToken',
			dataType : 'text',
			data : {
				token : token
			},
			cache : false,
			success : function(data){
				if(data.code == 200 && data.data == true){
					window.location.href = basePath + '/html/index.html';
				}else{
					$.cookie("__token__",null,{
			            path : '/',           //cookie的作用域
			            expires : -1
			        });
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){
				if(textStatus == "error"){
					alert("服务器无法正常连接！请联系开发人员！");
				}
			}
		});	
	}
});

function login() {
	$('.loading').show();
	var userName = $('#userName').val();
	var password = $('#password').val();
	var hash = md5.create();
	hash.update(password);
	var password = hash.hex();
	var system = detectOS();
	var time = 1;
	if($('input:checkbox').is(':checked')) time=48 ;
	$.ajax({
		type : "get",
		url : basePath + "/user/login",
		data : {
			username : userName,
			password : password,
			system : system,
			time : time
		},
		dataType : "json",
		cache : false,
		success : function(data) {
			if (data.code == 200) {
				var expiresDate= new Date();
				expiresDate.setTime(expiresDate.getTime() + (60*60*1000*time));   //设置1小时过期时间
				$.cookie("__token__",data.data.token,{
		            path : '/',           //cookie的作用域
		            expires : expiresDate
		        });
				window.location.href = basePath + '/html/index.html';
			} else {
				alert(data.message);
				$('.loading').hide();
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){
			if(textStatus == "error"){
				alert("服务器无法正常连接！请联系开发人员！");
				$('.loading').hide();
			}
		}
	});
}
