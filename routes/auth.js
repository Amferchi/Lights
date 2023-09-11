var express = require("express")
var router = express.Router()
var passport = require("passport");
var middleware = require("../middleware/index.js");
var cart = require("../models/cart.js")
var admin = require("../models/admin.js")
const path = require("path");
const locals = require("../config/utils")

var returnTo;

 router.get("/login" , function(req,res){
  if(req.user){
      req.flash("error","Already Logged in")
      res.redirect("/")
  }
  else{
   returnTo = req.session.returnTo;
   delete req.session.returnTo;
   res.render('login')
  }
   })

router.get("/logout", function(req,res){
     req.logout(function(err){
        if(err){
         req.flash("error","error logging out")
         res.redirect("back")}
        else{
         res.redirect('/');
         if (req.session.returnTo) {
           delete req.session.returnTo
         }}
     })
   })


router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

router.get('/auth/google/callback', 
 passport.authenticate('google', { failureRedirect: '/error' }), locals,
 function(req, res) {
   cart.findOne({ userID: req.user.id }, function(err, foundcart) {
     if (err) {
       console.log(err);
       return res.redirect('/error');
     }

     if (!foundcart) {
       cart.create({ userID: req.user.id, username: req.user.displayName }, function(err) {
         if (err) {
           console.log(err);
           return res.redirect('/error');
         }
       });
     }
   });
   res.redirect("/auth/verify")
});

router.get("/auth/verify",(req,res)=>{
  if (returnTo && returnTo.method === 'POST') {
    return res.redirect("/")
} else {
   // Default to GET if the method is not POST
   if(returnTo){
    res.redirect(returnTo.url);
   }
   return res.redirect("/")
}

})

module.exports = router;