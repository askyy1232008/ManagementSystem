/**
 * common
 */
/*
 * 判断浏览器
 * */
function myBrowser() {
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
	var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
	var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
	var isSafari = userAgent.indexOf("Safari") > -1; //判断是否Safari浏览器
	var isChrome = userAgent.indexOf("Chrome") > -1; //判断是否Chrome浏览器
	var is = navigator.userAgent.toLowerCase().indexOf() > -1;
	if (isIE) {
		var IE5 = IE55 = IE6 = IE7 = IE8 = false;
		var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		reIE.test(userAgent);
		var fIEVersion = parseFloat(RegExp["$1"]);
		IE55 = fIEVersion == 5.5;
		IE6 = fIEVersion == 6.0;
		IE7 = fIEVersion == 7.0;
		IE8 = fIEVersion == 8.0;
		if (IE55) {
			return "IE55";
		}
		if (IE6) {
			return "IE6";
		}
		if (IE7) {
			return "IE7";
		}
		if (IE8) {
			return "IE8";
		}
	} //isIE end
	if (isFF) {
		return "FF";
	}
	if (isOpera) {
		return "Opera";
	}
	if(isChrome) {
		return "Chrome";
	}
}

/*
 * 日期格式转换 
 * */
function timestampToTime(timestamp) {
//	var date = new Date(timestamp * 1000);
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  Y = date.getFullYear() + '-';
  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
  h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
  m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':';
  s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds());
  return Y+M+D+h+m+s;
}
//var date = new Date('2014-04-23 18:55:49:123');
////有三种方式获取
//var time1 = date.getTime();
//var time2 = date.valueOf();
//var time3 = Date.parse(date);
//console.log(time1);//1398250549123
//console.log(time2);//1398250549123
//console.log(time3);//1398250549000

/*
 * 获取操作系统版本
 * */
function detectOS() {
	var sUserAgent = navigator.userAgent;
	var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
	var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
	if (isMac) return "Mac";
	var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
	if (isUnix) return "Unix";
	var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
	if (isLinux) return "Linux";
	if (isWin) {
		var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
		if (isWin2K) return "Win2000";
		var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
		if (isWinXP) return "WinXP";
		var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
		if (isWin2003) return "Win2003";
		var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
		if (isWinVista) return "WinVista";
		var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
		if (isWin7) return "Win7";
		var isWin10 = sUserAgent.indexOf("Windows NT 10") > -1 || sUserAgent.indexOf("Windows 10") > -1;
		if (isWin10) return "Win10";
	}
	return "other";
}

/*
 * 格式化显示的文本  easyui datetimebox
 * */
function formatter(date) {
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var M = date.getMinutes();
	var s = date.getSeconds();
	function formatNumber(value) {
		return (value < 10 ? '0' : '') + value;
	}
	return y + '-' + formatNumber(m) + '-' + formatNumber(d) + ' ' + formatNumber(h) + ':' + formatNumber(M) + ':' + formatNumber(s)
}
function parser(s) {
	s = s.replace(/\s+/, ' '); //解决格式字符串中多个空格拼接在Firefox中无法兼容的问题
	var t = Date.parse(s);
	if (!isNaN(t)) {
		return new Date(t);
	} else {
		return new Date();
	}
}

