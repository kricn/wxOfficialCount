const db = require("../db")
const theatersCrawler = require("./crawler/theatersCrawler.js");
const saveTheaters = require("./save/saveTheaters.js")
const qiniuUpload = require("./qiniu")

;(async () => {
	await db
	// const data = await theatersCrawler()
	// await saveTheaters(data)
	await qiniuUpload()
	console.log("end")
})()