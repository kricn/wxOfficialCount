
//将数据库的图片上传到七牛云
const Theaters = require("../../model/Theaters.js")
const upload = require("./upload")
const {nanoid} = require("nanoid")
module.exports = async () => {

	const movies = await Theaters.find({
		$or: [
			{posterKey: ""},
			{posterKey: null},
			{posterKey: {$exists: false}}
		]
	})

	console.log(movies)

	for (let i=0; i<movies.length; i++) {
		let movie = movies[i]
		let url = movie.image
		let key = `${nanoid(10)}.${url.split(".").slice(-1).join("")}`
		//上传
		await upload(url, key)

		movie.posterKey = key

		await movie.save()

	}
}
