
package main

import (
	"fmt"
)

func main() {

	var ff int= 0
	var  ptr *int= &ff
	fmt.Println("address=%d",ptr)
	*ptr++
	fmt.Println("address=%d",ptr)
}