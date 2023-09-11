  //middleware
  const mongoose = require('mongoose');
  var admin = require("../models/admin.js")

  var middlewareObj = {};
 
  middlewareObj.isLoggedin = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.returnTo = {
       url:req.originalUrl  || '/',
       method:req.method,
      };
    req.flash("error","Please sign in to be able to add products to your cart, save items , checkout and much more.")
    res.redirect('/login');
};


 middlewareObj.admin = function(req, res , next){
    if(req.isAuthenticated()){
      var adminEmail = req.user.emails[0].value
  return admin.findOne({ email: adminEmail}, function( err, admin){

      if(!admin){
        console.log(admin + "notfound")
        res.render("error")
      }
      else if(err){
        console.log(err)
      }
    else{
      console.log(admin + "found")
        next()
    }
  })
}
 res.render("error")
}

middlewareObj.isValidObjectId = (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.render("error");
  }

  next();
};

 module.exports = middlewareObj;