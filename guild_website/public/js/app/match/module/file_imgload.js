/**
* 评论弹框上传图片 · 游戏详情页 --- 九游安卓门户
* @author lilh@ucweb.com
* @version 1.0.0 ### 20150528
* @update lilh3 #### 20150604
*/

define(function(require) {
	var fileLoadApp = {
		// upload img
		/*
			@param {object} fileInputs
		*/
		fileLoad : function(fileInputs) {
			var that = this;
      var $this = fileInputs;
      var $wrap = $this.closest('.upload');
      fileInputs.change(function (e) {
			e.preventDefault();
			var files = e.target.files;
			// for file list
			var fileReader = new FileReader();
		    for(var i = 0, f; f = files[i]; i++){
		            // onload
	            	fileReader.onload = function(e) {
	            		var f = files[0];
	            		$wrap.find(".imgShow").attr("src",e.target.result);
	            		var fd = new FormData();
	            		fd.append('file', f, new Date().getTime() + '.jpg');
	            		$.ajax({
						    url: '/m/match/uploadImg',
						    type: 'POST',
						    cache: false,
						    data: fd,
						    processData: false,
						    contentType: false
						}).done(function(res) {
							if(res && res.success){
								$wrap.find("input[nameflag=fileRemoteUrl]").val(res.data.url);
							} else {
								errorTips("上传失败！请重新上传");
							}
						}).fail(function(res) {
							errorTips("上传失败！请重新上传");
							
						});
	            		$wrap.addClass('con-update');
	            		$wrap.find('.btn-update').html('重新上传')
	            	};
		          	fileReader.readAsDataURL(f);
		     }
		        // loading
				fileReader.onprogress = function(evt){
					
				}
				// loadError
				fileReader.onerror = function(){
					that.states.html("<em class='error'>上传失败！请重新上传</em>");
				}
			});
		},

		init : function() {
			var that = this;
      var $fileImg = $('.file-img');
      if ($fileImg.length) {
        $fileImg.each(function() {
          that.fileLoad($(this));
        });
      }
		},
	}

	fileLoadApp.init();
});