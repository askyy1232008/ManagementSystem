/**
 * menu
 * 
 * <div class="west">
		<div class="sidebar-toggle">
			<i class="fa fa-fw fa-dedent"></i>
		</div>
		<div class="main-menu">
			//data
		</div>
	</div>
 */
$(function() {
	var basePath = "/ManagementSystem";
	//获取West菜单
	$.ajax({
		type : "get",
		url : basePath + "/assets/testData/menu.txt",
		dataType : "text",
		success : function(data) {
			myMenu(data);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			if (textStatus == "error") {
				alert("服务器无法正常连接！请联系开发人员！");
			}
		}
	});
	//打开关闭菜单
	$('body').on('click', '.has-children', function(event) {
		var b = myBrowser();
		if(b =="IE55" || b =="IE6"|| b =="IE7"|| b =="IE8"|| b =="FF"|| b =="Opera" || b=="Chrome"){
			$(this).toggleClass('open');
		}else{
			$(this).addClass('open');
		}
		event.stopPropagation(); //关键在于阻止冒泡
		return false;
	});
	$('body').on('click', '.menu-submenu li', function(event) {
		event.stopPropagation(); //关键在于阻止冒泡
		return false;
	});
	//菜单切换tabs
	$('body').on('click', '.main-menu li', function(event) {
		//判断是否有子菜单
		if (!$(this).children('a').children('span:last').hasClass('menu-arrow')) {
			var title = $(this).children('a').children('span').html();
			var id = $(this).children('a').attr('id');
			var url = $(this).children('a').children('p').html();
			var icon = $(this).children('a').children('i').attr('class');
			//如果选项卡已经打开
			if ($('#tabs').tabs('exists', title)) {
				//跳转到指定的选项卡页面
				$('#tabs').tabs('select', title);
			} else {
				//需要显示的具体信息的URL地址   http://www.baidu.com  替换成url即可
				var content = "<iframe id='mainiframe' width='100%' height='100%' frameborder='0' scrolling='auto' src='" + url + "'></iframe>";
				//添加选项卡
				$('#tabs').tabs('add', {
					//选项卡标题
					title : title,
					//选项卡内容
					content : content,
					//选项卡面板显示关闭按钮
					closable : true,
					iconCls : icon
				});
			}
		}
		return false;
	});
});

//menu
function myMenu(data){
	var menu = eval('(' + data + ')');
	if (menu.code == 200) {
		var buffer1 = "<ul class='one-level'>";
		var buffer2 = "";
		var buffer3 = "";
		for (var i = 0, len1 = menu.data.length; i < len1; i++) {
			buffer1 += "<li class='has-children'>";
			var idOne = menu.data[i].id;
			var nameOne = menu.data[i].name;
			var iconOne = menu.data[i].icon;
			var urlOne = menu.data[i].url;
			var childrenOne = menu.data[i].children;
			buffer1 += "<a id='" + idOne + "'><i class='fa fa " + iconOne + "'></i><span>" + nameOne + "</span><span class='menu-arrow fa'></span><p class='url'>" + urlOne + "</p></a>";
			buffer2 += "<ul class='menu-submenu two-level'>";
			for (var j = 0, len2 = childrenOne.length; j < len2; j++) {
				buffer2 += "<li class='has-children'>";
				var idTwo = childrenOne[j].id;
				var nameTwo = childrenOne[j].name;
				var iconTwo = childrenOne[j].icon;
				var urlTwo = childrenOne[j].url;
				var childrenTwo = childrenOne[j].children;
				buffer2 += "<a id='" + idTwo + "'><i class='fa fa " + iconTwo + "'></i><span>" + nameTwo + "</span>";
				if (!(typeof (childrenTwo) == "undefined")) {
					buffer2 += "<span class='menu-arrow fa'></span>";
				}
				buffer2 += "<p class='url'>" + urlTwo + "</p></a>";
				if (!(typeof (childrenTwo) == "undefined")) {
					buffer3 += "<ul class='menu-submenu three-level'>";
					for (var k = 0, len3 = childrenTwo.length; k < len3; k++) {
						buffer3 += "<li class=''>";
						var idThree = childrenTwo[k].id;
						var nameThree = childrenTwo[k].name;
						var iconThree = childrenTwo[k].icon;
						var urlThree = childrenTwo[k].url;
						buffer3 += "<a id='" + idThree + "'><i class='fa fa " + iconThree + "'></i><span>" + nameThree + "</span><p class='url'>" + urlThree + "</p></a>";
						buffer3 += "</li>";
					}
					buffer3 += "</ul>";
					buffer2 += buffer3;
					buffer3 = "";
				}
				buffer2 += "</li>";
			}
			buffer2 += "</ul>";
			buffer1 += buffer2;
			buffer2 = "";
		}
		buffer1 += "</ul>";
		$('.main-menu').html(buffer1);
	} else {
		alert(menu.message);
	}
}