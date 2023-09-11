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
var flash = require("connect-flash")
const nodemailer = require('nodemailer');
const payacc = require("../models/payacc.js");
require("dotenv").config()
var EMAIL_USER=process.env.email_user;
var EMAIL_PASSWORD=process.env.email_password;
const deliveries = require("../models/deliveryprice.js");

const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 587,
    secure:false, 
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD
    }
 });

 router.get("/checkout",middleware.isLoggedin,function(req,res){
    cart.findOne({userID:req.user.id}).populate("items").exec(function(err,cart){
      if(err){console.log(err)}
      else{
    res.render("checkout", {cart:cart})
      }
    })
   })

router.post("/confirm-order/:id",middleware.isValidObjectId,middleware.isLoggedin,function(req,res){ 
   product.findById(req.params.id, function(err,product){
      if(err){console.log(err)}
      else if(!product){
         res.redirect("/error")}
      else{
         //transaction ID//
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const random = Math.floor(Math.random() * letters.length)
const random2 = Math.floor(Math.random() * letters.length)
const alpha = letters[random]
const apha2 = letters[random2]
const num1 = Math.floor(Math.random() * 300 )
const num2 = Math.floor(Math.random() * 675 )
const transId = "OID"+num1+num2+apha2+alpha;
  order.create({
      orderID:transId,
      amount:product.price,
      quantity:1,
      productId:product._id,
      productName:product.name,
      mobile:req.body.mobile,
      email:req.body.email,
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      state:req.body.state,
      method:req.body.method,
      city:req.body.city,
      address:req.body.address,
      userId:req.user.id
   }, function(err,order){
      if(err){console.log(err)}
      else{
         deliveries.findOne({state:req.body.state}, function(err,delivery){
            if(err){console.log(err)}
            else{
              if(delivery){
               order.delivery = delivery.price;
               order.save();
              }
              else{order.delivery = 1500
               order.save();}
            }
          })
       
      res.redirect("/confirm-order/" + order.orderID)}
   })     
      }
   })
  })

router.post("/confirm-orders/:id",middleware.isValidObjectId,middleware.isLoggedin,function(req,res){
   cart.findById(req.params.id).populate("items").exec(function(err,cart){
      if(err){console.log(err)}
      else if(!cart){
         res.redirect("/error")}
      else{
          //transaction ID//
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const random = Math.floor(Math.random() * letters.length)
const random2 = Math.floor(Math.random() * letters.length)
const alpha = letters[random]
const apha2 = letters[random2]
const num1 = Math.floor(Math.random() * 300 )
const num2 = Math.floor(Math.random() * 675 )
const transId = "OID"+num1+num2+apha2+alpha;
const cartAmount = cart.items.reduce((acc,obj) =>{
   return acc + obj.total
},0)

const OrderQuant =  cart.items.reduce((acc,obj) =>{
   return acc + obj.quantity
},0)
       order.create({
         cartId:cart._id,
         orderID:transId,
         amount:cartAmount,
         quantity:OrderQuant,
         mobile:req.body.mobile,
         email:req.body.email,
         firstName:req.body.firstName,
         lastName:req.body.lastName,
         state:req.body.state,
         method:req.body.method,
         city:req.body.city,
         address:req.body.address
      }, function(err,order){
         if(err){console.log(err)}
         else{
            deliveries.findOne({state:req.body.state}, function(err,delivery){
               if(err){console.log(err)}
               else{
                 if(delivery){
                  order.delivery = delivery.price;
                 }
                 else{order.delivery = 1500}
               }
             })
         var pushitem = cart.items.map(doc => doc.toObject())
          order.cart.push(...pushitem)
          order.save()
          res.redirect("/confirm-order/" + order.orderID)}
      })
   }
    })
})

router.get("/confirm-order/:orderId",middleware.isLoggedin,function(req,res){
    order.findOne({orderID:req.params.orderId}, function(err,order){
       if(err){console.log(err)}
       else if(!order){
         res.render("error")}
       else{
         if(order.userId !== req.user.id){
            res.render("error")
         }
         else{
    payacc.findOne({tag:"current"}, function(err,pay){
      if(err){console.log(err)}
      else{
      res.render("order", {order:order,pay:pay}) 
  }
    })
     }}
    })
})

router.post("/complete-order/:id",middleware.isValidObjectId,middleware.isLoggedin,multerInstance.upload.single('image'),function(req,res){
   if (!req.file) {
      req.flash('error', 'Please select an image file.');
      return res.redirect('back');
    }
     order.findById(req.params.id, function(err,order){
      if(err){console.log(err)}
      else if(!order){
         res.redirect("/error")}
      else{ 
         if(order.userId !== req.user.id){
            res.render("error")
         }
         else{
        order.receipt = "/uploads/" + req.file.filename;
        console.log(req.file, req.body.accNum)
        order.accNum = req.body.accNum;
        order.status = "pending"
       order.save();
       if(order.productId){
         product.findById(order.productId, function(err,pduct){
            if(err){console.log(err)}
            else{
             pduct.available = pduct.available-1;
             pduct.save();
             items.find({productID:order.productId}, (err,uitems)=>{
               if(err){console.log(err)}
               else{
                  uitems.forEach(function(uitem){
                     uitem.available = uitem.available-1;
                     if(uitem.quantity > pduct.available){
                        uitem.quantity = pduct.available;
                   }
                     uitem.save();  
                  })
               }
            })                   
            }
         })
      }

         if(order.cart){
            order.cart.forEach(function(item){
                 product.findById(item.productID,function(err,pitem){
                  if(err){console.log(err)}
                  else{
                       pitem.available = pitem.available-item.quantity;
                       pitem.save();
                  items.find({productID:pitem._id}, (err,uitems)=>{
                     if(err){console.log(err)}
                     else{
                        uitems.forEach(function(uitem){
                           uitem.available = uitem.available-item.quantity;
                           if(uitem.quantity > pitem.available){
                                uitem.quantity = pitem.available;
                           }
                           uitem.save(); 
                        })
                     }
                  })
                        
                  }
                 })
            })
         }
    items.deleteMany({cartId:order.cartId}, function(err){
       if(err){console.log(err)}
         })       
         const mailOptions = {
            from: 'info@lightsoclock.com',
            to: order.email,
            subject: "Order from Lights o'clock",
            html: `Hello ${order.firstName} ${order.lastName} your order has been recieved but it's yet to be confirmed<br>Once we confirm your order an email that includes how your order would be delivered would be sent to you<br><br>Your order id is: ${order.orderID}`
          };
          
          // Send the email
   transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.log(error);
            } else {
           console.log('Email sent: ' + info.response);
 transporter.sendMail({
    from: 'info@lightsoclock.com',
    to: 'christophineanyiam@gmail.com',
    subject: "Pending order at Lights o'clock",
    html:`Hello Admin you have a new pending order to confirm`
   },function(error, info) {
            if (error) {
              console.log(error);
            } else {
           console.log('Email sent: ' + info.response);    
           res.redirect("/complete-order/" + order._id)
            }
         })
            }
         })
         }}
     })
})

router.get("/complete-order/:id",middleware.isValidObjectId,middleware.isLoggedin,function(req,res){
   order.findById(req.params.id, function(err,order){
      if(err){console.log(err)}
      else if(!order){
          res.render("error")}
      else{
         if(order.userId !== req.user.id){
            res.render("error")
         }
         else{
      res.render("complete-order" , {order:order})}  
   } })
})

router.get("/order-history",middleware.isLoggedin,  async(req,res)=>{
     try{
    const orders = await order.find({userId:req.user.id})
    res.render("orderhistory", {orders:orders})
     }
     catch(error){
      console.log(error)
     }
})
module.exports = router;