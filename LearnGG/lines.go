package main

import (
	"github.com/fogleman/gg"
	"math/rand"
)

func main() {

	const W = 1024
	const H = 1024
	dc := gg.NewContext(W, H) //上下文，含长和宽
	dc.SetRGB(0, 0, 0)        //设置当前色
	dc.Clear()                //清理一下上下文，下面开始画画

	for i := 0; i < 1000; i++ { //画1000 条线，随机位置，长度，颜色和透明度
		x1 := rand.Float64() * W
		y1 := rand.Float64() * H
		x2 := rand.Float64() * W
		y2 := rand.Float64() * H

		r := rand.Float64()
		g := rand.Float64()
		b := rand.Float64()
		a := rand.Float64()*0.5 + 0.5
		w := rand.Float64()*4 + 1
		dc.SetRGBA(r, g, b, a)
		dc.SetLineWidth(w)
		dc.DrawLine(x1, y1, x2, y2) //画线
		dc.Stroke()                 //没有这句是不会把线最终画出来的
	}
	dc.SavePNG("lines.png") //保存上下文为一张图片
}
