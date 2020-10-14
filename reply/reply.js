const rp = require('request-promise-native')

const Theaters = require("../model/Theaters.js")
const {url, searchBooks, qiniuZone} = require("../config")

module.exports = async message => {

	//回复消息模板的options
	let options = {
		toUserName: message.FromUserName,
		fromUserName: message.ToUserName,
		createTime: Date.now(),
		msgId: message.MsgId,
		msgType: "text"
	}

	let content = "无法识别！"
	if (message.MsgType === 'text') {
		if (message.Content === "热门"){
			const data = await Theaters.find({}, {
				title: 1,
				summary: 1,
				image: 1,
				doubanId: 1,
				_id: 0
			})
			content = []
			options.msgType = "news"
			content.push({
				title: "热门电影推荐",
				description: "你的下一部电影在这里~",
				picUrl: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3436880746,4066276417&fm=26&gp=0.jpg",
				url: `${url}/theaters`
			})
		} else if (message.Content === "首页") {
			options.msgType = "news"
			content = [{
				title: "预告片首页，冲！！",
				description: "最新预先片",
				picUrl: "https://i0.hdslb.com/bfs/live/new_room_cover/efce8e6292e167c31eafd510de2b4885113fe7a8.jpg@206w_116h_1c_100q.webp",
				url: `${url}/index`
			}]
		} else {
			console.log(searchBooks)
			let searchBooksUrl = `${searchBooks}?q=${encodeURI(message.Content)}`
			const data = await rp({
				method: "GET",
				url: searchBooksUrl,
				json: true
			})
			if (data.total > 0) {
				content = []
				options.msgType = "news"
				content.push({
					title: `你想看的书在这里--${message.Content}`,
					description: "奇文共欣赏，疑义相与析~",
					picUrl: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2307330537,391149472&fm=26&gp=0.jpg",
					url: `${url}/books/search/${message.Content}`
				})
			} else {
				content = "暂时没有该书目，查询失败qwq"
			}
		}
	} else if (message.MsgType === "voice") {
			options.msgType = "news"
			options.mediaId = message.MediaId
			recognition = message.Recognition.slice(0, -1)
			let queryUrl = `${searchBooks}?q=${encodeURI(recognition)}`
			const data = await rp({
				method: "GET",
				url: queryUrl,
				json: true
			})
			if (data.total > 0) {
				content = []
				options.msgType = "news"
				content.push({
					title: `你想看的书在这里--${recognition}`,
					description: "奇文共欣赏，疑义相与析~",
					picUrl: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2307330537,391149472&fm=26&gp=0.jpg",
					url: `${url}/books/search/${recognition}`
				})
			} else {
				content = "暂时没有该书目，查询失败qwq"
			}
	} else if (message.MsgType === "event") {
		if (message.Event === "subscribe") {
			content = "welcome~ \n" +
				"回复 首页 可以查看电影预告 \n" +
				"回复 热门 可以查看热门电影 \n" +
				"回复 文本 可以查看指定的书目信息 \n" +
				"回复 语音 可以查看指定的书目信息 \n" +
				"点击下面菜单按钮，了解更多🎥"
		} else if (message.Event === "unsubscribe") {
			console.log("取关取关...")
		} else if (message.Event === "CLICK") {
			if(message.EventKey === "help") {
				content = "你可以进行以下操作~ \n" +
				"回复 首页 可以查看电影预告 \n" +
				"回复 热门 可以查看热门电影 \n" +
				"回复 文本 可以查看指定的电影信息 \n" +
				"回复 语音 可以查看指定的电影信息 \n"
			} else {
				content = `你点击了按钮： ${message.EventKey}`
			}
		}
	}

	options.content = content;

	return options

}

