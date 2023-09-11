var mongoose = require("mongoose");


var orderSchema = new mongoose.Schema({
    orderID:String,
    cart:[],
    cartId:String,
    receipt:String,  
    amount:{type:Number,default:0},
    productName:String,
    accNum:String,
    mobile:Number,
    email:String,
    productId:String,
    firstName:String,
    lastName:String,
    state:String,
    method:String,
    city:String,
    address:String,
    status:{type:String, default:"In-progress"},
    quantity:{type:Number},
    delivery:Number,
    userId:{type:String, required:true},
    date:{type:Date, default:Date.now}
})

module.exports = mongoose.model("orders", orderSchema)