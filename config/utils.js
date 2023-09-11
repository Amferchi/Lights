const category = require("../models/category")
const cart = require("../models/cart")
const admins = require("../models/admin")

let currency = "₦"

const locals = async (req, res, next) => {
  try {
    if(req.user){
     const userCart = await cart.findOne({userID:req.user.id}).populate("items");
         res.locals.cart = userCart;
    const admin = await admins.findOne({email:req.user.emails[0].value})
    res.locals.currentAdmin = admin;
    }   
    const categories = await category.find();
    res.locals.categories = categories;
    res.locals.foundcategory = req.query.category;
    res.locals.search = req.query.search;
    res.locals.user = req.user;
    res.locals.currency = currency;
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = locals;