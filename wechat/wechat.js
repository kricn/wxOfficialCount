//读取本地文件(readAccessToken)
//本地有文件，判断其是否过期(isValidAccessToken)
//过期了重新获取getAccessToken
//若本地没有文件，获取access_token(getAccessToken)

const fs = require("fs")
const rp = require('request-promise-native')

const {appID, appsecret} = require("../config")
const menu = require("./menu.js")
const api = require("../utils/api.js")
const tool = require("../utils/tool.js")


class Wechat {
	constructor() {

	}

	//请求access_token
	getAccessToken () {
		//获取access_token的地址
		const url = `${api.accessToken}&appid=${appID}&secret=${appsecret}`
		
		return new Promise ((resolve, reject) => {
			rp({
				method: "GET",
				url,
				json: true
			}).then(res => {
				//设置access_token的过期时间
				res.expires_in = Date.now() + (res.expires_in - 5 * 60) * 1000
				resolve(res)
			}).catch(err => {
				console.log(err)
				reject('getAccessToken fail' + err)
			})
		})
	}

	//保存access_token
	saveAccessToken (token) {
		return tool.writeFileAsync(token, './accessToken.txt')
	}

	//读取access_token
	readAccessToken () {
		return tool.readFileAsync('accessToken.txt')
	}

	//判断access_token是否有效
	isValidAccessToken (data) {
		if(!data && data.accessToken && !data.expires_in) {
			return false
		}
		//判断有效期
		return data.expires_in > Date.now()?true:false
	}

	//获取asscess_token
	fetchAccessToken () {
		if(this.access_token && this.expires_in && this.isValidAccessToken(this)){
			return Promise.resolve({
				access_token: this.access_token,
				expires_in: this.expires_in
			})
		}

		return this.readAccessToken().then(async res => {
			if(this.isValidAccessToken(res)){
				return Promise.resolve(res)
			}else{
				const res = await this.getAccessToken()
				await this.saveAccessToken(res)
				return Promise.resolve(res)
			}
		}).catch(async err => {
			const res = await this.getAccessToken()
			await this.saveAccessToken(res)
			return Promise.resolve(res)
		}).then(res => {
			this.access_token = res.access_token
			this.expires_in = res.expires_in
			return Promise.resolve(res)
		})
	}

	createMenu (menu) {
		return new Promise (async (resolve, reject) => {
			try{
				const data = await this.fetchAccessToken()
				const url =  `${api.menu.create}?access_token=${data.access_token}`
				const result = await rp({
					method: "POST",
					url,
					json: true,
					body: menu
				})
				resolve(result)
			}catch (err) {
				reject("createMenu"+err)
			}
		})
	}

	deleteMenu () {
		return new Promise (async (resolve, reject) => {
			try{
				const data = await this.fetchAccessToken()
				const url = `${api.menu.delete}?access_token=${data.access_token}`
				const result = await rp({
					method: "GET",
					url,
					json: true
				})
				resolve(result)
			}catch (err) {
				reject("deleteMenu"+err)
			}
		})
	}

	//请求ticket
	async getTicket () {
		const data = await this.fetchAccessToken()
		//获取access_token的地址
		const url = `${api.ticket}&access_token=${data.access_token}`
		
		return new Promise ((resolve, reject) => {
			rp({
				method: "GET",
				url,
				json: true
			}).then(res => {
				resolve({
					ticket: res.ticket,
					expires_in: Date.now() + (res.expires_in - 5 * 60) * 1000
				})
			}).catch(err => {
				console.log(err)
				reject('getTicket fail' + err)
			})
		})
	}

	//保存access_token
	saveTicket (ticket) {
		return tool.writeFileAsync(ticket, './ticket.txt')
	}

	//读取access_token
	readTicket () {
		return tool.readFileAsync('ticket.txt')
	}

	//判断access_token是否有效
	isValidTicket (data) {
		if(!data && data.ticket && !data.expires_in) {
			return false
		}
		//判断有效期
		return data.expires_in > Date.now()?true:false
	}

	fetchTicket () {
		if(this.ticket && this.ticket_expires_in && this.isValidTicket(this)){
			return Promise.resolve({
				ticket: this.ticket,
				expires_in: this.ticket_expires_in
			})
		}

		return this.readTicket().then(async res => {
			if(this.isValidTicket(res)){
				return Promise.resolve(res)
			}else{
				const res = await this.getTicket()
				await this.saveTicket(res)
				return Promise.resolve(res)
			}
		}).catch(async err => {
			const res = await this.getTicket()
			await this.saveTicket(res)
			return Promise.resolve(res)
		}).then(res => {
			this.ticket = res.ticket
			this.ticket_expires_in = res.expires_in
			return Promise.resolve(res)
		})
	}
}

//模拟测试
// (async () => {
// 	const wechat = new Wechat()
// 	let res = await wechat.deleteMenu()
// 	console.log(res)
// 	res = await wechat.createMenu(menu)
// 	console.log(res)

// 	const data = await wechat.fetchTicket()
// 	console.log(data)
// })()

 module.exports = Wechat
