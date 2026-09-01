/* =========================================================
   SHOPSPHERE
   PRODUCT DETAILS
   DEFAULT PRODUCTS + SELLER PRODUCTS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* =====================================================
       STORAGE KEYS
    ===================================================== */

    const CART_KEY = "shopSphereCart";
    const SELLER_PRODUCTS_KEY = "shopSphereSellerProducts";


    /* =====================================================
       DEFAULT PRODUCTS
    ===================================================== */

    const products = {

        "Classic Black T-Shirt": {
            category: "Fashion",
            image: "../images/tshirt.jpg",
            price: 599,
            rating: 4,
            reviews: "128 reviews",
            seller: "Fashion Hub",
            description: "Comfortable everyday wear with a clean, versatile design."
        },

        "Everyday Running Shoes": {
            category: "Fashion",
            image: "../images/shoes.jpg",
            price: 1799,
            rating: 4,
            reviews: "163 reviews",
            seller: "Fashion Hub",
            description: "Lightweight footwear designed for everyday comfort and active lifestyles."
        },

        "Casual Everyday Jacket": {
            category: "Fashion",
            image: "../images/jacket.jpg",
            price: 2299,
            rating: 4,
            reviews: "91 reviews",
            seller: "Style Avenue",
            description: "A stylish lightweight jacket for casual everyday outfits."
        },

        "Classic Everyday Handbag": {
            category: "Fashion",
            image: "../images/handbag.jpg",
            price: 1999,
            rating: 5,
            reviews: "146 reviews",
            seller: "Style Avenue",
            description: "Elegant everyday handbag with practical storage space."
        },

        "Classic Sunglasses": {
            category: "Fashion",
            image: "../images/sunglasses.jpg",
            price: 899,
            rating: 4,
            reviews: "84 reviews",
            seller: "Style Avenue",
            description: "Modern sunglasses designed for everyday style and comfort."
        },

        "Comfort Fit Hoodie": {
            category: "Fashion",
            image: "../images/hoodie.jpg",
            price: 1299,
            rating: 4,
            reviews: "117 reviews",
            seller: "Fashion Hub",
            description: "Soft everyday hoodie designed for relaxed comfort."
        },

        "Wireless Headphones": {
            category: "Electronics",
            image: "../images/headphones.jpg",
            price: 1999,
            rating: 5,
            reviews: "214 reviews",
            seller: "Tech World",
            description: "Immersive sound with a comfortable wireless listening experience."
        },

        "Smart Watch": {
            category: "Electronics",
            image: "../images/smartwatch.jpg",
            price: 2499,
            rating: 4,
            reviews: "96 reviews",
            seller: "Tech World",
            description: "Stay connected and keep track of your day with a smart wearable."
        },

        "Portable Bluetooth Speaker": {
            category: "Electronics",
            image: "../images/speaker.jpg",
            price: 1499,
            rating: 5,
            reviews: "187 reviews",
            seller: "Tech World",
            description: "Compact wireless speaker with powerful everyday sound."
        },

        "Modern Smartphone": {
            category: "Electronics",
            image: "../images/smartphone.jpg",
            price: 18999,
            rating: 4,
            reviews: "203 reviews",
            seller: "Tech World",
            description: "Sleek smartphone built for everyday communication and entertainment."
        },

        "Slim Performance Laptop": {
            category: "Electronics",
            image: "../images/laptop.jpg",
            price: 54999,
            rating: 5,
            reviews: "156 reviews",
            seller: "Tech World",
            description: "Reliable performance for work, study and everyday entertainment."
        },

        "Wireless Computer Mouse": {
            category: "Electronics",
            image: "../images/mouse.jpg",
            price: 799,
            rating: 4,
            reviews: "103 reviews",
            seller: "Tech World",
            description: "Precise and comfortable mouse for work and everyday computing."
        },

        "Automatic Coffee Maker": {
           category: "Home & Kitchen",
           image: "../images/coffee-maker.jpg",
        price: 3499,
    rating: 4,
    reviews: "74 reviews",
    seller: "Home Store",
    description: "Brew fresh coffee conveniently from the comfort of home."
},

"Coffee Maker": {
    category: "Home & Kitchen",
    image: "../images/coffee-maker.jpg",
    price: 3499,
    rating: 4,
    reviews: "74 reviews",
    seller: "Home Store",
    description: "Brew fresh coffee conveniently from the comfort of home."
},


        

        "Modern Table Lamp": {
            category: "Home & Kitchen",
            image: "../images/lamp.jpg",
            price: 1299,
            rating: 4,
            reviews: "89 reviews",
            seller: "Home Store",
            description: "Minimal lighting designed to complement modern interiors."
        },

        "Digital Air Fryer": {
            category: "Home & Kitchen",
            image: "../images/air-fryer.jpg",
            price: 4299,
            rating: 4,
            reviews: "118 reviews",
            seller: "Home Store",
            description: "Convenient everyday cooking with less oil and easy controls."
        },

        "Multi-Purpose Organizer": {
            category: "Home & Kitchen",
            image: "../images/organizer.jpg",
            price: 699,
            rating: 4,
            reviews: "67 reviews",
            seller: "Home Store",
            description: "Keep everyday essentials neatly arranged and easy to access."
        },

        "Insulated Water Bottle": {
            category: "Home & Kitchen",
            image: "../images/water-bottle.jpg",
            price: 899,
            rating: 4,
            reviews: "132 reviews",
            seller: "Home Store",
            description: "Practical reusable bottle designed for everyday use."
        },

        "Premium Cotton Bedsheet": {
            category: "Home & Kitchen",
            image: "../images/bedsheet.jpg",
            price: 1499,
            rating: 5,
            reviews: "145 reviews",
            seller: "Home Store",
            description: "Soft and comfortable bedsheet for a relaxed bedroom setup."
        },

        "Skincare Essentials": {
            category: "Beauty",
            image: "../images/skincare.jpg",
            price: 899,
            rating: 4,
            reviews: "112 reviews",
            seller: "Glow Store",
            description: "Everyday skincare essentials for a simple personal care routine."
        },

        "Everyday Eau de Parfum": {
            category: "Beauty",
            image: "../images/perfume.jpg",
            price: 1599,
            rating: 4,
            reviews: "98 reviews",
            seller: "Glow Store",
            description: "A refined fragrance suitable for everyday occasions."
        },

        "Daily Face Moisturizer": {
            category: "Beauty",
            image: "../images/moisturizer.jpg",
            price: 699,
            rating: 4,
            reviews: "127 reviews",
            seller: "Glow Store",
            description: "Lightweight daily moisturizer for a comfortable skincare routine."
        },

        "Daily Care Shampoo": {
            category: "Beauty",
            image: "../images/shampoo.jpg",
            price: 549,
            rating: 4,
            reviews: "86 reviews",
            seller: "Glow Store",
            description: "Gentle everyday hair care for a fresh, clean feel."
        },

        "Everyday Makeup Kit": {
            category: "Beauty",
            image: "../images/makeup.jpg",
            price: 1299,
            rating: 4,
            reviews: "105 reviews",
            seller: "Glow Store",
            description: "A convenient selection of everyday makeup essentials."
        },

        "Compact Hair Dryer": {
            category: "Beauty",
            image: "../images/hair-dryer.jpg",
            price: 1499,
            rating: 4,
            reviews: "93 reviews",
            seller: "Glow Store",
            description: "Convenient styling tool with a compact everyday design."
        }

    };


    /* =====================================================
       GET PRODUCT FROM URL
    ===================================================== */

    const params = new URLSearchParams(window.location.search);

    const productName = params.get("product");


    console.log("URL:", window.location.href);
    console.log("Product from URL:", productName);


    if (!productName) {
        console.error("No product name found in URL.");
        return;
    }


    /* =====================================================
       FIND SELLER PRODUCT
    ===================================================== */

    let sellerProducts = [];

    try {

        const storedProducts =
            localStorage.getItem(SELLER_PRODUCTS_KEY);

        if (storedProducts) {

            const parsedProducts =
                JSON.parse(storedProducts);

            if (Array.isArray(parsedProducts)) {
                sellerProducts = parsedProducts;
            }

        }

    } catch (error) {

        console.error(
            "Error reading seller products:",
            error
        );

    }


    const sellerProduct = sellerProducts.find(function (item) {

        if (!item) {
            return false;
        }

        const itemName =
            String(item.name || "").trim();

        const currentName =
            String(productName || "").trim();

        const status =
            String(item.status || "")
                .toLowerCase()
                .trim();

        return (
            itemName === currentName &&
            (
                status === "approved" ||
                status === "" ||
                item.status === undefined
            )
        );

    });


    /* =====================================================
       FIND DEFAULT PRODUCT
    ===================================================== */

    let defaultProduct = null;

    const decodedProductName =
        decodeURIComponent(productName).trim();


    if (products[decodedProductName]) {

        defaultProduct =
            products[decodedProductName];

    }


    /* =====================================================
       SELECT PRODUCT
    ===================================================== */

    let product = null;


    if (sellerProduct) {

        product = {

            id:
                sellerProduct.id ||
                sellerProduct.name,

            name:
                sellerProduct.name,

            category:
                sellerProduct.category || "",

            image:
                sellerProduct.image || "",

            price:
                Number(sellerProduct.price) || 0,

            rating:
                Number(sellerProduct.rating) || 4,

            reviews:
                "Seller product",

            seller:
                sellerProduct.sellerName ||
                sellerProduct.seller ||
                "ShopSphere Seller",

            sellerId:
                sellerProduct.sellerId || "",

            description:
                sellerProduct.description ||
                "No description available.",

            stock:
                Number(sellerProduct.stock) || 0

        };

    } else if (defaultProduct) {

        product = {

            id: decodedProductName,

            name: decodedProductName,

            category:
                defaultProduct.category,

            image:
                defaultProduct.image,

            price:
                Number(defaultProduct.price) || 0,

            rating:
                Number(defaultProduct.rating) || 4,

            reviews:
                defaultProduct.reviews,

            seller:
                defaultProduct.seller,

            sellerId: "",

            description:
                defaultProduct.description,

            stock: 999

        };

    }


    /* =====================================================
       PRODUCT NOT FOUND
    ===================================================== */

    if (!product) {

        console.error(
            "Product not found:",
            decodedProductName
        );

        alert(
            "Product not found. Please go back to Products."
        );

        return;

    }


    console.log(
        "Selected product:",
        product
    );


    /* =====================================================
       UPDATE PAGE
    ===================================================== */

    const image =
        document.getElementById(
            "details-product-image"
        );

    if (image) {

        image.src =
            product.image;

        image.alt =
            product.name;

    }


    const name =
        document.getElementById(
            "details-product-name"
        );

    if (name) {
        name.textContent =
            product.name;
    }


    const category =
        document.getElementById(
            "details-product-category"
        );

    const infoCategory =
        document.getElementById(
            "info-category"
        );

    if (category) {
        category.textContent =
            product.category;
    }

    if (infoCategory) {
        infoCategory.textContent =
            product.category;
    }


    /* =====================================================
       RATING
    ===================================================== */

    const rating =
        document.getElementById(
            "details-product-rating"
        );

    if (rating) {

        const safeRating =
            Math.max(
                0,
                Math.min(
                    5,
                    Number(product.rating) || 0
                )
            );

        const fullStars =
            "★".repeat(
                Math.floor(safeRating)
            );

        const emptyStars =
            "☆".repeat(
                5 - Math.floor(safeRating)
            );

        rating.innerHTML =
            fullStars +
            emptyStars +
            " <span>(" +
            product.reviews +
            ")</span>";

    }


    /* =====================================================
       PRICE
    ===================================================== */

    const price =
        document.getElementById(
            "details-product-price"
        );

    if (price) {

        price.textContent =
            "₹" +
            Number(product.price)
                .toLocaleString("en-IN");

    }


    /* =====================================================
       SELLER
    ===================================================== */

    const seller =
        document.getElementById(
            "details-product-seller"
        );

    const infoSeller =
        document.getElementById(
            "info-seller"
        );

    if (seller) {
        seller.textContent =
            product.seller;
    }

    if (infoSeller) {
        infoSeller.textContent =
            product.seller;
    }


    /* =====================================================
       DESCRIPTION
    ===================================================== */

    const description =
        document.getElementById(
            "details-product-description"
        );

    if (description) {
        description.textContent =
            product.description;
    }


    /* =====================================================
       AVAILABILITY
    ===================================================== */

    const informationGrid =
        document.querySelector(
            ".information-grid"
        );

    if (informationGrid) {

        const values =
            informationGrid.querySelectorAll("strong");

        if (values.length >= 3) {

            if (product.stock <= 0) {

                values[2].textContent =
                    "Out of Stock";

            } else {

                values[2].textContent =
                    "In Stock";

            }

        }

    }


    /* =====================================================
       QUANTITY
    ===================================================== */

    const quantityElement =
        document.getElementById(
            "product-quantity"
        );

    const minusButton =
        document.getElementById(
            "quantity-minus"
        );

    const plusButton =
        document.getElementById(
            "quantity-plus"
        );

    let quantity = 1;


    if (quantityElement) {

        quantityElement.textContent =
            quantity;

    }


    /* =====================================================
       PLUS BUTTON
    ===================================================== */

    if (plusButton) {

        plusButton.addEventListener(
            "click",
            function () {

                if (
                    sellerProduct &&
                    product.stock > 0 &&
                    quantity >= product.stock
                ) {

                    alert(
                        "Only " +
                        product.stock +
                        " item(s) available."
                    );

                    return;

                }


                quantity++;


                if (quantityElement) {

                    quantityElement.textContent =
                        quantity;

                }

            }
        );

    }


    /* =====================================================
       MINUS BUTTON
    ===================================================== */

    if (minusButton) {

        minusButton.addEventListener(
            "click",
            function () {

                if (quantity > 1) {
                    quantity--;
                }


                if (quantityElement) {

                    quantityElement.textContent =
                        quantity;

                }

            }
        );

    }


    /* =====================================================
       CART
    ===================================================== */

    function getCart() {

        try {

            const storedCart =
                localStorage.getItem(CART_KEY);

            if (!storedCart) {
                return [];
            }

            const cart =
                JSON.parse(storedCart);

            return Array.isArray(cart)
                ? cart
                : [];

        } catch (error) {

            console.error(
                "Error reading cart:",
                error
            );

            return [];

        }

    }


    function saveCart(cart) {

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );

    }


    /* =====================================================
       UPDATE CART COUNT
    ===================================================== */

    function updateCartCount() {

        const cart =
            getCart();

        let total =
            0;

        cart.forEach(function (item) {

            total +=
                Number(item.quantity) || 0;

        });


        document
            .querySelectorAll(".cart-link")
            .forEach(function (link) {

                link.textContent =
                    total > 0
                        ? "Cart (" + total + ")"
                        : "Cart";

            });

    }


    updateCartCount();


    /* =====================================================
       ADD TO CART
    ===================================================== */

    function addToCart(goToCart) {

        if (
            sellerProduct &&
            product.stock <= 0
        ) {

            alert(
                "This product is currently out of stock."
            );

            return;

        }


        const cart =
            getCart();


        const existingProduct =
            cart.find(function (item) {

                return (
                    String(item.id) ===
                    String(product.id)
                );

            });


        if (existingProduct) {

            const newQuantity =
                (
                    Number(
                        existingProduct.quantity
                    ) || 0
                ) + quantity;


            if (
                sellerProduct &&
                product.stock > 0 &&
                newQuantity > product.stock
            ) {

                alert(
                    "Only " +
                    product.stock +
                    " item(s) available."
                );

                return;

            }


            existingProduct.quantity =
                newQuantity;

        } else {

            cart.push({

                id:
                    product.id,

                name:
                    product.name,

                price:
                    Number(product.price),

                category:
                    product.category,

                seller:
                    product.seller,

                sellerId:
                    product.sellerId,

                sellerName:
                    product.seller,

                image:
                    product.image,

                rating:
                    product.rating,

                quantity:
                    quantity

            });

        }


        saveCart(cart);

        updateCartCount();


        if (goToCart) {

            window.location.href =
                "cart.html";

            return;

        }


        alert(
            product.name +
            " (" +
            quantity +
            ") added to cart!"
        );

    }


    /* =====================================================
       ADD TO CART BUTTON
    ===================================================== */

    const addToCartButton =
        document.getElementById(
            "details-add-to-cart"
        );

    if (addToCartButton) {

        addToCartButton.addEventListener(
            "click",
            function () {

                addToCart(false);

            }
        );

    }


    /* =====================================================
       BUY NOW
    ===================================================== */

    const buyNowButton =
        document.getElementById(
            "buy-now-button"
        );

    if (buyNowButton) {

        buyNowButton.addEventListener(
            "click",
            function () {

                addToCart(true);

            }
        );

    }

});