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
const locals = require("../config/utils.js")


 router.get("/products/:id",middleware.isValidObjectId, function(req,res){
       product.findById(req.params.id).populate("reviews").exec(function(err,theproduct){
       if(err){console.log(err) }
        else if(!theproduct){
          res.render("error")}
     else{
        var Pcategory = theproduct.Category;
       product.find({ Category: Pcategory}, function(err, simiproducts){
    if(err){console.log(err)}
       else{res.render("detail",{product:theproduct , simiproducts: simiproducts})}  
     })         
        }})
    })

router.get("/product/:id/checkout",middleware.isValidObjectId,middleware.isLoggedin,function(req,res){
      product.findById(req.params.id,function(err,product){
        if(err){
           console.log(err)
        }
        else if(!product){
         res.render("error")}
           else{
                res.render("onecheckout", {product:product})
           }
        })
     })
     
module.exports = router;