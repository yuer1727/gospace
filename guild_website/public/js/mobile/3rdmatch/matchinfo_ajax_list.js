/**
* 异步加载列表 --- 赛事列表
* @author jiaming.rjm
* @version 1.0.0 ### 20160406
* @update: 
*/

    //ajax数据分页请求
    var newScrollBottomLoad = scrollBottomLoad;
    var pageNO = parseInt($('#pageNO').val()) + 1; //首次分页都已经是下一页信息了
    var pageSize = $('#pageSize').val();
    var orgId = $('#orgId').val();
    var sUrl = "/m/match/thirdparty/matchListPage";
    var typeParam = {
    	"pageNO" : pageNO,
    	"pageSize" : pageSize,
    	"orgId" : orgId
    };
    
    var clickMorePageNum = 3;
    //每动态加载几次后显示“点击查看更多”
    var numberOfRequests = 0;
    function initFunction() {
        newScrollBottomLoad.setData(typeParam);
    }

    function endFunction(dataHtml) {
        if (!dataHtml || $.trim(dataHtml) == "") {
        	if(typeParam.pageNO==1){
        		return "only1Page";
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
