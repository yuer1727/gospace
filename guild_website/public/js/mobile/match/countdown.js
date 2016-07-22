(function() {
  var day, hours, minu, seco;
  var $countDown = $('#countdown');
  var $countdownNow = $('#countdownNow');

  // 倒计时功能
  function countDown(timer){
    if ($countDown.length) {
      var leftTime = timer;
      var leftsecond = parseInt(leftTime / 1e3);
      day = Math.floor(leftsecond / (60 * 60 * 24));

      // 如果超过24小时则不做倒计时
      if (day >= 1) return;

      hours = Math.floor((leftsecond - day * 24 * 60 * 60) / 3600);
      minu = Math.floor((leftsecond - day * 24 * 60 * 60 - hours * 3600) / 60);
      seco = Math.floor(leftsecond - day * 24 * 60 * 60 - hours * 3600 - minu * 60);

      if (!$countDown.find('.countdown').length) {
        $countDown.append('<span class="countdown">(倒计时:<span class="time">' + hours + '小时' + minu + '分钟' + seco +'秒</span>)</span>');
      }

      // 倒计时结束
      if (day === 0 && hours === 0 && minu === 0 && seco === 0 || day < 0 || hours < 0 || minu < 0 || seco < 0 ) {
        $countDown.find('.time').html('0小时0分钟0秒');
        setTimeout(function() {
          $countDown.removeClass('btn-disabled').removeAttr('disabled').find('.countdown').hide();
        }, 1e3);
      } else {
        $countDown.find('.time').html(hours + '小时' + minu + '分钟' + seco +'秒');
        setTimeout(function(){
          timer -= 1000;
          countDown(timer);
        }, 1e3);
      }
    }
  }

    function signUpMatch() {
        var matchInfoId = $('#matchInfoId').val();
        var squadId     = $('#squadId').val();

        $.ajax({
            type: 'POST',
            url: "/m/match/signupMatch" ,
            data: {
                'matchInfoId': matchInfoId,
                'squadId' : squadId
            },
            success: function(result){
                if (result.result == 'success') {
                    location.href = '/m/matchTracker/signupSuccess?matchInfoId=' + matchInfoId + "&squadId=" + squadId;
                }
            },
            error: function(result){
            },
            dataType: 'json'
        });
    }

    countDown($countDown.data('time'));

    $countDown.bind('click', signUpMatch);
    $countdownNow.bind('click', signUpMatch);

}());