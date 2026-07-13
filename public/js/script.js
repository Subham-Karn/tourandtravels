"use strict";

/* =========================================================
   DOM Elements
========================================================= */

const searchBtn = document.querySelector("#search-btn");
const searchBar = document.querySelector(".search-bar-container");

const loginBtn = document.querySelector("#login-btn");
const loginForm = document.querySelector(".login-form-container");
const formClose = document.querySelector("#form-close");

const menuBar = document.querySelector("#menu-bar");
const navbar = document.querySelector(".navbar");

const videoButtons = document.querySelectorAll(".vid-btn");
const videoSlider = document.querySelector("#video-slider");


/* =========================================================
   Reset Header on Scroll
========================================================= */

window.addEventListener("scroll", () => {

    searchBtn?.classList.remove("fa-times");
    searchBar?.classList.remove("active");

    menuBar?.classList.remove("fa-times");
    navbar?.classList.remove("active");

});


/* =========================================================
   Mobile Menu
========================================================= */

if (menuBar && navbar) {

    menuBar.addEventListener("click", () => {

        menuBar.classList.toggle("fa-times");
        navbar.classList.toggle("active");

    });

}


/* =========================================================
   Search Toggle
========================================================= */

if (searchBtn && searchBar) {

    searchBtn.addEventListener("click", () => {

        searchBtn.classList.toggle("fa-times");
        searchBar.classList.toggle("active");

    });

}


/* =========================================================
   Login Popup
========================================================= */

if (loginBtn && loginForm) {

    loginBtn.addEventListener("click", () => {

        loginForm.classList.add("active");

    });

}

if (formClose && loginForm) {

    formClose.addEventListener("click", () => {

        loginForm.classList.remove("active");

    });

}


/* =========================================================
   Video Switcher
========================================================= */

if (videoButtons.length && videoSlider) {

    videoButtons.forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelector(".controls .active")
                ?.classList.remove("active");

            button.classList.add("active");

            videoSlider.src = button.dataset.src;

        });

    });

}


/* =========================================================
   Review Slider
========================================================= */

if (document.querySelector(".review-slider")) {

    new Swiper(".review-slider", {

        spaceBetween: 20,

        loop: true,

        autoplay: {

            delay: 2500,

            disableOnInteraction: false

        },

        breakpoints: {

            640: {
                slidesPerView: 1
            },

            768: {
                slidesPerView: 2
            },

            1024: {
                slidesPerView: 3
            }

        }

    });

}


/* =========================================================
   Brand Slider
========================================================= */

if (document.querySelector(".brand-slider")) {

    new Swiper(".brand-slider", {

        spaceBetween: 20,

        loop: true,

        autoplay: {

            delay: 2500,

            disableOnInteraction: false

        },

        breakpoints: {

            450: {
                slidesPerView: 2
            },

            768: {
                slidesPerView: 3
            },

            991: {
                slidesPerView: 4
            },

            1200: {
                slidesPerView: 5
            }

        }

    });

}

console.log("Tour & Travels JS Loaded Successfully");