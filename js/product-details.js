/* =========================================================
   SHOPSPHERE
   PRODUCT DETAILS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       PRODUCT DATA
    ===================================================== */

    const products = {

        "Classic Black T-Shirt": {
            category: "Fashion",
            image: "../images/tshirt.jpg",
            price: "₹599",
            rating: "★★★★☆",
            reviews: "128 reviews",
            seller: "Fashion Hub",
            description: "Comfortable everyday wear with a clean, versatile design."
        },

        "Everyday Running Shoes": {
            category: "Fashion",
            image: "../images/shoes.jpg",
            price: "₹1,799",
            rating: "★★★★☆",
            reviews: "163 reviews",
            seller: "Fashion Hub",
            description: "Lightweight footwear designed for everyday comfort and active lifestyles."
        },

        "Casual Everyday Jacket": {
            category: "Fashion",
            image: "../images/jacket.jpg",
            price: "₹2,299",
            rating: "★★★★☆",
            reviews: "91 reviews",
            seller: "Style Avenue",
            description: "A stylish lightweight jacket for casual everyday outfits."
        },

        "Classic Everyday Handbag": {
            category: "Fashion",
            image: "../images/handbag.jpg",
            price: "₹1,999",
            rating: "★★★★★",
            reviews: "146 reviews",
            seller: "Style Avenue",
            description: "Elegant everyday handbag with practical storage space."
        },

        "Classic Sunglasses": {
            category: "Fashion",
            image: "../images/sunglasses.jpg",
            price: "₹899",
            rating: "★★★★☆",
            reviews: "84 reviews",
            seller: "Style Avenue",
            description: "Modern sunglasses designed for everyday style and comfort."
        },

        "Comfort Fit Hoodie": {
            category: "Fashion",
            image: "../images/hoodie.jpg",
            price: "₹1,299",
            rating: "★★★★☆",
            reviews: "117 reviews",
            seller: "Fashion Hub",
            description: "Soft everyday hoodie designed for relaxed comfort."
        },

        "Wireless Headphones": {
            category: "Electronics",
            image: "../images/headphones.jpg",
            price: "₹1,999",
            rating: "★★★★★",
            reviews: "214 reviews",
            seller: "Tech World",
            description: "Immersive sound with a comfortable wireless listening experience."
        },

        "Smart Watch": {
            category: "Electronics",
            image: "../images/smartwatch.jpg",
            price: "₹2,499",
            rating: "★★★★☆",
            reviews: "96 reviews",
            seller: "Tech World",
            description: "Stay connected and keep track of your day with a smart wearable."
        },

        "Portable Bluetooth Speaker": {
            category: "Electronics",
            image: "../images/speaker.jpg",
            price: "₹1,499",
            rating: "★★★★★",
            reviews: "187 reviews",
            seller: "Tech World",
            description: "Compact wireless speaker with powerful everyday sound."
        },

        "Modern Smartphone": {
            category: "Electronics",
            image: "../images/smartphone.jpg",
            price: "₹18,999",
            rating: "★★★★☆",
            reviews: "203 reviews",
            seller: "Tech World",
            description: "Sleek smartphone built for everyday communication and entertainment."
        },

        "Slim Performance Laptop": {
            category: "Electronics",
            image: "../images/laptop.jpg",
            price: "₹54,999",
            rating: "★★★★★",
            reviews: "156 reviews",
            seller: "Tech World",
            description: "Reliable performance for work, study and everyday entertainment."
        },

        "Wireless Computer Mouse": {
            category: "Electronics",
            image: "../images/mouse.jpg",
            price: "₹799",
            rating: "★★★★☆",
            reviews: "103 reviews",
            seller: "Tech World",
            description: "Precise and comfortable mouse for work and everyday computing."
        },

        "Automatic Coffee Maker": {
            category: "Home & Kitchen",
            image: "../images/coffee-maker.jpg",
            price: "₹3,499",
            rating: "★★★★☆",
            reviews: "74 reviews",
            seller: "Home Store",
            description: "Brew fresh coffee conveniently from the comfort of home."
        },

        "Modern Table Lamp": {
            category: "Home & Kitchen",
            image: "../images/lamp.jpg",
            price: "₹1,299",
            rating: "★★★★☆",
            reviews: "89 reviews",
            seller: "Home Store",
            description: "Minimal lighting designed to complement modern interiors."
        },

        "Digital Air Fryer": {
            category: "Home & Kitchen",
            image: "../images/air-fryer.jpg",
            price: "₹4,299",
            rating: "★★★★☆",
            reviews: "118 reviews",
            seller: "Home Store",
            description: "Convenient everyday cooking with less oil and easy controls."
        },

        "Multi-Purpose Organizer": {
            category: "Home & Kitchen",
            image: "../images/organizer.jpg",
            price: "₹699",
            rating: "★★★★☆",
            reviews: "67 reviews",
            seller: "Home Store",
            description: "Keep everyday essentials neatly arranged and easy to access."
        },

        "Insulated Water Bottle": {
            category: "Home & Kitchen",
            image: "../images/water-bottle.jpg",
            price: "₹899",
            rating: "★★★★☆",
            reviews: "132 reviews",
            seller: "Home Store",
            description: "Practical reusable bottle designed for everyday use."
        },

        "Premium Cotton Bedsheet": {
            category: "Home & Kitchen",
            image: "../images/bedsheet.jpg",
            price: "₹1,499",
            rating: "★★★★★",
            reviews: "145 reviews",
            seller: "Home Store",
            description: "Soft and comfortable bedsheet for a relaxed bedroom setup."
        },

        "Skincare Essentials": {
            category: "Beauty",
            image: "../images/skincare.jpg",
            price: "₹899",
            rating: "★★★★☆",
            reviews: "112 reviews",
            seller: "Glow Store",
            description: "Everyday skincare essentials for a simple personal care routine."
        },

        "Everyday Eau de Parfum": {
            category: "Beauty",
            image: "../images/perfume.jpg",
            price: "₹1,599",
            rating: "★★★★☆",
            reviews: "98 reviews",
            seller: "Glow Store",
            description: "A refined fragrance suitable for everyday occasions."
        },

        "Daily Face Moisturizer": {
            category: "Beauty",
            image: "../images/moisturizer.jpg",
            price: "₹699",
            rating: "★★★★☆",
            reviews: "127 reviews",
            seller: "Glow Store",
            description: "Lightweight daily moisturizer for a comfortable skincare routine."
        },

        "Daily Care Shampoo": {
            category: "Beauty",
            image: "../images/shampoo.jpg",
            price: "₹549",
            rating: "★★★★☆",
            reviews: "86 reviews",
            seller: "Glow Store",
            description: "Gentle everyday hair care for a fresh, clean feel."
        },

        "Everyday Makeup Kit": {
            category: "Beauty",
            image: "../images/makeup.jpg",
            price: "₹1,299",
            rating: "★★★★☆",
            reviews: "105 reviews",
            seller: "Glow Store",
            description: "A convenient selection of everyday makeup essentials."
        },

        "Compact Hair Dryer": {
            category: "Beauty",
            image: "../images/hair-dryer.jpg",
            price: "₹1,499",
            rating: "★★★★☆",
            reviews: "93 reviews",
            seller: "Glow Store",
            description: "Convenient styling tool with a compact everyday design."
        }

    };


    /* =====================================================
       GET PRODUCT FROM URL
    ===================================================== */

    const urlParams = new URLSearchParams(window.location.search);

    const productName = urlParams.get("product");


    /* =====================================================
       STOP IF NO PRODUCT WAS PASSED
    ===================================================== */

    if (!productName) {
        console.error("No product selected.");
        return;
    }


    /* =====================================================
       FIND SELECTED PRODUCT
    ===================================================== */

    const product = products[productName];


    if (!product) {

        console.error(
            "Product not found:",
            productName
        );

        return;
    }


    /* =====================================================
       UPDATE PRODUCT IMAGE
    ===================================================== */

    const image =
        document.getElementById("details-product-image");

    if (image) {
        image.src = product.image;
        image.alt = productName;
    }


    /* =====================================================
       UPDATE PRODUCT NAME
    ===================================================== */

    const name =
        document.getElementById("details-product-name");

    if (name) {
        name.textContent = productName;
    }


    /* =====================================================
       UPDATE CATEGORY
    ===================================================== */

    const category =
        document.getElementById("details-product-category");

    const infoCategory =
        document.getElementById("info-category");

    if (category) {
        category.textContent = product.category;
    }

    if (infoCategory) {
        infoCategory.textContent = product.category;
    }


    /* =====================================================
       UPDATE RATING
    ===================================================== */

    const rating =
        document.getElementById("details-product-rating");

    if (rating) {

        rating.innerHTML =
            `${product.rating} <span>(${product.reviews})</span>`;

    }


    /* =====================================================
       UPDATE PRICE
    ===================================================== */

    const price =
        document.getElementById("details-product-price");

    if (price) {
        price.textContent = product.price;
    }


    /* =====================================================
       UPDATE SELLER
    ===================================================== */

    const seller =
        document.getElementById("details-product-seller");

    const infoSeller =
        document.getElementById("info-seller");

    if (seller) {
        seller.textContent = product.seller;
    }

    if (infoSeller) {
        infoSeller.textContent = product.seller;
    }


    /* =====================================================
       UPDATE DESCRIPTION
    ===================================================== */

    const description =
        document.getElementById("details-product-description");

    if (description) {
        description.textContent = product.description;
    }


    /* =====================================================
       QUANTITY
    ===================================================== */

    const quantityElement =
        document.getElementById("product-quantity");

    const minusButton =
        document.getElementById("quantity-minus");

    const plusButton =
        document.getElementById("quantity-plus");

    let quantity = 1;


    if (plusButton) {

        plusButton.addEventListener("click", function () {

            quantity++;

            if (quantityElement) {
                quantityElement.textContent = quantity;
            }

        });

    }


    if (minusButton) {

        minusButton.addEventListener("click", function () {

            if (quantity > 1) {
                quantity--;
            }

            if (quantityElement) {
                quantityElement.textContent = quantity;
            }

        });

    }


    /* =====================================================
       ADD TO CART
    ===================================================== */

    const addToCartButton =
        document.getElementById("details-add-to-cart");

    if (addToCartButton) {

        addToCartButton.addEventListener("click", function () {

            alert(
                `${productName} added to cart!`
            );

        });

    }


    /* =====================================================
       BUY NOW
    ===================================================== */

    const buyNowButton =
        document.getElementById("buy-now-button");

    if (buyNowButton) {

        buyNowButton.addEventListener("click", function () {

            alert(
                `Buying ${productName}`
            );

        });

    }

});