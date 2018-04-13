(function($, define) {
    if (!$) {
        config&&config.error('需要jQuery支持'); return;
    }

    let binder = {
        'default': function($ele, value) {
            $ele.html(value);
        },
        'input': function($ele, value) {
            $ele.val(value);
        },
        'button': function($ele, value) {
            $ele.text(value);
        },
    };

    let databind = function(parentEle, opt, data) {
        let _template = parentEle.find('.template');

        this.viewBox = parentEle;
        this.template = _template.clone();
        this.data = [];
        this.options = $.extend(true,
            {
                defaultView: function($ele, value) {
                    let tagname = $ele[0].tagName.toLowerCase();
                    (binder[tagname]?binder[tagname]:binder['default'])($ele, value);
                },
                computes: {
                    $index: function(item, index) {
                        return index.toString();
                    },
                    $sequence: function(item, index) {
                        return (index+1).toString();
                    },
                },
            }, opt);

        _template.remove();
        data&&this.load(data);
    };

    databind.prototype.load = function(data) {
        this.data = data||this.data;
        this.viewBox.find('.template').remove();

        var data = (this.options.filter && this.data.filter(this.options.filter))||this.data;

        let computes = this.options.computes;
        let defaultView = this.options.defaultView;
        let template = this.template;
        let bind = this.options.bindValue;
        let viewBox = this.viewBox;

        let itemBindCallBack = this.options.itemBindCallBack;

        data.forEach(function(item, index) {
            let viewItem = template.clone();
            Array.prototype.forEach.call(viewItem.find('[dataField]'), function(ele) {
                let $ele = $(ele);
                let fieldName = $ele.attr('dataField');

                let value = item[fieldName];
                let view = (computes[fieldName]&&computes[fieldName].view)||defaultView;

                if (!item[fieldName] && computes[fieldName]) {
                    let getValue = (typeof computes[fieldName] == 'function' && computes[fieldName])
					|| (typeof computes[fieldName].value == 'function' && computes[fieldName].value);
                    value = getValue&&getValue.call(viewItem, item, index)||null;
                }

                view($ele, value, item, viewItem);
            });
            itemBindCallBack&&itemBindCallBack(viewItem, item, index);
            viewItem.appendTo(viewBox);
        });

        template.remove();
        return this;
    };

    $.dataBind = function(parent, data, opt) {
        return (new databind(parent, opt, data));
    };

    $.fn.dataBind = function(data, opt) {
        Array.prototype.forEach.call(this, function(item) {
            new databind($(item), opt, data);
        });
        return this;
    };

    define&&define(['jquery'], function($) {
        return $.dataBind;
    });
})(typeof jQuery != 'undefined' && jQuery, typeof define != 'undefined' && define);
