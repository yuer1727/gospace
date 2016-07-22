  // 提示弹窗
	  var $alertWin = $('#alert-win');

	  // 关闭弹窗
	  $('[data-action="close"]').bind('click', function() {
	    $(this).parents('.mask-pop').hide();
	  });
	  
	function getVerifyCode(){
		var mobile = $('#phone').val();
		var re = /^1\d{10}$/
		if (!mobile || !re.test(mobile)) {
			$alertWin.show().find('.con').html("请填写正确手机号码");
			return;
		}
	
		jQuery.post('/m/match/requestVerifyCode', {'mobile':mobile}, function (result) {
	         if(result.success){
	       		$alertWin.show().find('.con').html("验证码已发送，注意查收");
	       		$('#match_check_mobile_get_vercode_success').click();
	         }else{
	        	$alertWin.show().find('.con').html("验证码发送失败，请稍后重试");
	        	$('#match_check_mobile_get_vercode_error').click();
	        	
	         }
	     },'json');
	}	