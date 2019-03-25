<template>
  <button id="restart" @click="restart()">RESTART</button>
  <canvas id="mineMap"></canvas>
</template>
<script>
var preHandler = function (e) { e.preventDefault() }
class Mine {
    constructor (el) {
        this.totalMine = 27
        this.mineMatrix = new Array(144)
        this.invisedMatrix = new Array(144)
        this.notInversed = 144 - this.totalMine
        this.arroundNum = new Array(144)
        this.failed = false
        this.el = el
        this.canvas = document.getElementById(this.el)
        this.context = this.canvas.getContext('2d')
        this.stageInfo = this.canvas.getBoundingClientRet()
        this.x = 16
        this.y = 9
    }

    init (btn) {
        var that = this
        this.canvas.addEventListener('touchstart', function (event) {
            document.addEventListener('touchstart', preHandler, false)
            that.drawBegin(event)
        })
        this.canvas.addEventListener('touchend', function (event) {
            document.addEventListener('touchend', preHandler, false)
            that.drawEnd()
        })
        this.clear(btn)
    }

    // 重新开始游戏
    restart (n, x, y) {
        let restMine = this.totalMine
        this.notInversed = 144 - this.totalMine
        this.failed = false
        for (let i = 0; i < 144; i++) {
            this.mineMatrix[i] = 0
            this.invisedMatrix[i] = 0
            this.arroundNum[i] = 0
            // this.fill(-1, Math.floor(i / 16), i % 16)
        }
        while (restMine > 0) {
            let index = Math.floor(Math.random() * 144)
            if (this.mineMatrix[index] === 0) {
                this.mineMatrix[index] = 1
                restMine--
            }
        }
        for (let i = 0; i < 144; i++) {
            this.arroundNum[i] += i > 15 && i % 16 > 0 ? this.mineMatrix[i - 17] : 0 // 左上
            this.arroundNum[i] += i % 16 > 0 ? this.mineMatrix[i - 1] : 0 // 左
            this.arroundNum[i] += i < 128 && i % 16 > 0 ? this.mineMatrix[i + 15] : 0 // 左下
            this.arroundNum[i] += i < 128 ? this.mineMatrix[i + 16] : 0 // 下
            this.arroundNum[i] += i < 128 && i % 16 < 15 ? this.mineMatrix[i + 17] : 0 // 右下
            this.arroundNum[i] += i % 16 < 15 ? this.mineMatrix[i + 1] : 0 // 右
            this.arroundNum[i] += i > 15 && i % 16 < 15 ? this.mineMatrix[i - 15] : 0 // 右上
            this.arroundNum[i] += i > 15 ? this.mineMatrix[i - 16] : 0 // 上
        }
    }
}
export default {
    data () {}
}
</script>
