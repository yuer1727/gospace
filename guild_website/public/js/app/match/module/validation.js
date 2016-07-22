/**
* 表单校验
* @author zhongna.zn@alibaba-inc.com
* @version 1.0.0 ### 20150826
* @update: yingyan.zyy@alibaba-inc.com ### 20150904 -- 修改输入验证
*/

define(function(require, exports, module) {

    var Validation = {

        init: function($el, args) {
            var that = this,
                $form = $el.find('form');

            that.$el = $el;  // 容器
            that.$input = $el.find('.j-input');  // 文本框
            that.$fileInput = $el.find('.j-fileInput');  // 上传控件
            that.$select = $el.find('.j-select');  // 上传控件
            that.args = $.extend({}, options, args);  // 参数配置

            $form.submit(function() {
                that.$input.each(function() {
                    that.validate($(this));
                });

                that.$fileInput.each(function() {
                    that.validate($(this));
                });

                that.$select.each(function() {
                    that.validate($(this));
                });

                if (!that.$el.find('.error').length) {  // 校验通过
                    return that.trigger(that.args.onSubmit);
                }
                else {  // 校验未通过
                    that.trigger(that.args.onError);
                    return false;
                }
            });

            that.$input
            .on('keyup', function() {
                $(this).closest('.j-field').find('.msg').hide();
            })
            .on('blur', function() {
                that.validate($(this));
            });

            that.$select.on('change', function() {
                that.validate($(this));
            });

            that.$fileInput.on('change', function() {
                that.validate($(this));
            });
        },

        // 校验
        validate: function($target) {
            var that = this,
                value = $.trim($target.val()),
                rules = $target.data('rules'),  // 正则
                msg = $target.data('msg') || {};

            msg = $.extend({}, that.args.defaultMsg, msg);  // 提示文本
            var regexp = rules=='number' ? /^[0-9]*$/g : null;
            if (value == '') {
                if ($target.data('required')) {
                    that.showMsg($target, msg.requiredMsg);
                } else {
                    that.hideMsg($target);
                }
            }
            else if (regexp && !regexp.test(value)) {
                that.showMsg($target, msg.regexpMsg);
            }
            else {
                that.hideMsg($target);
            }

            return that.isValid;
        },

        // 显示提示信息
        showMsg: function($target, str) {
            $target.closest('.j-field').find('.msg').html(str).addClass('error').show();
            this.isValid = false;
        },

        // 隐藏提示信息
        hideMsg: function($target) {
            $target.closest('.j-field').find('.msg').removeClass('error').hide();
            this.isValid = true;
        },

        // 执行回调
        trigger: function (fn) {
            return typeof fn === 'function' ? fn.call(this) : true;
        }
    };

    // 计算字符串字节数
    function stringbyte(str) {
        var tempStr = new String(str), tempChar, charLength = 0;
        for (var i = 0, len = tempStr.length; i < len; i++) {
            tempChar = tempStr.charAt(i);
            if (escape(tempChar).length > 4) {
                charLength += 2;
            } else if (tempChar != "\r") {
                charLength++;
            }
        }
        return charLength;
    }

    // 截取中英文字符串
    function subString(str, len) {
        var newLength = 0;
        var newStr = "";
        var chineseRegex = /[^\x00-\xff]/g;
        var singleChar = "";
        var strLength = str.replace(chineseRegex,"**").length;
        for(var i = 0;i < strLength;i++) {
            singleChar = str.charAt(i).toString();
            if(singleChar.match(chineseRegex) != null) {
                newLength += 2;
            }else {
                newLength++;
            }
            if(newLength > len) {
                break;
            }
            newStr += singleChar;
        }
        return newStr;
    }

    // 正则表达式
    var regExp = {
        name: /^([\u4e00-\u9fa5]+|([a-zA-Z]+\s?)+)$/,  // 姓名
        mobile: /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,  // 手机号码
        number: /^[0-9]+$/,  // 数字
        alphanum: /^[A-Za-z0-9]+$/  // 数字或英文字母
    };

    // 默认配置
    var options = {

        // 默认提示语
        defaultMsg: {
            requiredMsg: '必填项',
            regexpMsg: '格式不正确'
        },

        // 提交表单时的回调
        onSubmit: null,

        // 校验失败回调
        onError: null
    };

    module.exports = Validation;

});