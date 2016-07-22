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
                    	if(this.value.length>15){
                    		var errorMsg = '战队简称必须小于15个字';
                        	$parent.append('<span class="tips onError">'+errorMsg+'</span>');	
                    	}
                        else{
                        	$parent.append(' ');
                        }
                    }
             }
             
             //动态录入项
             $('div[name=inputDataGroup]').each(function() {
            	 var $ele = $(this);
            	 var $titleEle = $ele.find('input[name=title]');
            	 var $contentEle = $ele.find('input[name=content]');
            	 var title = $titleEle.val();
            	 var inputVal = $contentEle.val();
            	 var maxLengthVal = $contentEle.attr('maxlength');
            	 var hasRequiredClazz = $contentEle.hasClass('required');
            	 //进行校验
            	 if (hasRequiredClazz && inputVal=="") {
            		 var errorMsg = '请输入'+title;
            		 $ele.append('<span class="tips onError">'+errorMsg+'</span>');
            	 } else { 
            		 if (maxLengthVal && inputVal.length > maxLengthVal){
            			 var errorMsg = title + '必须小于' + maxLengthVal + '位';
            			 $ele.append('<span class="tips onError">'+errorMsg+'</span>');	
            		 } else{
            			 $ele.append(' ');
            		 }
            	 }
             });
             
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
                
              $('#applyInputContent').val(genInputItemJson());
//              $('#imgUploadContent').val(genInputItemJson());
                
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
	 $('div[name=inputDataGroup]').each(function() {
    	 var $ele = $(this);
    	 var title = $ele.find('input[name=title]').val();
    	 var content = $ele.find('input[name=content]').val();
    	 
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


//]]>
