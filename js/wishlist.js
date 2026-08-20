/* =========================================================
   SHOPSPHERE
   WISHLIST PAGE JAVASCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const wishlistItems =
    document.getElementById("wishlist-items");

const emptyWishlist =
    document.getElementById("empty-wishlist");


/* =========================================================
   GET WISHLIST
========================================================= */

function getWishlist() {

    const savedWishlist =
        localStorage.getItem("shopSphereWishlist");

    if (!savedWishlist) {

        return [];

    }

    try {

        const wishlist =
            JSON.parse(savedWishlist);

        if (Array.isArray(wishlist)) {

            return wishlist;

        }

        return [];

    } catch (error) {

        console.error(
            "Error reading wishlist:",
            error
        );

        return [];

    }

}



/* =========================================================
   SAVE WISHLIST
========================================================= */

function saveWishlist(wishlist) {

    localStorage.setItem(
        "shopSphereWishlist",
        JSON.stringify(wishlist)
    );

}



/* =========================================================
   FORMAT PRICE
========================================================= */

function formatWishlistPrice(price) {

    const cleanPrice =
        String(price || "0")
            .replace("₹", "")
            .replace(/,/g, "");

    const number =
        parseFloat(cleanPrice) || 0;

    return (
        "₹" +
        number.toLocaleString("en-IN")
    );

}



/* =========================================================
   LOAD WISHLIST
========================================================= */

function loadWishlist() {

    if (!wishlistItems) {

        return;

    }


    const wishlist =
        getWishlist();


    wishlistItems.innerHTML = "";



    /* =====================================================
       EMPTY WISHLIST
    ===================================================== */

    if (wishlist.length === 0) {

        if (emptyWishlist) {

            emptyWishlist.classList.remove(
                "hidden"
            );

        }

        return;

    }



    /* =====================================================
       HIDE EMPTY MESSAGE
    ===================================================== */

    if (emptyWishlist) {

        emptyWishlist.classList.add(
            "hidden"
        );

    }



    /* =====================================================
       CREATE PRODUCT CARDS
    ===================================================== */

    wishlist.forEach(
        function (product, index) {

            const card =
                document.createElement("div");


            card.className =
                "wishlist-card";


            /* IMAGE */

            let imageHTML = "";


            if (product.image) {

                imageHTML =
                    '<img src="' +
                    product.image +
                    '" alt="' +
                    (
                        product.name ||
                        "Product"
                    ) +
                    '">';

            } else {

                imageHTML =
                    '<div class="wishlist-image-placeholder">' +
                    '🛍️' +
                    '</div>';

            }



            /* CATEGORY */

            const category =
                product.category ||
                "ShopSphere Product";



            /* CARD HTML */

            card.innerHTML =

                '<div class="wishlist-card-image">' +

                    imageHTML +

                    '<button ' +
                        'type="button" ' +
                        'class="wishlist-remove" ' +
                        'data-index="' +
                        index +
                        '" ' +
                        'title="Remove from wishlist">' +

                        '❤️' +

                    '</button>' +

                '</div>' +


                '<div class="wishlist-card-info">' +

                    '<h3>' +
                        (
                            product.name ||
                            "Product"
                        ) +
                    '</h3>' +


                    '<p>' +
                        category +
                    '</p>' +


                    '<div class="wishlist-price">' +
                        formatWishlistPrice(
                            product.price
                        ) +
                    '</div>' +


                    '<button ' +
                        'type="button" ' +
                        'class="wishlist-add-cart" ' +
                        'data-index="' +
                        index +
                        '">' +

                        'Add to Cart' +

                    '</button>' +

                '</div>';


            wishlistItems.appendChild(
                card
            );

        }
    );



    /* =====================================================
       REMOVE BUTTONS
    ===================================================== */

    const removeButtons =
        document.querySelectorAll(
            ".wishlist-remove"
        );


    removeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            button.getAttribute(
                                "data-index"
                            )
                        );


                    removeFromWishlist(
                        index
                    );

                }
            );

        }
    );



    /* =====================================================
       ADD TO CART BUTTONS
    ===================================================== */

    const addCartButtons =
        document.querySelectorAll(
            ".wishlist-add-cart"
        );


    addCartButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            button.getAttribute(
                                "data-index"
                            )
                        );


                    addWishlistItemToCart(
                        index
                    );

                }
            );

        }
    );

}



/* =========================================================
   REMOVE FROM WISHLIST
========================================================= */

function removeFromWishlist(index) {

    const wishlist =
        getWishlist();


    if (
        index < 0 ||
        index >= wishlist.length
    ) {

        return;

    }


    wishlist.splice(
        index,
        1
    );


    saveWishlist(
        wishlist
    );


    loadWishlist();

}



/* =========================================================
   ADD WISHLIST ITEM TO CART
========================================================= */

function addWishlistItemToCart(index) {

    const wishlist =
        getWishlist();


    if (
        index < 0 ||
        index >= wishlist.length
    ) {

        return;

    }


    const product =
        wishlist[index];



    /* =====================================================
       GET CART
    ===================================================== */

    let cart = [];


    try {

        cart =
            JSON.parse(
                localStorage.getItem(
                    "shopSphereCart"
                )
            ) || [];

    } catch (error) {

        cart = [];

    }


    if (!Array.isArray(cart)) {

        cart = [];

    }



    /* =====================================================
       CHECK EXISTING PRODUCT
    ===================================================== */

    const existingProduct =
        cart.find(
            function (item) {

                return (
                    item.name ===
                    product.name
                );

            }
        );



    /* =====================================================
       UPDATE QUANTITY
    ===================================================== */

    if (existingProduct) {

        existingProduct.quantity =
            (
                Number(
                    existingProduct.quantity
                ) || 1
            ) + 1;

    } else {

        cart.push({

            name:
                product.name ||
                "Product",

            price:
                product.price ||
                "₹0",

            image:
                product.image ||
                "",

            category:
                product.category ||
                "",

            quantity:
                1

        });

    }



    /* =====================================================
       SAVE CART
    ===================================================== */

    localStorage.setItem(
        "shopSphereCart",
        JSON.stringify(cart)
    );



    /* =====================================================
       REMOVE FROM WISHLIST
    ===================================================== */

    wishlist.splice(
        index,
        1
    );


    saveWishlist(
        wishlist
    );



    /* =====================================================
       MESSAGE
    ===================================================== */

    alert(
        (
            product.name ||
            "Product"
        ) +
        " has been added to your cart."
    );


    loadWishlist();

}



/* =========================================================
   INITIALIZE
========================================================= */

loadWishlist();



/* =========================================================
   END
========================================================= */