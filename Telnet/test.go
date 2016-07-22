package main

import (
	"fmt"
	"time"
)

func say(s string) {
	fmt.Println(s)
}

func main() {
	go say("who are you?")
	go say("who are you?1")
	fmt.Println(2)
	var a int
	fmt.Scanf("%d", &a)
	fmt.Println(a)
	time.Sleep(1e9)
}
