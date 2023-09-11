var express = require("express")
var router = express.Router()
var product = require("../models/products.js");
var reviews = require("../models/reviews.js");
var passport = require("passport");
var middleware = require("../middleware/index.js");
var cart = require("../models/cart.js")
var items = require("../models/item.js")
var admin = require("../models/admin.js")
var category = require("../models/category.js")
const multerInstance = require('../config/multer')
const path = require("path");
const orders = require("../models/orders.js");
var tickets =require("../models/ticket")
    
         //reviews//

 router.get("/review/:order_id",middleware.isLoggedin,function(req,res){
   orders.findOne({orderID:req.params.order_id}, function(err,order){
      if(err){console.log(err)}
      else if(!order){
        res.render("error")
      }
      else{
         if(order.userId !== req.user.id){
            res.render("error")
         }
         else{
     res.render("review",{order:order})
         }
      }
    })
   })


 router.post("/products/:id/reviews/:order_id",middleware.isValidObjectId,middleware.isLoggedin,function(req,res){
   orders.findOne({orderId:req.params.order_id}, function(err,order){
      if(err){console.log(err)}
      else if(!order){
         res.render("error")
      }
      else{
         if(order.userId !== req.user.id){
            res.render("error")
         }
         else{
       product.findById(req.params.id,function(err,product){
        if(err){console.log(err)}
        else if (!product){ 
         res.render("error")}
        else{
       reviews.create(req.body.review, function(err,review){
         if(err){console.log(err)}
     else{
         product.reviews.push(review)
         product.save()
         req.flash("success", "review submitted successfully");
         res.redirect("/products/" + product._id)
          }
            })  
         }})
       }}
      })
   })
                //Tickets
router.post("/support/ticket/new", (req,res)=>{
   tickets.create(req.body.ticket,(err,ticket)=>{
        if(err){console.log(err)}
        else{
         const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
         const random = Math.floor(Math.random() * letters.length)
         const alpha = letters[random]
         const num1 = Math.floor(Math.random() * 300 )
         const num2 = Math.floor(Math.random() * 779 )
         const num3 = Math.floor(Math.random() * 675 )
         ticket.refId = num1+num2+num2+alpha;
         ticket.save(
         req.flash("success", "ticket has been created successfully"),
         res.redirect("/ticket/created/" + ticket._id)
         )}
         
   })
})

router.get("/ticket/created/:id",middleware.isValidObjectId,(req,res)=>{
   tickets.findById(req.params.id,(err,ticket)=>{
      if(err){console.log(err)}
      else if(!ticket){
         res.render("error")}
      else{res.render("ticket-created", {ticket:ticket})}
   })

})
module.exports = router;