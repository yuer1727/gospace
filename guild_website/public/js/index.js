/**
* 图片幻灯片
* @author guanwq
* @version 0.0.1
* @dependencies 依赖jquery
*/

var t = 0, n = 1, count;
$(document).ready(function(){	
	$("#slidePhoto li:not(:first-child)").hide();
	t = setInterval("showAuto(n)", 4000);
	$("#slidePhoto").hover(function(){clearInterval(t)}, function(){t = setInterval("showAuto(n)", 4000);});
})
function showAuto(num){
	count=$("#slidePhoto li").length;
	$("#slidePhoto li").filter(":visible").fadeOut(400).parent().children().eq(num).fadeIn(400);
	n=(n>=count-1)?0:++n;
}


	  	

//触发动画

$(function(){
	//定义屏幕高度
	var $Screen = $(window).height();
	if($Screen>=480){
		$(".section-home").height($Screen+"px");
		$(".section6").height($Screen+"px");
	}
	else{
		$(".section-home").height(480+"px");
		$(".section6").height(480+"px");
	}
	


    $(window).scroll(function(){
        var $ScrollTop = $(window).scrollTop();
//      var $Screen = parseInt($(window).height());
//      var theHeight=$Screen;
//      $("#count1").html($ScrollTop);
//      $("#count2").html($Screen);
////      //alert($ScrollTop);
////      //alert($Screen);
////alert((theHeight+320));
//      
        if($ScrollTop>230){
          $(".section1").addClass("active");
        }
  		if($ScrollTop>580){
          $(".section2").addClass("active");
        }
//			if($ScrollTop<580){
//        $(".section2").removeClass("active");
//      }
		if($ScrollTop>940){
          $(".section3").addClass("active");
        }
//			if($ScrollTop<940){
//        $(".section3").removeClass("active");
//      }
		if($ScrollTop>1300){
          $(".section4").addClass("active");
        }
//			if($ScrollTop<1300){
//        $(".section4").removeClass("active");
//      }
		if($ScrollTop>1670){
          $(".section5").addClass("active");
        }
//			if($ScrollTop<1670){
//        $(".section5").removeClass("active");
//      }
		//alert($ScrollTop)
		if($ScrollTop<100){
			$(".section1").removeClass("active");
			$(".section2").removeClass("active");
			$(".section3").removeClass("active");
			$(".section4").removeClass("active");
			$(".section5").removeClass("active");
        }
    });
    
});