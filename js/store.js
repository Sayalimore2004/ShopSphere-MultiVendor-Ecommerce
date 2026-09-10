/* =========================================================
   SHOPSPHERE
   STORE.JS
   BACKEND SELLER STORE
========================================================= */

const API_BASE_URL = "http://localhost:8080/api";

document.addEventListener("DOMContentLoaded", async function () {

    "use strict";

    const storeName =
        document.getElementById("store-name");

    const storeDescription =
        document.getElementById("store-description");

    const storeCategory =
        document.getElementById("store-category");

    const storeMeta =
        document.getElementById("store-meta");

    const productCount =
        document.getElementById("product-count");

    const productGrid =
        document.getElementById("store-product-grid");

    const noProducts =
        document.getElementById("store-no-products");

    const urlParams =
        new URLSearchParams(window.location.search);

    const sellerId =
        urlParams.get("sellerId");

    if (!sellerId) {

        console.error(
            "Seller ID is missing from URL."
        );

        if (storeName) {
            storeName.textContent =
                "Store Not Found";
        }

        if (storeDescription) {
            storeDescription.textContent =
                "Seller information could not be found.";
        }

        return;
    }


    // =====================================================
    // LOAD SELLER INFORMATION
    // =====================================================

    try {

        const sellerResponse =
            await fetch(
                API_BASE_URL +
                "/sellers/" +
                sellerId
            );

        if (!sellerResponse.ok) {

            throw new Error(
                "Unable to load seller information."
            );
        }

        const seller =
            await sellerResponse.json();

        if (storeName) {

            storeName.textContent =
                seller.storeName ||
                seller.name ||
                "Store";
        }

        if (storeDescription) {

            storeDescription.textContent =
                seller.description ||
                "Explore products from this seller.";
        }

        if (storeCategory) {

            storeCategory.textContent =
                seller.category ||
                "SHOPSPHERE STORE";
        }

        if (storeMeta) {

            storeMeta.textContent =
                "⭐ Trusted Seller";
        }

    } catch (error) {

        console.error(
            "Seller loading error:",
            error
        );

        if (storeName) {

            storeName.textContent =
                "Unable to Load Store";
        }

        if (storeDescription) {

            storeDescription.textContent =
                "Please try again later.";
        }

        return;
    }


    // =====================================================
    // LOAD SELLER APPROVED PRODUCTS
    // =====================================================

    try {

        const productsResponse =
            await fetch(
                API_BASE_URL +
                "/products/store/" +
                sellerId
            );

        if (!productsResponse.ok) {

            throw new Error(
                "Unable to load seller products."
            );
        }

        const products =
            await productsResponse.json();

        if (productCount) {

            productCount.textContent =
                products.length +
                (
                    products.length === 1
                        ? " Product"
                        : " Products"
                );
        }

        if (productGrid) {

            productGrid.innerHTML = "";
        }

        if (products.length === 0) {

            if (noProducts) {

                noProducts.classList.remove(
                    "hidden"
                );
            }

            return;
        }

        if (noProducts) {

            noProducts.classList.add(
                "hidden"
            );
        }


        // =================================================
        // CREATE PRODUCT CARDS
        // =================================================

        products.forEach(
            function (product) {

                const card =
                    document.createElement("article");

                card.className =
                    "store-product-card";


                const image =
                    document.createElement("img");

                image.className =
                    "store-product-image";

                image.src =
                    product.imageUrl ||
                    "../images/placeholder.jpg";

                image.alt =
                    product.name ||
                    "Product";


                image.onerror =
                    function () {

                        this.style.display =
                            "none";
                    };


                const content =
                    document.createElement("div");

                content.className =
                    "store-product-content";


                const category =
                    document.createElement("span");

                category.className =
                    "store-product-category";

                category.textContent =
                    product.category ||
                    "Product";


                const name =
                    document.createElement("h3");

                name.className =
                    "store-product-name";

                name.textContent =
                    product.name ||
                    "Unnamed Product";


                const price =
                    document.createElement("p");

                price.className =
                    "store-product-price";

                price.textContent =
                    "₹" +
                    Number(
                        product.price || 0
                    ).toLocaleString("en-IN");


                const stock =
                    document.createElement("p");

                stock.className =
                    "store-product-stock";

                if (
                    Number(product.stock || 0) > 0
                ) {

                    stock.textContent =
                        "In Stock";

                } else {

                    stock.textContent =
                        "Out of Stock";
                }


                const button =
                    document.createElement("a");

                button.className =
                    "store-product-button";

                button.textContent =
                    "View Product";

                button.href =
                    "product-details.html?productId=" +
                    product.id;


                content.appendChild(category);
                content.appendChild(name);
                content.appendChild(price);
                content.appendChild(stock);
                content.appendChild(button);

                card.appendChild(image);
                card.appendChild(content);


                if (productGrid) {

                    productGrid.appendChild(card);
                }

            }
        );

    } catch (error) {

        console.error(
            "Product loading error:",
            error
        );

        if (productGrid) {

            productGrid.innerHTML = "";
        }

        if (productCount) {

            productCount.textContent =
                "0 Products";
        }

        if (noProducts) {

            noProducts.classList.remove(
                "hidden"
            );

            const message =
                noProducts.querySelector("p");

            if (message) {

                message.textContent =
                    "Unable to load products. Please try again.";
            }
        }
    }

});

