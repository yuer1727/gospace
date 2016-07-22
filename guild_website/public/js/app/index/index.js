
define(function(require, exports, module) {

	var slideImg = require("../../module/slideImg");
  	new slideImg({
		  main: "#slideImg li",
	//handleWrap: "#slideImgBar",	
 	//handleOnClass: "on",
		  time: 4000
	});
	


});




//触发动画

	$(function(){
    $(window).scroll(function(){
        var this_scrollTop = $(this).scrollTop();
        var this_screen = $(this).height();
        
        var theHeight=parseInt(1540-this_screen);
		//alert(theHeight1);
		
        if(this_scrollTop>theHeight){
          $(".intro-1").addClass("animation");
        }
       		if(this_scrollTop<theHeight){
          $(".intro-1").removeClass("animation");
        }
		if(this_scrollTop>(theHeight+500)){
          $(".intro-2").addClass("animation");
        }
			if(this_scrollTop<(theHeight+500)){
          $(".intro-2").removeClass("animation");
        }
		if(this_scrollTop>(theHeight+1000)){
          $(".intro-3").addClass("animation");
        }
			if(this_scrollTop<(theHeight+1000)){
          $(".intro-3").removeClass("animation");
        }
		if(this_scrollTop>(theHeight+1500)){
          $(".intro-4").addClass("animation");
        }
			if(this_scrollTop<(theHeight+1500)){
          $(".intro-4").removeClass("animation");
        }
		if(this_scrollTop>(theHeight+2000)){
          $(".intro-5").addClass("animation");
        }
			if(this_scrollTop<(theHeight+2000)){
          $(".intro-5").removeClass("animation");
        }
		//alert(this_scrollTop)
    });
    
});
//滚动游戏
$(function(){
        var $this = $("#scrollGame");
  var scrollTimer;
  $this.hover(function(){
     clearInterval(scrollTimer);
   },function(){
     scrollTimer = setInterval(function(){
       scrollNews( $this );
     }, 3000 );
  }).trigger("mouseleave");
});
function scrollNews(obj){
   var $self = obj.find("ul:first"); 
   var lineHeight = $self.find("li:first").width(); //获取宽度，向上滚动则需要获取高度.height()
   $self.animate({ "marginLeft" :-380+"px" }, 600 , function(){ //向左滚动，向上滚动则需要改为marginTop,其他方向类似，下同
         $self.css({marginLeft:0}).find("li:first").appendTo($self); //appendTo能直接移动元素
   })
}

