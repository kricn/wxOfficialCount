const mongoose = require("mongoose")

const Schema = mongoose.Schema

//创建约束对象
const DanmusSchema = new Schema({
	doubanId: String,
    author: String,
    time: Number,
    text: String,
    color: String,
    type: String
})

//创建模型对象
const Danmus = mongoose.model("danmus", DanmusSchema)

module.exports = Danmus