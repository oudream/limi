(function($,define){
	if(!$){ config&&config.error("需要jQuery支持"); return;}
	
	var binder = {
		"default":function($ele,value){$ele.html(value);},
		"input":function($ele,value){$ele.val(value);},
		"button":function($ele,value){$ele.text(value);}
	}
	
	var databind = function(parentEle,opt,data){
		var _template = parentEle.find(".template");
		
		this.viewBox = parentEle;
		this.template = _template.clone();
		this.data = [];
		this.options = $.extend(true, 
		{
			defaultView :function($ele,value){
				var tagname = $ele[0].tagName.toLowerCase();
				(binder[tagname]?binder[tagname]:binder["default"])($ele,value);
			},
			computes:{
				$index:function(item,index){
					return index.toString();
				},
				$sequence:function(item,index){
					return (index+1).toString();
				}
			}
		}, opt);
		
		_template.remove();
		data&&this.load(data);
	}
	
	databind.prototype.load = function(data){
		this.data = data||this.data;
		this.viewBox.find(".template").remove();
		
		var data = (this.options.filter && this.data.filter(this.options.filter))||this.data;
		
		var computes = this.options.computes;
		var defaultView = this.options.defaultView;
		var template = this.template;
		var bind = this.options.bindValue;
		var viewBox = this.viewBox;
			
		var itemBindCallBack = this.options.itemBindCallBack;
		
		data.forEach(function(item,index){
			var viewItem = template.clone();
			Array.prototype.forEach.call(viewItem.find("[dataField]"), function(ele) {
				var $ele = $(ele);
				var fieldName = $ele.attr("dataField");
				
				var value = item[fieldName];
				var view = (computes[fieldName]&&computes[fieldName].view)||defaultView;
				
				if(!item[fieldName] && computes[fieldName]){
					var getValue = (typeof computes[fieldName] == "function" && computes[fieldName])
					|| (typeof computes[fieldName].value == "function" && computes[fieldName].value);
					value = getValue&&getValue.call(viewItem,item,index)||null; 
				}
				
				view($ele,value,item,viewItem);
			});
			itemBindCallBack&&itemBindCallBack(viewItem,item,index);
			viewItem.appendTo(viewBox);
		});
		
		template.remove();
		return this;
	}
	
	$.dataBind = function(parent,data,opt){
		return (new databind(parent,opt,data));
	}
	
	$.fn.dataBind = function(data,opt){
		Array.prototype.forEach.call(this, function(item) {
			new databind($(item),opt,data)
		});
		return this;
	}
	
	define&&define(["jquery"],function($){
		return $.dataBind;
	});
	
})(typeof jQuery != "undefined" && jQuery,typeof define != "undefined" && define);