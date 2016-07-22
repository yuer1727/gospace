/**
* 异步加载列表 --- 发号活动列表
* @author lilh3
* @version 1.0.0 ### 20150226
* @update: 
*/

    //ajax数据分页请求
    var newScrollBottomLoad = scrollBottomLoad;
    var pageNO = parseInt($('#pageNO').val()) + 1; //首次分页都已经是下一页信息了
    var pageSize = $('#pageSize').val();
    var spreadType = $('#spreadType').val();
    var sUrl = "/m/match/indexPage.html";
    var typeParam = {
    	"pageNO" : pageNO,
    	"pageSize" : pageSize,
    	"spreadType" : spreadType
    };
    
    var clickMorePageNum = 3;
    //每动态加载几次后显示“点击查看更多”
    var numberOfRequests = 0;
    function initFunction() {
        newScrollBottomLoad.setData(typeParam);
    }

    function endFunction(dataHtml) {
        if (dataHtml == "") {
            if(typeParam.pageNO == 1){
                if(!dataHtml) {
                    $("#loading").hide();
                    $("#ajaxContainer").html('<div class="list-none-data">暂时没有赛事</div>');
                }
            }
            return "noMore";
        } else {
            typeParam.pageNO = parseInt(typeParam.pageNO) + 1;
            scrollBottomLoad.setData(typeParam);
        }
        numberOfRequests++;
        if (numberOfRequests % clickMorePageNum == 0) {
            return "resumeAutoLoad";
        } else if (numberOfRequests % clickMorePageNum == 1) {
            return "resumeAutoLoad";
        }
    }
    function initLoad() {
        newScrollBottomLoad.init({
            url: sUrl,
            type: "POST",
            loadingTipObjId: "loadingTip",
            loadErrorTipObjId: "errorTip",
            loadMoreTipObjId: "moreBtn",
            loadParentBoxId: "loading",
            noMoreTipObjId: "noMoreTip",
            containerId: "ajaxContainer",
            initFun: initFunction,
            endFun: endFunction
        });
    }
