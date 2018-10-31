let modal = {
};
let instance;
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
        this.height = height || 250;
        this.msg = msg;
        this.flag = true;

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
        // 函数节流/防抖
        this.throttle = function(fn, gapTime) {
            let _lastTime = null;
            return function() {
                let _nowTime = + new Date();
                if (_nowTime - _lastTime > gapTime || !_lastTime) {
                    fn();
                    _lastTime = _nowTime;
                }
            };
        };
    };

    /**
     * 单列模式
     */
    modal.CreateModalSingle = (function() {
        return function(msg, width, height) {
            if (!instance) {
                instance = new modal.Modal(msg, width, height);
                instance.flag = true;
            } else {
                instance.flag = false;
            }
            return instance;
        };
    })();
    modal.CreateModal = function(msg, width, height) {
        return new modal.Modal(msg, width, height);
    };

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
        if (instance) {
            instance = null;
        }
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
                       <div id="modal-header"> 
                            <span>提示</span>
                       </div>
                       <div id="confirm-content"> 
                            <div class="confirm-icon">
                                <img src="../../../../../common/cimg/img/warning.png">
                                
                            </div>
                           <p class="confirm-p">${this.msg}</p>
                       </div>
                       <div id="modal-footer">
                            <div class="modal-btn modal-btn-sure" id="true-btn">确认</div>
                            <div class="modal-btn modal-btn-sure" id="cancel-btn">取消</div>
                       </div>
                   </div>`;
        $('body', window.top.document).append(div);

        $('#true-btn', window.top.document).click(function() {
            flag = 1;
            if (callBack) {
                callBack(flag);
                $('#modal-confirm', window.top.document).remove();
                $('#modal-mask', window.top.document).remove();
                if (instance) {
                    instance = null;
                }
            }
        });
        $('#cancel-btn', window.top.document).click(function() {
            flag = 0;
            if (callBack) {
                callBack(flag);
                $('#modal-confirm', window.top.document).remove();
                $('#modal-mask', window.top.document).remove();
                if (instance) {
                    instance = null;
                }
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

    /**
     * 新增框
     */
    modal.Modal.prototype.add = function() {
        this.confirmCancel();
        this.maskInit();
        let div = `<div id="modal-confirm" style="height: ${this.height}px;width: ${this.width}px;margin-top: -${(this.height/2)+100}px;
    margin-left: -${this.width/2}px;">
                       <div id="modal-header"> 
                            <span>新增</span>
                       </div>
                       <div id="modal-content" style="height: ${this.height-160}px">
                            <form id="add-form" class="form-inline">
                            
                            </form>
                       </div>
                       <div id="modal-footer">
                            <div class="modal-btn modal-btn-save">保存</div>
                            <div class="modal-btn modal-btn-cancel">取消</div>
                       </div>
                   </div>`;
        $('body', window.top.document).append(div);
        $('.modal-btn').click(function() {
            $('#modal-confirm', window.top.document).remove();
            $('#modal-mask', window.top.document).remove();
            if (instance) {
                instance = null;
            }
        });
    };
    /**
     * 提示框
     */
    modal.Modal.prototype.alert = function() {
        this.confirmCancel();
        this.maskInit();
        let div = `<div id="modal-confirm" style="height: ${this.height}px;width: ${this.width}px;margin-top: -${(this.height/2)+100}px;
    margin-left: -${this.width/2}px;">
                       <div id="modal-header"> 
                            <span>提示</span>
                       </div>
                       <div id="modal-content" style="height: ${this.height-160}px">
                            <span>${this.msg}</span>
                       </div>
                       <div id="modal-footer">
                            <div class="modal-btn modal-btn-sure">确认</div>
                       </div>
                   </div>`;
        $('body', window.top.document).append(div);
        $('.modal-btn').click(function() {
            $('#modal-confirm', window.top.document).remove();
            $('#modal-mask', window.top.document).remove();
            if (instance) {
                instance = null;
            }
        });
    };
    /**
     * 新增计时框
     */
    modal.Modal.prototype.timer = function(msg1, msg2, time, callBack) {
        this.confirmCancel();
        this.maskInit();
        let div = `<div id="modal-confirm" style="height: ${this.height}px;width: ${this.width}px;margin-top: -${(this.height/2)+100}px;
    margin-left: -${this.width/2}px;">
                       <div id="modal-header"> 
                            <span>提示</span>
                       </div>
                       <div id="modal-content" style="height: ${this.height-160}px">
                            <span>${msg1}<span id="time" style="color:red">${time}</span>${msg2}</span>
                       </div>
                   </div>`;
        $('body', window.top.document).append(div);
        if (arguments.length < 2) {
            let i = 0;
            setInterval(function() {
                $('#time').text(i++);
            }, 1000);
        } else {
            let i = time-1;
            setInterval(function() {
                $('#time').text(i--);
                if (i === 0) {
                    callBack();
                }
            }, 1000);
        }
    };

    /**
     * 新增iframe框
     */
    modal.Modal.prototype.iframe = function(url) {
        if (!this.flag) {
            return;
        }
        this.confirmCancel();
        this.maskInit();
        let div = `<div id="modal-confirm" style="height: ${this.height}px;width: ${this.width}px;margin-top: -${(this.height/2)+100}px;
    margin-left: -${this.width/2}px;">
                       <div id="modal-header"> 
                            <span>提示</span>
                       </div>
                       <div id="modal-content" style="height: ${this.height-160}px">
                            <iframe src="${url}" style="width:100%;height:100%;border: none"></iframe>
                       </div>
                       <div id="modal-footer">
                            <div class="modal-btn modal-btn-sure a">确认</div>
                            <div class="modal-btn modal-btn-sure b">30分钟不弹出</div>
                            <div class="modal-btn modal-btn-sure c">1小时不弹出</div>
                       </div>
                   </div>`;
        $('body', window.top.document).append(div);
        this.flag = true;
        $('.a').click(function() {
            $('#modal-confirm', window.top.document).remove();
            $('#modal-mask', window.top.document).remove();
            if (instance) {
                instance = null;
            }
        });
        $('.b').click(function() {
            $('#modal-confirm', window.top.document).remove();
            $('#modal-mask', window.top.document).remove();
            setTimeout(function() {
                if (instance) {
                    instance = null;
                }
            }, 1800000);
        });
        $('.c').click(function() {
            $('#modal-confirm', window.top.document).remove();
            $('#modal-mask', window.top.document).remove();
            setTimeout(function() {
                if (instance) {
                    instance = null;
                }
            }, 3600000);
        });
    };
    /**
     * 弹出iframe框
     */
    modal.Modal.prototype.alertIframe = function(url) {
        if (!this.flag) {
            return;
        }
        this.confirmCancel();
        this.maskInit();
        let div = `<div id="modal-confirm" style="height: ${this.height}px;width: ${this.width}px;margin-top: -${(this.height/2)+100}px;
    margin-left: -${this.width/2}px;">
                       <div id="modal-header"> 
                            <span>提示</span>
                       </div>
                       <div id="modal-content" style="height: ${this.height-160}px">
                            <iframe src="${url}" style="width:100%;height:100%;border: none"></iframe>
                       </div>
                       <div id="modal-footer">
                            <div class="modal-btn modal-btn-sure a">确认</div>
                       </div>
                   </div>
                    `;
        $('body', window.top.document).append(div);
        this.flag = true;
        $('.a').click(function() {
            $('#modal-confirm', window.top.document).remove();
            $('#modal-mask', window.top.document).remove();
            if (instance) {
                instance = null;
            }
        });
    };
});
