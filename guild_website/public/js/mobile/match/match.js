//点赞效果
$(function() {

	 // window.JSBridge = {
  //   callNative: function(a, b, c, cb) {
  //     console.log(a, b, c, cb);
  //   }
  // };


	var $zanCount = $(".zan");
	$zanCount.click(function() {
		if ($(this).hasClass('on')) {
			$(this).removeClass("on");
			return false;
		} else {
			$(this).addClass("on")
			return false;
		}
	});

	//弹浮层
	var $btnPop = $(".btn-pop");
	var $downPop = $(".down-pop");
	var $btnClose = $(".btn-close");
	$btnPop.click(function() {
		$downPop.show();
	})
	$btnClose.click(function() {
		$downPop.hide();
	});

	// 拖动列表
	var $scrollList = $('[data-role="scroll-list"]'),
			$items = $('[data-role="scroll-list"] li'),
			length = $items.length,
			itemWidth = $items.width() + (parseInt($items.css('margin-left')) || 0),
			prevX;
   
	$scrollList.width(itemWidth * length);

	var prevX = curX = delta = x= 0,
			minX = -(itemWidth * length - $('body').width() );

	$scrollList.on('touchstart', function(e) {
		prevX = e.touches[0].pageX;
	}).on('touchmove', function(e) {
		e.preventDefault();
		// 计算偏移量
		curX = e.touches[0].pageX;
		delta = curX - prevX;
		prevX = curX;
		x = x + delta;
		
		if(x <= 0 && x >= minX) {
			$scrollList.css('-webkit-transform', 'translate3d('+ x +'px, 0, 0)');
			$('#translate3dValue').val(x); //记录translate3d的值
		} else {
			x = x - delta;
		}

	}).on('touchend', function(e) {
		prevX = curX = delta = 0;
	});

	if(window.slip) {
		// 视频图片轮播
		var $slider = $('#slider'),
				$sliderItems = $slider.find('li'),
				$pager = $('#pager'),
				containerWidth = $slider.width();

		$sliderItems.width(containerWidth);
		$slider.find('ul').width(containerWidth * $sliderItems.length);
		
		// 如果数目大于 1 的话，轮播
		if($sliderItems.length > 1) {
			// init pager
			$sliderItems.each(function() {
				$pager.append('<span class="swiper-pagination-switch"></span>');
			});
			$pager.find('.swiper-pagination-switch').first().addClass('swiper-active-switch');

			slip('page', $slider.find('ul')[0], {
				change_time: 4000,
				num: $sliderItems.length,
				endFun: function() {
					var $curItem = $pager.find('.swiper-pagination-switch').eq(this.page);
					$curItem.addClass('swiper-active-switch');
					$pager.find('.swiper-pagination-switch').not($curItem).removeClass('swiper-active-switch');
				}
			});

		}
		// 点击播放视频
		$slider.on('click', 'a', function(e) {
			var url = $(this).data('url');
			e.preventDefault();
			
			window.JSBridge && JSBridge.callNative("NineGameClient", "openWindow", {"url": url, "target": "video", "options": "" });
		});
	}
	 //获取对战信息导航位置
	  if($.trim($('#translate3dValue').val()).length>0){
		  if($('#translate3dValue').val()<=0 && $('#translate3dValue').val()>=minX){
			  $scrollList.css('-webkit-transform', 'translate3d('+$('#translate3dValue').val()+'px, 0, 0)');
		  }else{
			  if(minX>0){
				  minX=0;
				  $scrollList.css('-webkit-transform', 'translate3d('+minX+'px, 0, 0)');
			  }
			  else{
				  $scrollList.css('-webkit-transform', 'translate3d('+minX+'px, 0, 0)');
			  }
		  }   
	  }
});