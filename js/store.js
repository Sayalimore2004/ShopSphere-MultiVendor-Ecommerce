/* =========================================================
   SHOPSPHERE
   STORE / SELLER FILTER
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       GET ELEMENTS
    ===================================================== */

    const productCards = document.querySelectorAll(".product-card");

    const productsGrid = document.querySelector(".products-grid");

    const productsCount = document.querySelector(".products-toolbar p");

    const urlParams = new URLSearchParams(window.location.search);

    const selectedSeller = urlParams.get("seller");


    /* =====================================================
       IF NO SELLER IS SELECTED
       SHOW FIRST 8 PRODUCTS
    ===================================================== */

    if (!selectedSeller) {

        productCards.forEach(function (card, index) {

            if (index < 8) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }

        });

        if (productsCount) {
            productsCount.textContent = "Showing 1–8 of 24 products";
        }

        return;
    }


    /* =====================================================
       FILTER PRODUCTS BY SELLER
    ===================================================== */

    let visibleProducts = 0;

    productCards.forEach(function (card) {

        const seller = card.dataset.seller;

        if (
            seller &&
            seller.toLowerCase() === selectedSeller.toLowerCase()
        ) {

            card.style.display = "";
            visibleProducts++;

        } else {

            card.style.display = "none";

        }

    });


    /* =====================================================
       UPDATE PRODUCT COUNT
    ===================================================== */

    if (productsCount) {

        if (visibleProducts > 0) {

            productsCount.textContent =
                `Showing 1–${visibleProducts} of ${visibleProducts} products`;

        } else {

            productsCount.textContent =
                "No products found";

        }

    }


    /* =====================================================
       UPDATE PAGE HEADING
    ===================================================== */

    const productsHeading =
        document.querySelector(".products-header h1");

    const productsDescription =
        document.querySelector(".products-header > p");


    if (selectedSeller && productsHeading) {

        productsHeading.textContent =
            `${selectedSeller} Store`;

    }


    if (selectedSeller && productsDescription) {

        productsDescription.textContent =
            `Explore products available from ${selectedSeller}.`;

    }


    /* =====================================================
       HIDE PAGINATION FOR STORE PAGE
    ===================================================== */

    const pagination =
        document.querySelector(".pagination");

    if (pagination && selectedSeller) {

        pagination.style.display = "none";

    }

});