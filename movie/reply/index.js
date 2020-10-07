const sha1 = require("sha1")
const config = require("../config")
const tool = require("../utils/tool.js")
const template = require("./template.js")
const reply = require("./reply.js")

module.exports = () => {
	return async (req, res) => {
		const {signature, echostr, timestamp, nonce} = req.query
		//微信签名需要的三个参数
		//timestamp, nonce, config.token
		//先进行字典序排序
		//将排好序的数组拼接成字符串然后进行sha1加密
		const sha1Str = sha1([timestamp, nonce, config.token].sort().join(""))
		if(req.method === "GET" && signature) {
			//验证与服务器返回的前面是否一致
			if(sha1Str === signature) {
				console.log("配置成功")
				res.send(echostr)
			}else{
				console.log("配置失败")
				res.send("error")
			}
		} else if (req.method === "POST") {
			if(sha1Str !== signature) {
				res.send("error")
			}

			const xmlData = await tool.getUserDataAsync(req)

			const jsonData = await tool.parseXMLAsync(xmlData)

			const message = await tool.formatMessage(jsonData)
			
			const options = await reply(message)
			//回复用户的消息
			let replyMessage = template(options)
			
			//返回响应
			res.send(replyMessage)
		} else {
			res.send("error")
		}
	}
}