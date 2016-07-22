/*
* 报名成功
*/
/**
 * 约战按钮点击事件
 */
 function bindYueZhan() {
	//约战按钮
      var $btnYue =$(".tiaozhan .btn-default");
      $btnYue.click(function(){
      if($('#userType').val()=='1'){
    	  var $btnThis = $(this);
    	  if($btnThis.hasClass('loading')) return;
    	  var url=$btnThis.attr('url');
    	    $.ajax({
    	        url:url,
    	        type:'get',
    	        beforeSend:function(){
    	        	$btnThis.addClass('loading');
    	        },
    	        complete:function(){
    	        	$btnThis.removeClass('loading');
    	        },
    	        success:function(data){
    	        	if(data.result=='success'){
    	        		$btnThis.addClass("btn-dis");
    	        		$btnThis.removeClass("btn-default");
    	        		$btnThis.text("已约战");
    	        		$btnThis.unbind('click');//不可点击
    	        		return false;
    	        	}else{
    	        		_alert('<p style="text-align: center">已约战失败<p>');
    	        	}
    	        },
    	        error: function(){
    	        	_alert('<p style="text-align: center">已约战失败<p>');
    	        }
    	     }); 
       }//if结束    
	  else{//提示下载KK语音
    	   openDownloadKK();
       }
      }) ;
  }

  //加入群链接
 function addGroup(ele){
	 	var userType = $('#userType').val();
	 	
	 	if (userType != 1) {
	 		return;
	 	}
	 
		var groupId=$(ele).attr('group_id');
		window.alert("kk://page/goto?target=groupDetail&id="+groupId);
	}
	/**
	 * 下载KK语音弹窗JS
	 */
	function openDownloadKK(){
			$('#win1').show();
		}
		function downloadkk(){
			$('#win1').hide();
			window.location.href = "http://api2.kkyuyin.com/app/downloadApk?from=WD_89";
		}
		function closeWin(){
			$('#win1').hide();
		}

	// 提示弹窗
    function _alert(msg) {
    	var $alertWin = $('#alert-win');
        $alertWin.show().find('.con').html(msg);
      }
    
  $(function(){  
	  // 关闭弹窗
	  $('[data-action="close"]').bind('click', function() {
	    $(this).parents('.mask-pop').hide();
	  });
      showGuild();//预加载展示战队
	  bindYueZhan(); //约战按钮
    //发起按钮
      var $btnFaQi =$(".tz-con .btn-tj");
      $btnFaQi.click(function(){
      if($('#userType').val()=='1'){
    	  if($btnFaQi.hasClass('loading')) return;
    	  var url=$('#updateChallenge').val();
    	    $.ajax({
    	        url:url,
    	        type:'get',
    	        beforeSend:function(){
    	        //	$btnFaQi.addClass('loading');
    	        },
    	        complete:function(){
    	        //	$btnFaQi.removeClass('loading');
    	        },
    	        success:function(data){
    	        	if(data.result=='success'){
    	        		 $btnFaQi.addClass("btn-tj-dis").removeClass("btn-tj").text("我已发起挑战");
    	        		 $btnFaQi.unbind('click');//不可点击
    	        		 return false;
    	        	}else{
    	        		_alert('<p style="text-align: center">发起挑战失败<p>');
    	        	}
    	        },
    	        error: function(){
    	        	_alert('<p style="text-align: center">发起挑战失败<p>');
    	        }
    	     });
      } else if ($('#userType').val()=='3'){
    	  return false;
      } else{//提示下载KK语音
          openDownloadKK();
      } 
    });
      
      
    //换一批按钮
      var $btnHuan =$(".tiaozhan .change"); 
      $btnHuan.click(function(){
    	  if($btnHuan.hasClass('loading')) return;
    	  var url=$btnHuan.attr('url');
    	    $.ajax({
    	        url:url,
    	        type:'get',
    	        beforeSend:function(){
    	        	//$btnHuan.addClass('loading');
    	        },
    	        complete:function(){
    	        	//$btnHuan.removeClass('loading');
    	        },
    	        success:function(data){
    	          if(data.flag){//判断换一批按钮是否需要删除
      	       	      $btnHuan.attr('url','/m/match/getChallengeSquad?matchInfoId='+$('#matchInfoId').val()+'&userId='+$('#userId').val()+'&pageNO='+data.pageNO+'&pageSize='+data.pageSize);
      	       	  }else{
      	       		  $btnHuan.remove();
      	       	  }
    	          $(".tz-team-list li").remove();//删除页面上的li元素
    	       	  var content='<li>';
    	       	  var squadList=data.MatchSquadDTOList;
    	       	  var str1='<div class="item-team"><div class="pic show_guild" url="/m/match/guildShow?userId=';
    	       	  var str2='"><img src="';
    	          var str3='" width="54" height="54"></div><div class="name">';
    	          var str4='</div><div class="btn-default" url="/m/match/updateFightedTimeAndCount?matchInfoId=';
    	          var str5='&squadId=';
    	          var str6='&otherUserId=';
    	          var str7='&userId=';
    	          var str8='">约战</div></div>';
    	       	  for(var i=0 ;i<squadList.length; i++){
    	       		 var element=JSON.stringify(squadList[i]);
    	       		 var ele=$.parseJSON(element);
    	       		 content=content+str1+ele.user_id;//加入战队头像可点击链接
    	       		 if(typeof(ele.squad_logo_url)=="undefined"){
    	       			content=content+str2+'/public/images/mobile/match/no-guild.png';//默认战队头像
    	       		 }else{
    	       		    content=content+str2+ele.squad_logo_url;//战队头像
    	       		 }
    	       		 content=content+str3+ele.squad_name;//战队名称
    	       		 content=content+str4+$('#matchInfoId').val();//赛事ID
    	       		 content=content+str5+ele.id;//战队ID
    	       		 content=content+str6+ele.user_id;//被约战的战队userID
    	       		 content=content+str7+$('#userId').val();//用户userID
    	       		 content=content+str8;
    	       	  }
    	       	  content=content+'</li>'
    	          $("#tzAjax").html(content);//异步加载的html内容
    	       	  showGuild();//重新注册展示战队事件
    	       	  bindYueZhan();//重新注册约战按钮点击事件
    	          return false;
    	        },
    	        error: function(){
    	        	_alert('<p style="text-align: center">换一批战队失败<p>');
    	        }
    	     });
    }); 
  });

