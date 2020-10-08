const mongoose = require("mongoose")

const Schema = mongoose.Schema

//创建约束对象
const trailerSchema = new Schema({
	title: String,
	rating: Number,
	runtime: String,
	directors: [String],
	casts: [String],
    image: String,
    cover: String,
	doubanId: {
		type: Number,
		unique: true
	},
	genre: [String],
	summary: String,
    releaseDate: [String],
    link: String,
    posterKey: String,      //图片上传七牛云返回的key值
    coverKey: String,
    videoKey: String,
	createTime: {
		type: Date,
		default: Date.now()
	}
})

//创建模型对象
const Trailer = mongoose.model("trailer", trailerSchema)

module.exports = Trailer