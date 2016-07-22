package controllers

import (
	 "github.com/revel/revel"
	 "strings"
	 "guild_website/app/utils"
)
// 首页

type Index struct{
	BaseController 
}


func (c Index) Index() revel.Result{

	return  c.RenderTemplate("pc/index.html")
}

func (c Index) SdkCooperate() revel.Result{

	return c.RenderTemplate("pc/sdk.html")
}

func (c Index) SdkApply() revel.Result{
	return c.RenderTemplate("pc/sdk-apply.html")
}

func (c Index) MobileIndex()revel.Result{
    var isFromWeiXin bool = true
    var agentHeader string=c.Request.Header.Get("user-agent")
    isFromWeiXin = strings.Contains(agentHeader,"MicroMessenger")

    c.RenderArgs["isFromWeiXin"]=isFromWeiXin

    return c.RenderTemplate("mobile/index.html")
}

func (c Index) MobileVote()revel.Result{
	var isFromWeiXin bool = true
    var agentHeader string=c.Request.Header.Get("user-agent")
    isFromWeiXin = strings.Contains(agentHeader,"MicroMessenger")

    c.RenderArgs["isFromWeiXin"]=isFromWeiXin

    return c.RenderTemplate("mobile/vote.html")
}

func (c Index) MobileRule()revel.Result{
	var isFromWeiXin bool = true
    var agentHeader string=c.Request.Header.Get("user-agent")
    isFromWeiXin = strings.Contains(agentHeader,"MicroMessenger")

    c.RenderArgs["isFromWeiXin"]=isFromWeiXin

    return c.RenderTemplate("mobile/rule.html")
}

func (c Index) MobileLaPiao()revel.Result{
	var isFromWeiXin bool = true
    var agentHeader string=c.Request.Header.Get("user-agent")
    isFromWeiXin = strings.Contains(agentHeader,"MicroMessenger")

    c.RenderArgs["isFromWeiXin"]=isFromWeiXin

    return c.RenderTemplate("mobile/lapiao.html")
}

func (c Index) ZiyouAd() revel.Result{
	return c.RenderTemplate("pc/ziyou.html")
}

func (c Index) ZiyouAdSubmit( imgUrl, teamName, teamLeaderQQ, teamLeaderTel, gameServerName, teamLeaderHonor string ) revel.Result{
      if utils.StringIsNullOrEmpty(imgUrl)||utils.StringIsNullOrEmpty(teamName)||
      utils.StringIsNullOrEmpty(teamLeaderQQ)||utils.StringIsNullOrEmpty(teamLeaderTel)||
      utils.StringIsNullOrEmpty(gameServerName)||utils.StringIsNullOrEmpty(teamLeaderHonor){
      	  return c.RenderTemplate("pc/ziyou_fail.html")
      }
      return c.RenderTemplate("pc/ziyou_succ.html")
}

  /**
     * 自由之战广告详情手机版页
     */
func (c Index) MobileZiYouAd()revel.Result{
	var isFromWeiXin bool = true
    var agentHeader string=c.Request.Header.Get("user-agent")
    isFromWeiXin = strings.Contains(agentHeader,"MicroMessenger")

    c.RenderArgs["isFromWeiXin"]=isFromWeiXin

    return c.RenderTemplate("mobile/ziyou.html")
}

    /**
     * 自由之战广告详情手机版页-报名页
     */
func (c Index) MobileZiYouSign()revel.Result{
	var isFromWeiXin bool = true
    var agentHeader string=c.Request.Header.Get("user-agent")
    isFromWeiXin = strings.Contains(agentHeader,"MicroMessenger")

    c.RenderArgs["isFromWeiXin"]=isFromWeiXin

    return c.RenderTemplate("mobile/ziyou_sign.html")
}

/**
     * 自由之战广告详情手机版页-报名页
     */
//func (c Index) MobileZiYouSubmit()revel.Result{
//	var isFromWeiXin bool = true

//}