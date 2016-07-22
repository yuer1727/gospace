package controllers

import (
	"encoding/json"
	"fmt"
	"github.com/ddliu/go-httpclient"
	"github.com/revel/revel"
	"guild_website/app/common/api"
)

// 测试httpclient

type Connection struct {
	BaseController
}

func (c Connection) Conn() revel.Result {

	httpclient.Defaults(httpclient.Map{
		httpclient.OPT_USERAGENT: "my awsome httpclient",
		"Accept-Language":        "en-us",
	})

	res, _ := httpclient.Get("http://www.baidu.com", map[string]string{})

	fmt.Printf("StatusCode-->%d\n", res.StatusCode)
	m := res.Header
	for k, v := range m {
		fmt.Printf("%s-->%s\n", k, v)
	}
	if data, err := res.ToString(); err == nil {
		fmt.Printf("data:%d\n", len(data))
		fmt.Printf("%v\n", data)
	} else {
		fmt.Printf("%v\n", err)
	}

	return c.RenderTemplate("debug.html")
}

const (
	USERAGENT       = "my awsome httpclient"
	TIMEOUT         = 30
	CONNECT_TIMEOUT = 5
	SERVER          = "http://127.0.0.1:9142/m/girl/recommend?id=49991"
)

func (c Connection) Apirequest() revel.Result {

	httpclient.Defaults(httpclient.Map{
		"opt_useragent":   USERAGENT,
		"opt_timeout":     TIMEOUT,
		"Accept-Encoding": "gzip,deflate,sdch",
	})

	res, _ := httpclient.Get(SERVER, nil)

	fmt.Println("Response:")
	fmt.Println(res.ToString())

	return c.RenderTemplate("debug.html")
}

func (c Connection) ApiToServer() revel.Result {
	httpclient.Defaults(httpclient.Map{
		"opt_timeout": TIMEOUT,
	})
	httpclient.WithHeader("Content-Type", "text/html;charset=utf-8")

	body := make(map[string]interface{})
	body["id"] = "1465825473352"
	body["encrypt"] = "md5"
	body["sign"] = "588c125e2e665907e47e55297de2d20e"

	client := make(map[string]interface{})
	client["caller"] = "guild.website"
	client["ex"] = ""
	body["client"] = client

	data := make(map[string]interface{})
	data["uid"] = 49991
	body["data"] = data

	bodyJSON, err := json.Marshal(body)
	if err != nil {
		panic(err)
	}
	println(string(bodyJSON))

	res, _ := httpclient.PostString("http://127.0.0.1:9151/ucgc/girl/recommend", string(bodyJSON))

	fmt.Println("Response:")
	fmt.Println(res.ToString())

	test := make(map[string]interface{})
	test["a"] = "1"
	test["b"] = 2
	RequestData := api.CreateRequestData(test)
	fmt.Println(RequestData)

	return c.RenderTemplate("debug.html")
}

func (c Connection) ApiTest() revel.Result {

	test := make(map[string]interface{})
	test["a"] = "1"
	test["b"] = 2
	RequestData := api.CreateRequestData(test)
	revel.INFO.Println("RequestData:%+v", RequestData)
	revel.INFO.Println("json :%#v", RequestData.ToJSON())

	return c.RenderTemplate("debug.html")
}
