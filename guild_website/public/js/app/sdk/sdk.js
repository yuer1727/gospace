
//触发动画
	$(function(){
    $(window).scroll(function(){
        var this_scrollTop = $(this).scrollTop();
        var this_screen = $(this).height();
        
        var theHeight=parseInt(1240-this_screen);
		//alert(theHeight1);
		
        if(this_scrollTop>theHeight){
          $(".intro-1").addClass("animation");
        }
       		if(this_scrollTop<100){
          $(".intro-1").removeClass("animation");
          $(".intro-2").removeClass("animation");
          $(".intro-3").removeClass("animation");
          $(".intro-4").removeClass("animation");
        }
		if(this_scrollTop>(theHeight+500)){
          $(".intro-2").addClass("animation");
        }

		if(this_scrollTop>(theHeight+1000)){
          $(".intro-3").addClass("animation");
        }

		if(this_scrollTop>(theHeight+1500)){
          $(".intro-4").addClass("animation");
        }

		//alert(this_scrollTop)
    });
    
});


