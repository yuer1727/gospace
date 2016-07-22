/**
 * @description 电竞侠移动电竞大奖赛揭幕赛
 * @author zhongna
 * @update 20160216
 */

define(function(require) {
	var validation = require('./module/validation');  // 表单校验
  require('./module/msg_code');  // 获取短信校验码
  require('./module/file_imgload');  // 上传图片
  if ($('#verifyMobile').length) {
    validation.init($('#verifyMobile'), {  // 验证手机
      onSubmit: function() {
      },
      onError: function() {
        console.log('校验失败回调！')
      }
    });
  } else {
    validation.init($('#validation'), {  // 填写报名信息
      onSubmit: function() {
    	  $('#applyInputContent').val(genInputItemJson());
          $('#imgUploadContent').val(genImgItemJson());
          
         // return false;
      },
      onError: function() {
        console.log('校验失败回调！')
      }
    });
  }


});
//错误提示
function errorTips(msg) {
  if ($('totast').length) return;
  var $totast = $('<div class="totast"><span class="error">' + msg + '<span></div>');
  $('body').append($totast);
  setTimeout(function() {
    $totast.remove();
  }, 1500);
}

//发送统计数据
function sendStatLog(action,subjectId,matchInfoId){
	  var data = {"action":action,"subjectId":subjectId,"matchInfoId":matchInfoId}
	  jQuery.post('/match/subjectStatLog', data, function (result) {},'json');
}

//生成报名录入项Json
function genInputItemJson() {
	 var items = '';
	 var count = 0;
	 $('div[nameFlag=inputDataGroup]').each(function() {
   	 var $ele = $(this);
   	 var title = $ele.find('input[nameFlag=title]').val();
   	 var content = $ele.find('input[nameFlag=content]').val();
   	 
   	 var itemJson = {"title": title, "content":content};
		 if (count == 0) {
			items += '[' + JSON.stringify(itemJson) ;
		 } else {
			items += ',' + JSON.stringify(itemJson);
		 }
		count++;
    });
	 if (items != '') {
		items += ']';
	 }
	 return items;
}

//生成图片录入项Json
function genImgItemJson() {
	 var items = '';
	 var count = 0;
	 $('div[nameFlag=imgUploadGroup]').each(function() {
    	 var $ele = $(this);
    	 var title = $ele.find('input[nameFlag=title]').val();
    	 var contentUrl = $ele.find('input[nameFlag=fileRemoteUrl]').val();
    	 
    	 var itemJson = {"title": title, "content":contentUrl};
 		 if (count == 0) {
 			items += '[' + JSON.stringify(itemJson) ;
 		 } else {
 			items += ',' + JSON.stringify(itemJson);
 		 }
 		count++;
     });
	 if (items != '') {
		items += ']';
	 }
	 return items;
}
