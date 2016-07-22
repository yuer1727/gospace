/**
* 页面滑动到底部加载列表
* @author lih3
* @version 1.0.0
* @dependencies 依赖zepto ai
*/
    var scrollBottomLoad = {
        init: function(arg) {
            var that = this;
            that.requestIng = false;
            that.data = arg.data;
            that.url = arg.url;
            that.type = arg.type || "GET";
            that.times;
            that._getDom(arg);
            if (that.container.size() == 0) {
                return;
            }
            that._getFun(arg);
            that.initFun();
            that._bind();
            $(window).trigger("scroll");
        },
        _getDom: function(arg) {
            var that = this;
            var doc = document;
            that.container = $("#" + arg.containerId);
            that.loadingTipObj = $("#" + arg.loadingTipObjId);
            that.loadingTipHtml = that.loadingTipObj.html();
            that.loadErrorTipHtml = $("#" + arg.loadErrorTipObjId).html();
            that.loadMoreTipHtml = $("#" + arg.loadMoreTipObjId).html();
            that.noMoreTipHtml = $("#" + arg.noMoreTipObjId).html();
            that.loadParentBoxId = $("#" + arg.loadParentBoxId);
        },
        _getFun: function(arg) {
            var that = this;
            that.initFun = arg.initFun || function() {};
            that.startFun = arg.startFun || function() {};
            that.errorFun = arg.errorFun || function() {};
            that.endFun = arg.endFun || function() {};
        },
        _bind: function() {
            var that = this;
            that._bindScroll();
            ai.touchClick(that.loadingTipObj[0], function() {
                that._request();
            });
        },
        _bindScroll: function() {
            var that = this;
            $(window).bind("scroll", function() {
                if ($(window).scrollTop() >= $(document).height() - $(window).height() - 253) {
                    that._request();
                }
            });
        },
        _request: function() {
            var that = this;
            if (that.requestIng == false) {
                that._ajax();
            }
        },
        _render: function(data) {
            var that = this;
            that.container.append(data);
            $(window).trigger("scroll");
        },
        _beforeSendFun: function() {
            var that = this;
            that.requestIng = true;
            that.loadingTipObj.html(that.loadingTipHtml);
            that.startFun();
        },
        _successFun: function(data) {
            var that = this;
            that.requestIng = false;
            var continueTo = that.endFun(data);
            if (continueTo == "only1Page") {
                that.loadParentBoxId.hide();
            }else if (continueTo == "noMore") {
                $(window).unbind("scroll");
                that.loadingTipObj.html(that.noMoreTipHtml);
            } else if (continueTo == "clickMore") {
                $(window).unbind("scroll");
                that._render(data);
                that.loadingTipObj.html(that.loadMoreTipHtml);
            } else if (continueTo == "resumeAutoLoad") {
                that._bindScroll();
                that._render(data);
                that.loadingTipObj.html(that.loadingTipHtml);
            } else if (continueTo == "againRequest") {
                $(window).trigger("scroll");
                that.loadingTipObj.html(that.loadingTipHtml);
            } else if (continueTo == "temporarilyNoMore") {
                that.loadingTipObj.html(that.noMoreTipHtml);
                $(window).unbind("scroll");
                that.times = setTimeout(function() {
                    that.loadParentBoxId.hide();
                }, 3e3);
            } else {
                that._render(data);
                that.loadingTipObj.html(that.loadingTipHtml);
            }
        },
        _errorFun: function() {
            var that = this;
            that.requestIng = false;
            that.errorFun();
            that.loadingTipObj.html(that.loadErrorTipHtml);
        },
        _ajax: function() {
            var that = this;
            $.ajax({
                type: that.type,
                url: that.url,
                data: that.data,
                timeout: 4e3,
                beforeSend: function() {
                    that._beforeSendFun();
                },
                success: function(data) {
                    that._successFun(data);
                },
                error: function() {
                    that._errorFun();
                }
            });
        },
        setData: function(data) {
            var that = this;
            that.data = data;
        },
        setUrl: function(url) {
            var that = this;
            that.url = url;
        },
        setBind: function() {
            var that = this;
            that.loadParentBoxId.show();
            that._bindScroll();
            clearTimeout(that.times);
        }
    };
