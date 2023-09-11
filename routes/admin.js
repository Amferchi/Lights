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
const nodemailer = require('nodemailer');
require("dotenv").config()
var EMAIL_USER = process.env.email_user
var EMAIL_PASSWORD = process.env.email_password
var tickets = require("../models/ticket");
const payacc = require("../models/payacc.js");
const fs = require("fs");
const deliveries = require("../models/deliveryprice.js");
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&" );
};


const transporter = nodemailer.createTransport({

    host: 'mail.privateemail.com',
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD
    }
 });


router.post("/admin/new-admin", function(req,res){
    admin.create(req.body.admin, function(err){
     if(err){console.log(err)}
      else{
        req.flash("success", "successfully added an admin")
        res.redirect("/admin/234crvS554")}
    })
   })
             
router.post("/admin/category/new",middleware.admin,multerInstance.upload.single('image'), function(req,res){
  if (!req.file) {
    req.flash('error', 'Please select an image file.');
    return res.redirect('back');
  }
   category.create({
     name:req.body.name,
     image: "/uploads/" + req.file.filename
      }, function(err){
        if(err){console.log(err)}
        else{
          req.flash("success", "successfully added a category")
          res.redirect("/admin/234crvS554")}
      })
    })  

router.post("/admin/product/new", middleware.admin, multerInstance.upload.array('image',2), function(req,res){
  if (!req.files) {
    req.flash('error', 'Please select an image file.');
    return res.redirect('back');
  }
    product.create({
        name:req.body.name,
        oldPrice:req.body.oldPrice,
        available:req.body.available,
        image:"/uploads/" + req.files[0].filename,
        price:req.body.price,
        description:req.body.description,
        Category:req.body.Category,
    }, function(err,product){
      if(err){console.log(err)}
      else{
       if(req.files[1]){
          product.image2 = "/uploads/" + req.files[1].filename;
       }
        var Pinfo = [{property:req.body.speci1,specify:req.body.quality1},
          {property:req.body.speci2,specify:req.body.quality2},
          {property:req.body.speci3,specify:req.body.quality3},
          {property:req.body.speci4,specify:req.body.quality4},
          {property:req.body.speci5,specify:req.body.quality5}]
      product.specifications.push(...Pinfo)
      product.save();
        req.flash("success", "Product added successfully")
        res.redirect("/admin/product/add")}
    })
  })

router.get("/admin/product/add", middleware.admin,(req,res)=>{
  product.find().sort({"_id": -1}).limit(8).exec(function(err,products){
    if(err){console.log(err)}
    else{
  category.find({}, function(err,category){
    if(err){console.log(err)}
    else{res.render("add-product", {products:products, categories:category})}
 })    
  }})
})

router.get("/admin/category/create",middleware.admin, function(req,res){
  category.find({}, function(err,category){
    if(err){console.log(err)}
    else{res.render("add-category", {categories:category})}
})
})

router.get("/admin/view/admin",middleware.admin, function(req,res){
   admin.find({}, function(err,admins){
    if(err){console.log(err)}
    else{
      admin.findOne({tag:"headadmin"}, function(err,headadmin){
        if(err){console.log(err)}
        else{
         res.render("add-admin-view", {admins:admins, headadmin:headadmin})  
        }
      })
    }
  })
 })

router.post("/admin/confirm-order/:id",middleware.isValidObjectId,middleware.admin, (req,res)=>{
  orders.findById(req.params.id,function(err,order){
     if(err){console.log(err)}
     else if(!order){
res.render("error")}
     else{
  order.status = "confirmed";
  if(order.productId){
    product.findById(order.productId, function(err,pduct){
       if(err){console.log(err)}
       else{
        pduct.orders = pduct.orders+1;
        pduct.revenue = pduct.revenue+order.amount;
        pduct.save();
          }
       })                   
  }
    if(order.cart){
       order.cart.forEach(function(item){
            product.findById(item.productID,function(err,pitem){
             if(err){console.log(err)}
             else{
                  pitem.orders = pitem.orders+item.quantity;
                  pitem.revenue = pitem.revenue+item.total;
                  pitem.save();
                }
             })
            })}
  order.save();
  const mailOptions = {
    from: 'info@lightsoclock.com',
    to: order.email,
    subject: "Order from Lights o'clock",
    html:  `Hello ${order.firstName} your order has been confirmed. <P></P> Your delivery details would be sent shortly`
  };
  
  // Send the email
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      req.flash("success", "Order confirmed successfully")
      res.redirect("back");
    }
  });
     }
  })
})
 
router.get("/admin/pending-orders",middleware.admin, function(req,res){
    orders.find({status:"pending"}).sort({"_id":-1}).exec(function(err,orders){
      if(err){console.log(err)}
      else{res.render("pendorder",{orders:orders})}
    })
})

router.get("/admin/order/:id/details",middleware.isValidObjectId,middleware.admin, function(req,res){
   orders.findById(req.params.id, function(err,order){
    if(err){console.log(err)}
    else if(!order){
  res.render("error")}
    else{
    deliveries.findOne({state:order.state}, function(err,delivery){
      if(err){console.log(err)}
      else{
   res.render("vieworder",{order:order,delivery:delivery})
      }
    })}
   })
})

router.post("/admin/delete/:id/category",middleware.isValidObjectId,middleware.admin, function(req,res){
  category.findById(req.params.id, (err,foundcat)=>{
      if(err){console.log(err)}
      else if(!foundcat){res.render("error")}
      else{
   const filePath = path.join(__dirname, '..', 'public', foundcat.image);
      fs.unlinkSync(filePath);
   category.findByIdAndDelete(req.params.id, function(err){
    if(err){console.log(err)}
    else{
      req.flash("success", "category has been deleted successfully")
      res.redirect("back")}
   })      
      }
  })
})

router.post("/admin/order/:id/email-response",middleware.isValidObjectId,middleware.admin, (req,res)=>{
    orders.findById(req.params.id, (err,order)=>{
      if(err){console.log(err)}
      else if(!order){
          res.redirect("/error")
      } 
      else{
        const mailOptions = {
          from: 'info@lightsoclock.com',
          to: order.email,
          subject: "Order from Lights o'clock",
          html:  `${req.body.response} <br><br> order id: ${order.orderID}`
        };
        
        // Send the email
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            req.flash("success", "Order confirmed successfully")
            res.redirect("back");
          }
        });
      }
    })
})

router.post("/admin/delete/:id/admin",middleware.isValidObjectId,middleware.admin, function(req,res){
  admin.findByIdAndDelete(req.params.id, function(err){
   if(err){console.log(err)}
   else{
    req.flash("success", "Admin has been removed successfully")
    res.redirect("back")}
  })
})

router.post("/admin/delete/:id/product",middleware.isValidObjectId,middleware.admin, function(req,res){
  product.findById(req.params.id, (err,foundpduct)=>{
    if(err){console.log(err)}
    else if(!foundpduct){res.render("error")}
    else{
 const filePath = path.join(__dirname, '..', 'public', foundpduct.image);
    fs.unlinkSync(filePath);
  product.findByIdAndDelete(req.params.id, function(err){
   if(err){console.log(err)}
   else{
    items.deleteMany({productID:req.params.id}, (err)=>{
      if(err){console.log(err)}
      else{
      req.flash("success", "product has been deleted successfully")
      res.redirect("back")
    }
    })}
   })}
 })
 })

router.post("/admin/edit/:id/product",middleware.isValidObjectId,middleware.admin,function(req,res){
  product.findByIdAndUpdate(req.params.id,{
    oldPrice:req.body.oldPrice,
    available:req.body.available,
    price:req.body.price,
    description:req.body.description,
    Category:req.body.Category 
  },function(err,product){
   if(err){console.log(err)}
   else{
  var Pinfo = [{property:req.body.speci1,specify:req.body.quality1},
    {property:req.body.speci2,specify:req.body.quality2},
    {property:req.body.speci3,specify:req.body.quality3},
    {property:req.body.speci4,specify:req.body.quality4},
    {property:req.body.speci4,specify:req.body.quality5}]
  product.specifications = []
  product.specifications.push(...Pinfo)
  product.save();
  req.flash("success", "product has been Updated successfully")
  res.redirect("/products/"+ product._id)
  }
  })
})

router.get("/admin/:id/product/edit",middleware.admin,(req,res)=>{
  product.findById(req.params.id, (err,product)=>{
        if(err){console.log(err)}
        else{res.render("edit-product", {product:product})}
  })
}) 

router.get("/admin/support/tickets",middleware.admin,(req,res)=>{
  tickets.find({status:"pending"}).sort({"_id":-1}).exec((err,tickets)=>{
        if(err){console.log(err)}
        else{res.render("tickets", {tickets:tickets})}
  })
})             

router.get("/admin/support/tickets/:id", middleware.isValidObjectId,middleware.admin,(req,res)=>{
  tickets.findById(req.params.id, (err,ticket)=>{
     if(err){console.log(err)}
     else if(!ticket){
   res.render("error")}
     else{res.render("ticket-detail",{ticket:ticket})}
  })
})

router.post("/admin/support/tickets/:id",middleware.isValidObjectId,middleware.admin,(req,res)=>{
  tickets.findById(req.params.id, (err,ticket)=>{
     if(err){console.log(err)}
     else if(!ticket){
   res.render("error")}
     else{
      const mailOptions = {
        from: 'info@lightsoclock.com',
        to: ticket.email,
        subject: "Lights o'clock - ticket,"+ " " + ticket.subject,
        html: `Your ticket-${ticket.subject}<br>${req.body.header}<p></p>${req.body.text}`
      };
      
      // Send the email
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          req.flash("success", "Response has being sent to" + " " + ticket.sender)
          res.redirect("back");
        }
      })
      }
  })
})

router.get("/admin/payment-accounts",middleware.admin, function(req,res){
 payacc.find({}, function(err,pay){
    if(err){console.log(err)}
    else{res.render("bank-pay",{pay:pay})}
  }) 
})

router.post("/admin/payment-accounts/:id/update",middleware.isValidObjectId,middleware.admin,function(req,res){
  payacc.findById(req.params.id, function(err,pay){
     if(err){console.log(err)}
     else if(!pay){res.redirect("/error")}
     else{ 
    payacc.find({tag:"current"}, function(err,num){
    if(err){console.log(err)}
    else{
      num.forEach((numAcc)=>{
          numAcc.tag = "saved"
          numAcc.save();
      })
      pay.tag = "current"
      pay.save();
      req.flash("success","Current account number has been updated")
      res.redirect("/admin/payment-accounts")
    }
   })
  }})
 })

router.post("/admin/payment-accounts/create",middleware.admin, function(req,res){
  payacc.find({}, function(err,num){
     if(err){console.log(err)}
     else{
  payacc.create(req.body.payAcc,(err,payAcc)=>{
     if(err){console.log(err)}
     else{
      if(num.length < 1){
         payAcc.tag = "current"
         payAcc.save();
         req.flash("success","successfully created an account number")
         res.redirect("/admin/payment-accounts")  
      }
      else{
   req.flash("success","successfully created an account number")
   res.redirect("/admin/payment-accounts")  
      }
     }
  })
}
   }) 
 })

router.post("/admin/payment-accounts/:id/delete",middleware.isValidObjectId,middleware.admin,function(req,res){
  payacc.findByIdAndDelete(req.params.id, function(err){
     if(err){console.log(err)}
     else{
  payacc.findOne({tag:"current"}, function(err,payAcc){
     if(err){console.log(err)}
     else if(!payAcc){
  payacc.findOne({tag:"saved"},(err,reset)=>{
    if(err){console.log(err)}
    else{
      reset.tag ="current"
      reset.save();
      req.flash("success","account number has been deleted")
      res.redirect("/admin/payment-accounts")
    }
  })
  }
  else{
     req.flash("success","account number has been deleted")
     res.redirect("/admin/payment-accounts")
  }})
  }})
  })

router.get("/admin/state-delivery-prices",middleware.admin, function(req,res){
  deliveries.find({}).sort({"state":-1}).exec(function (err,deliveries){
      if(err){console.log(err)}
      else{res.render("delivery",{deliveries:deliveries})}
  })
})

router.post("/admin/delivery-price/create",middleware.admin,function(req,res){
   deliveries.findOne({state:req.body.state}, function(err,founddelivery){
    if(err){console.log(err)}
      else if(founddelivery){
        req.flash("error", `delivery price already set for ${founddelivery.state}, you can edit a delivery price by clicking on edit`)
         res.redirect("back")
      }
      else{
        deliveries.create({state:req.body.state,price:req.body.price}, function(err,delivery){
              if(err){console.log(err)}
              else{
                req.flash("success", `You have successfully set delivery fee for ${delivery.state} to ${delivery.price}`)
                res.redirect("back")
              }
        })
      }
   })
})

router.post("/admin/delivery/delete/:id",middleware.isValidObjectId,middleware.admin,function(req,res){
   deliveries.findByIdAndDelete(req.params.id, function(err){
    if(err){console.log(err)}
    else{req.flash("sucess","state deleted successfully")
         res.redirect("back")
  }
   })
})

router.post("/admin/delivery/edit/:id",middleware.isValidObjectId ,middleware.admin,function(req,res){
   delivery.findById(req.params.id, function(err,delivery){
       if(err){console.log(err)}
       else if(!delivery){res.render("error")}
       else{
         delivery.price = req.body.price;
         delivery.save();
        req.flash("success",`successfully edited delivery fee for ${delivery.state}`)
        res.redirect("back")}
   })
})
            //Dashboard
router.get("/admin/234crvS554",middleware.admin,function(req,res){
  if(req.query.search){
      var currentSearch = new RegExp(escapeRegex(req.query.search) , "gi")
    orders.find({orderID:currentSearch}).sort({"_id":-1}).exec(function(err,order){
      if(err){console.log(err)}
      else{
        orders.find({status:"confirmed"}, function(err,calorder){
          if(err){console.log(err)}
          else{
      product.find({}).sort({orders:-1}).limit(16).exec(function(err,products){
            if(err){console.log(err)}
            else{res.render("admin", {orders:order, calorder:calorder, product:products})}
      })}
       })
     }})
  }
  else{
    orders.find({}).sort({"_id":-1}).exec(function(err,order){
        if(err){console.log(err)}
        else{
    orders.find({status:"confirmed"}, function(err,calorder){
       if(err){console.log(err)}
       else{
   product.find({}).sort({orders:-1}).limit(16).exec(function(err,products){
         if(err){console.log(err)}
         else{res.render("admin", {orders:order, calorder:calorder, product:products})}
   })}
    })
  }})
}
  })


  module.exports = router;