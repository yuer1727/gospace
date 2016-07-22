package api

import (
	"encoding/hex"
	"encoding/json"
	"github.com/revel/revel"
	"guild_website/app/utils"
	"sort"
	"time"
)

type Client struct {
	caller string
	ex     string
}

type Body struct {
	id      int64
	encrypt string
	sign    string
}

type RequestData struct {
	body   Body
	client Client
	data   map[string]interface{}
}

func CreateRequestData(data map[string]interface{}) RequestData {
	if data == nil {
		revel.WARN.Println("RequestData create data is nil !")
	}
	stringbuffer := make([]string, 10, 15)
	for k, v := range data {
		switch v.(type) {
		case string, bool:
			stringbuffer = append(stringbuffer, k)
			continue
		}
		if utils.IsNumber(v) {
			stringbuffer = append(stringbuffer, k)
			continue
		}
	}
	revel.INFO.Println("stringbuffer key:%v", stringbuffer)
	var sign string = ""
	var sortedString = ""
	if len(stringbuffer) > 0 {
		sort.Strings(stringbuffer)
		for _, k := range stringbuffer {
			sortedString = sortedString + k + "=" + utils.InterfaceToStringValue(data[k])
		}
	}
	originalStr := BizCaller + sortedString + BizSecretKey
	Md5Ctx.Write([]byte(originalStr))
	cipherStr := Md5Ctx.Sum(nil)
	sign = hex.EncodeToString(cipherStr)
	revel.INFO.Println("sign:%s", sign)
	now := time.Now().Unix() / 1000000
	return RequestData{
		body: Body{
			id:      now,
			encrypt: "md5",
			sign:    sign,
		},
		client: Client{
			caller: BizCaller,
			ex:     "",
		},
		data: data,
	}
}

func (reqdata RequestData) ToJSON() []byte {

	bodyJSON, err := json.Marshal(reqdata)
	if err != nil {
		panic(err)
	}
	return bodyJSON
}
