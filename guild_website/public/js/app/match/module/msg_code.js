/**
 * @description: 主播信息页 - 手机校验
 * @author: zhongna
 * @update: 20151027
 */

define(function(require) {
    // 获取短信验证码
    var timer = null;
    $('#getMsgCode').click(function() {
        var $this = $(this);

        if ($('#mobile').siblings('.error').length) {
          $('#mobile').focus();
          return;
        }

        var _url = $this.data('url'),
            _data = $('#mobile').val(),
            count = 60;

        timer && clearInterval(timer);

        jQuery.post(_url, {'mobile': _data}, function(result) {
        	if(result.success){
	            $this.addClass('disabled').attr('disabled', 'disabled').html('<span class="num">剩余' + count + '</span>秒');
	            // 获取验证码倒计时
	            timer = setInterval(function() {
	                count--;
	                $this.find('.num').html(count);
	                if (count < 0) {
	                    clearInterval(timer);
	                    $this.removeClass('disabled').removeAttr('disabled').html('获取验证码');
	                }
	            }, 1e3);
        	} else {
        		errorTips('验证码发送失败，请稍后重试');
        	}
        },'json');
    });
});