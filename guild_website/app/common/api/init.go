package api

import (
	"crypto/md5"
	"github.com/revel/config"
	"github.com/revel/revel"
	"guild_website/app/utils"
	"hash"
)

const (
	USERAGENT       = "my awsome httpclient"
	TIMEOUT         = 30
	CONNECT_TIMEOUT = 5
)

var (
	BizAddress   string
	BizCaller    string
	BizSecretKey string
	Md5Ctx       hash.Hash
)

func init() {
	revel.OnAppStart(InitBizService)
}

func InitBizService() {
	separator := utils.OsSeparator()
	config_file := revel.BasePath + separator + "conf" + separator + "api.conf"

	c, _ := config.ReadDefault(config_file)

	/*
	   bizService.addr=127.0.0.1:9151
	   bizService.caller=guild.website
	   bizService.secretkey=04ab5c51ew81c353g4dc2y0d2f6x51ma
	*/

	bizService_addr, _ := c.String("api", "bizService.addr")
	bizService_caller, _ := c.String("api", "bizService.caller")
	bizService_secretkey, _ := c.String("api", "db.guild_core.user")

	BizAddress = "http://" + bizService_addr
	BizCaller = bizService_caller
	BizSecretKey = bizService_secretkey

	Md5Ctx = md5.New()

}
