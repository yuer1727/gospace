package controllers

import (
	 "github.com/revel/revel"
	 "github.com/bradfitz/gomemcache/memcache"
	 "fmt"
	 "guild_website/app/mc"
)
// 测试httpclient

type MemC struct{
	BaseController 
}


func (c MemC) Conn() revel.Result{

	mc.Mem.Set(&memcache.Item{Key: "foo", Value: []byte("my value")})

    it, _ := mc.Mem.Get("foo")
    fmt.Printf("%s,%s",it.Key,it.Value)
    	
	return c.RenderTemplate("debug.html")
}
