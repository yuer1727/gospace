package utils

import(
    "os"
)

func OsSeparator() string{
	separator := "/"
	if os.IsPathSeparator('\\'){
		separator = "\\"
	}
	return separator
}