const express = require("express")
const router = require("./routers")
const db = require("./db")
const bodyParser = require("body-parser")
const Wechat = require("./wechat/wechat.js")
const menu = require("./wechat/menu.js")

const app = express()
const wechatApi = new Wechat()

app.set("views", "./views")
app.set("view engine", "ejs")

;(async () => {
	await db
	await wechatApi.createMenu(menu)
	app.use(router)
})()


app.use(bodyParser.urlencoded({ extended: false }))

app.listen(3009, () => {
	console.log("server is running...")
})
