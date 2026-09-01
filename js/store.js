
/* =========================================================
   SHOPSPHERE
   STORE.JS
   SELLER PRODUCT STORAGE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /*
     * Seller products are stored in localStorage.
     *
     * IMPORTANT:
     * This file does NOT add seller products to the
     * public Products page.
     *
     * The public Products page keeps its original
     * 24 products from products.html.
     */

    var sellerProducts = [];

    try {

        var savedProducts = localStorage.getItem(
            "shopSphereSellerProducts"
        );

        if (savedProducts) {
            sellerProducts = JSON.parse(savedProducts);
        }

    } catch (error) {

        console.log("Could not load seller products.");
        sellerProducts = [];

    }

    /*
     * Make sure the stored data is an array.
     */

    if (!Array.isArray(sellerProducts)) {
        sellerProducts = [];
    }

});

