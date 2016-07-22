/**
* 图片幻灯片
* @author huanghm
* @version 0.0.1
* @dependencies 依赖jquery
*/
define(function(require, exports, module) {
	
function slideImg(arg){
	
	
	var that = this;
	that.index = 0;
	that.main = $(arg.main);
	that.on_class = arg.handleOnClass;
	that.time = arg.time;
	that.num = that.main.length;
	
	that.bar_index = 0;
	
	
	that.handleWrap = $(arg.handleWrap);
	that._echoBar(that.num);
	that.handle = that.handleWrap.find("li");
	
	that.main.hide();
	that.main.eq(0).show();
	
	
	
	that.handle.hover(function() {
		
		if(that.index != $(this).index()){		
			that.index = $(this).index();
			that._goNum(that.index);
		}
		clearInterval(that.auto_change);
	}, function(){
		that._autoChange();
	});
	that.main.hover(function() {
		clearInterval(that.auto_change);
	}, function() {
		that._autoChange();
	});
	that._autoChange();
	
}

module.exports = slideImg;

slideImg.prototype={
	_autoChange: function() {
		var that = this;
		
		that.auto_change = setInterval(function() {
			that.main.addClass(that.none_class);
			if(that.index + 1 != that.num){
				that.index +=1;
			}else{
				that.index = 0;
			}	
			that._goNum(that.index);
			
		},that.time);
		
	},
	_goNum: function(n) {
		var that = this;
		if(!that.main.eq(n).is(":animated")){
			that.main.stop().fadeOut();
			that.main.eq(n).stop().fadeIn();
		}
		that.handle.removeClass(that.on_class);
		that.handle.eq(n).addClass(that.on_class);
		that._n = n;
	},
	_echoBar: function(n) {
		var that = this;
		var h='';
		for(i=1;i<n;i++){
			h+='<li class=""><a href="#"><span>1</span></a></li>';
		}
		var bar_on = '<li class="on"><a href="#"><span>1</span></a></li>'
		that.handleWrap.html(bar_on + h);
	}
	
}

//初始化demo
//	new slideImg({
//		  main: $("#js-img-box"),
//		handle: $("#js-samll-pic"),	
// handleOnClass: "on",
//		  time: 4000
//	});


 

});