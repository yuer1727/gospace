$(function(){ 
var _wrap=$('.speaker ul');//定义滚动区域 
var _interval=2500;//定义滚动间隙时间 
	_wrap.hover(function(){ 
		setInterval(function(){ 
			var _field=_wrap.find('li:first');
			var _h=_field.height();
			_field.animate({marginTop:-_h+'px'},600,function(){
			_field.css('marginTop',0).appendTo(_wrap);
		}) 
		},_interval)
		}).trigger('mouseleave');
	}); 
	
//切换
	$(function(){
	    var $conNav =$(".gh-nav li");
	    $conNav.click(function(){
			$(this).addClass("current").siblings().removeClass("current");
				var index =  $conNav.index(this); 
				$(".gh-list-con .gh-list").eq(index).show().siblings().hide(); 
	})
	    
	    //投票按钮	
	 $(".gh-list-con .btn-vote").click(function(){
			$(".pop-mask").show();
			$(".pop-vote").show();
			event.preventDefault();
	})
	 //关闭投票浮层
	 $(".pop-vote .icon-close").click(function(){
			$(".pop-vote").hide();
			$(".pop-mask").hide();
			event.preventDefault();
	})
	    
});