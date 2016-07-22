/*
* 对战信息
*/

$(function() {

  JSBridge.isAndroid = navigator.userAgent && (navigator.userAgent.indexOf("NineGameClient/android") > -1 || navigator.userAgent.indexOf("com.tongmo.kk") > -1);
  
  JSBridge.isIos = navigator.userAgent && (navigator.userAgent.indexOf("NineGameClient/ios") > -1 || navigator.userAgent.indexOf("com.tongmo.kkios") > -1);

  // 图片显示个数
  var maxImgCount = $('#maxImgCount').val();

  // 图片大小
  var maxImgSize = 5 * 1024 * 1024;

  // canvas
  var canvas = document.createElement("canvas");
  var canvasCtx = canvas.getContext('2d');

  // 后端接口
  var api = {
    upload: $('#api-upload').val(),
    uploadBase64: $('#api-upload-base64').val(),
    submit: $('#api-submit').val(),
    imgType: $('#imgType').val()
  }

  // 提示语
  var errorTips = {
    required: '<p style="text-align: center;">没有选择图片<p>',

    // 图片必选
    imgRequired: '<p style="text-align: center;">请至少上传一张图片<p>',

    // 图片超过设定大小
    imgLimit: '很抱歉，你上传的图片大于5M，请压缩后上传。',

    // 图片上传失败
    imgUploadError: '<p style="text-align: center;">图片上传失败<p>',

    // 提交成功
    postSucc: '提交成功',

    // 提交失败
    postErr: '提交失败'
  };

  var app = {

    init: function() {
      // 初始化数据
      this.imgCount = 0;

      // 缓存 dom
      this.cacheDom();

      // 绑定事件
      this.bindEvent();
    },

    cacheDom: function() {

      this.$alertWin = $('#alert-win');

      // 上传图片相关\
      this.$fileInput = $('#file-input');
      this.$fileBtn = $('#file-btn');
      this.$imgList = $('#img-list');

      this.$form = $('#form');
      this.$submitBtn = $('#submit-btn');

    },

    bindEvent: function() {
      var that = this;

      // 选择图片
      if (JSBridge.isIos) {
    	 this.$fileInput.on('change', function(e) {
              that.onChooseImg(e);
         });
      } else if(JSBridge.isAndroid) {
        this.$fileInput.hide();
        this.$fileBtn.show();
        this.$fileBtn.on('click', function() {
           that.onChooseImgClient();
        });
      } else {
        this.$fileInput.on('change', function(e) {
          that.onChooseImg(e);
        });
      }

      // 删除图片
      this.$imgList.on('click', '.close', function() {
    	if (api.imgType == 1) {
    		$(this).closest('div').remove();
    		
    		that.imgCount = that.$imgList.find('img').length;
    		if (that.imgCount < maxImgCount) {
    			$('#uploadDiv').show();
    		}
    	} else if (api.imgType == 2) {
    		$(this).closest('li').remove();
    		
    		that.imgCount = that.$imgList.find('img').length;
    		if (that.imgCount < maxImgCount) {
    			$('#uploadLi').show();
    		}
    	}
      });

      // 关闭弹窗
      this.$alertWin.on('click', '[data-action="close"]', function() {
        that.$alertWin.hide().find('.con').html('');
      });

      // 提交
      that.$submitBtn.on('click', function(e){
    	  e.preventDefault();
          if(that.$submitBtn.hasClass('loading')) return;
          that.onSubmit();
      });
    },

    // 选择图片
    onChooseImg: function(e) {
      var that = this,
          target = e.target,
          defds = [],
          files = [];
          fileCount = target.files.length;

      that.imgCount = that.$imgList.find('img').length;
      // 如果文件是空的，不处理
      if(fileCount <= 0) return;
      
      if (that.imgCount >= maxImgCount) {
    	  that.alert('超越图片上传张数!');
    	  return;
      }

      var remainCount = maxImgCount - that.imgCount;
      for(var i = 0; i < remainCount; i++) {
        if(target.files[i]) files.push(target.files[i]);
      }

      that.setLoading(true);
      var i = 0;
      $.each(files, function(index, file) {
        var reader = new FileReader(),
            ext = file.name.substr(file.name.lastIndexOf('.') + 1);

        if(!/^(png|gif|jpg|jpeg)$/.test(ext.toLowerCase())) {
          that.setLoading(false);
          that.alert('请上传png,gif,jpg,jpeg格式的图片');
          return false;
        }

        reader.onloadend = function() {
          defds.push(that.addImgToList(reader.result));
          i++;
          if(i === files.length) {
            $.when.apply($, defds).always(function() {
              that.setLoading(false);
            });
          }
        };

        reader.readAsDataURL(file);
      });
    },

    // 客户端选取图片
    onChooseImgClient: function() {
      var that = this;

      if(that.$fileBtn.hasClass('loading')) return;

      that.imgCount = that.$imgList.find('img').length;
      var remainCount = maxImgCount - that.imgCount;

      // 如果已经超过最大个数，不处理
      if(remainCount <= 0) {
    	  that.alert('超越图片上传张数!');
    	  return;
      } 

      that.setLoading(true);
      JSBridge.callNative("NineGameClient", "chooseImage", {"maxSize": remainCount}, function(json) {
    	  var defds = [],
          data = json.data || [];

        if(data.length <= 0) {
          that.setLoading(false);
          return;
        }

        data.forEach(function(src, index) {
          defds.push(that.addImgToList(src));
          if(index == data.length - 1) {
            $.when.apply($, defds).always(function() {
              that.setLoading(false);
            });
          }
        });

      });
    },

    // 上传一张图片
    uploadImg: function(img, defd) {
      var that = this;

      that.imgToBlob(img, function(blob) {
        if(blob.size > maxImgSize) {
          that.alert(errorTips.imgLimit);
          defd.reject();
          return;
        }

        var fd = new FormData();
        fd.append($('#upload-name').val(), blob, new Date().getTime() + '.jpg');

        xhr = $.ajax({
          url: api.upload,
          data: fd,
          type: 'POST',
          processData: false,
          contentType: false,
          success: function(res) {
            if(res.success) {
              defd.resolve(res.data);
            } else {
              that.uploadImgToBase64(img, defd);
            }
          }, 
          error: function() {
            defd.reject();
          },
          beforeSend: function() {
        	  that.$submitBtn.text('图片上传中，请稍后').addClass('loading');
          }
        });
      });
    },
    
    //为了兼容ANDROID 4.3版本及以下的WEBView上传，在图片上传失败后通过BASE64方式重传一次。
    uploadImgToBase64: function(img, defd) {
    	  var that = this;
	      that.imgToBase64(img, function(base64Data) {
	    	  if(base64Data.length > maxImgSize) {
	    		  that.alert(errorTips.imgLimit);
	    		  defd.reject();
	    		  return;
	    	  }  
	    	  $.ajax({
	    		  type: "post",
	    		  url: api.uploadBase64,
	    		  data: {
	    			  base64: base64Data,
	    			  fileName: new Date().getTime()
	    		  },
	    		  cache:false,
	    		  success: function(res) {
	    			  if(res.success) {
	    				  defd.resolve(res.data);	  
	    			  } else {
	    				  $('#errorTips').text("如果上传机型的android版本小于4.3,请联系客服处理!");	
	    				  defd.reject();
	    			  }
	    		  }, 
	    		  error: function(XMLHttpRequest, textStatus, errorThrown) {
	    			  $('#errorTips').text("上传失败！textStatus=" + textStatus + "errorThrown" + errorThrown);
	    			  defd.reject();
	    			 
	    		  },
	    		  beforeSend: function() {
	            	  that.$submitBtn.text('图片上传中，请稍后').addClass('loading');
	              }
	    	  });
	    	});  
	},

    // 添加图片到列表
    addImgToList: function(src) {
       var that = this;
       if (api.imgType == 1) {
      	  return that.playProcess(src);
       } else if (api.imgType == 2) {
    	  return that.absentProcess(src);
      } 
    },
    
    absentProcess : function(src) {
    	var that = this,
        img = new Image(),
        $li = $('<li>'),
        $div = $('<div>'),
        $loadingTips = $('<div>'),
        $img=$('<img>'),
        defd = $.Deferred();

    	defd.done(function(data) {
    		var imgUrl = data.url;
    		$li.data('url', imgUrl);
    		that.imgCount = that.$imgList.find('img').length;
    		if (that.imgCount >= maxImgCount) {
    			$('#uploadLi').hide();
    		}
    	}).fail(function() {
    		that.alert(errorTips.imgUploadError);
    		$loadingTips.append('<p class="p">上传失败</p>');
    		that.imgCount = that.$imgList.find('img').length;
    		if (that.imgCount >= maxImgCount) {
    			$('#uploadLi').hide();
    		}
    	}).always(function() {
    		$loadingTips.find('span').remove();	
    		$div.append('<span class="close"><span>');  
          	that.$submitBtn.text('提交').removeClass('loading');
    	});

    	img.onload = function() {
    		that.uploadImg(img, defd);
    	}

    	$loadingTips.addClass('loding-tips');
    	$loadingTips.append('<span class="loading"></span>');
    	
    	img.src = src;
    	$div.addClass('img');
    	$img.addClass('ig').attr('src', src );
    	$div.append($img);
    	$div.append($loadingTips);
    	$li.append($div);
    	that.$imgList.prepend($li);
    	return defd;
    },
    
    playProcess : function(src) {
    	var that = this,
        img = new Image(),
        $div = $('<div>'),
        $img=$('<img>'),
        $loadingTips = $('<div>'),
        defd = $.Deferred();

    	defd.done(function(data) {
    		var imgUrl = data.url;
    		$div.data('url', imgUrl);
    		
    		that.imgCount = that.$imgList.find('img').length;
    		if (that.imgCount >= maxImgCount) {
    			$('#uploadDiv').hide();
    		}
    		
    	}).fail(function() {
    		that.alert(errorTips.imgUploadError);
    		$loadingTips.append('<p class="p">上传失败</p>');
    	}).always(function() {
    		$loadingTips.find('span').remove();	
    		$div.append('<span class="close"><span>');
    		that.$submitBtn.text('提交').removeClass('loading');
    	});

    	img.onload = function() {
    		that.uploadImg(img, defd);
    	}
    	
    	$loadingTips.addClass('loding-tips');
    	$loadingTips.append('<span class="loading"></span>');
    	
    	$div.addClass('demo-pic');
    	$div.addClass('img');
    	img.src = src;
    	$img.addClass('ig').attr('src', src );
    	$div.append($img);
    	$div.append($loadingTips);
    	that.$imgList.prepend($div);
    	return defd;
    },

    // 提交
    onSubmit: function() {
      var that = this,
          extraData = that.$form.serializeArray(),
          imgList = [];

      // 上传图片
      var hasError = false;
      var srcEle = "";
      if (api.imgType == 1) {
    	  srcEle = ".demo-pic";
      } else if (api.imgType == 2) {
    	  srcEle = "li";
      }
      
      that.$imgList.find(srcEle).each(function() {
        var $img = $(this),
            url = $img.data('url');
        url && imgList.push(url);
        
        if(that.$fileBtn.hasClass('loading')) {
        	var errorMsg = "图片仍在上传，请勿提交!";
   		 	that.alert('<p style="text-align: center">'+ errorMsg +'</p>');
   		 	hasError = true;
   		 	return false;
        } else if ($(this).hasClass('p')) {
        	var errorMsg = "图片上传失败，请重新上传!";
   	 		that.alert('<p style="text-align: center">'+ errorMsg +'</p>');
   	 		hasError = true;
   	 		return false;
        }
      });
      
      if (hasError) {
    	  return false;
      }

      if(imgList.length <= 0) {
        that.alert(errorTips.required);
        return false;
      }

      var postData = {};
      extraData.forEach(function(param) {
        postData[param.name] = param.value;
      });

      postData.imgList = imgList;

      $.ajax({
        url: api.submit,
        type: 'POST',
        data: {
          squadId : postData.squadId,	
          schedulePlayId: postData.schedulePlayId,
          imgList: JSON.stringify(postData.imgList),
          imgType: api.imgType
        },
        beforeSend: function() {
          that.$submitBtn.text('正在提交...').addClass('loading');
        },
        complete: function() {
          that.$submitBtn.text('提交').removeClass('loading');

        },
        success: function(data) {
          var resultJson = eval("(" + data +")")	
        	
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

    // 上传图片按钮状态改变
    setLoading: function(flag) {
      var that = this;

      if(!flag) {
        that.$fileBtn.removeClass('loading').find('span').text('上传比赛截图')
      } else {
        that.$fileBtn.addClass('loading').find('span').text('读取中...');
      }
    },

    // 提示
    alert: function(msg) {
      this.$alertWin.show().find('.con').html(msg);
    },

    // img to blob
    imgToBlob: function(imgNode, cb) {
      var that = this;
      var imgSrc = imgNode.src;
      // 清除之前画的
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      canvas.width = imgNode.width;
      canvas.height = imgNode.height;
      canvasCtx.drawImage(imgNode, 0, 0);
      canvas.toBlob(function(blob) {
        cb(blob);
      }, 'image/jpeg', 0.8);
    },
    
    // img to blob
    imgToBase64: function(imgNode, cb) {
      var that = this;
      var imgSrc = imgNode.src;
      
      // 清除之前画的
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = imgNode.width;
      canvas.height = imgNode.height;
      
      canvasCtx.drawImage(imgNode, 0, 0);
      cb(canvas.toDataURL('image/jpeg', 0.8));
    }

  };

  app.init();

});

