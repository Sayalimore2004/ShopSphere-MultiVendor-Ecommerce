/* =========================================================
   SHOPSPHERE
   ADMIN DASHBOARD JAVASCRIPT
   PRODUCT APPROVAL MANAGEMENT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* =====================================================
       STORAGE KEY
    ===================================================== */

    const PRODUCTS_KEY =
        "shopSphereSellerProducts";


    /* =====================================================
       STORAGE
    ===================================================== */

    function getProducts() {

        try {

            const products =
                JSON.parse(
                    localStorage.getItem(PRODUCTS_KEY)
                );


            return Array.isArray(products)
                ? products
                : [];

        } catch (error) {

            console.error(
                "Could not read products:",
                error
            );

            return [];

        }

    }


    function saveProducts(products) {

        localStorage.setItem(
            PRODUCTS_KEY,
            JSON.stringify(products)
        );

    }


    /* =====================================================
       HTML ESCAPE
    ===================================================== */

    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       PRICE FORMAT
    ===================================================== */

    function formatPrice(price) {

        return Number(price || 0)
            .toLocaleString("en-IN");

    }


    /* =====================================================
       PRODUCT STATUS
    ===================================================== */

    function getStatusClass(status) {

        if (status === "approved") {
            return "status-approved";
        }

        if (status === "rejected") {
            return "status-rejected";
        }

        return "status-pending";

    }


    /* =====================================================
       DISPLAY STATISTICS
    ===================================================== */

    function displayStatistics(products) {

        const total =
            document.getElementById(
                "admin-total-products"
            );


        const pending =
            document.getElementById(
                "admin-pending-products"
            );


        const approved =
            document.getElementById(
                "admin-approved-products"
            );


        const rejected =
            document.getElementById(
                "admin-rejected-products"
            );


        const pendingCount =
            products.filter(function (product) {

                return (
                    (product.status || "pending") ===
                    "pending"
                );

            }).length;


        const approvedCount =
            products.filter(function (product) {

                return product.status ===
                    "approved";

            }).length;


        const rejectedCount =
            products.filter(function (product) {

                return product.status ===
                    "rejected";

            }).length;


        if (total) {
            total.textContent =
                products.length;
        }


        if (pending) {
            pending.textContent =
                pendingCount;
        }


        if (approved) {
            approved.textContent =
                approvedCount;
        }


        if (rejected) {
            rejected.textContent =
                rejectedCount;
        }

    }


    /* =====================================================
       DISPLAY PRODUCTS
    ===================================================== */

    function displayProducts() {

        const productList =
            document.getElementById(
                "admin-product-list"
            );


        if (!productList) {
            return;
        }


        const products =
            getProducts();


        displayStatistics(products);


        const filter =
            document.getElementById(
                "admin-product-filter"
            )?.value || "all";


        const filteredProducts =
            products.filter(function (product) {

                const status =
                    product.status ||
                    "pending";


                if (filter === "all") {
                    return true;
                }


                return status === filter;

            });


        if (filteredProducts.length === 0) {

            productList.innerHTML = `

                <div class="admin-empty">

                    <h3>
                        No products found
                    </h3>

                    <p>
                        There are no products
                        matching this filter.
                    </p>

                </div>

            `;

            return;

        }


        productList.innerHTML = "";


        filteredProducts.forEach(
            function (product) {

                const status =
                    product.status ||
                    "pending";


                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "admin-product-card";


                card.innerHTML = `

                    <div class="admin-product-image-container">

                                                <img
    src="${escapeHtml(product.image)}"
    alt="${escapeHtml(product.name)}"
    class="admin-product-image"
>

                    </div>


                    <div class="admin-product-content">


                        <div class="admin-product-header">

                            <div>

                                <p class="admin-product-label">
                                    PRODUCT
                                </p>

                                <h3>
                                    ${escapeHtml(
                                        product.name
                                    )}
                                </h3>

                            </div>


                            <span
                                class="admin-product-status ${getStatusClass(status)}">

                                ${escapeHtml(status)}

                            </span>

                        </div>


                        <div class="admin-product-details">


                            <div>

                                <span>
                                    Seller
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        product.sellerName ||
                                        "Seller"
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Category
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        product.category
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Price
                                </span>

                                <strong>
                                    ₹${formatPrice(
                                        product.price
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Stock
                                </span>

                                <strong>
                                    ${Number(
                                        product.stock || 0
                                    )}
                                </strong>

                            </div>


                        </div>


                        <div class="admin-product-description">

                            <span>
                                Description
                            </span>

                            <p>
                                ${escapeHtml(
                                    product.description
                                )}
                            </p>

                        </div>


                        <div class="admin-product-actions">


                            <button
                                type="button"
                                class="approve-product"
                                data-id="${product.id}"
                                ${status === "approved"
                                    ? "disabled"
                                    : ""}>

                                Approve

                            </button>


                            <button
                                type="button"
                                class="reject-product"
                                data-id="${product.id}"
                                ${status === "rejected"
                                    ? "disabled"
                                    : ""}>

                                Reject

                            </button>

                        </div>


                    </div>

                `;


                productList.appendChild(card);

            }
        );


        addApprovalEvents();

    }


    /* =====================================================
       APPROVAL EVENTS
    ===================================================== */

    function addApprovalEvents() {

        document
            .querySelectorAll(
                ".approve-product"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const productId =
                            Number(
                                button.dataset.id
                            );


                        updateProductStatus(
                            productId,
                            "approved"
                        );

                    }
                );

            });


        document
            .querySelectorAll(
                ".reject-product"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const productId =
                            Number(
                                button.dataset.id
                            );


                        updateProductStatus(
                            productId,
                            "rejected"
                        );

                    }
                );

            });

    }


    /* =====================================================
       UPDATE PRODUCT STATUS
    ===================================================== */

    function updateProductStatus(
        productId,
        newStatus
    ) {

        const products =
            getProducts();


        const index =
            products.findIndex(
                function (product) {

                    return Number(product.id) ===
                        productId;

                }
            );


        if (index === -1) {

            alert(
                "Product not found."
            );

            return;

        }


        const productName =
            products[index].name ||
            "Product";


        if (newStatus === "approved") {

            const confirmed =
                confirm(
                    `Approve "${productName}"?`
                );


            if (!confirmed) {
                return;
            }

        }


        if (newStatus === "rejected") {

            const confirmed =
                confirm(
                    `Reject "${productName}"?`
                );


            if (!confirmed) {
                return;
            }

        }


        products[index].status =
            newStatus;


        products[index].updatedAt =
            new Date().toLocaleString(
                "en-IN"
            );


        saveProducts(products);


        displayProducts();


        alert(
            `Product ${newStatus} successfully.`
        );

    }


    /* =====================================================
       FILTER
    ===================================================== */

    const filter =
        document.getElementById(
            "admin-product-filter"
        );


    if (filter) {

        filter.addEventListener(
            "change",
            displayProducts
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    displayProducts();

});