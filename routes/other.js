var express = require("express")
var router = express.Router()
var product = require("../models/products.js");
var middleware = require("../middleware/index.js");
var cart = require("../models/cart.js")
var items = require("../models/item.js")
var category = require("../models/category.js")
const multerInstance = require('../config/multer.js')
const path = require("path");
const order = require("../models/orders.js");

router.get("/contact", function(req,res){
    res.render("contact")
  })

router.get("/About-Us", function(req,res){
    res.render("About")
  })

  router.get("/privacy-policy", function(req,res){
    res.render("policy")
  })

  module.exports = router;