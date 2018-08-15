let modal = {
};
define && define(['jquery'], function($) {
    /**
     * 模态框构造函数
     * @param {string} msg
     * @param {number} width
     * @param {number} height
     * @constructor
     */
    modal.Modal = function(msg, width, height) {
        this.width = width || 400;
        this.height = height || 180;
        this.msg = msg;

        this.maskInit = function(offsetLeft) {
            let offset = offsetLeft || 0;
            let width = $(window.top.document).innerWidth() - offset;
            let height = $(window.top.document).innerHeight();

            let div = `<div id="modal-mask" style=
                         "width: ${width}px;height: ${height}px;left: ${offset}px;">
                       </div>`;
            $('body', window.top.document).append(div);
        };
        this.maskCancel = function() {
            $('#modal-mask', window.top.document).remove();
        };
    };

    /**
     * 单列模式
     */
    modal.CreateModal = (function() {
        let instance;
        return function(msg, width, height) {
            if (!instance) {
                instance = new modal.Modal(msg, width, height);
            }
            return instance;
        };
    })();

    /**
     * 加载等待动画
     */
    modal.Modal.prototype.waitInit = function() {
        this.waitCancel();
        this.maskInit();
        let div = `<div id="modal-wait">
                         <div class="spinner">
                              <div class="spinner-container container1">
                                <div class="circle1"></div>
                                <div class="circle2"></div>
                                <div class="circle3"></div>
                                <div class="circle4"></div>
                              </div>
                              <div class="spinner-container container2">
                                <div class="circle1"></div>
                                <div class="circle2"></div>
                                <div class="circle3"></div>
                                <div class="circle4"></div>
                              </div>
                              <div class="spinner-container container3">
                                <div class="circle1"></div>
                                <div class="circle2"></div>
                                <div class="circle3"></div>
                                <div class="circle4"></div>
                              </div>
                         </div>
                   </div>`;
        $('body', window.top.document).append(div);
    };

    /**
     * 取消等待动画
     */
    modal.Modal.prototype.waitCancel = function() {
        $('#modal-wait', window.top.document).remove();
        this.maskCancel();
    };

    /**
     * 弹出确认框
     * @param {function} callBack
     */
    modal.Modal.prototype.confirmInit = function(callBack) {
        this.confirmCancel();
        this.maskInit();
        let flag = -1;
        let div = `<div id="modal-confirm" style="height: ${this.height}px;width: ${this.width}px;margin-top: -${(this.height/2)+100}px;
    margin-left: -${this.width/2}px;">
                       <div id="confirm-content"> 
                            <div class="confirm-icon">
                                <img src="../../../../../common/cimg/img/warning.png">
                                
                            </div>
                           <p class="confirm-p">${this.msg}</p>
                       </div>
                       <div id="confirm-button">
                           <a id="true-btn">确认</a>
                           <a id="cancel-btn">取消</a>
                       </div>
                   </div>`;
        $('body', window.top.document).append(div);

        $('#true-btn', window.top.document).click(function() {
            flag = 1;
            if (callBack) {
                callBack(flag);
            }
        });
        $('#cancel-btn', window.top.document).click(function() {
            flag = 0;
            if (callBack) {
                callBack(flag);
            }
        });
    };

    /**
     * 取消确认框
     */
    modal.Modal.prototype.confirmCancel = function() {
        $('#modal-confirm', window.top.document).remove();
        this.maskCancel();
    };
});
