(function(){
	var _csMenu$Object,
		csMenu$Object;
	function contextMenu(_object, _menu) {
		this.IEventHander = null;
		this.IFrameHander = null;
		this.IContextMenuHander = null;
		this.Menu = _menu;
		this.Show = function(_menu) {
			var e = window.event || event;
			_menu = _menu||this.Menu;
			
			if(window.document.all) {
				this.IContextMenuHander = function() {
					return false;
				};
				document.attachEvent("oncontextmenu", this.IContextMenuHander);
			} else {
				this.IContextMenuHander = document.oncontextmenu;
				document.oncontextmenu = function() {
					return false;
				};
			}

			csMenu$Object = this;
			this.IEventHander = function() {
				csMenu$Object.Hide(_menu);
			};

			if(window.document.all)
				document.attachEvent("onmousedown", this.IEventHander);
			else
				document.addEventListener("mousedown", this.IEventHander, false);
			
			var left = e.clientX;
			if($(_menu).outerWidth()>=$(window).width()-e.clientX){
				left = e.clientX - $(_menu).outerWidth();
			}
			var top = e.clientY;
			if($(_menu).outerHeight()>=$(window).height()-e.clientY){
				top = e.clientY - $(_menu).outerHeight();
			}
			
			_menu.style.left = left +"px";
			_menu.style.top = top+"px";
			_menu.style.visibility = "visible";
			
			if(this.IFrameHander) {
				var _iframe = document.getElementById(this.IFrameHander);
				_iframe.style.left = left +"px";
				_iframe.style.top = top +"px";
				_iframe.style.height = $(_menu).outerHeight()+"px";
				_iframe.style.width = $(_menu).outerWidth()+"px";
				_iframe.style.visibility = "visible";
			}
		};
	
		this.Hide = function(_menu) {
			var e = window.event || event;
			_menu = _menu||this.Menu;
			var _element = e.srcElement;
			do {
				if(_element == _menu) {
					return false;
				}
			}
			while ((_element = _element.offsetParent));
	
			if(window.document.all)
				document.detachEvent("on" + e.type, this.IEventHander);
			else
				document.removeEventListener(e.type, this.IEventHander, false);
	
			if(this.IFrameHander) {
				var _iframe = document.getElementById(this.IFrameHander);
				_iframe.style.visibility = "hidden";
			}
	
			_menu.style.visibility = "hidden";
	
			if(window.document.all)
				document.detachEvent("oncontextmenu", this.IContextMenuHander);
			else
				document.oncontextmenu = this.IContextMenuHander;
		};
	
		this.initialize = function(_object, _menu) {
			_csMenu$Object = this;
			var _eventHander = function() {
				var e = window.event || event;
				if(e.button == 2) {
					_csMenu$Object.Show(_menu);
				}
			};
	
			_menu.style.position = "absolute";
			_menu.style.visibility = "hidden";
			_menu.style.zIndex = "1000000";
			
			if(!_object){return;}
			
			if(window.document.all) {
				var _iframe = document.createElement('iframe');
				document.body.insertBefore(_iframe, document.body.firstChild);
				_iframe.id = _menu.id + "_iframe";
				this.IFrameHander = _iframe.id;
	
				_iframe.style.position = "absolute";
				_iframe.style.visibility = "hidden";
				_iframe.style.zIndex = "999999";
				_iframe.style.border = "0px";
				_iframe.style.height = "0px";
				_iframe.style.width = "0px";
	
				_object.attachEvent("onmouseup", _eventHander);
			} else {
				_object.addEventListener("mouseup", _eventHander, false);
			}
		};
	
		this.initialize(_object, _menu);
	}
	
	
	define&&define(["jquery"],function($){
		return contextMenu;
	})
})()
