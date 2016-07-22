	$(function(){
		//首页战队切换
	    var $teamNav =$(".team-nav li");
	    var $teamCon =$(".team-con .team-list");
	    $teamNav.click(function(){
			$(this).addClass("on")
			.siblings().removeClass("on");
			var index =  $teamNav.index(this);
			$teamCon.eq(index).removeClass("hide").siblings().addClass("hide"); 
		})
	    //显示浮层
	    var $btnVote =$(".btn-vote");
	    var $popAlert =$(".pop-alert");
	    $btnVote.click(function(){
			$popAlert.show();
		})
	    //关闭浮层
	    var $btnClose =$(".btn-close");
	    $btnClose.click(function(){
			$popAlert.hide();
		})
	     //点击视频
	    var $btnVideo =$(".item-video");
	    $btnVideo.click(function(){
			$(this).parent().addClass("show").siblings().removeClass("show");
		})
	    
})