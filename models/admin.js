var mongoose = require("mongoose")

 var adminSchema = new mongoose.Schema({
    name: String,
    email:String,
    tag:String
 })

 
 var admin = mongoose.model ("admin",adminSchema)

 module.exports = admin;