//<![CDATA[
$(function(){

         //文本框失去焦点后
        $('form :input').blur(function(){
             var $parent = $(this).parent();
             $parent.find(".tips").remove();
             //验证简称
             if( $(this).is('#name') ){
                    if( this.value=="" ){
                        var errorMsg = '请输入战队名称';
                        $parent.append('<span class="tips onError">'+errorMsg+'</span>');
                    }
                    else{
                    	if(this.value.length>15){
                    		var errorMsg = '战队名称必须小于15个字';
                        	$parent.append('<span class="tips onError">'+errorMsg+'</span>');	
                    	}
                        else{
                        	$parent.append(' ');
                        }
                    }
             }
             //验证战队人数
             if( $(this).is('#teamNumber') ){
                    if( this.value=="" ){
                        var errorMsg = '请输入战队人数';
                        $parent.append('<span class="tips onError">'+errorMsg+'</span>');
                    }
                    else{
                    	if (!checkRate(this.value)) {
                    		var errorMsg = '战队人数只能为5位以内的数字';
                            $parent.append('<span class="tips onError">'+errorMsg+'</span>');
                    	} else {
                    		$parent.append(' ');
                    	}
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
                    	  if(this.value.length!=11){
                      		var errorMsg = '手机号必须是11位';
                          	$parent.append('<span class="tips onError">'+errorMsg+'</span>');	
                      	}
                          else{
                          	$parent.append(' ');
                          }
                    }
             }
              //验证荣誉值
             if( $(this).is('#server') ){
                    if( this.value=="请选择游戏区服" ){
                        var errorMsg = '请选择游戏区服';
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
         
       //模拟选择服务器
  	    var $serverName =$("#server");
  	    var $serverList =$(".server-list");
  	    var $serverListText =$(".server-list li");
  	    $serverName.click(function(){
  			$serverList.toggleClass("hide");
  		})
  	    $serverListText.click(function(){
  	    	$(this).addClass("on").siblings().removeClass("on");
  			$serverName.val($(this).text());
  			$serverList.addClass("hide");
  		})
})

function checkRate(value) {  
   var re = /^\d{1,5}$/;  
   if (!re.test(value)) {  
      return false;
   }
   return true;
}


//]]>
