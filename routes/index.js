var express = require("express")
var router = express.Router()
var product = require("../models/products.js");
var reviews = require("../models/reviews.js");
var passport = require("passport");
var middleware = require("../middleware/index.js");
var cart = require("../models/cart.js")
var items = require("../models/item.js")
var admin = require("../models/admin.js")
var Category = require("../models/category.js")
const path = require("path");
const locals = require("../config/utils")

        //regex//
  function escapeRegex(text) {
       return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&" );
     };

router.get("/",function(req,res){
   Category.find().sort({"_id":-1}).exec(function(err,category){
      if(err){
         console.log(err)
      }
      else{  
            //category
    var querycat = req.query.category 
   if(req.query.category){
    product.find({Category: querycat}).sort({"_id": -1}).exec(function(err,product){
       if(err){console.log(err)}
       else{res.render("index", {products:product, category:category})}
          })}

   else{
          //search
   if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search) , "gi")
        product.find({name: regex}).sort({"_id": -1}).exec(function(err, product){
        if(err){console.log("OH no error")}
        else{
             res.render("index" , {products:product ,category:category});}
         })}
   else{
    product.find().sort({"_id": -1}).limit(50).exec(function(err,product){
         if(err){console.log(err)}
         else{ 
            res.render("index", {products:product, category:category})}
        })}
       }}})})
module.exports = router;