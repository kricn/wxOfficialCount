const { parseString } = require("xml2js")
const fs = require("fs")
const path = require("path")

module.exports = {
	getUserDataAsync (req) {
		return new Promise ((resolve, reject) => {
			let xmlData = ""
			req.on("data", data => {
				xmlData += data.toString()
			}).on("end", () => {
				resolve(xmlData)
			})
		})
	},

	parseXMLAsync (xmlData) {
		return new Promise ((resolve, reject) => {
			parseString(xmlData, {trim: true}, (err, data) => {
				if (!err) {
					resolve(data)
				} else {
					reject("parseXml fail" + err)
				}
			})
		})
	},

	formatMessage (jsonData) {
		let message = {}
		jsonData = jsonData.xml
		if (typeof jsonData === "object") {
			for (let key in jsonData) {
				let value = jsonData[key]
				if (Array.isArray(value) && value.length > 0) {
					message[key] = value[0]
				}
			}
		}
		return message
	},

	writeFileAsync (data, filename) {
		data = JSON.stringify(data)
		filename = path.resolve(__dirname, filename)
		return new Promise ((resolve, reject) => {
			fs.writeFile(filename, data, err => {
				if(!err){
					console.log("文件保存成功。")
					resolve()
				} else {
					console.log("文件保存失败。")
					reject("saveTicket fail" + err)
				}
			})
		})
	},

	readFileAsync (filename) {
		filename = path.resolve(__dirname, filename)
		return new Promise ((resolve, reject) => {
			fs.readFile(filename, (err, data) => {
				if(!err){
					resolve(JSON.parse(data))
				} else {
					reject("readFile fail."+err)
				}
			})
		})
	}
}