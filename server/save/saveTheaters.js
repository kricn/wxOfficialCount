const Theaters = require("../../model/Theaters.js")

module.exports = async data => {

	for (let i=0; i<data.length; i++) {
		let item = data[i]
		try {
			await Theaters.create({
				title: item.title,
				rating: item.rating,
				runtime: item.runtime,
				directors: item.directors,
				casts: item.casts,
				image: item.image,
				doubanId: item.doubanId,
				genre: item.genre,
				summary: item.summary,
				releaseDate: item.releaseDate,
			})
		} catch(err) {
			console.log(`第${i+1}条数据保存失败..`)
		}
	}
	console.log("data saved!")
}
