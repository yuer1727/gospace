/**
* 评论弹框上传图片 · 游戏详情页 --- 九游安卓门户
* @author lilh@ucweb.com
* @version 1.0.0 ### 20150528
* @update lilh3 #### 20150604
*/


	var fileLoadApp = {
		getDom : function() {
			var that = this;

			// 上传图按钮
			that.upBtn = document.getElementById("file-img");
			that.upItemsBtn = document.getElementById("tem-file");
           $("#update-photo").hide();
			
		},



		// upload img
		/*
			@param {object} fileInputs
		*/
		fileLoad : function(fileInputs) {
			var that = this;
			fileInputs.onchange = function (e) {
				e.preventDefault();
				var files = e.target.files;
				// for file list
				var fileReader = new FileReader();
		        for(var i = 0, f; f = files[i]; i++){
		            // onload
	            	fileReader.onload = function(e) {
	            		var f = files[0];
	            		$("#imgShow").attr("src",e.target.result);
	            		
	            		$("#imgShow").attr("data-name",f.name);
//          			
	            	};
		          	fileReader.readAsDataURL(f);
		          	$("#update-photo-new").hide();
		          	$("#update-none").val("1");
		          	$("#update-photo").show();
		        }
		        // loading
				fileReader.onprogress = function(evt){
				}
				// loadError
				fileReader.onerror = function(){
					that.states.html("<em class='error'>上传失败！请重新上传</em>");
				}
			}
		},


		

		init : function() {
			var that = this;
			that.getDom();
//			that.deleteImg();
//			that.speechAutoImg();
			that.fileLoad(that.upBtn);
			that.fileLoad(that.upItemsBtn);			
		},
	}

	fileLoadApp.init();

//	module.exports = {
//		params : function() {
//			var value = fileLoadApp.callParam();
//			return value;
//		}
//	};
