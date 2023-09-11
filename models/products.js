var mongoose = require("mongoose")


var productSchema = new mongoose.Schema({
     name:String,
     image:String,
     image2:String,
     price:Number,
     description:String,
     specifications:[],
     Category:String,
     available:Number,
     oldPrice:Number,
     orders:{type:Number, default:0},
     revenue:{type:Number, default:0}, 
     reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "reviews"
     }]
})

var product = mongoose.model("product",productSchema)

module.exports = product;