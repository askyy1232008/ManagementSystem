/**
 * getBrowser    
 */
//对象级开发
//;(function($){
//    $.fn.getBrowser = function(options){
//        
//        var defaults = {
//            //各种参数，各种属性
//        }
//
//        var options = $.extend(defaults,options);
//
//        var NV = {};    
//        var UA = navigator.userAgent.toLowerCase();    
//        try    
//        {    
//            NV.name=!-[1,]?'ie':    
//            (UA.indexOf("firefox")>0)?'firefox':    
//            (UA.indexOf("chrome")>0)?'chrome':    
//            window.opera?'opera':    
//            window.openDatabase?'safari':    
//            'unkonw';    
//        }catch(e){};    
//        try    
//        {    
//            NV.version=(NV.name=='ie')?UA.match(/msie ([\d.]+)/)[1]:    
//            (NV.name=='firefox')?UA.match(/firefox\/([\d.]+)/)[1]:    
//            (NV.name=='chrome')?UA.match(/chrome\/([\d.]+)/)[1]:    
//            (NV.name=='opera')?UA.match(/opera.([\d.]+)/)[1]:    
//            (NV.name=='safari')?UA.match(/version\/([\d.]+)/)[1]:    
//            '0';    
//        }catch(e){};    
//        try    
//        {    
//            NV.shell=(UA.indexOf('360ee')>-1)?'360极速浏览器':    
//            (UA.indexOf('360se')>-1)?'360安全浏览器':    
//            (UA.indexOf('se')>-1)?'搜狗浏览器':    
//            (UA.indexOf('aoyou')>-1)?'遨游浏览器':    
//            (UA.indexOf('theworld')>-1)?'世界之窗浏览器':    
//            (UA.indexOf('worldchrome')>-1)?'世界之窗极速浏览器':    
//            (UA.indexOf('greenbrowser')>-1)?'绿色浏览器':    
//            (UA.indexOf('qqbrowser')>-1)?'QQ浏览器':    
//            (UA.indexOf('baidu')>-1)?'百度浏览器':    
//            '未知或无壳';    
//        }catch(e){};
        
//        switch('shell')    
//        {    
//            case 'ua':    
//            case 'UA':br=UA;break;    
//            case 'name':br=NV.name;break;    
//            case 'version':br=NV.version;break;    
//            case 'shell':br=NV.shell;break;    
//            default:br=NV.name;    
//        }    
//        return br; 
//    }
//})(jQuery);

//类级别开发
jQuery.lee={
	getBrowser	: function(obj){
		var NV = {};
		var UA = navigator.userAgent.toLowerCase();
		try    
        {    
            NV.name=!-[1,]?'ie':    
            (UA.indexOf("firefox")>0)?'firefox':    
            (UA.indexOf("chrome")>0)?'chrome':    
            window.opera?'opera':    
            window.openDatabase?'safari':    
            'unkonw';    
        }catch(e){};    
        try    
        {    
            NV.version=(NV.name=='ie')?UA.match(/msie ([\d.]+)/)[1]:    
            (NV.name=='firefox')?UA.match(/firefox\/([\d.]+)/)[1]:    
            (NV.name=='chrome')?UA.match(/chrome\/([\d.]+)/)[1]:    
            (NV.name=='opera')?UA.match(/opera.([\d.]+)/)[1]:    
            (NV.name=='safari')?UA.match(/version\/([\d.]+)/)[1]:    
            '0';    
        }catch(e){};    
        try    
        {    
            NV.shell=(UA.indexOf('360ee')>-1)?'360极速浏览器':    
            (UA.indexOf('360se')>-1)?'360安全浏览器':    
            (UA.indexOf('se')>-1)?'搜狗浏览器':    
            (UA.indexOf('aoyou')>-1)?'遨游浏览器':    
            (UA.indexOf('theworld')>-1)?'世界之窗浏览器':    
            (UA.indexOf('worldchrome')>-1)?'世界之窗极速浏览器':    
            (UA.indexOf('greenbrowser')>-1)?'绿色浏览器':    
            (UA.indexOf('qqbrowser')>-1)?'QQ浏览器':    
            (UA.indexOf('baidu')>-1)?'百度浏览器':    
            '未知或无壳';    
        }catch(e){};
        
        switch(obj)    
        {    
            case 'ua':    
            case 'UA':br=UA;break;    
            case 'name':br=NV.name;break;    
            case 'version':br=NV.version;break;    
            case 'shell':br=NV.shell;break;    
            default:br=NV.name;    
        }    
        return br; 
	}
}