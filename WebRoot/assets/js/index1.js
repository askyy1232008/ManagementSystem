/**
 * for index.html
 */
$(function() {
	var basePath = "/ManagementSystem";
	var token = $.cookie("__token__");
	if (token == null) {
		window.location.href = basePath + '/html/login.html';
	}
	//退出登录
	$('.login-out').click(function(){
		$.ajax({
			type:'get',
			cache: false,
			dataType: 'json',
			data:{
				token : token
			},
			url:basePath+'/user/login_out',
			success:function(data){
				if(data.code == 200){
					$.cookie("__token__",null,{
			            path : '/',           //cookie的作用域
			            expires : -1
			        });
					window.location.href = basePath + '/html/login.html';
				}else{
					alert(data.message);
				}
				
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){
				if(textStatus == "error"){
					alert("服务器无法正常连接！请联系开发人员！");
				}
			}
		});
	});
	
//	alert($.lee.getBrowser('UA'));
});

