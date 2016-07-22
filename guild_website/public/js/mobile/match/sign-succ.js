/*
* 报名成功逻辑
*/


$(function() {

  // 提示弹窗
  var $alertWin = $('#alert-win');

  function _alert(msg) {
    $alertWin.show().find('.con').html(msg);
  }

  // 关闭弹窗
  $('[data-action="close"]').bind('click', function() {
    $(this).parents('.mask-pop').hide();
  });

  //查看我的战队
  var $guildBtn=$('#showGuild');
  $guildBtn.bind('click',function(){
	  if ($('#userType').val() != '1') {
		  return;
	  }
	  
	  window.alert("kk://page/goto?target=teamHomePage&id="+$('#guildId').val());
	  //window.alert("kk://common/combine?list=kk%3a%2f%2fpage%2fclose%60kk%3a%2f%2fpage%2fgoto%3ftarget%3dteamHomePage%26id%3d"+$('#guildId').val());
  });
  
  // 自建战队
  /*var $autoBtn = $('[data-action="auto-found"]');
  $autoBtn.on('click', function() {
    var url = $('#api-found').val();
    if($autoBtn.hasClass('loading')) return;

    $.ajax({
      url: url,
      type: 'POST',
      beforeSend: function() {
        $autoBtn.addClass('loading');
      },
      complete: function() {
        $autoBtn.removeClass('loading');
      },
      success: function(data) {
        alert(data.userType);
        if(data.userType==1) {
          var $win2 = $('#win2');
          $('#win1').hide();

          // 提示弹窗
          $win2.find('.con').html(data.message);
          $('[data-action="view-team"]').on('click', function() {
            // 点击查看我的战队跳转
            window.location.href = data.guildUrl;
          });
          $win2.show();
        } else {
        	 window.location.href = data.guildUrl;
        }
      },
      
      error: function() {
        _alert('<p style="text-align: center">自动建队失败<p>');
      }
    });
  });
*/
});