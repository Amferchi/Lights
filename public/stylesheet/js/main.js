(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 100,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:3
            },
            768:{
                items:4
            },
            992:{
                items:5
            },
            1200:{
                items:6
            }
        }       
    });


    // Related carousel
    $('.related-carousel').owlCarousel({
        margin: 29,
        nav: false,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });
    
})(jQuery);


var addCartForm =  document.querySelector(".add-cart-fm");
var closeCartForm = document.querySelector("#can-ad-ca-btn");



  if(closeCartForm){
closeCartForm.addEventListener("click", function(){  
    addCartForm.style.display = "none"
})
  
document.querySelector("#ad-ca-btn").addEventListener("click", function(){
     if(this){
     addCartForm.style.display = "block"   
    }
})
  }

// Get references to the form and the external button
document.addEventListener('DOMContentLoaded', function() {

const form = document.querySelector("#check-form");

const externalButton = document.getElementById('sub-check-btn');
  if(externalButton){
    externalButton.addEventListener('click', function(){
    if (form.checkValidity()) {
        form.submit();
      } 
});    
    }

  });

const btnplus = document.querySelectorAll(".btn-plus")
const btnMinus = document.querySelectorAll(".btn-minus")
const quval = document.querySelectorAll(".quval")
const pdavailable = document.querySelectorAll(".pdav")
const lowVal = document.querySelector("#val-too-low")
const poqval = document.querySelector("#errquanpop")

    if(btnplus){

btnplus.forEach(function(btn){
    btn.addEventListener("click", function(){
 pdavailable.forEach(function(pdve){
     quval.forEach(function(qval){
    var pdv = parseInt(pdve.textContent);
        console.log(pdv)
    if(qval.value > pdv){
        poqval.style.display = "block"
        lowVal.style.display = "none"
        qval.value = pdv

     } 
     setTimeout(function(){
        poqval.style.display = "none"
     }, 6000)
     })
        })


})})

btnMinus.forEach(function(btn){
    btn.addEventListener("click", function(){
        quval.forEach(function(qval){
   if(qval.value < 1){
        qval.value = 1;
        lowVal.style.display = "block"
        poqval.style.display = "none"
      }
      setTimeout(function(){
        lowVal.style.display = "none"
     }, 6000)
        })

})
})
    }


 function toggleDeletePopup(popupId) {
        var popup = document.getElementById(popupId);
        popup.classList.toggle("active");
      }
      
 function closeDeletePopup(popupId) {
        var popup = document.getElementById(popupId);
        popup.classList.remove("active");
      }

 function toggleOrderPopup() {
        var popup = document.getElementById("confirm-ord");
        popup.classList.toggle("active");
      }
      
 function cancelOrderPopup() {
        var popup = document.getElementById("confirm-ord");
        popup.classList.remove("active");
      }

 function toggleConfirmPopup() {
        var popup = document.getElementById("addAdmin");
        popup.style.display = "block";
      }
      
 function cancelConfirmPopup() {
        var popup = document.getElementById("addAdmin");
        popup.style.display = "none";
      }


  document.querySelectorAll(".flash").forEach((flash)=>{
      setTimeout(function(){
        flash.style.display = "none"
      },10000)
  })


  const imageInputs = document.querySelectorAll('[id^="imageInput"]');
  const errorContainers = document.querySelectorAll('[id^="errorContainer"]');
      if(imageInputs){
  imageInputs.forEach((imageInput, index) => {
    imageInput.addEventListener('change', function () {
      const selectedFile = imageInput.files[0];
      const errorContainer = errorContainers[index];
  
      if (selectedFile && !selectedFile.type.startsWith('image/')) {
        errorContainer.textContent = 'Please select an image file.';
        errorContainer.style.display = 'block';
        imageInput.value = ''; // Clear the selected file
      } else {
        errorContainer.style.display = 'none';
      }
    });
  });
  
  const formImg = document.querySelector('.form-Img');
  
  formImg.addEventListener('submit', function (event) {
    let hasError = false;
    imageInputs.forEach((imageInput, index) => {
      const selectedFile = imageInput.files[0];
      const errorContainer = errorContainers[index];
  
      if (selectedFile && !selectedFile.type.startsWith('image/')) {
        errorContainer.textContent = 'Please select an image file.';
        errorContainer.style.display = 'block';
        imageInput.value = ''; // Clear the selected file
        hasError = true;
      } else {
        errorContainer.style.display = 'none';
      }
    });
  
    if (hasError) {
      event.preventDefault(); // Prevent form submission
    }
  });
}
  