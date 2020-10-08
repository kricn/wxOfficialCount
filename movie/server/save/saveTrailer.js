const Trailer = require("../../model/Trailer.js")

module.exports = async data => {

	for (let i=0; i<data.length; i++) {
		let item = data[i]
		try {
			await Trailer.create({
				title: item.title,
				rating: item.rating,
				runtime: item.runtime,
				directors: item.directors,
				casts: item.casts,
                image: item.image,
                cover: item.cover,
				doubanId: item.doubanId,
				genre: item.genre,
				summary: item.summary,
                releaseDate: item.releaseDate,
                link: item.link
			})
		} catch(err) {
            console.log(`第${i+1}条数据保存失败..` + err)
		}
	}
	console.log("data saved!")
}
