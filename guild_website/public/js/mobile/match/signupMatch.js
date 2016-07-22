 // 提示弹窗
	  function _alert(msg) {
		var $alertWin = $('#alert-win');
	    $alertWin.show().find('.con').html(msg);
	  }
//领签到劵
$(function() {
    // 关闭弹窗
	 $('[data-action="close"]').bind('click', function() {
	    $(this).parents('.mask-pop').hide();
	});
	showGuild();//展示战队加载
	var $signupMatch=$('#signupMatch');
	$('#signupedMatch').hide();
	//点击按钮触发对应事件
	$signupMatch.on('click',function(){
	if($signupMatch.hasClass('loading')) return;
	var url=$('#ajaxUrl').val();
    $.ajax({
        url:url,
        type:'get',
        beforeSend:function(){
        	$signupMatch.addClass('loading');
        },
        complete:function(){
        	$signupMatch.removeClass('loading');
        },
        success:function(data){
        	if(data.result=='success'){
        		$('#signupedMatch').show();
        		$('#oldGetSignup').hide();
        	} else if(data.result=='apply_sign_limit') {
        		_alert('<p style="text-align: center">很遗憾，签到人数已满！<p>');
        	}
        },
        error: function(){
        	_alert('<p style="text-align: center">领比赛入场劵失败<p>');
        }
     }); 
	});
});