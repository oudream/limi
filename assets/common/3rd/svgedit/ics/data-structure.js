/**
 * Created by liuchaoyu on 2016-10-31.
 */

/**
 * 基础结构
 * @param id : 唯一标识
 * @param name : 显示名字
 * @param updTime : 更新时间
 * @constructor
 */
var BaseStruct = function (id, name, updTime) {

    this.id = id;
    this.name = name;
    this.updateTime = updTime;

};

/**
 * 项目结构
 * @param id : 唯一标识
 * @param name : 项目名字
 * @param updTime : 更新时间
 * @constructor
 */
var Project = function (id, name, updTime) {

    BaseStruct.apply(this,[id, name, updTime]);

};

/**
 * 页结构
 * @param id : 唯一标识
 * @param name : 页名
 * @param projId : 所属项目的ID号
 * @param updTime : 更新时间
 * @param svgText : 页面SVG字符串
 * @param svgPath : 页面SVG文件
 * @constructor
 */
var Page = function (id, name, projId, updTime, svgText, svgPath, propertyList, propertyPath) {

    BaseStruct.apply(this,[id, name, updTime]);

    this.proj = projId;
    this.svg_text = svgText;
    this.svg_path = svgPath;
    this.property_list = propertyList || [];
    this.property_path = propertyPath || "";
    this.isChange = false;

    this.optType = [];
    this.optRec = [];

};

/**
 * 模块结构
 * @param id : 页中唯一标识
 * @param name : 模块名
 * @param url : 唯一定位URL
 * @param updTime : 更新时间
 * @constructor
 */
var Module = function (id, name, url, updTime) {

    BaseStruct.apply(this,[id, name, updTime]);

    this.url = url;
    this.propertys = [];

    if (this.propertyOptions == undefined) {
        this.propertyOptions = extendConfig.propertyOptions.module;
    }

    var _this = this;

    $.each(_this.propertyOptions,function (index, propOption) {
        var prop = new Property(propOption.propertyName,propOption.propertyValue,propOption.group);

        _this.propertys.push(prop);
    })

};


/**
 * 元素结构（最小单元）
 * @param id : 页中唯一标识
 * @param name : 元素名
 * @param url : 唯一定位URL
 * @param updTime : 更新时间
 * @constructor
 */
var Elem = function (id, name, url, updTime) {

    this.propertyOptions = extendConfig.propertyOptions.elem;
    Module.apply(this,[id, name, url, updTime]);

};


/**
 * 属性结构
 * @param name : 属性名对象
 * @param value : 属性值对象
 * @param group : 属性所属组
 * @constructor
 */
var Property = function (name, value, group) {

    this.name = name.name;
    this.title = name.title;
    this.value = (value.value != undefined) ? value.value : '';
    this.type = value.type;

    if (this.type == "text") {
        this.options = {

        };
    }
    else if (this.type == "validatebox") {
        this.options = {
            validType: value.subOptions.validType,
        };
    }
    else if (this.type == "combobox") {
        this.options = {
            valueField:'text',
            textField:'text',
            panelHeight:'auto',
            data: [],
            formatter:function(row){

                if (row.bgColor) {
                    var div = '<div style="width: 12px;height: 12px;float: left;background-color: ' + row.bgColor + '"></div><div style="width: 2px;height: 12px;float: left"></div>';
                }
                else {
                    var div = "";
                }

                if (row.fontColor) {
                    var span = '<span style="color: ' + row.fontColor + '">'+row.text+'</span>';
                }
                else {
                    var span = '<span>'+row.text+'</span>';
                }
                return div + span;
            },
        };

        var _this = this;
        $.each(value.subOptions.data,function (index,itemObj) {
            var _item = {
                'id':index,
                'text':itemObj.text,
            };

            if (itemObj.fontColor) {
                _item.fontColor = itemObj.fontColor;
            }

            if (itemObj.bgColor) {
                _item.bgColor = itemObj.bgColor;
            }

            _this.options.data.push(_item);
        })

    }
    else if (this.type == "checkbox") {
        this.options = {
            'on':value.subOptions.check.on,
            'off':value.subOptions.check.off,
        };
    }

    this.group = group.title;

    this.editable = (function () {
        if (value.editable != undefined) {
            return value.editable;
        }
        else {
            return true;
        }
    })();

    this.deletable = (function () {
        if (group.deletable != undefined) {
            return group.deletable;
        }
        else {
            return true;
        }
    })();
};

