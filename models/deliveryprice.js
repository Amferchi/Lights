var mongoose = require("mongoose")

 var deliverySchema = new mongoose.Schema({
    state: String,
    price:Number,
 })

 
 var delivery = mongoose.model ("delivery",deliverySchema)

 module.exports = delivery;