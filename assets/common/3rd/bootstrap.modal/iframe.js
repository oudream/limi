define(['jquery'],
function($,undefined,Modal) {
	return {
		beforeOnload:function(){
		},
		onload:function(common){
			common.page.css({"background":"#ccc"})
		},
		onclose:function(){
			alert("页面关闭");
		}
	}
});