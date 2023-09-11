var mongoose = require("mongoose")

 var categorySchema = new mongoose.Schema({
    name: String,
    image: String
 })

 
 var category = mongoose.model ("category",categorySchema)

 module.exports = category;