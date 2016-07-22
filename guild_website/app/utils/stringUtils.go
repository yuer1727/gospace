package utils

import (
	"strings"
)
func StringIsNullOrEmpty(str string) bool{
	if str == "" {
		return true
	}
	strTrim := strings.Trim(str, " ")
    if len(strTrim)<=0{
    	return true
    }
    return false
}
