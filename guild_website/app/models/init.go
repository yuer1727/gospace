package models

import(
      "github.com/go-xorm/xorm"
      "github.com/revel/revel"
      "guild_website/app/utils"
      "github.com/revel/config"
      "fmt"
      _ "github.com/go-sql-driver/mysql"
)

var DB *xorm.Engine

func init() {
	revel.OnAppStart(InitDB)
}

func InitDB(){
       separator := utils.OsSeparator() 
       config_file:=revel.BasePath + separator + "conf" + separator + "databases.conf"

       c, _ := config.ReadDefault(config_file)

      	guildcore_driver, _ := c.String("database", "db.guild_core.driver")
		guildcore_dbname, _ := c.String("database", "db.guild_core.dbname")
		guildcore_user, _ := c.String("database", "db.guild_core.user")
		guildcore_password, _ := c.String("database", "db.guild_core.password")
		guildcore_host, _ := c.String("database", "db.guild_core.host")

		var err error
		DB ,err = xorm.NewEngine(guildcore_driver,fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8", guildcore_user, guildcore_password, guildcore_host, guildcore_dbname))
	    if err != nil{
	    	revel.WARN.Printf("DB 错误：%v",err)
	    }	
}