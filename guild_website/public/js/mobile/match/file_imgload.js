/*
* 对战信息
*/

$(function() {

  // canvas toBlob
  //(function patchCanvas(){
	/** if(!HTMLCanvasElement.prototype.toBlob){
      HTMLCanvasElement.prototype.toBlob = function(callback, type, encoderOptions){
        var dataurl = this.toDataURL(type, encoderOptions);
        var bstr = atob(dataurl.split(',')[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        
        var blob = '';
        try {
        	blob = new Blob([u8arr], {type: type});
        } catch (e) {
            window.BlobBuilder = window.BlobBuilder || 
                                 window.WebKitBlobBuilder || 
                                 window.MozBlobBuilder || 
                                 window.MSBlobBuilder;
        	
            var bb = new BlobBuilder();
            bb.append([u8arr.buffer]);
            blob = bb.getBlob(type);
        }
        callback.call(this, blob);
      };
    } */
  //})();
  
  JSBridge.isAndroid = navigator.userAgent && (navigator.userAgent.indexOf("NineGameClient/android") > -1 || navigator.userAgent.indexOf("com.tongmo.kk") > -1 || navigator.userAgent.indexOf("NineGameClient/ios") > -1);	

  // 图片显示个数
  var maxImgCount = 1;

  // 图片大小
  var maxImgSize = 3 * 1024 * 1024;
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
    // 图片必选
    imgRequired: '<p style="text-align: center;">请至少上传一张图片<p>',

    // 图片超过设定大小
    imgLimit: '很抱歉，你上传的图片大于3M，请压缩后上传。',

    // 图片上传失败
    imgUploadError: '<p style="text-align: center;">图片上传失败<p>',

    // 提交成功
    postSucc: '提交成功',

    // 提交失败
    postErr: '提交失败'
  };

  $('div[nameFlag=imgUploadGroup]').each(function() {
		var $ele = $(this);
		var $fileBtnEle = $ele.find('div[nameFlag=fileBtn]');
		var $fileInputEle = $ele.find('input[nameFlag=fileInput]');
		var $imgUrlEle = $ele.find('ul[nameFlag=imgList]');
		var $fileRemoteUrlEle = $ele.find('input[nameFlag=fileRemoteUrl]');
		
		var app = {
			    init: function($fileInputEle, $fileBtnEle, $fileRemoteUrlEle, $imgListEle) {
			      this.imgCount = 0;

			      // 缓存 dom
			      this.cacheDom($fileInputEle, $fileBtnEle, $fileRemoteUrlEle, $imgListEle);

			      // 绑定事件
			      this.bindEvent();
			    },

			    cacheDom: function($fileInputEle, $fileBtnEle, $fileRemoteUrlEle, $imgListEle) {
			      this.$alertWin = $('#alert-win');	
			    	
			      // 上传图片相关
			      this.$fileInput = $fileInputEle;
			      this.$fileBtn = $fileBtnEle;
			      this.$fileRemoteUrl = $fileRemoteUrlEle;
			      this.$imgList =  $imgListEle;

			    },

			    bindEvent: function() {
			      var that = this;

			      // 选择图片
			      if(JSBridge.isAndroid) {
			        this.$fileInput.hide();
			        this.$fileBtn.bind('click', function() {
			          that.onChooseImgClient();
			        });
			      } else {
			        this.$fileInput.bind('change', function(e) {
			          that.onChooseImg(e);
			        });
			      }

			      // 关闭弹窗
			      this.$alertWin.on('click', '[data-action="close"]', function() {
			        that.$alertWin.hide().find('.con').html('');
			      });
			    },

			    // 选择图片
			    onChooseImg: function(e) {
			      var that = this,
			          target = e.target,
			          defds = [],
			          files = [];
			          fileCount = target.files.length;

			      files.push(target.files[0]);

			      that.setLoading(true);
			      var i = 0;
			      $.each(files, function(index, file) {
			        var reader = new FileReader();
			        
		            var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
		            if(!/^(png|gif|jpg|jpeg)$/.test(ext.toLowerCase())) {
		            	that.setLoading(false);
		            	that.alert('请上传png,gif,jpg,jpeg格式的图片');
		            	return false;
		            }
		            
		            if(file.size > maxImgSize) {
		            	that.setLoading(false);
		            	that.alert(errorTips.imgLimit);
					    return;
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
			      that.setLoading(true);
			      JSBridge.callNative("NineGameClient", "chooseImage", {"maxSize": 1}, function(json) {
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
			      that.imgToBase64(img, function(base64Data) {
			    	  if(base64Data.length > maxImgSize) {
			    		  that.alert(errorTips.imgLimit);
			    		  defd.reject();
			    		  return;
			    	  }  
			    	  $.ajax({
			    		  type: "post",
			    		  url: api.upload,
			    		  data: {
			    			  base64: base64Data,
			    			  fileName: new Date().getTime()
			    		  },
			    		  cache:false,
			    		  success: function(res) {
			    			  if(res.success) {
			    				  defd.resolve(res.data);	  
			    			  } else {
			    				  $('#errorTips').text("上传失败！应答信息=" + JSON.stringify(res));	
			    				  defd.reject();
			    				 
			    			  }
			    		  }, 
			    		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			    			  $('#errorTips').text("上传失败！textStatus=" + textStatus + "errorThrown" + errorThrown);
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
			        var imgUrl = data.url,
			            url = 'url("'+ imgUrl + ')';

			        that.$fileRemoteUrl.val(imgUrl);
			      }).fail(function() {
			        that.alert(errorTips.imgUploadError);
			        $li.addClass('error');
			      }).always(function() {
			        $li.removeClass('uploading');
			      });

			      img.onload = function() {
			    	  that.uploadImg(img, defd);
			      }

			      img.src = src;
			      $div.addClass('img').css('background-image', 'url("'+ src + '")');
			      $li.append($div);
			      $li.append(img).addClass('uploading');
			      that.$imgList.empty();
			      that.$imgList.append($li);
			      return defd;
			    },
			    
			    // 上传图片按钮状态改变
			    setLoading: function(flag) {
			      var that = this;

			      if(!flag) {
			        that.$fileBtn.removeClass('loading').find('span').text('上传图片')
			      } else {
			        that.$fileBtn.addClass('loading').find('span').text('读取中...');
			      }
			    },

			    // 提示
			    alert: function(msg) {
			      this.$alertWin.show().find('.con').html(msg);
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
		app.init($fileInputEle, $fileBtnEle, $fileRemoteUrlEle, $imgUrlEle);
  });
  
  

});

