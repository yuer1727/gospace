var Util = {};

(function(u) {
	/**
	 * 弹出toast框
	 * @param string msg
	 */
	u.toast = function(msg) {
		location.href = 'kk://common/toast?msg=' + encodeURIComponent(msg);
	}
	
	/**
	 * 弹出对话框
	 * @param string text 对话框内容
	 * @param string button 按钮文字（默认为"确定"）
	 * @param string action 点击按钮后要跳转的url
	 */
	u.alert = function(text, button, action) {
		var link = 'kk://page/alertDialog?text=' + encodeURIComponent(text);
		
		if(button != undefined && button != '') {
			link += ('&button=' + button);
		}
		
		if(action != undefined && action != '') {
			link += ('&action=' + encodeURIComponent(action)); 
		}
		location.href = link;
	}
	
	/**
	 * 显示有两个选择按钮的对话框
	 * @param string text 对话框内容
	 * @param string confirmButton 确认按钮的文字（默认为”确定“）
	 * @param string confirmAction 点击确认后要跳转的url
	 * @param string cancelButton 取消按钮的文字（默认为”取消“）
	 * @param string cancelAction 点击取消后要跳转的url
	 */
	u.confirm = function(text, confirmButton, confirmAction, cancelButton, cancelAction) {
		var link = 'kk://page/alertDialog?text=' + encodeURIComponent(text);
		
		if(confirmButton != undefined && confirmButton != '') {
			link += ('&confirmButton=' + confirmButton);
		}
		
		if(confirmAction != undefined && confirmAction != '') {
			link += ('&confirmAction=' + encodeURIComponent(confirmAction)); 
		}
		
		if(cancelButton != undefined && cancelButton != '') {
			link += ('&cancelButton=' + cancelButton);
		}
		
		if(cancelAction != undefined && cancelAction != '') {
			link += ('&cancelAction=' + encodeURIComponent(cancelAction)); 
		}
		location.href = link;
	}
	
	/**
	 * 跳转至目标界面
	 * @param string target 界面名称
	 * @param int id 调用界面所携带的id参数
	 * @param string extra 调用界面所携带的第2个参数
	 */
	u.go = function(target, id, extra) {
		var link = 'kk://page/goto?target=' + encodeURIComponent(target);
		
		if(id != undefined && id != '') {
			link += ('&id=' + id); 
		}
		
		if(extra != undefined && extra != '') {
			link += ('&extra=' + extra);
		}
		
		location.href = link;
	}
	
	u.handleError = function(httpRequest,textStatus) {
		if(textStatus == 'error') {
			if(httpRequest.status == 403) {
				//跳转登录
			} else {
				Util.toast("服务器内部错误");
			}
		} else if(textStatus == 'abort') {
			Util.toast("服务连接超时");
		} else {
			Util.toast("未知错误");
			location.href = "kk://common/toast?msg=" + encodeURIComponent(httpRequest.response);
		}
	}
	
	/**
	 * 显示有两个选择按钮的对话框
	 * @param string text 对话框内容
	 * @param string confirmButton 确认按钮的文字（默认为”确定“）
	 * @param string confirmAction 点击确认后要跳转的url
	 * @param string cancelButton 取消按钮的文字（默认为”取消“）
	 * @param string cancelAction 点击取消后要跳转的url
	 */
	u.question = function(text, confirmButton, confirmAction, cancelButton, cancelAction) {
		var link = 'kk://page/questionDialog?text=' + encodeURIComponent(text);
		
		if(confirmButton != undefined && confirmButton != '') {
			link += ('&confirmButton=' + confirmButton);
		}
		
		if(confirmAction != undefined && confirmAction != '') {
			link += ('&confirmAction=' + encodeURIComponent(confirmAction)); 
		}
		
		if(cancelButton != undefined && cancelButton != '') {
			link += ('&cancelButton=' + cancelButton);
		}
		
		if(cancelAction != undefined && cancelAction != '') {
			link += ('&cancelAction=' + encodeURIComponent(cancelAction)); 
		}
		location.href = link;
	}
	
	/**
	* 通知刷新评论
	*/
	u.refreshComment=function(){
		var link='kk://activity/refreshComment';
		location.href = link;
	}
	
	/**
	* 合并KKlink
	*/
	u.combine=function(urls){
		if(urls == undefined || urls == null) {
			return;
		}
		var list = '';
		var len = urls.length;
		for(var i=0; i<len; i++) {
			if(i > 0) {
				list += '`';
			}
			list += urls[i];
		}
		list = encodeURIComponent(list);
		location.href = 'kk://common/combine?list='+list;
	}
	
	/**
	* 合并通知,先弹框，再刷新评论
	*/
	u.refreshCommentAndAlert=function(text, button, action){
		var refreshLink='kk://activity/refreshComment';
		var alertLink ='kk://page/alertDialog?text=' + encodeURIComponent(text);
		
		if(button != undefined && button != '') {
			alertLink += ('&button=' + button);
		}
		
		if(action != undefined && action != '') {
			alertLink += ('&action=' + encodeURIComponent(action)); 
		}
		u.combine(new Array(refreshLink, alertLink));	
	}
	
	/**
	 * 打开图片浏览器
 	 * @param {Array} imgUrls 图片地址的数组
 	 * @param {int} pos 初始位置（从0开始，0 <= pos < 图片数量，默认为0）
	 */
	u.browserImg=function(imgUrls, pos) {
		if(imgUrls == undefined || imgUrls == null) {
			return;
		}
		var list = '';
		var len = imgUrls.length;
		for(var i=0; i<len; i++) {
			if(i > 0) {
				list += '`';
			}
			list += imgUrls[i];
		}
		list = encodeURIComponent(list);
		location.href = 'kk://page/gallery?urls='+ list + '&pos=' + pos;
	}
	
})(Util);
