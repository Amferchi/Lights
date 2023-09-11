var mongoose = require("mongoose")

var ticketSchema = new mongoose.Schema({
    sender:String,
    email:String,
    subject:String,
    text:String,
    refId:String,
    status:{type:String, default:"pending"},
    date: {type:Date, default: Date.now}
})

var tickets = mongoose.model("tickets",ticketSchema)
module.exports = tickets;