//<![CDATA[
$(function(){

         //文本框失去焦点后
        $('form :input').blur(function(){
             var $parent = $(this).parent();
             $parent.find(".tips").remove();
             //验证简称
             if( $(this).is('#name') ){
                    if( this.value=="" ){
                        var errorMsg = '请输入战队简称';
                        $parent.append('<span class="tips onError">'+errorMsg+'</span>');
                    }
                    else{
                        $parent.append(' ');
                    }
             }
             //验证QQ
             if( $(this).is('#qq') ){
                    if( this.value=="" ){
                        var errorMsg = '请输入QQ号码';
                        $parent.append('<span class="tips onError">'+errorMsg+'</span>');
                    }
                    else{
                        $parent.append(' ');
                    }
             }
             //验证手机
             if( $(this).is('#phone') ){
                    if( this.value=="" ){
                        var errorMsg = '请输入手机号码';
                        $parent.append('<span class="tips onError">'+errorMsg+'</span>');
                    }
                    else{
                        $parent.append(' ');
                    }
             }
              //验证荣誉值
             if( $(this).is('#count') ){
                    if( this.value=="" ){
                        var errorMsg = '请输入个人荣誉值';
                        $parent.append('<span class="tips onError">'+errorMsg+'</span>');
                    }
                    else{
                        $parent.append(' ');
                    }
             }
              //验证荣誉值
             if( $(this).is('#server') ){
                    if( this.value=="" ){
                        var errorMsg = '请输入游戏服务器';
                        $parent.append('<span class="tips onError">'+errorMsg+'</span>');
                    }
                    else{
                        $parent.append(' ');
                    }
             }
             
             /** 验证图片
             if( $(this).is('#update-none') ){
                    if( this.value==""  ){
                        var errorMsg = '请上传图片';
                        $parent.append('<span class="tips onError">'+errorMsg+'</span>');
                    }
                    else{
                        $parent.append(' ');
                    }
             } */


        }).keyup(function(){
           $(this).triggerHandler("blur");
        }).focus(function(){
             $(this).triggerHandler("blur");
        });//end blur

        
        //提交，最终验证。
         $('#send').click(function(){
                $("form :input.required").trigger('blur');
                var numError = $('form .onError').length;
                if(numError){
                    return false;
                } 
                //alert("验证成功.");
         });
         

	    //关闭浮层
	    var $btnClose =$(".btn-close");
	    var $popAlert =$(".pop-alert");
	    $btnClose.click(function(){
			$popAlert.hide();
		})       
		
		
		//模拟选择服务器
  	    var $serverName =$("#server");
  	    var $serverList =$(".server-list");
  	    var $serverListText =$(".server-list li");
  	    $serverName.click(function(){
  			$serverList.toggleClass("hide");
  		});
  	    $serverListText.click(function(){
  	    	$(this).addClass("on").siblings().removeClass("on");
  			$serverName.val($(this).text());
  			$serverList.addClass("hide");
  		}) 

})


//]]>
