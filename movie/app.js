const express = require("express")
const router = require("./routers")
const db = require("./db")

const app = express()

app.set("views", "./views")
app.set("view engine", "ejs")

;(async () => {
	await db
	app.use(router)
})()

app.listen(3009, () => {
	console.log("server is running...")
})
