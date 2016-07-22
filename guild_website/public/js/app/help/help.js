	$(function(){
	    var $navList =$(".nav-list li");
	    $navList.click(function(){
			$(this).addClass("current")           
			.siblings().removeClass("current"); 
			var index =  $navList.index(this);  
			$(".con-wrap .content").eq(index).show().siblings().hide(); 
	})
	})