const db = require("../db")
const theatersCrawler = require("./crawler/theatersCrawler.js");
const trailerCrawler = require("./crawler/trailerCrawler.js");
const saveTheaters = require("./save/saveTheaters.js")
const qiniuUpload = require("./qiniu")

;(async () => {
	// await db
	// const data = await theatersCrawler()
	const data = await trailerCrawler()
	console.log(data)
	// await saveTheaters(data)
	// await qiniuUpload()
	console.log("end")
})()