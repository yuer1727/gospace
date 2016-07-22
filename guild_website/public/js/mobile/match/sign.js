/*
* 报名 js 逻辑
* Author: molb
* Date: 2015-08-24
*/

$(function() {

    // canvas toBlob
  (function patchCanvas(){
    if(!HTMLCanvasElement.prototype.toBlob){
      HTMLCanvasElement.prototype.toBlob = function(callback, type, encoderOptions){
        var dataurl = this.toDataURL(type, encoderOptions);
        var bstr = atob(dataurl.split(',')[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        var blob = new Blob([u8arr], {type: type});
        callback.call(this, blob);
      };
    }
  })();

   // img to blob
  function imgToBolb(imgNode, cb) {
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

  JSBridge.isAndroid = navigator.userAgent && (navigator.userAgent.indexOf("NineGameClient/android") > -1 || navigator.userAgent.indexOf("com.tongmo.kk") > -1 JSBridge.isAndroid = navigator.userAgent && (navigator.userAgent.indexOf("NineGameClient/android") > -1 || navigator.userAgent.indexOf("com.tongmo.kk") > -1 || navigator.userAgent.indexOf("NineGameClient/ios") > -1););

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
  };

  var uploadText = "点击上传";

   // 提示语
  var errorTips = {
    // 图片上传失败
    imgUploadError: '<p style="text-align: center;">图片上传失败<p>',
  
    // 提交成功
    postSucc: '提交成功',

    // 提交失败
    postErr: '提交失败'
  };

  var app = {

    init: function() {
      this.cacheDom();
      this.bindEvent();
    },

    cacheDom: function() {

      this.$alertWin = $('#alert-win');

      this.$form = $('#form');
      this.$submitBtn = $('#submit-btn');

      // 上传图片相关
      this.$fileInput = $('#file-input');
      this.$fileBtn = $('#file-btn');
      this.$imgDiv = $('#img-holder');
    },

    bindEvent: function() {
      var that = this;

      // 下拉框
      $('.con-select .input-text').on('click', function() {
        $(this).siblings('ul').removeClass('hide');
      });

      $('.con-select li').on('click', function() {
        var $select = $(this).parents('.con-select'),
            val = $(this).data('value'),
            label = $(this).text();

        $select.find('.input-value').val(val).trigger('change');
        $select.find('.input-text').val(label);
        $(this).parents('ul').addClass('hide');
      });

      // 关闭弹窗
      this.$alertWin.on('click', '[data-action="close"]', function() {
        that.$alertWin.hide().find('.con').html('');
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

      // 失去焦点验证
      that.$form.find('input').on('change', function() {
        that.validField($(this));
      });

      // 提交
      this.$form.on('submit', function(e) {
        e.preventDefault();
        if(that.$submitBtn.hasClass('loading')) return;
        that.onSubmit();
      });

    },

    onChooseImg: function(e) {
      var that = this,
          target = e.target,
          files = target.files; 

      if(files.length <= 0) return;

      that.setLoading(true);

      var file = files[0],
          reader = new FileReader(),
          ext = file.name.substr(file.name.lastIndexOf('.') + 1);

      if(!/^(png|gif|jpg|jpeg)$/.test(ext.toLowerCase())) {
        that.setLoading(false);
        that.alert('请上传png,gif,jpg,jpeg格式的图片');
        return false;
      }

      reader.onloadend = function() {
        that.addImg(reader.result);
      };

      reader.readAsDataURL(file);
    },

    onChooseImgClient: function() {
      var that = this;

      if(that.$fileBtn.hasClass('loading')) return;

      that.setLoading(true);
      JSBridge.callNative("NineGameClient", "chooseImage", {"maxSize": 1}, function(json) {
       var data = json.data || [];

        if(data.length <= 0) {
          that.setLoading(false);
          return;
        }

        data.forEach(function(src, index) {
          that.addImg(src);
        });

      });
    },

    // 上传一张图片
    uploadImg: function(img, defd) {
      var that = this;

      imgToBolb(img, function(blob) {
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
    addImg: function(src) {
      var that = this,
          img = new Image(),
          $imgDiv = that.$imgDiv,
          defd = $.Deferred();

      defd.done(function(data) {
        var imgUrl = data.url;
        $imgDiv.find('input').val(imgUrl).trigger('change');
        $imgDiv.css('background-image', 'url("'+ src + '")');
        $imgDiv.show();
        uploadText = '重新上传';

      }).fail(function() {
        that.alert('<p style="text-align: center;">图片上传失败<p>');
        $imgDiv.addClass('error');
      }).always(function() {
        $imgDiv.removeClass('uploading');
        that.setLoading(false);
      });

      img.onload = function() {
        that.uploadImg(img, defd);
      }

      img.src = src;
      
      return defd;
    },

    onSubmit: function() {
      var that = this,
          data;

      if(!that.validForm()) return false;

      data = that.$form.serializeArray();
      var postData = {};
      data.forEach(function(param) {
        postData[param.name] = param.value;
      });

      $.ajax({
        url: api.submit,
        type: 'POST',
        data: postData,
        beforeSend: function() {
          that.$submitBtn.val('正在提交...').addClass('loading');
        },
        complete: function() {
          that.$submitBtn.val('提交').removeClass('loading');
        },
        success: function(data) {
          if(data.success) {
            window.location.href = data.data;
          } else {
            that.alert('<p style="text-align: center">'+ errorTips.postErr +'</p>');
          }
        },
        error: function() {
          that.alert('<p style="text-align: center">'+ errorTips.postErr +'</p>');
        }
      });

    },

    validForm: function() {
      var that = this,
          valid = true;

      $('[data-required]').each(function() {
        if(!that.validField($(this))) {
          valid = false;
        }
      });

      return valid;
    },

    validField: function($el) {
      var value = $el.val(),
          required = $el[0].hasAttribute('data-required');

      var $tips = $el.parents('.row').find('.tips');

      // 必填
      if(required && $el.val().trim() === '') {
        $tips.removeClass('hide').text($tips.data('msg'));
        return false;
      }

      // 验证正则
      var reg = $el.data('reg');
      if(reg) {
        reg = new RegExp(reg);
        if(!reg.test(value)) {
          $tips.removeClass('hide').text($el.data('msg'));
          return false
        }
      } 

      $tips.addClass('hide').text('');
      return true;
    },

    // 提示
    alert: function(msg) {
      this.$alertWin.show().find('.con').html(msg);
    },

    // 上传图片按钮状态改变
    setLoading: function(flag) {
      var that = this;
      if(!flag) {
        that.$fileBtn.removeClass('loading').find('span').text(uploadText)
      } else {
        that.$fileBtn.addClass('loading').find('span').text('上传中...');
      }
    }

  };

  app.init();

});