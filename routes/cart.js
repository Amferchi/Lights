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
const flash = require("connect-flash")
  
router.get("/cart", function(req,res){
    if(req.user){  
     cart.findOne({userID:req.user.id}).populate("items").exec(function(err,cart){
        if(err){console.log(err)}
        else{ 
         res.render("cart", {cart:cart})}    
               })}
    else{res.render("cart")}
             })

router.post("/cart/:id",middleware.isValidObjectId, middleware.isLoggedin, function(req,res){
    product.findById(req.params.id,function(err,product){
      if(err){console.log(err)}
         else if(!product){
          res.redirect("/error")}
        else{
          if(product.available < 1){
             req.flash("error", "Product is currently out of stock")
             res.redirect("back")
          }
          else{
      var price = Number.parseInt(product.price)
    items.create({
                productID: product._id,
                name: product.name,
                image: product.image,
                quantity:req.body.quantity,
                price: price,
                userID:req.user.id,
                available:product.available

            }, function(err,item){
                if(err){console.log(err)}
                else{
        var quantity = Number.parseInt(req.body.quantity)
            if(quantity > 0){
            item.quantity = quantity;
         item.total = Number.parseInt(product.price * quantity)   
        }
        else{
            item.quantity = 1;
            item.total = product.price * 1;
        }
     
 cart.findOne({userID:req.user.id} , function(err,cart){
         if(err){console.log(err)}
            else{
        item.cartId = cart._id
        item.save();
        cart.items.push(item);
        cart.save();
        req.flash("success", "Product added to cart successfully")
        res.redirect("back")        
     }})
     }})
    }
     }})
      })
    
 router.post("/cart/:id/delete",middleware.isValidObjectId, function(req,res){
     items.findByIdAndRemove(req.params.id, function(err){
         if(err){console.log(err)}
         else{
            req.flash("success", "Item successfully removed from cart")
            res.redirect("/cart")}
     })
  })
      
 router.post("/cart/:id/edit",middleware.isValidObjectId,function(req,res){
    items.findById(req.params.id,function(err,item){
      if(err){console.log(err)}
      else if(!item){
        res.redirect("/error")}
        else{
     if(req.body.quantity < 1){
        req.flash("error", "Quantity cannot be less than One")
        res.redirect("back")
     }
     else if(req.body.quantity > item.available){
      req.flash("error", "Only" + " " + item.available + " " + "pieces of this product is available")
      res.redirect("back")
     }
     else{
      item.quantity = req.body.quantity;
     item.total = Number.parseInt(item.price * req.body.quantity)
     item.save()
    req.flash("success", "Item has been updated")  
    res.redirect("/cart")
     }
     }
       })
        })

module.exports = router;