var mongoose = require("mongoose")


var payaccSchema = new mongoose.Schema({
     name:String,
     bank:String,
     accNum:Number,
     tag:{type:String, default:"saved"}
})

var payacc = mongoose.model("payacc",payaccSchema)

module.exports = payacc;