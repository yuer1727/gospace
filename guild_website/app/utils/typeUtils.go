package utils

import (
	"fmt"
	"github.com/revel/revel"
)

func IsNumber(value interface{}) bool {
	if value == nil {
		revel.WARN.Println("IsNumber value is nil!")
		return false
	}
	switch value.(type) {

	case int, int8, int16, int32, int64, uint8, uint16, uint32, uint64, float32, float64:
		return true
	default:
		return false

	}

}

func InterfaceToStringValue(value interface{}) string {
	var valueStr string = ""
	switch value.(type) {
	case string:
		valueStr = value.(string)
	case int32:
		valueStr = fmt.Sprintf("%d", value.(int32))
	case int:
		valueStr = fmt.Sprintf("%d", value.(int))
	case int8:
		valueStr = fmt.Sprintf("%d", value.(int8))
	case int16:
		valueStr = fmt.Sprintf("%d", value.(int16))
	case int64:
		valueStr = fmt.Sprintf("%d", value.(uint8))
	case uint8:
		valueStr = fmt.Sprintf("%d", value.(uint8))
	case uint16:
		valueStr = fmt.Sprintf("%d", value.(uint16))
	case uint32:
		valueStr = fmt.Sprintf("%d", value.(uint32))
	case uint64:
		valueStr = fmt.Sprintf("%d", value.(uint64))
	case float32:
		valueStr = fmt.Sprintf("%f", value.(float32))
	case float64:
		valueStr = fmt.Sprintf("%f", value.(float64))
	}
	return valueStr
}
