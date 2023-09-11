const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var itemSchema = new Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },

    name:String,
    cartId:String,
    image:String,
    available:Number,

    quantity: {
        type: Number,
        min: [1, 'Quantity can not be less then 1.']
    },
    price: {
        type: Number,
        required: true
    },
    userID:String,

    username:String,
    
  total: {
    default: 0,
    type: Number
 }
}, {
    timestamps: true
})

var item = mongoose.model("item", itemSchema)
module.exports = item; 