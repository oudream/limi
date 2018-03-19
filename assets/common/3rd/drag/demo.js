define(['jquery', 'drag'],
	function($) {
		var action = {
			init: function() {
				/*
				 * 参数1：string；"bottom"/"right"，默认为"right"；代表需要在哪边增加拖动区域
				 * 参数2：function；鼠标松开时的回调函数
				 * 参数3：number；元素最小保留的宽度/高度，单位为px
				 * 参数4：dom；默认为当前元素的下一个直接兄弟节点；代表哪个元素与此元素一起改变大小
				 */
				//$(".t").drag("bottom",callback,50,$(".t3"));

				var oldC = $(".c").width();
				var oldR = $(".r").width();
				var moveBefore = $(".c").width();
				var moveAfter = $(".c").width();
				$(".c").drag({
					pos: "r", //r,l,t,b，默认r
					beforeCallBack: function(e, type) {
						switch(type) {
							case "close": //当折叠之前触发
								{
									var w = $(".c").width() + $(".r").width();
									$(".r").animate({
										width: w
									}, 500);
									break;
								}
							case "open": //当展开之前触发
								{
									$(".r").animate({
										width: oldR
									}, 500);
									$(".c").animate({
										width: oldC
									}, 500);
									break;
								}
							case "move": //当移动之前触发
								{
									moveBefore = $(".c").width();
									break;
								}
						}
					},
					afterCallBack: function(e, type) {
						if(type == "move") {
							moveAfter = $(".c").width();
							var off = $(".r").width() + (moveBefore - moveAfter);
							if(off < 2) {
								$(".c").width(moveBefore);
								return;
							}
							$(".r").width(off);
						}
					}
				});
				$(".t").drag({
					pos: "b"
				});
			}
		}
		return {
			beforeOnload: function() {},
			onload: function(common) {
				action.init();
			}
		}
	});