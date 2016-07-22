	$(function(){
		//首页战队切换
	    var $teamNav =$(".team-nav li");
	    var $teamCon =$(".team-con .team-list");
	    $teamNav.click(function(){
			$(this).addClass("on")
			.siblings().removeClass("on");
			var index =  $teamNav.index(this);
			$teamCon.eq(index).removeClass("hide").siblings().addClass("hide"); 
			 return false;
		})
	    //已点按钮
	    var $btnVoteEd =$(".btn-vote-ed");
	    $btnVoteEd.click(function(){
			 return false;
		})
	    //显示投票浮层
	    var $btnVote =$(".btn-vote");
	    var $popAlert =$(".pop-alert");
	    $btnVote.click(function(){
			$popAlert.show();
			return false;
		})
	    //关闭投票浮层
	    var $btnClose =$(".btn-close");
	    $btnClose.click(function(){
			$popAlert.hide();
		})
	    //显示报名浮层
	    var $btnForm =$(".top-nav .nav-3");
	    var $popForm =$(".pop-form");
	    $btnForm.click(function(){
			$popForm.show();
			return false;
		})
	    //关闭报名浮层
	    var $btnFormClose =$(".pop-form .btn-close");
	    $btnClose.click(function(){
			$popForm.hide();
		})
	    
	    //关闭成功错误浮层
	    var $btnInfoClose =$(".pop-info .btn-close");
	    var $popInfo =$(".pop-info");
	    $btnInfoClose.click(function(){
			$popInfo.hide();
		})
	    
})