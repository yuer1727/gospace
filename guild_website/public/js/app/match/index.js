/**
 * @description 电竞侠移动电竞大奖赛揭幕赛
 * @author zhongna
 * @update 20160216
 */

define(function(require) {
  // 关于比赛
  $('#aboutBtn').click(function() {
    dialog({
      title: '关于比赛',
      content: $('#about').html(),
      cancelValue: '关闭'
    }).show();
    sendStatLog('visit_match_subject_about');
  });

  // 比赛规则
  $('#rulesBtn').click(function() {
    dialog({
      title: '比赛规则',
      content: $('#rules').html(),
      cancelValue: '关闭'
    }).show();
    sendStatLog('visit_match_subject_rule');
  });
  
//切换比赛规则
  $('body').on('click', '#tabs li', function() {
    var id = $(this).data('id');
    $(this).addClass('active').siblings().removeClass('active');
    $('#' + id).show().siblings().hide();
    dialog.getCurrent().reset();
    $('.article-rules').scrollTop(0);
  });
  
  function sendStatLog(action){
	  var data = {"action":action,"id":$("#id").val()}
	  jQuery.post('/match/subjectStatLog', data, function (result) {},'json');
  }
});