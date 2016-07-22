/*
* 对战信息
*/

$(function() {

  JSBridge.isAndroid = navigator.userAgent && (navigator.userAgent.indexOf("NineGameClient/android") > -1 || navigator.userAgent.indexOf("com.tongmo.kk") > -1);	

  // 视频限制个数
  var maxVideoCount = 5;

  // 图片显示个数
  var maxImgCount = 6;

  // 图片大小
  var maxImgSize = 5 * 1024 * 1024;
  // var maxImgSize = 5;


  // canvas
  var canvas = document.createElement("canvas");
  var canvasCtx = canvas.getContext('2d');

  // 后端接口
  var api = {
    upload: $('#api-upload').val(),
    submit: $('#api-submit').val()
  }

  // 提示语
  var errorTips = {
    required: '<p style="text-align: center;">图片或视频不能为空<p>',

    // 图片必选
    imgRequired: '<p style="text-align: center;">请至少上传一张图片<p>',

    // 图片超过设定大小
    imgLimit: '很抱歉，你上传的图片大于5M，请压缩后上传。',

    // 图片上传失败
    imgUploadError: '<p style="text-align: center;">图片上传失败<p>',

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
      // 初始化数据
      this.videoCount = 1;
      this.imgCount = 0;

      // 缓存 dom
      this.cacheDom();

      // 绑定事件
      this.bindEvent();
    },

    cacheDom: function() {

      this.$alertWin = $('#alert-win');

      // 视频相关
      this.$addVideo = $('#add-video');
      this.$videoCon = $('#video-con');

      // 上传图片相关
      this.$fileInput = $('#file-input');
      this.$fileBtn = $('#file-btn');
      this.$imgList = $('#img-list');

      this.$form = $('#form');
      this.$submitBtn = $('#submit-btn');

    },

    bindEvent: function() {
      var that = this;

      // 继续添加视频
      this.$addVideo.on('touchend, click', function() {
        that.$videoCon.append('<div class="form-group"><input type="text" class="input" placeholder="请输入视频地址"></div>');

        that.videoCount++;
        if(that.videoCount >= maxVideoCount) {
          that.$addVideo.hide();
        }
      });

      // 选择图片
      if(JSBridge.isAndroid) {
        this.$fileInput.hide();
        this.$fileBtn.on('click', function() {
           that.onChooseImgClient();
        });
      } else {
        this.$fileInput.on('change', function(e) {
          that.onChooseImg(e);
        });
      }

      // 删除图片
      this.$imgList.on('click', 'li', function() {
        $(this).remove();
      });

      // 视频输入框无焦点时验证视频网址
      this.$videoCon.on('blur', '.input', function() {
        var url = $(this).val();

        if(url && !videReg.test(url)) {
          that.alert(errorTips.videoValid);
        }
      });

      // 关闭弹窗
      this.$alertWin.on('click', '[data-action="close"]', function() {
        that.$alertWin.hide().find('.con').html('');
      });

      // 提交
      this.$form.on('submit', function(e) {
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
      if(fileCount <= 0 || that.imgCount >= maxImgCount) return;

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
      if(remainCount <= 0) return;

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
              defd.reject();
            }
            
          }, 
          error: function() {
            defd.reject();
          }
        });

      });
    },

    // 添加图片到列表
    addImgToList: function(src) {
      var that = this,
          img = new Image(),
          $li = $('<li>'),
          $div = $('<div>'),
          defd = $.Deferred();


      defd.done(function(data) {
        var imgUrl = data.url;
        $li.data('url', imgUrl);
      }).fail(function() {
        that.alert(errorTips.imgUploadError);
        $li.addClass('error');
      }).always(function() {
        $li.removeClass('uploading').append('<span>删除<span>');
      });

      img.onload = function() {
        that.uploadImg(img, defd);
      }

      img.src = src;
      $div.addClass('img').css('background-image', 'url("'+ src + '")');
      $li.append($div).addClass('uploading');
      that.$imgList.append($li);

      return defd;
    },

    // 提交
    onSubmit: function() {
      var that = this,
          extraData = that.$form.serializeArray(),
          videoList = [],
          imgList = [];

      // 验证表单
      if(!that.validForm()) return;

      // 视频地址
      that.$videoCon.find('.input').each(function() {
        var val = $(this).val().trim();
        if(val) videoList.push(val);
      });
      //当视频上传的个数大于0时表示玩家有上传视频，触发日志记录按钮
      var videoSize=videoList.length;
      // 上传图片
      var hasError = false;
      that.$imgList.find('li').each(function() {
        var $img = $(this),
            url = $img.data('url');
        url && imgList.push(url);
        if ($(this).hasClass('uploading')) {
        	var errorMsg = "图片仍在上传，请勿提交!";
   		 	that.alert('<p style="text-align: center">'+ errorMsg +'</p>');
   		 	hasError = true;
   		 	return false;
   	 	} else if ($(this).hasClass('error')) {
   	 		var errorMsg = "图片上传失败，请重新上传!";
   	 		that.alert('<p style="text-align: center">'+ errorMsg +'</p>');
   	 		hasError = true;
   	 		return false;
   	 	}
      });
      
      if (hasError) {
    	  return false;
      }

      if(imgList.length <= 0 && videoList.length <= 0) {
        that.alert(errorTips.required);
        return false;
      }

      var postData = {};
      extraData.forEach(function(param) {
        postData[param.name] = param.value;
      });

      postData.videoList = videoList;
      postData.imgList = imgList;


      $.ajax({
        url: api.submit,
        type: 'POST',
        data: {
//          json: JSON.stringify(postData)
          squadId : postData.squadId,	
          schedulePlayId: postData.schedulePlayId,
          imgList: JSON.stringify(postData.imgList),
          videoList : JSON.stringify(postData.videoList)
        },
        beforeSend: function() {
          that.$submitBtn.val('正在提交...').addClass('loading');
        },
        complete: function() {
          that.$submitBtn.val('提交').removeClass('loading');

        },
        success: function(data) {
          var resultJson = eval("(" + data +")")	
        	
          if(resultJson.success) {
            that.alert('<p style="text-align: center">'+ errorTips.postSucc +'</p>');
            that.$alertWin.on('click', '[data-action="close"]', function() {
            	window.location.reload();
            });
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
      this.$videoCon.find('.input').each(function() {
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
    }

  };

  app.init();

});

