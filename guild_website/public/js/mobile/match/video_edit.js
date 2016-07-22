/*
* 对战信息
*/

$(function() {
	
  // 视频限制个数
  var maxVideoCount = 5;
  
  // 后端接口
  var api = {
    submit: $('#api-submit').val()
  }

  // 提示语
  var errorTips = {
    required: '<p style="text-align: center;">视频不能为空<p>',

    // 视频必选
    videoRequired: '<p style="text-align: center;">请至少输入一个视频地址<p>',

    // 视频url格式不正确
    videoValid: '很抱歉，你输入的网站有误，请重新输入',

    // 提交成功
    postSucc: '提交成功',

    // 提交失败
    postErr: '提交失败'
  };

  // 验证视频网址正则
  var videReg = /^http:\/\/\S*(tudou|youku|v\.qq)/;

  var app = {

    init: function() {
      // 缓存 dom
      this.cacheDom();

      // 绑定事件
      this.bindEvent();
    },

    cacheDom: function() {

      this.$alertWin = $('#alert-win');

      // 视频相关
      this.$addVideo = $('#add-video');
      this.$divAddVideo = $('#div-add-video');
      this.$videoCon = $('.t');
      this.$delVideoIds = $('#delVideoIds');
      

      this.$form = $('#form');
      this.$submitBtn = $('#submit-btn');

    },

    bindEvent: function() {
      var that = this;

      // 继续添加视频
      that.$addVideo.on('touchend, click', function() {
    	that.$divAddVideo.before('<div class="text-con" name="addVideos"><div class="text"><input class="t" type="text" value=""/><span class="close"></span></div></div>');
    	
    	var videoCount = $('.text').size();
    	if(videoCount >= maxVideoCount) {
            that.$addVideo.hide();
        }
        
        // 视频输入框无焦点时验证视频网址
        that.$videoCon.on('blur', '.input', function() {
          var url = $(this).val();

          if(url && !videReg.test(url)) {
            that.alert(errorTips.videoValid);
          }
        });
        
        //删除新增的视频
        $('[name=addVideos]').find('.close').on('touchend, click', function() {
        	$(this).closest('div [name=addVideos]').remove(); 
        	var videoCount = $('.text').size();
       	 	if(videoCount < maxVideoCount) {
                that.$addVideo.show();
            }
        });
        
      });

      // 视频输入框无焦点时验证视频网址
      that.$videoCon.on('blur', '.input', function() {
        var url = $(this).val();

        if(url && !videReg.test(url)) {
          that.alert(errorTips.videoValid);
        }
      });
      
      //删除已存在视频
      $('[name=existVideos]').find('.close').on('touchend, click', function() {
    	 var currentId = $(this).attr('data');
    	 var currentDelIds = that.$delVideoIds.val();
    	 if (currentDelIds) {
    		 currentDelIds = currentDelIds + "," + currentId;
    	 } else {
    		 currentDelIds = currentId;
    	 }
    	 $(this).closest('div [name=existVideos]').remove(); 
    	 var videoCount = $('.text').size();
    	 if(videoCount < maxVideoCount) {
             that.$addVideo.show();
         }
    	 
    	 that.$delVideoIds.val(currentDelIds);
      });
      
      //删除新增的视频
      $('[name=addVideos]').find('.close').on('touchend, click', function() {
    	 $(this).closest('div [name=addVideos]').remove(); 
    	 var videoCount = $('.text').size();
    	 if(videoCount < maxVideoCount) {
             that.$addVideo.show();
         }
      });

      // 关闭弹窗
      that.$alertWin.on('click', '[data-action="close"]', function() {
        that.$alertWin.hide().find('.con').html('');
      });

      // 提交
      that.$submitBtn.on('click', function(e){
    	  e.preventDefault();
          if(that.$submitBtn.hasClass('loading')) return;
          that.onSubmit();
      });
      
      /** that.$form.on('submit', function(e) {
        e.preventDefault();
        if(that.$submitBtn.hasClass('loading')) return;
        that.onSubmit();
      }); */

    },

    // 提交
    onSubmit: function() {
      var that = this,
          extraData = that.$form.serializeArray(),
          videoList = [],
          delVideoIds = that.$delVideoIds.val();

      // 验证表单
      if(!that.validForm()) return;

      // 视频地址
      var condCount = 0;
      var items = '';  
      
      $('[name=existVideos]').find('input').each(function() {
    	  if (!$(this).val()) {
    		  return;
    	  }
    	  var item = {"video_id": $(this).attr('videoId'), "video_url":$(this).val()};
    	  if (condCount == 0) {
    		  items += '[' + JSON.stringify(item) ;		
    	  } else {
    		  items += ',' + JSON.stringify(item);
    	  }
    	  condCount++;
      });
      
      $('[name=addVideos]').find('input').each(function() {
    	  if (!$(this).val()) {
    		  return;
    	  }
      	  var item = {"video_url":$(this).val()};
  		  if (condCount == 0) {
  			  items += '[' + JSON.stringify(item) ;		
  		  } else {
  			  items += ',' + JSON.stringify(item);
  		  }
  		  condCount++;
      });
      
	  if (items != '') {
		 items += ']';
	  }
      
	  //没有视频记录
      if(condCount <= 0 && !delVideoIds) {
        that.alert(errorTips.required);
        return false;
      }

      var postData = {};
      extraData.forEach(function(param) {
        postData[param.name] = param.value;
      });

      postData.videoList = (items == "" ? "[]" : items);
      
      $.ajax({
        url: api.submit,
        type: 'POST',
        data: {
          squadId : postData.squadId,	
          schedulePlayId: postData.schedulePlayId,
          videoList : postData.videoList,
          delVideoIds : delVideoIds
        },
        beforeSend: function() {
          that.$submitBtn.text('正在提交...').addClass('loading');
        },
        complete: function() {
          that.$submitBtn.text('提交').removeClass('loading');

        },
        success: function(data) {
          var resultJson = eval("(" + data +")");	
          if(resultJson.success) {
        	if (resultJson.data && resultJson.data.error_code != 0) {
                  that.alert(resultJson.data.error_msg);
          	}  else {
          		that.alert('<p style="text-align: center">'+ errorTips.postSucc +'</p>');
                  that.$alertWin.on('click', '[data-action="close"]', function() {
                  	window.location.reload();
                  });
          	}  
          } else {
            that.alert('<p style="text-align: center">'+ resultJson.error +'</p>');
          }
        },
        error: function() {
          that.alert('<p style="text-align: center">'+ errorTips.postErr +'</p>');
        }
      });
    },

    // 验证表单
    validForm: function()  {
      var validUrl = true;

      // 验证视频
      $('[name=existVideos]').find('input').each(function() {
        var val = $(this).val().trim();
        if(val && !videReg.test(val)) {
          validUrl = false;
          return false;
        }
      });
      
      $('[name=addVideos]').find('input').each(function() {
          var val = $(this).val().trim();
          if(val && !videReg.test(val)) {
            validUrl = false;
            return false;
          }
      });

      if(!validUrl) {
        this.alert(errorTips.videoValid);
        return false;
      }

      return true;
    },
    
    // 提示
    alert: function(msg) {
      this.$alertWin.show().find('.con').html(msg);
    }
  };

  app.init();

});

