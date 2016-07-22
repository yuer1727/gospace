/**
* 游戏视频投稿 --- KK语音
* @author wwl98670@alibaba-inc.com  
* @version 1.0.0 ### 20151117
* @update wuwl ### 20151120 for 修改提交数据 
*/ 
$(function(){
	
	var tool = {
		lockbtn: function(obj){
			obj.attr("disabled","disabled");
		},
		unlockbtn: function(obj){
			obj.removeAttr("disabled");
		},
		checked: function(obj){
			obj.attr("checked","checked").siblings().removeAttr("checked");	
		},
		currented: function(obj){
			obj.addClass("current").siblings().removeClass("current");	
		},
		popupshow: function(text){
			$("#pop_msg").html(text);
			$("#popup").show();
		},
		createhtml: function(arr){
			var html = [];
			html.push(arr);
			html = html.join("");
			return html;
		},
		createUl: function(arg){
			var content = '<ul class="item-list '+arg.cls+'" data-id="'+ arg.id + '"></ul>'
			var html = tool.createhtml(content);
			return html;
		},
		createLi: function(arg){
			var content = '<li class="'+arg.cls+'" data-code="'+arg.code+'"><span class="it">'+arg.name+'</span></li>'
			var html = tool.createhtml(content);
			return html;
		},
		createProp: function(arg){
			var key = arg.key || "";
			var content = '<input type="hidden" class="input_tmp hide" name="' + key + '"/>';
			var html = tool.createhtml(content);
			return html;
		},
		writeJson: function(arg){
			var name = arg.name,
					val = arg.val;
			var json = {},
					input = $(".input_tmp[name='"+name+"']");
					
			json.key_name = name;
			json.key_value = val;
			json = JSON.stringify(json);
			input.val(json);
		}
	};
	
	var app = {
		init: function(){
			var that = this;
			that.form = $("#form");
			that.basefun();
			// 绑定选择游戏
			that.form.delegate(".choose_game", "click", function(){
				var its = $(this);
				that.choose_game(its);
			});
			// 绑定选择分类
			that.form.delegate(".choose_son", "click", function(){
				var its = $(this);
				that.choose_son(its);
			});
			// 绑定选择属性
			that.form.delegate(".choose_val", "click", function(){
				var its = $(this);
				that.choose_val(its);
			});
			
			// 绑定提交事件
			that.form.delegate("#toSubmit", "click", function(){
				var its = $(this);
				that.tosubmit(its);
			});
			
		},
		
		//基础事件
		basefun: function(){
			var that = this;
			$(document).on('click','.popup_close', function () { 
				$(this).parents(".mod-popup").hide();
			});
			$(document).on('touchmove','.mod-popup-bg,.popup-container,.popup_close,.no_touchmove', function (e) { 
				e.preventDefault(); 
				e.stopPropagation(); 
			});
		},
		
		// 选择游戏
		choose_game: function(obj){
			var that = this;
			var its = obj,
					s_btn = $(".choose_game"),
					disabled = its.attr("disabled");
		
			if ( disabled ) {
				return;
			} else {	
				var s_has = its.attr("data-has"),
						s_id = its.attr("data-id"),
						s_url = its.attr("data-url");
				
				if ( s_has == 0 ) { 
					$.ajax({
						url:s_url,
						type:"GET",
						dataType:"json",
						beforeSend:function(){
							tool.lockbtn(s_btn);
							tool.checked(its);
							tool.currented(its);
							tool.writeJson({
								name:"kk_game_id",
								val:s_id
							})	
							$("#sonWrap").hide();
							$("#valueWrap").hide();
							$("#sonBlock").html("");
							$("#valueBlock").html("");
						},
						complete:function(){
							tool.unlockbtn(s_btn);
						},
						success:function(data) {
							
							its.attr("data-has",1).siblings().attr("data-has",0);
							
							var list = data.list,
									list_len = list.length;
									
							if ( list_len > 0 ) {
								// 1、生成游戏专属外壳
								var sonUl = tool.createUl({
									cls:"son_ul",
									id:s_id
								});
								$("#sonBlock").html(sonUl);
								
								var valueDiv = '<div class="value_in" data-id="'+ s_id+ '"></div>',
										valueDiv = tool.createhtml(valueDiv);
								$("#valueBlock").html(valueDiv);
								
								// 2、循环
								for ( var i=0; i<list_len; i++ ) {
									var item_code = list[i].prop_code, //编码
											item_name = list[i].prop_name, //分类名
											item_value = list[i].prop_value; //属性
											
									var lihtml = tool.createLi({
										cls: "choose_son",
										code: item_code,
										name: item_name
									});
									
									$(".son_ul[data-id='"+s_id+"']").append(lihtml).show();
									
									// 找孙子
									that.get_value({
										cls:"value_ul",
										code:item_code,
										list:item_value,
										gameid:s_id
									});

									$("#sonWrap").show();
									
								}
							} 
						},
						error: function(){
							$(".tips").show().text("服务器繁忙，请稍后再试！");
						}
					})

				} else {
					tool.popupshow("你已经选择了这个游戏哦!");	
				}
			}
		},
		get_value: function(arg){
			var that = this;
			// 1、包装外壳
			var ulHtml = tool.createUl({
				cls:arg.cls,
				id:arg.code
			});
			$(".value_in[data-id='"+arg.gameid+"']").append(ulHtml);
		
			// 2、循环
			var thelist = arg.list,
					len = thelist.length;
		
			for ( var j=0; j<len; j++ ) {
				var name = thelist[j].name;
				
				var liHtml = tool.createLi({
					cls: "choose_val",
					code: arg.code,
					name: name
				});
				
				$(".value_ul[data-id='"+arg.code+"']").append(liHtml);
			}		
			
			var othHtml = '<li class="choose_val" data-code="'+arg.code+'"><span class="it">其他</span></li>',
					othHtml = tool.createhtml(othHtml);
			
			$(".value_ul[data-id='"+arg.code+"']").append(othHtml);
					
		},
		
		// 选择分类
		choose_son: function(obj){
			var that = this;
			var its = obj,
					id = its.attr("data-code"),
					tit = its.find(".it").html();
			tool.currented(its);		
			$("#valueTit").html(tit);
			$("#valueWrap").show();
			$(".value_ul[data-id='"+id+"']").show().siblings().hide();
		},
		
		// 选择属性
		choose_val: function(obj){
			var that = this;
			var its = obj,
					s_val = its.find(".it").html(),
					s_code = its.attr("data-code"),
					s_checkif = its.attr("checked"),
					its_parent = $(".choose_son[data-code='"+s_code+"']"),
					its_tmp = its.siblings(".input_tmp");
			
			its_tmp.remove();
			
			if ( s_checkif ) {
				its.removeAttr("checked");
				its_parent.removeAttr("checked");
			} else {
				tool.checked(its);
				tool.currented(its);
				$(".choose_son[data-code='"+s_code+"']").attr("checked","checked");
				
				var inputemp = tool.createProp({
					key: s_code
				});
				$(".value_ul[data-id='"+s_code+"']").append(inputemp);
				
				tool.writeJson({
					name:s_code,
					val:s_val
				})
					
				
				
				
				// var proparr = {};
				// proparr.key_name = s_code;
				// proparr.key_value = s_val;
				// proparr = JSON.stringify(proparr); 
				
				// its_tmp.val(proparr);
				
			}
			
		},
		
		// 提交
		tosubmit: function(obj){
			var that = this;
			var its = obj,
					disabled = its.attr("disabled");
			
			if ( disabled ) {
				return;
			} else {
				var videocheck = that.checknull($("#checkvideo"));
				
				if ( videocheck == 1 ) {
					var videoval = $("#checkvideo").val(),
							videoname = $("#checkvideo").attr("name");
					tool.writeJson({
						name:videoname,
						val:videoval
					})
					
				} else {
					tool.popupshow("你还没有填写视频地址呢！")
					return;
				}
				
				var gamecheck = that.checknull($("#checkgame"));
				if ( gamecheck == 1 ) {
					console.log("已经选了游戏");
				} else {
					tool.popupshow("你还没有选择游戏呢！")
					return;
				}
				
				//异步提交
				that.postdata = that.spelldata();
				
				that.toajax({
					its:its,
					postdata:that.postdata
				})
				
			};

		},
		
		//校验
		checknull: function(obj){
			var that = this;
			that.val = obj.val();
			that.len = that.val.length;
			that.result = 0;
			if ( that.len > 0 ) {
				that.result = 1;
			} else {
				that.result = 0;
			}
			return that.result;
		},
		
		//拼接数组
		spelldata: function(){
			var that = this;
			that.list = $(".input_tmp");
			that.len = that.list.length;
			that.arr = [],
			that.jsonarr = {},
			that.count = 0;
					
			for ( var i=0; i<that.len; i++ ) {
				var thisjson =  $.trim(that.list.eq(i).val());
				that.arr.push(JSON.parse(thisjson));
				that.count++;
				if ( that.count == that.len ) {
					that.jsonarr.prop = that.arr;
					//console.log(that.jsonarr);
					return that.jsonarr;
					break;
				}
			}
		},
		
		// 提交数据
		toajax: function(arg){
			var that = this;
			var its = arg.its,
					surl = its.attr("data-url");
			$.ajax({
				url:surl,
				type:"POST",
				dataType:"json",
				data:{'postdata':JSON.stringify(arg.postdata)},
				beforeSend:function(){
					tool.lockbtn(its);
					its.val("正在提交中");
				},
				complete:function(){
					tool.unlockbtn(its);
					its.val("提交");
				},
				success:function(data){
					if ( data.result == 0 ) {
						tool.popupshow(data.data);
						$('#checkvideo').val("");
					} else {
					    tool.popupshow(data.data);		
					}
					
				},
				error: function(){
					tool.popupshow("网络繁忙，请稍后再试哦~~")
				}
			});
		}	
	
	}	
	
	app.init();
	
	
})



