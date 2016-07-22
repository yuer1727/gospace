(function() {
  var browser = (function() {
    var ua = navigator.userAgent;
    return {
      wechat: ua.match(/MicroMessenger/i) == 'MicroMessenger'
    }
  })();

  // 下载按钮
  var downloadBtns = $('.btn-down'),
      wechatTips = $('#wechatTips'),
      downPopup = $('#downPopup');
  
  // 如果是微信浏览器
  downloadBtns.click(function(e) {
    if(browser.wechat) {
      e.preventDefault();
      wechatTips.show();
    }
  });

  $('.j-downtips').click(function() {
    downPopup.show();
  });

  wechatTips.click(function() {
    $(this).hide();
  });

  downPopup.find('.j-close').click(function() {
    downPopup.hide();
  });
})();