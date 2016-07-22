//<![CDATA[
$(function() {

	//文本框失去焦点后
	$('form :input').blur(function() {
		var $parent = $("#tips");
		$parent.find(".tips").remove();


		//验证验证码
		if ($(this).is('#yazheng')) {
			if (this.value == "") {
				var errorMsg = '请输入验证码';
				$parent.append('<span class="tips onError">' + errorMsg + '</span>');
			} else {
				$parent.append(' ');
			}
		}
		//验证手机
		if ($(this).is('#phone')) {
			if (this.value == "") {
				var errorMsg = '请输入手机号码';
				$parent.append('<span class="tips onError">' + errorMsg + '</span>');
			} else {
				$parent.append(' ');
			}
		}


	}).keyup(function() {
		$(this).triggerHandler("blur");
	}).focus(function() {
		$(this).triggerHandler("blur");
	}); //end blur


	//提交，最终验证。
	$('#send').click(function() {
		$("form :input.required").trigger('blur');
		var numError = $('form .onError').length;
		if (numError) {
			return false;
		}
		 $('#mobile').val($('#phone').val());
         $('#verifyCode').val($('#yazheng').val());
	});


})


//]]>