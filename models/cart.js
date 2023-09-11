var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({

    sum : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "sum"
        
    }],

    userID:String,
    
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "item"
    }], 
    
    username:String,

    subTotal: {
        default: 0,
        type: Number
    }
}, {
    timestamps: true
})
var cart = mongoose.model('cart', CartSchema);
module.exports = cart;