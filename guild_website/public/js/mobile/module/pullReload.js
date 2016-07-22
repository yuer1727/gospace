/**
 * @description:  下拉刷新页面
 * @author: zhongna
 * @update: 20160105
 */

define(function(require, exports, module) {
    var startY, moveY, scrollTop, angle, y;
    $('body').on('touchstart', function(e) {
        startY = e.touches[0].pageY;
        scrollTop = window.scrollY;
    }).on('touchmove', function(e) {
        moveY = startY - e.touches[0].pageY;
        if (moveY < -5 && scrollTop <= 0) {
            e.preventDefault();
            y = Math.abs(moveY);
            if (!$('#topRefreshTips').length) {
                var $topRefreshTips = $('<p id="topRefreshTips"><i class="icon"></i><span class="text">下拉刷新</span></p>');
                $('body').prepend($topRefreshTips);
            } else {
                $('#topRefreshTips .text').html('下拉刷新');
            }

            if (y > 30) {
                angle = Math.abs(moveY + 30) * 180 / 50;
                angle = Math.min(180, angle);
                $('#topRefreshTips .icon').css({
                    '-webkit-transform': 'rotate(' + angle + 'deg)'
                });
            }

            if (y > 50) {
                $('#topRefreshTips .text').html('松开刷新');
            }

            if (y > 70) {
                y = Math.log2(y) + 70;
            }
            $('#topRefreshTips').css({
                'height': y + 'px'
            });
        }
    }).on('touchend', function() {
        $('#topRefreshTips .icon').css({
            '-webkit-transform': 'rotate(0deg)'
        });

        $('.list-page').css({
            '-webkit-transform': 'translate3d(0,0,0)'
        });

        if (moveY < -50 && scrollTop <= 0) {
            window.location.reload();
        }
    })
});