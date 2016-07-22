  
   $(function(){
 

 
                $('.btn-sub').click(function(){
                	if( $('input[name="company"]').val()==''){
                		 $(".form-tips").text('请输入公司名称');
                		 $('input[name="company"]').addClass('input-hover');
                	}
                	else{
                       // $('form').submit();
                       $('.pop-apply').hide();
                       $('.pop-apply-succ').show(); 
}
                });
                 
            });
