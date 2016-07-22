$(document).ready(function(){
	
	var upload = document.getElementsByClassName('file-img');
	if(upload){
		for(var i=0;i<upload.length;i++){
			upFileFn(upload[i]);
		}
	}
	/*
	$(".mod-popup-bg").click(function(){
		$('body').removeClass('mod-overflow');
		$('html').removeClass('mod-overflow');
		$('.mod-popup').hide();
		$('.mod-popup2').hide();
	});
	*/
	$('#form_sub').click(function(){
		var form=$('#form_form');
		var check = true;
		/*
		$(".formValue").each(function(){
			var This=$(this);
			if($.trim(This.val()).length<1){
				
				This.addClass('warn').focus();
				check = false;
			} else {
				check = true;
				This.removeClass('warn');
			}
		});
		
		if(!check) {
			tip_word("请填写服区/排名");
			return;
		}
		
		var img=form.find('.img-li').find('.img');
		img.each(function(){
			if(!$(this).hasClass('current')){
				check= false;
			}
		});
		
		if(!check) {
			tip_word("请上传相关截图");
			return;
		}
		
		
		var gulid = $("#guildId").val();
		if(gulid == "") {
			tip_word("请先加入已有公会或创建公会");
			return;
		}
		*/
		form.submit();
	});
	
/*
	function tip_word(word){
		$(".toast-wrap").html(word);
		$(".toast").removeClass("hide");
		setTimeout(function(){
			$(".toast").addClass("hide");
		},2000);
	}
	*/
	function upFileFn(fileName){
		var fileReader;
		
	    fileName.onchange = function (e){
			e.preventDefault();
			var files = e.target.files;
			
	        for(var i = 0, f; f = files[i]; i++){
	        	var fileReader = new FileReader();
	            // onload		            
            	fileReader.onload = (function(theFile) {
					return function(e) {
					
						var img=$(fileName).parent().addClass('current').find('img').eq(0);
						
						img.attr('src',event.target.result);
						img.attr("data-name",theFile.name);
						var width=img.width(),height=img.height();
						if(width>height){
							img.css({"width":"100%"});
							var top=(44-img.height())/2;
							img.css({'top':top+'px'});
							
						}else{
							img.css({"height":"100%"});
							var left=(44-img.width())/2;
							img.css({'left':left+'px'});
						}
						
					};
				})(f);
	          	fileReader.readAsDataURL(f);
	        }
			// loadError
			fileReader.onerror = function(){
				alert("不好意思.网络失败")
			}
	    };
    }
	/*
	$(".mod-popup2 .close").click(function(){
		$('body').removeClass('mod-overflow');
		$('html').removeClass('mod-overflow');
		$('.mod-popup').hide();
		$('.mod-popup2').hide();
	});
	*/
	
	
});