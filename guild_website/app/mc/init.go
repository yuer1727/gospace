package mc

import(
    "github.com/bradfitz/gomemcache/memcache"
    "github.com/revel/revel"
)

var Mem *memcache.Client 

func init() {
	revel.OnAppStart(InitMC)
}

func InitMC(){
       Mem = memcache.New("100.84.72.98:12000")
}