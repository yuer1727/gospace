//<![CDATA[
$(function(){

         //文本框失去焦点后
        $('form :input').blur(function(){
             var $parent = $(this).parent();
             $parent.find(".tips").remove();
             
             //验证简称
             if( $(this).is('#squadName') ){
                    if( this.value=="" ){
                        var errorMsg = '请输入战队简称';
                        $parent.append('<span class="tips onError">'+errorMsg+'</span>');
                    }
                    else{
                    	if(this.value.length>15){
                    		var errorMsg = '战队简称必须小于15个字';
                        	$parent.append('<span class="tips onError">'+errorMsg+'</span>');	
                    	}
                        else{
                        	$parent.append(' ');
                        }
                    }
             }
             
             //验证比赛服务器
             if( $(this).is('#server') ){
            	  if( this.value=='请选择比赛服务器' || this.value =="" ){
                      var errorMsg = '请选择比赛服务器';
                      $parent.append('<span class="tips onError">'+errorMsg+'</span>');
                    }
                    else{
                        $parent.append(' ');
                    }
             }
             
             //动态录入项
             $(this).closest('div[nameFlag=inputDataGroup]').each(function() {
            	 var $ele = $(this);
            	 var $titleEle = $ele.find('input[nameFlag=title]');
            	 var $contentEle = $ele.find('input[nameFlag=content]');
            	 var title = $titleEle.val();
            	 var inputVal = $contentEle.val();
            	 var maxLengthVal = $contentEle.attr('maxlength');
            	 var inputTypeVal = $contentEle.attr('inputType');
            	 var hasRequiredClazz = $contentEle.hasClass('required');
            	 
            	 //进行校验
            	 if (hasRequiredClazz && inputVal=="") {
            		 var errorMsg = '请输入'+title;
            		 $ele.append('<span class="tips onError">'+errorMsg+'</span>');
            	 } else {
            		 if (inputTypeVal && inputTypeVal == "number" && !IsNum(inputVal)) {
            			 var errorMsg = title + '必须为数值';
            			 $ele.append('<span class="tips onError">'+errorMsg+'</span>');
            		 } else if (maxLengthVal && inputVal.length > maxLengthVal){
            			 var errorMsg = title + '必须小于' + maxLengthVal + '位';
            			 $ele.append('<span class="tips onError">'+errorMsg+'</span>');	
            		 } else{
            			 $ele.append(' ');
            		 }
            	 }
             });
             
             //图片动态上传项
             $(this).closest('div[nameFlag=imgUploadGroup]').each(function() {
            	 var $ele = $(this);
            	 var $parentEle = $ele.parent();
            	 $parentEle.find(".tips").remove();
            	 var $titleEle = $ele.find('input[nameFlag=title]');
            	 var $fileRemoteUrl = $ele.find('input[nameFlag=fileRemoteUrl]');
            	 var title = $titleEle.val();
            	 var fileRemoteUrl = $fileRemoteUrl.val();
            	 var $liEle = $ele.find('li');
            	 if ($liEle.hasClass('uploading')) {
            		 var errorMsg = "图片仍在上传，请勿提交!";
            		 $parentEle.append('<span class="tips onError">'+errorMsg+'</span>');
            		 return;
            	 } else if ($liEle.hasClass('error')) {
            		 var errorMsg = "图片上传失败，请重新上传!";
            		 $parentEle.append('<span class="tips onError">'+errorMsg+'</span>');
            		 $fileRemoteUrl.val('');
            		 return;
            	 }
            	 
            	 //进行校验
            	 if (fileRemoteUrl=="") {
            		 var errorMsg = '请输入'+title;
            		 $parentEle.append('<span class="tips onError">'+errorMsg+'</span>');
            	 } else {
            		 $parentEle.append(' ');
            	 }
             });

			//验证验证码
			if ($(this).is('#yazheng')) {
				if (this.value == "") {
					var errorMsg = '请输入验证码';
					$parent.append('<span class="tips onError">' + errorMsg + '</span>');
				} else {
					$parent.append(' ');
				}
			}
			//验证手机
			if ($(this).is('#phone')) {
				if (this.value == "") {
					var errorMsg = '请输入手机号码';
					$parent.append('<span class="tips onError">' + errorMsg + '</span>');
				} else {
					$parent.append(' ');
				}
			}
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
                
             $('#applyInputContent').val(genInputItemJson());
             $('#imgUploadContent').val(genImgItemJson());
			$('#mobile').val($('#phone').val());
			$('#verifyCode').val($('#yazheng').val());
             
             $('#form1').submit();
        });
         
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

//生成报名录入项Json
function genInputItemJson() {
	 var items = '';
	 var count = 0;
	 $('div[nameFlag=inputDataGroup]').each(function() {
   	 var $ele = $(this);
   	 var title = $ele.find('input[nameFlag=title]').val();
   	 var content = $ele.find('input[nameFlag=content]').val();
   	 
   	 var itemJson = {"title": title, "content":content};
		 if (count == 0) {
			items += '[' + JSON.stringify(itemJson) ;
		 } else {
			items += ',' + JSON.stringify(itemJson);
		 }
		count++;
    });
	 if (items != '') {
		items += ']';
	 }
	 return items;
}

//生成图片录入项Json
function genImgItemJson() {
	 var items = '';
	 var count = 0;
	 $('div[nameFlag=imgUploadGroup]').each(function() {
    	 var $ele = $(this);
    	 var title = $ele.find('input[nameFlag=title]').val();
    	 var contentUrl = $ele.find('input[nameFlag=fileRemoteUrl]').val();
    	 
    	 var itemJson = {"title": title, "content":contentUrl};
 		 if (count == 0) {
 			items += '[' + JSON.stringify(itemJson) ;
 		 } else {
 			items += ',' + JSON.stringify(itemJson);
 		 }
 		count++;
     });
	 if (items != '') {
		items += ']';
	 }
	 return items;
}

//判断是否为数字
function IsNum(s)
{
    if (s!=null && s!="")
    {
        return !isNaN(s);
    }
    return false;
}


//]]>
