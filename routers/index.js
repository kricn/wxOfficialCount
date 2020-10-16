const express = require("express")
const rp = require('request-promise-native')
const Router = express.Router
const router = new Router()

const sha1 = require("sha1")
const reply = require("../reply")
const Wechat = require("../wechat/wechat.js")
const {url, appID, searchBooks, qiniuZone, searchBooksUrl} = require("../config")
const Theaters = require("../model/Theaters.js")
const Trailer = require("../model/Trailer.js")
const Danmus = require("../model/Danmus.js")

const wechatApi = new Wechat()

router.get("/search", async (req, res) => {
	//需要ticket,noncestr(随机字符串),timestamp(时间戳),url(当前服务器地址)
	const { ticket } = await wechatApi.fetchTicket()
	//生成随机字符串
	const noncestr = Math.random().toString().split(".")[1]
	const timestamp = Date.now()
	//组合
	const arr = [
		`jsapi_ticket=${ticket}`,
		`noncestr=${noncestr}`,
		`timestamp=${timestamp}`,
		`url=${url}/search`
	]

	const signature = sha1(arr.sort().join("&"))

	res.render("search", {
		appID,
		signature,
		noncestr,
		timestamp
	})
})

router.get("/theaters", async (req, res) => {
	const data = await Theaters.find({}, {
		title: 1,
		doubanId: 1,
		image: 1,
		genre: 1,
		posterKey: 1
	})
	res.render("theaters", {
		data,
		url,
		qiniuZone
	})
})

router.get("/detail/:id", async (req, res) => {
	const { id } = req.params
	if (id) {
		const data = await Theaters.findOne({doubanId: id}, {
			_id: 0,
			__v: 0,
			createTime: 0,
			doubanId: 0
		})
		res.render("detail", {
			data,
			qiniuZone
		})
	} else {
		res.send("error")
	}
})

router.get("/books/search/:q", async (req, res) => {
	const { q } = req.params
	const { voice } = req.query
	let searchBooksUrl = `${searchBooks}?q=${encodeURI(q)}`
	const data = await rp({
		method: "GET",
		url: searchBooksUrl,
		json: true
	})
	if(voice) {
		res.send(data)
		return ;
	}
	if( data.total > 0) {
		res.render("books", {
			url,
			q,
			data: data.books
		})
	} else {
		res.send("查无此书qwq..")
	}
})

router.get("/index", async (req, res) => {
	const data = await Trailer.find({}, {
		_id: 0,
		__v: 0
	})
	res.render("movie", {
		data,
		url,
		qiniuZone
	})
})

//加载弹幕路由
router.get("/v3", async (req, res) => {
	const { id } = req.query
	const data = await Danmus.find({doubanId: id})

	let resData = []

	data.forEach(item => {
		resData.push([item.time, item.type, item.color, item.author, item.text])
	})

	res.send({
		code: 0,
		data: resData
	})
})

router.post("/v3", async (req,res) => {
	const {
		player,
		author,
		time,
		text,
		color,
		type
	} = await new Promise((resolve, reject) => {
		let data = ""
		req.on("data", chunk => {
			data += chunk
		})
		req.on("end", () => {
			resolve(JSON.parse(data))
		})
		req.on("error", err => {
			reject(err)
		})
	})

	await Danmus.create({
		doubanId: player,
		author,
		time,
		text,
		color,
		type
	})
	console.log(type)
	res.send({
		code: 0,
		data: {}
	})
})



//验证服务器
//客户端 -> 微信服务器 -> 自己的服务器
router.use(reply())


module.exports = router
