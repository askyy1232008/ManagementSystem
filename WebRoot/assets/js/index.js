$(function() {
	var basePath = "/ManagementSystem";
	//点击显示隐藏west
	$('#toggle, .sidebar-toggle').click(function() {
		var titleSelected = $('.tabs-selected').children('a').children('span').html(); //获取tab标题
	//         westShow(titleSelected);
	});
	//dropdown  还有问题
	$(".dropdown-toggle").click(function(event) {
		$('.dropdown-menu').show();
		return false;
	});
	$(document).click(function(event) {
		$('.dropdown-menu').hide();
		return false;
	});
	
	//设置main的高度和宽度
    $('.main').width(windowWidth-225);
    $('.main').height(windowHeight-50);
    //解决tabs-panel的高度和宽度问题
    $("#tabs").tabs({
        width: $(".main").width(),
        height: $(".main").height()
    });
});

//获取系统的高度和宽度
var windowWidth = 0;
var windowHeight = 0;
var b = myBrowser();
if (b == 'Opera') {
	windowWidth = document.body.clientWidth;
	windowHeight = document.body.clientHeight - 30;
} else {
	windowWidth = document.documentElement.clientWidth;
	windowHeight = document.documentElement.clientHeight;
}


//toggle
function westShow(title) {
	var p = $(".west")[0].clientWidth;
    var Tab = $('#tabs').tabs('getSelected');
    if (p > 0) {
        $(".west").hide();
        $('.navbar-header').hide();
        $('.main').css('width',windowWidth);
        $('.main').css('left', '0px');
        $("#tabs").tabs({
          width: $(".main").width()
        });
        $('#tabs').children('div:last').children('div').css('width', $("#tabs").parent().width() + 225);
        $('#tabs').children('div:last').children('div').children('div').css('width', $("#tabs").parent().width() + 225);
        $('#tabs').tabs('select', title);
    } else {
        $(".west").show();
        $('.navbar-header').show();
        $('.main').css('width',windowWidth-225);
        $('.main').css('left', '225px');
        $("#tabs").tabs({
          width: $(".main").width()
        });
        $('#tabs').children('div:last').children('div').css('width', $("#tabs").parent().width());
        $('#tabs').children('div:last').children('div').children('div').css('width', $("#tabs").parent().width());
        RefreshTab(Tab);
        $('#tabs').tabs('select', title);
    }
}

//刷新指定标签Tab
function RefreshTab(currentTab) {
	var url = $(currentTab.panel('options')).attr('href');
	$('#tabs').tabs('update', {
		tab : currentTab,
		options : {
			href : url
		}
	});
	currentTab.panel('refresh');
}
