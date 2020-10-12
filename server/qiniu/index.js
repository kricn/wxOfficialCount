
//将数据库的图片上传到七牛云
const Theaters = require("../../model/Theaters.js")
const upload = require("./upload")
const {nanoid} = require("nanoid")
module.exports = async (key, Model) => {

	const movies = await Model.find({
		$or: [
			{[key]: ""},
			{[key]: null},
			{[key]: {$exists: false}}
		]
	})

	for (let i=0; i<movies.length; i++) {
		let movie = movies[i]
		let url = movie.image
		let filename = ".jpg"
		if (key == "coverKey") {
			url = movie.cover
		} else if (key == "videoKey"){
			url = movie.link
			filename=".mp4"
		}
		let qiniuKey = ""
		if (url) {
			qiniuKey = `${nanoid(10)}${filename}`
		}
		//上传
		if (qiniuKey) {
			await upload(url, qiniuKey)

			movie[key] = qiniuKey
		}

		await movie.save()

	}
}
