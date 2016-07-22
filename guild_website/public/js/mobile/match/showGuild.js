
/**
 * 展示战队
 */
function showGuild() {
	var $guildBtn = $(".show_guild");
	$guildBtn.bind('click',function() {
		if ($('#userType').val() == '1') {//1表示安卓端
			var $btnThis = $(this);
			if ($btnThis.hasClass('loading'))
				return;
			var url = $btnThis.attr('url');
			$.ajax({
						url : url,
						type : 'get',
						beforeSend : function() {
							//$btnThis.addClass('loading');
						},
						complete : function() {
							//$btnThis.removeClass('loading');
						},
						success : function(data) {
							if (data.result == 'success') {
								window.alert("kk://page/goto?target=teamHomePage&id="+ data.data);
								//window.alert("kk://common/combine?list=kk%3a%2f%2fpage%2fclose%60kk%3a%2f%2fpage%2fgoto%3ftarget%3dteamHomePage%26id%3d"+ data.data);
							} else {
								new_alert('战队队长太忙，关闭了战队主页');
							}
						},
						error : function() {
							new_alert('战队队长太忙，关闭了战队主页');
						}
					});
		} else if ($('#userType').val() == '3') { //3表示IOS端，暂时什么都不干
			return;
		}else {//提示下载KK语音
			openDownloadKK();
		}
	});
}
/**
 * 下载KK语音弹窗JS
 */
function openDownloadKK() {
	$('#win1').show();
}
function downloadkk(comefrom) {
	$('#win1').hide();
	var redirectUrl= "http://api2.kkyuyin.com/app/downloadApk?from=WD_89";
	if (comefrom) {
		redirectUrl += "&comefrom="+ comefrom
	}
	
	window.location.href = redirectUrl;
}
function downloadkk4Share(comefrom, from, tid) {
	var redirectUrl= "http://api2.kkyuyin.com/app/downloadApk?" + "comefrom="+ comefrom + "&from="+from + "&tid="+tid;
	window.location.href = redirectUrl;
}


function closeWin() {
	$('#win1').hide();
}

// 新提示弹窗
function new_alert(msg) {
	$('.toast').html(msg);
	var $popToast = $(".pop-toast");
	$popToast.fadeIn();
	setTimeout(function() {
		$popToast.fadeOut("slow");
	}, 3000); //这里设置延时时间
}