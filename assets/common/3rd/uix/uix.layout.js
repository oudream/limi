/**
* 远光共创 UIX CICS3.0
* Grace [jQuery.js]
*
*  UIX页面布局
*
* 使用方式：
*  exp: 
*  $.uix.layout()
*  class="uix-layout-container"
*  class="uix_box" 布局时将此元素高度设置成父元素的高度(支持padding\margin)
*  class="uix_grid" 布局时将此元素下的唯一的grid 高度设置为父元素高度,宽度设置为auto
*
* 变更版本：
* zhuqiang@ygct.com 2015-6-10 创建
* zhuqiang@ygct.com 2015-8-10 修改 解决setHeight报错的问题
* zhuqiang@ygct.com 2015-12-16 修改 增加 uix_box uix_grid 标识判断
* zhuqiang@ygct.com 2015-02-16 修改 多个uix_grid共存失效的bug
* zhuqiang@ygct.com 2016-09-22 修改 增加 uix_box uix_grid 标识判断
* zhuqiang@ygct.com 2016-10-09 修改 增加对tab控件的自适应支持,添加class="uix_box"即可,例如 <div class="uix_box" inputer='{"code":"ecp.ui.layout.TabPanel"
*
*/

(function(define,$){

	var fn = function ($,undefined) {
	    //配置
	    var config = {
	        useUixLayout: true, //启用
	        isDebugger: true, //是否开启日志输出
	        version: "V201508171400", //版本
	        filename: "uix.layout.js", //脚本名称
	        timeout: 500, //布局间隔
	        //计算table高度时会减去一下元素的高度
	    };
	
	    //日志输出
	    var log = function () { }
	    if (typeof console != "undefined" && console.log) {
	        log = function (context, checklog) {
	            if (typeof checklog != "undefined" || config.isDebugger){}
	                // console.log("%c" + "[uix.layout]", "color:green;", context);
	        }
	    }
	
	    //加载日志
	    log("加载中", true);
	    if (!config.useUixLayout) { log("已停止加载[uix.layout 未启用]", true); return; }
	    if (typeof $ == "undefined") { log("已停止加载[需要jQuery支持]", true); return; }
	    if (typeof $.uix != "undefined" && typeof $.uix.layout != "undefined") { log("已停止加载[已加载过]", true); return; }
	    log("日志状态[" + (config.isDebugger ? "启用" : "禁用") + "]", true);
	
		
	
	
	    var tool = {
	        //防止某个函数在短时间内被密集调用
	        //fn:要调用的函数,delay:时间限制
	        //
	        //例如:window.onresize = debounce(resizeFn, 500);
	        debounce:function (fn, delay) {
	            var timer = null; // 声明计时器
	            return function () {
	                var context = this;
	                var args = arguments;
	                clearTimeout(timer);
	                timer = setTimeout(function () {
	                    fn.apply(context, args);
	                }, delay);
	            };
	        },
	        selecter: ".uix_box:visible", //uix_box高宽自适应
	        setAutoBox: function (inputSelecter) {
	            var sel = inputSelecter || tool.selecter;
	            $(sel).each(function () {
	                var o = $(this);
	                var p = o.parent();
	                var s = tool.getEleSize(o);
	                o.height(p.height() - s.otherHeight - tool.getCV(o, ["marginTop", "marginBottom"]));
	                o.width(p.width() - s.otherWidth - tool.getCV(o, ["marginLeft", "marginRight"]));
	            })
	        },
	        getCV: function (ele, cn) {
	            var s = 0;
	            if (typeof cn == "string") cn = [cn];
	            $(cn).each(function (i, o) {
	                var v;
	                s += isNaN(v = parseInt(ele.css(o))) ? 0 : v;
	            });
	            return s;
	        },
	        getOtherHeight: function ($obj) { return $obj.outerHeight() - $obj.height() },
	        getOtherWidth: function ($obj) { return $obj.outerWidth() - $obj.width() },
	        getEleSize: function ($objs) {
	            var rev = { height: 0, width: 0, otherHeight: 0, otherWidth: 0, outerHeight: 0, outerWidth: 0, children: [] };
	            for (var i = 0; i < $objs.length; i++) {
	                var o = $($objs[i]);
	                var h = o.height(), w = o.width(), oh = o.outerHeight(), ow = o.outerWidth();
	                var c = { height: h, width: w, otherHeight: oh - h, otherWidth: ow - w, outerHeight: oh, outerWidth: ow, ele: o }
	                rev.height += c.height;
	                rev.width += c.width;
	                rev.otherHeight += c.otherHeight;
	                rev.otherWidth += c.otherWidth;
	                rev.outerHeight += c.outerHeight;
	                rev.outerWidth += c.outerWidth;
	                rev.children.push(c);
	            }
	            return rev;
	        },
	        log: log,
	        
	    }
	
	    var uixlayout = {
	        tool: tool,
	        
		    //初始化tabs自适应(可多次执行)
		    initTabs:function(){
		        //获取到配置了自适应且未初始化的tabs控件div
		        $(".uix_box.tabs-container:not(.uix-layout-container)").each(function(){
			            var tabs = $(this).addClass("uix-layout-container");
			            tabs.children().eq(0).addClass("uix-layout-north");
			            tabs.children().eq(1).addClass("uix-layout-center");
		        });
		    },
		    
	        layout: function (isDelayed) {
		    	var _this = this;
	            var timeout = function () {
	                tool.log("开始布局[" + window.__uixlayoutstate + "]");
					
	                //初始化tabs自适应
					_this.initTabs();                
	                
					var pares = $(".uix-layout-container");
	                pares.each(function (obj, i) { $.uix.initLayout($(this)); });
	                $.uix.setGrid($(".uix_grid")); //自适应表格
	                tool.log("布局完毕[" + window.__uixlayoutstate + "]");
	                window.__uixlayoutstate = false;
	            }
	            
	        	if(isDelayed){
	        		timeout();
	        		return;
	        	}
	
	            //如果已经有了一个待执行的操作，则取消之
	            if (typeof window.__uixlayoutstate == "number") {
	                tool.log("取消布局[" + window.__uixlayoutstate + "]");
	                window.clearTimeout(window.__uixlayoutstate);
	            }
	
	            //添加一个新操作在待执行序列中
	            window.__uixlayoutstate = setTimeout(timeout, config.timeout);
	            tool.log("等待布局[" + window.__uixlayoutstate + "] 等待" + config.timeout + "ms");
	            return;
	        },
	        initLayout: function (pare) {
	            //覆盖旧布局的样式，
	            this.resestCSS();
	
	            var parent;
	            if (pare[0].tagName.toUpperCase() == "BODY") {
	                parent = { height: $(window).height(), width: $(window).width() };
	                var marginHeight = tool.getCV($(pare), ["marginTop", "marginBottom"]);
	                parent.height -= marginHeight;
	            }
	            else {
	                parent = { height: $(pare[0]).height(), width: $(pare[0]).width() };
	                var marginHeight = tool.getCV($(pare), ["marginTop", "marginBottom"]);
	                parent.height -= marginHeight;
	            }
	
	
	            parent.element = pare;
	            //            var parentBordr = {
	            //                height: pare.outerHeight() - pare.height(),
	            //                width: pare.outerWidth() - pare.width()
	            //                //top: tool.getCV($(pare[0]), ["borderTopWidth", "paddingTop"]),
	            //                //bottom: tool.getCV($(pare[0]), ["borderBottomWidth", "paddingBottom"])
	            //            }
	            //            parent.height -= parentBordr.height;
	            //            parent.width -= parentBordr.width;
	            //debugger;
	//            var bodyOtherHeight = pare.outerHeight() - pare.height();
	//            var bodyOtherWidth = pare.outerWidth() - pare.width();
	//            parent.height -= bodyOtherHeight;
	//            parent.width -= bodyOtherWidth;
	
	            if (pare[0].tagName.toUpperCase() == "BODY") {
	                pare.height(parent.height);
	            }
	
	
	            var eles = {
	                north: pare.children(".uix-layout-north:visible"),
	                south: pare.children(".uix-layout-south:visible"),
	                east: pare.children(".uix-layout-east:visible"),
	                west: pare.children(".uix-layout-west:visible"),
	                center: pare.children(".uix-layout-center:visible")
	            }
	            var s = {
	                parent: parent,
	                norths: tool.getEleSize(eles.north),
	                souths: tool.getEleSize(eles.south),
	                centers: tool.getEleSize(eles.center),
	                easts: tool.getEleSize(eles.east),
	                wests: tool.getEleSize(eles.west)
	            }
	            //debugger;
	            s.centers.outerHeight = s.parent.height - s.norths.outerHeight - s.souths.outerHeight;
	            s.centers.height = s.centers.outerHeight - s.centers.otherHeight;
	            s.centers.outerWidth = s.parent.width - s.wests.outerWidth - s.easts.outerWidth;
	            s.centers.width = s.centers.outerWidth - s.centers.otherWidth;
	
	            tool.log(s);
	
	            var autoHeight = parent.height - s.norths.outerHeight - s.souths.outerHeight;
	            var autoWidth = parent.width - s.wests.outerWidth - s.easts.outerWidth;
	
	            var cheight = s.centers.height;
	            var cwidth = s.centers.width;
	            eles.north.css({ margin: "0px" });
	            eles.south.css({ margin: "0px" });
	
	            var left = 0; //, parentBordr.left
	            var top = s.norths.outerHeight; //parentBordr.top; + ;
	
	
	            //考虑加入前置函数
	            //在改变布局前先改变子元素
	
	
	            for (var i = 0; i < s.wests.children.length; i++) {
	                var item = s.wests.children[i];
	                var westheight = autoHeight - item.otherHeight;
	                item.ele.css({ position: "absolute", left: left + "px", right: "auto", top: top + "px", bottom: "auto", height: westheight + "px", display: "block", margin: "0px" });
	                left += item.outerWidth;
	            }
	
	            var right = 0; // parentBordr.right;
	            for (var i = 0; i < s.easts.children.length; i++) {
	                var item = s.easts.children[i];
	                var eastheight = autoHeight - item.otherHeight;
	                item.ele.css({ position: "absolute", right: right + "px", left: "auto", top: top + "px", bottom: "auto", height: eastheight + "px", display: "block", margin: "0px" });
	                right += item.outerWidth;
	            }
	
	            eles.center.css({ height: cheight, "marginLeft": s.wests.outerWidth, "marginRight": s.easts.outerWidth });
	            tool.log("整体布局完成");
	
	            tool.log("开始检测回调函数  提示：可设置window.uixAfterResize值[false:禁用回调|function:自定义回调|undefined(默认):自动检测]");
	            this.resizecontral(s);
	            tool.log("回调函数处理完毕");
	
	            $.uix.tool.setAutoBox(); //uix_box 高宽自适应
	        },
	
	        resizecontral: function (sizes) {
	            //调整布局内常用版式
	            //检查用户设置的 uixAfterResize 变量，
	            // boolean fale：不进行排盘，
	            // function 调用自定义函数，
	            // undefined 自动检测所属版式
	
	            if (typeof window.uixAfterResize == "boolean" && window.uixAfterResize == false) {
	                tool.log("禁用回调函数[window.uixAfterResize==false]");
	                return;
	            }
	
	            //判断自适应center中唯一的grid
	            if(sizes.centers.children.length>0){
	                this.setGrid($(sizes.centers.children[0].ele));
	            }
	
	            if (typeof window.uixAfterResize == "function") {
	                tool.log("调用自定义回调函数[window.uixAfterResize=function]");
	                window.uixAfterResize(sizes);
	                return;
	            }
	
	            if (typeof window.uixAfterResize == "undefined") {
	                tool.log("使用默认回调函数[window.uixAfterResize=undefined]");
	                $.uix.autoGridWidth();
	                var n = sizes.norths.children.length;
	                var w = sizes.wests.children.length;
	                var e = sizes.easts.children.length;
	                var c = sizes.centers.children.length;
	                var s = sizes.souths.children.length;
	                tool.log("解析页面结构"
	                + " north[" + n + "] "
	                + " west[" + w + "] "
	                + " east[" + e + "] "
	                + " south[" + s + "] "
	                + " center[" + c + "]");
	//                if (w == 0 && e == 0 && c == 1) {
	//                    $.uix.afterResize1(sizes);
	//                }
	                if (w == 1 && e == 0 && c == 1) {
	                    $.uix.afterResize2(sizes);
	                }
	                return;
	            }
	        },
	
	        initpage: function () {
	            log("等待页面加载完成后初始化", true);
	            var _this = this;
	            $(window.document.body).ready(function () {
	                if ($(".uix-layout-container").length == 0) { log("已停止加载[未发现.uix-layout-container]", true); return; }
	                _this.tool.log("触发布局[window onload]");
	                _this.layout();
	                $(window).bind("resize", function () {
	                	
	                    _this.tool.log("触发布局[window onresize]");
	                    _this.layout();
	                });
	                $(".uix-layout-north,.uix-layout-south,.uix-layout-east,.uix-layout-west").bind("resize", function () {
	                    _this.tool.log("触发布局[uix-layout-" + $(this).attr("class") + " onresize]");
	                    _this.layout();
	                });
	                log("初始化完毕", true);
	            });
	        },
	
	        //将元素内的grid改为高宽自适应
	        setGrid: function (jqobj) {
	        	
	        	//兼容报表平台
	        	if(!$.ecp||!$.ecp.getUI){return;};
	        	
	            //jqobj.find(".ui-jqgrid-pager,#pager,.ui-jqgrid,.ui-jqgrid-view,.ui-jqgrid-bdiv,.ui-jqgrid-hdiv").css("width", "auto");
	            if (typeof jqobj == "undefined") { return; }
	            for (var i = 0; i < jqobj.length; i++) {
	                var div = jqobj.eq(i);
	
	                //渲染后的jq最外层div
					var gridDiv =div.children(".ui-jqgrid.ui-widget.ui-widget-content.ui-corner-all:visible");
	                var heads = div.children(".table_header:visible");
	                if(div.children(":visible").length>gridDiv.length+heads.length){
	                    return;
	                }
	
	                //ecpJQGrid 对象
					var tb = $.ecp.getUI($("table[dataField]", gridDiv)[0]);
					if (typeof tb == "undefined"){
						tool.log("ecpTable 获取失败")
						return;
					}
					
	                
					var tbh =  div.height();
					var tbw =  div.width();
	
	                //减去兄弟元素 table_header 的高度
					heads.each(function () {
					    tbh -= $(this).outerHeight();
					});
					
	                //减去表头高度
	                tbh-=gridDiv.find(".ui-jqgrid-view .ui-state-default.ui-jqgrid-hdiv").outerHeight();
	                //减去分页栏高度
	                tbh-=gridDiv.find(".ui-jqgrid-pager").outerHeight();
	
	                //减去表格边框高/宽度
	                tbh-=(gridDiv.outerHeight()-gridDiv.height());
	                tbw-=(gridDiv.outerWidth()-gridDiv.width());
	
	                if (typeof tb.setHeight != "function") { return; } tb.setHeight(tbh);
	                if (typeof tb.setWidth != "function") { return; } tb.setWidth(tbw);
	            }
	        },
	
	        //将页面内的grid设置为自适应宽度
	        autoGridWidth: function () {
	            $(".ui-jqgrid-pager,#pager,.ui-jqgrid,.ui-jqgrid-view,.ui-jqgrid-bdiv,.ui-jqgrid-hdiv").css("width", "auto");
	        },
	        resestCSS: function () {
	            $(".tree_con_right,.tree_con_left").css({ "float": "none" });
	            $(".table_header").css({ "overflow": "hidden" });
	        },
	//        afterResize1: function (size) {
	//			tool.log("使用回调函数[afterResize1] 上下结构");
	//			if (typeof ($.ecp) == "undefined" || typeof ($.ecp.getUI) == "undefined") return;
	//			if (size.centers.children.length == 0) return;
	//			var o = $(size.centers.children[0].ele);
	//            if (o.find(".area,.vertical_padding,bill").length > 0) return;
	//			this.setGrid(o);
	//        },
	        afterResize2: function (size) {
	            tool.log("使用回调函数[afterResize2] 左右树形结构");
	            var o = $(size.centers.children[0].ele);
	            var rh = size.centers.height;
	            var lh = size.wests.height;
	            var r = $('.tree_con_right');
	            var l = $('.tree_con_left');
	            var t = $('.treeBorder');
	            var ts = $('.tree_con_search');
	            r.height(rh - r.outerHeight() + r.height());
	            l.height(lh - l.outerHeight() + l.height());
	            t.height(lh - ts.outerHeight() - 2);
	
	            if (typeof ($.ecp) == "undefined") return;
	            if ($(".ui-jqgrid", r).length == 1) {
	                var headerlen = r.children(".table_header:visible").length;
	                var paperlen = r.children("#pager:visible").length;
	
	                if (r.children("div:visible").length - paperlen - headerlen == 1) {
	                    var table = $("table[dataField]", size.centers.children[0].ele);
	
	                    var tbh = size.centers.height - 2;
	                    $(config.tableotherele).each(function () {
	                        if (this == ".table_header") {
	                            $(".uix-layout-center " + this + ":visible").each(function () {
	                                tbh -= $(this).outerHeight();
	                            });
	                        }
	                        else {
	                            tbh -= $(".uix-layout-center " + this + ":visible").outerHeight();
	                        }
	                    });
	                    var tbw = size.centers.width - 2;
	                    tbh -= r.outerHeight() - r.height();
	
	                    var tb = $.ecp.getUI(table[0]);
	                    if (typeof tb == "undefined" || typeof tb.setHeight != "function") { return; }
	                    tb.setHeight(tbh);
	                    return;
	                }
	            }
	        }
	   };
	    log("加载完毕", true);
	    
		$.extend(true,{
			uix:uixlayout
		});
	    
	    return $.uix;
	}
	
	if(define) {define(["jquery"],fn);return};
	if($){(fn)($);return} 
})(define,typeof jQuery != "undefined"?jQuery:undefined)