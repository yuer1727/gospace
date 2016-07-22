JSBridge.isIOS = navigator.userAgent && (navigator.userAgent.indexOf("NineGameClient/ios") > -1 ||  navigator.userAgent.indexOf("com.tongmo.kkios") > -1 || navigator.userAgent.indexOf("com.tongmo.kkdevios") > -1 );
JSBridge.isAndroid = navigator.userAgent && (navigator.userAgent.indexOf("NineGameClient/android") > -1 || navigator.userAgent.indexOf("com.tongmo.kk") > -1);

/**
 * 打开客户端页面的方法。
 * @param kklink ：kklink地址，无法
 */
function openClientPage(kklink) {
	if (JSBridge.isIOS) {
		JSBridge.callNative("NineGameClient", "HandlerKKLink", {"kklink": kklink});
	} 
			
	if (JSBridge.isAndroid){
		window.alert(kklink);
	}
}

/**
 * 提供公用的隐藏分享按钮的方法。
 * @param kklink
 */
function hideShareButton() {
	if (JSBridge.isIOS) {
		 JSBridge.callNative("NineGameClient", "hideShareButton");
	} 
			
	if (JSBridge.isAndroid){
		 JSBridge.callNative("NineGameClient", "hideShareButton");
	}
}

/**
 * 获取是否支持群聊功能的算法。
 * 根据UA的最后三位进行运算，只有在版本440或以后支持，IOS则暂不支持
 */
function enterGroupSupport() {
	if($('#groupDetail').length == 0) {
		return;
	}
	
	var isSupport = true;
	if (JSBridge.isIOS) {
		isSupport=false;
	} else if (JSBridge.isAndroid){
		var version = parseInt(navigator.userAgent.substr(navigator.userAgent.length - 3));
		if (version && (version >= 440 || version == 999)) { //version 存在，并且版本号大于等于 440,由于测试的版本号为999，因此需要兼容。
			isSupport=true;
		} else {
			isSupport=false;
		}
	}
	if (!isSupport) { //不支持则隐藏
		$('#groupDetail').hide();
	}	
}


