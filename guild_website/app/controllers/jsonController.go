package controllers

import(
    "fmt"
    "github.com/revel/revel"
    "encoding/json"
)

type JsonTest struct{
	BaseController 
}

func (c JsonTest) JsonTester() revel.Result{
	  j1 := make(map[string]interface{})
	  j1["name"] = "xxx"
	  j1["url"] = "www.uc.cn"
	  js1,err := json.Marshal(j1)
      if err != nil {
      	 panic(err)
      }

      println(string(js1))
      // json decode
      j2 := make(map[string]interface{})
      err = json.Unmarshal(js1, &j2)
      if err != nil {
        panic(err)
      }
      fmt.Printf("%#v\n", j2)

	  return c.RenderTemplate("debug.html")
}