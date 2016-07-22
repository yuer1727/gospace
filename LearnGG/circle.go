package main

import (
	"github.com/fogleman/gg"
)

func main() {

	const W = 1024

	dc := gg.NewContext(W, W)
	dc.SetRGB(0, 0, 0)
	dc.DrawCircle(500, 500, 100)
	dc.Stroke()
	dc.SavePNG("circle.png")
}
