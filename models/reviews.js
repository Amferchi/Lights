var mongoose = require("mongoose")

var reviewSchema = new mongoose.Schema({
    author:String,
    info:String,
    date: {type:Date, default: Date.now}
})

var reviews = mongoose.model("reviews",reviewSchema)
module.exports = reviews;