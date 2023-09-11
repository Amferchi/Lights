var express = require("express")
var mongoose = require("mongoose")
var app = express()
var bodyparser = require("body-parser")
var product = require("./models/products.js");
var reviews = require("./models/reviews.js");
var session = require("express-session")
var passport = require("passport");
var middleware = require("./middleware/index.js");
var cart = require("./models/cart.js")
var items = require("./models/item.js")
var admin = require("./models/admin.js")
var category = require("./models/category.js")
const multerInstance = require('./config/multer')
var indexRoutes = require("./routes/index")
var adminRoutes = require("./routes/admin")
var authRoutes = require("./routes/auth")
var cartRoutes = require("./routes/cart")
var reviewsRoutes = require("./routes/reviews")
var productsRoutes = require("./routes/products")
var checkoutRoutes = require("./routes/checkout")
var othersRoutes = require("./routes/other")
const path = require("path");
const locals = require("./config/utils")
var flash = require("connect-flash")
require('dotenv').config();

mongoose.connect("mongodb://localhost/ringlight")
app.use(bodyparser.urlencoded({extented:true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"));
app.use(session({
        resave: false,
        saveUninitialized: true,
        secret: 'SECRET' 
      }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())
app.use(locals);
app.use(authRoutes);
app.use(adminRoutes);
app.use(productsRoutes);
app.use(cartRoutes);
app.use(indexRoutes);
app.use(checkoutRoutes); 
app.use(reviewsRoutes);
app.use(othersRoutes);
app.get("/error", function(req,res){
    res.render("error")
})
//Auth//
var user;
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  if (!(req.path === '/login' || req.path.startsWith('/auth/')) && req.session.returnTo) {
    delete req.session.returnTo;
  }
  next();
});
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


/*  Google AUTH  */
 
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL:process.env.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
      user=profile;
      return done(null, user);
  }
));

            //port//
const https = require('https');
const http = require('http');
const fs = require('fs');


// HTTP server
const httpPort = 3003;
const httpServer = http.createServer(app);

httpServer.listen(httpPort, () => {
  console.log(`HTTP server running on port ${httpPort}`);
});

/* HTTPS server
const httpsPort = 3004;
const options = {
  key: fs.readFileSync('/path/to/privkey.pem'),
  cert: fs.readFileSync('/path/to/fullchain.pem'),
};

const httpsServer = https.createServer(options, app);

httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS server running on port ${httpsPort}`);
}); */



        