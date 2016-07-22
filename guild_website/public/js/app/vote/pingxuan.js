	$(function(){
		//切换评选
	    var $conNav =$(".gh-nav li");
	    $conNav.click(function(){
			$(this).addClass("current").siblings().removeClass("current");
				var index =  $conNav.index(this); 
				$(".gh-list-con .gh-list").eq(index).show().siblings().hide(); 
	})
	    //滚动图片
	var sWidth = $(".wish-con .wish-list-con-ul li").width();
	var len = $(".wish-con .wish-list-con-ul li").length; 
	var index = 0;
	var picTimer;

	$(".wish-con .wish-list-con-ul").css("width",sWidth * (len));
	
	$(".wish-con").hover(function() {
		clearInterval(picTimer);
	},function() {
		picTimer = setInterval(function() {
			showPics(index);
			index++;
			if(index == len) {index = 0;}
		},4000); //此4000代表自动播放的间隔，单位：毫秒
	}).trigger("mouseleave");
	
	function showPics(index) { 
		var nowLeft = -index*sWidth; 
		$(".wish-con .wish-list-con-ul").stop(true,false).animate({"left":nowLeft},300); 
		$(".wish-con .mini-page li").stop(true,false).addClass("point").eq(index).stop(true,false).removeClass("point");
	}  
	//关闭二维码
	
	 $(".fixed-con .icon-close").click(function(){
			$(this).parent().hide();
			event.preventDefault();
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