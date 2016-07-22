package controllers

import (
	 "github.com/revel/revel"
)
// 公用Controller, 其它Controller继承它
type BaseController struct{
	*revel.Controller
}


