/* =========================================================
   SHOPSPHERE - ORDERS.JS
   MY ORDERS + ORDER STATUS + PRODUCT REVIEWS
========================================================= */

const ORDERS_KEY = "shopSphereOrders";
const REVIEWS_KEY = "shopSphereReviews";

const ordersList = document.querySelector("#orders-list");


/* =========================================================
   PAYMENT METHOD
========================================================= */

function getPaymentMethod(order) {

    if (!order || !order.paymentMethod) {
        return "Not specified";
    }

    if (order.paymentMethod === "cod") {
        return "Cash on Delivery";
    }

    if (order.paymentMethod === "card") {
        return "Credit / Debit Card";
    }

    if (order.paymentMethod === "upi") {

        const app = String(order.upiApp || "").toLowerCase();

        if (
            app === "google-pay" ||
            app === "googlepay" ||
            app === "gpay"
        ) {
            return "Google Pay";
        }

        if (
            app === "phonepe" ||
            app === "phone-pay"
        ) {
            return "PhonePe";
        }

        if (app === "paytm") {
            return "Paytm";
        }

        return "UPI";
    }

    return order.paymentMethod;
}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

    const number = parseFloat(
        String(price || "0")
            .replace("₹", "")
            .replace(/,/g, "")
    ) || 0;

    return "₹" + number.toLocaleString("en-IN");
}


/* =========================================================
   GET ORDERS
========================================================= */

function getOrders() {

    try {

        const data = localStorage.getItem(ORDERS_KEY);

        if (!data) {
            return [];
        }

        const orders = JSON.parse(data);

        return Array.isArray(orders) ? orders : [];

    } catch (error) {

        console.error("Error loading orders:", error);

        return [];
    }
}


/* =========================================================
   SAVE ORDERS
========================================================= */

function saveOrders(orders) {

    try {

        localStorage.setItem(
            ORDERS_KEY,
            JSON.stringify(orders)
        );

        return true;

    } catch (error) {

        console.error("Error saving orders:", error);

        return false;
    }
}


/* =========================================================
   GET REVIEWS
========================================================= */

function getReviews() {

    try {

        const data = localStorage.getItem(REVIEWS_KEY);

        if (!data) {
            return [];
        }

        const reviews = JSON.parse(data);

        return Array.isArray(reviews) ? reviews : [];

    } catch (error) {

        console.error("Error loading reviews:", error);

        return [];
    }
}


/* =========================================================
   SAVE REVIEWS
========================================================= */

function saveReviews(reviews) {

    try {

        localStorage.setItem(
            REVIEWS_KEY,
            JSON.stringify(reviews)
        );

        return true;

    } catch (error) {

        console.error("Error saving reviews:", error);

        return false;
    }
}


/* =========================================================
   CHECK IF REVIEW EXISTS
========================================================= */

function hasReviewed(orderId, productName) {

    const reviews = getReviews();

    return reviews.some(function(review) {

        return (
            String(review.orderId) === String(orderId) &&
            String(review.productName) === String(productName)
        );

    });
}


/* =========================================================
   SAVE REVIEW
========================================================= */

function saveReview(
    orderId,
    productName,
    rating,
    reviewText
) {

    if (hasReviewed(orderId, productName)) {

        alert("You have already reviewed this product.");

        return false;
    }

    const reviews = getReviews();

    const newReview = {

        reviewId: "REV" + Date.now(),

        orderId: String(orderId),

        productName: String(productName),

        rating: Number(rating),

        review: String(reviewText),

        reviewDate: new Date().toLocaleDateString("en-IN")
    };

    reviews.push(newReview);

    return saveReviews(reviews);
}


/* =========================================================
   NORMALIZE STATUS
========================================================= */

function normalizeStatus(status) {

    const value = String(status || "Placed")
        .trim()
        .toLowerCase();

    if (value === "delivered") {
        return "Delivered";
    }

    if (value === "shipped") {
        return "Shipped";
    }

    return "Placed";
}


/* =========================================================
   GET ORDER ID
========================================================= */

function getOrderId(order, index) {

    if (order && order.orderId) {
        return String(order.orderId);
    }

    return "SS" + String(index + 1).padStart(4, "0");
}


/* =========================================================
   GET ORDER DATE
========================================================= */

function getOrderDate(order) {

    if (!order) {
        return "Date unavailable";
    }

    if (order.orderDate) {
        return order.orderDate;
    }

    if (order.date) {
        return order.date;
    }

    if (order.createdAt) {

        const date = new Date(order.createdAt);

        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString("en-IN");
        }
    }

    if (order.timestamp) {

        const date = new Date(order.timestamp);

        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString("en-IN");
        }
    }

    return "Date unavailable";
}


/* =========================================================
   LOAD ORDERS
========================================================= */

function loadOrders() {

    if (!ordersList) {

        console.error("ERROR: #orders-list not found.");

        return;
    }

    const orders = getOrders();

    ordersList.innerHTML = "";


    /* =====================================================
       NO ORDERS
    ===================================================== */

    if (orders.length === 0) {

        ordersList.innerHTML = `
            <div class="no-orders">

                <div class="no-orders-icon">
                    🛍️
                </div>

                <h2>No Orders Yet</h2>

                <p>
                    You haven't placed any orders yet.
                </p>

                <a
                    href="products.html"
                    class="start-shopping-button"
                >
                    Start Shopping
                </a>

            </div>
        `;

        return;
    }


    /* =====================================================
       NEWEST ORDER FIRST
    ===================================================== */

    const displayOrders = orders
        .map(function(order, index) {

            return {
                order: order,
                index: index
            };

        })
        .reverse();


    /* =====================================================
       CREATE ORDER CARDS
    ===================================================== */

    displayOrders.forEach(function(data) {

        const order = data.order;
        const originalIndex = data.index;

        if (!order) {
            return;
        }


        /* =================================================
           ORDER ID
        ================================================= */

        const orderId = getOrderId(
            order,
            originalIndex
        );

        if (!order.orderId) {
            order.orderId = orderId;
        }


        /* =================================================
           STATUS
        ================================================= */

        const status = normalizeStatus(order.status);

        order.status = status;


        /* =================================================
           ITEMS
        ================================================= */

        const items = Array.isArray(order.items)
            ? order.items
            : [];


        /* =================================================
           ITEM COUNT
        ================================================= */

        let itemCount = 0;

        items.forEach(function(item) {

            itemCount += Number(item.quantity) || 1;

        });

        if (typeof order.itemCount === "number") {

            itemCount = order.itemCount;
        }


        /* =================================================
           TOTAL
        ================================================= */

        let total = 0;

        if (typeof order.total === "number") {

            total = order.total;

        } else {

            items.forEach(function(item) {

                const price = parseFloat(
                    String(item.price || "0")
                        .replace("₹", "")
                        .replace(/,/g, "")
                ) || 0;

                const quantity =
                    Number(item.quantity) || 1;

                total += price * quantity;

            });
        }


        /* =================================================
           PRODUCTS
        ================================================= */

        let productsHTML = "";


        if (items.length > 0) {

            productsHTML = items.map(function(item) {

                const productName =
                    String(item.name || "Product");

                const quantity =
                    Number(item.quantity) || 1;

                const price = parseFloat(
                    String(item.price || "0")
                        .replace("₹", "")
                        .replace(/,/g, "")
                ) || 0;

                const itemTotal =
                    price * quantity;


                /* =========================================
                   REVIEW SECTION
                ========================================= */

                let reviewHTML = "";


                /*
                   REVIEW BUTTON ONLY APPEARS
                   WHEN ORDER IS DELIVERED
                */

                if (status === "Delivered") {

                    const alreadyReviewed =
                        hasReviewed(
                            orderId,
                            productName
                        );


                    if (alreadyReviewed) {

                        reviewHTML = `
                            <span class="review-submitted">
                                ✓ Review Submitted
                            </span>
                        `;

                    } else {

                        reviewHTML = `
                            <button
                                type="button"
                                class="write-review-button"
                                data-order-id="${orderId}"
                                data-product-name="${encodeURIComponent(productName)}"
                            >
                                Write a Review
                            </button>
                        `;
                    }
                }


                /* =========================================
                   PRODUCT HTML
                ========================================= */

                return `
                    <div class="order-product">

                        <div class="order-product-info">

                            <h3>
                                ${productName}
                            </h3>

                            <p>
                                Quantity: ${quantity}
                            </p>

                            <small>
                                Price: ${formatPrice(price)}
                            </small>

                            <div class="product-review-action">
                                ${reviewHTML}
                            </div>

                        </div>

                        <strong>
                            ${formatPrice(itemTotal)}
                        </strong>

                    </div>
                `;

            }).join("");

        } else {

            productsHTML = `
                <p class="no-order-message">
                    No product information available.
                </p>
            `;
        }


        /* =================================================
           STATUS BUTTON
        ================================================= */

        let statusAction = "";


        if (status === "Placed") {

            statusAction = `
                <button
                    type="button"
                    class="order-status-button"
                    data-order-id="${orderId}"
                    data-new-status="Shipped"
                >
                    Mark as Shipped
                </button>
            `;

        } else if (status === "Shipped") {

            statusAction = `
                <button
                    type="button"
                    class="order-status-button"
                    data-order-id="${orderId}"
                    data-new-status="Delivered"
                >
                    Mark as Delivered
                </button>
            `;

        } else if (status === "Delivered") {

            statusAction = `
                <span class="delivered-message">
                    ✓ Delivered
                </span>
            `;
        }


        /* =================================================
           CUSTOMER DETAILS
        ================================================= */

        let customerHTML = "";


        if (order.customer) {

            customerHTML = `
                <div class="order-customer">

                    <h3>
                        Delivery Details
                    </h3>

                    <p>
                        ${order.customer.name || ""}
                    </p>

                    <p>
                        ${order.customer.address || ""}
                        ${
                            order.customer.city
                                ? ", " + order.customer.city
                                : ""
                        }
                    </p>

                    <p>
                        ${order.customer.state || ""}
                        ${
                            order.customer.pincode
                                ? " - " + order.customer.pincode
                                : ""
                        }
                    </p>

                </div>
            `;
        }


        /* =================================================
           ORDER CARD
        ================================================= */

        const orderCard =
            document.createElement("div");

        orderCard.className = "order-card";


        orderCard.innerHTML = `

            <div class="order-card-header">

                <div>

                    <h2>
                        Order #${orderId}
                    </h2>

                    <p>
                        ${getOrderDate(order)}
                    </p>

                </div>

                <span class="order-status">
                    ${status}
                </span>

            </div>


            <div class="order-card-details">

                <div class="order-detail">

                    <span>
                        Payment
                    </span>

                    <strong>
                        ${getPaymentMethod(order)}
                    </strong>

                </div>


                <div class="order-detail">

                    <span>
                        Items
                    </span>

                    <strong>
                        ${itemCount}
                    </strong>

                </div>


                <div class="order-detail">

                    <span>
                        Total
                    </span>

                    <strong>
                        ${formatPrice(total)}
                    </strong>

                </div>

            </div>


            <div class="order-card-products">

                ${productsHTML}

            </div>


            ${customerHTML}


            <div class="order-card-footer">

                <a
                    href="order-confirmation.html"
                    class="view-order-button"
                >
                    View Order
                </a>

                ${statusAction}

            </div>

        `;


        ordersList.appendChild(orderCard);

    });


    /* Save updated IDs/statuses */

    saveOrders(orders);
}


/* =========================================================
   UPDATE ORDER STATUS
========================================================= */

function updateOrderStatus(orderId, newStatus) {

    const orders = getOrders();

    let found = false;


    orders.forEach(function(order) {

        if (!order) {
            return;
        }


        if (
            String(order.orderId) ===
            String(orderId)
        ) {

            order.status =
                normalizeStatus(newStatus);

            found = true;
        }

    });


    if (!found) {

        console.error(
            "Order not found:",
            orderId
        );

        alert("Could not update this order.");

        return;
    }


    if (!saveOrders(orders)) {

        alert("Could not save order status.");

        return;
    }


    loadOrders();
}


/* =========================================================
   OPEN REVIEW FORM
========================================================= */

function openReviewForm(orderId, encodedProductName) {

    /*
       Decode product name because it is stored
       using encodeURIComponent() in the button.
    */

    const productName =
        decodeURIComponent(encodedProductName);


    /* Remove existing form */

    const existing =
        document.querySelector(
            ".review-form-overlay"
        );

    if (existing) {
        existing.remove();
    }


    /* =====================================================
       CREATE OVERLAY
    ===================================================== */

    const overlay =
        document.createElement("div");

    overlay.className =
        "review-form-overlay";


    overlay.innerHTML = `

        <div class="review-form-card">

            <button
                type="button"
                class="close-review-button"
            >
                ×
            </button>


            <h2>
                Write a Review
            </h2>


            <h3>
                ${productName}
            </h3>


            <label>
                Rating
            </label>


            <div class="review-rating">

                <label>
                    <input
                        type="radio"
                        name="review-rating"
                        value="1"
                    >
                    ★
                </label>

                <label>
                    <input
                        type="radio"
                        name="review-rating"
                        value="2"
                    >
                    ★★
                </label>

                <label>
                    <input
                        type="radio"
                        name="review-rating"
                        value="3"
                    >
                    ★★★
                </label>

                <label>
                    <input
                        type="radio"
                        name="review-rating"
                        value="4"
                    >
                    ★★★★
                </label>

                <label>
                    <input
                        type="radio"
                        name="review-rating"
                        value="5"
                    >
                    ★★★★★
                </label>

            </div>


            <label for="review-text">
                Your Review
            </label>


            <textarea
                id="review-text"
                rows="5"
                placeholder="Share your experience with this product..."
            ></textarea>


            <button
                type="button"
                class="submit-review-button"
            >
                Submit Review
            </button>

        </div>

    `;


    document.body.appendChild(overlay);


    /* =====================================================
       CLOSE REVIEW FORM
    ===================================================== */

    const closeButton =
        overlay.querySelector(
            ".close-review-button"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function() {

                overlay.remove();

            }
        );
    }


    /* =====================================================
       CLOSE WHEN CLICKING OUTSIDE
    ===================================================== */

    overlay.addEventListener(
        "click",
        function(event) {

            if (event.target === overlay) {
                overlay.remove();
            }

        }
    );


    /* =====================================================
       SUBMIT REVIEW
    ===================================================== */

    const submitButton =
        overlay.querySelector(
            ".submit-review-button"
        );


    if (submitButton) {

        submitButton.addEventListener(
            "click",
            function() {

                const selectedRating =
                    overlay.querySelector(
                        'input[name="review-rating"]:checked'
                    );


                const textarea =
                    overlay.querySelector(
                        "#review-text"
                    );


                /* Rating validation */

                if (!selectedRating) {

                    alert(
                        "Please select a rating."
                    );

                    return;
                }


                /* Review validation */

                if (
                    !textarea ||
                    !textarea.value.trim()
                ) {

                    alert(
                        "Please write a review."
                    );

                    return;
                }


                /* Save review */

                const saved =
                    saveReview(
                        orderId,
                        productName,
                        selectedRating.value,
                        textarea.value.trim()
                    );


                if (!saved) {
                    return;
                }


                alert(
                    "Thank you! Your review has been submitted."
                );


                overlay.remove();


                /* Refresh order */

                loadOrders();

            }
        );
    }
}


/* =========================================================
   CLICK HANDLER
========================================================= */

if (ordersList) {

    ordersList.addEventListener(
        "click",
        function(event) {


            /* =============================================
               MARK AS SHIPPED / DELIVERED
            ============================================= */

            const statusButton =
                event.target.closest(
                    ".order-status-button"
                );


            if (statusButton) {

                event.preventDefault();

                const orderId =
                    statusButton.dataset.orderId;

                const newStatus =
                    statusButton.dataset.newStatus;


                if (!orderId || !newStatus) {

                    console.error(
                        "Missing order status data."
                    );

                    return;
                }


                updateOrderStatus(
                    orderId,
                    newStatus
                );

                return;
            }


            /* =============================================
               WRITE A REVIEW
            ============================================= */

            const reviewButton =
                event.target.closest(
                    ".write-review-button"
                );


            if (reviewButton) {

                event.preventDefault();

                event.stopPropagation();


                const orderId =
                    reviewButton.dataset.orderId;


                const encodedProductName =
                    reviewButton.dataset.productName;


                if (
                    !orderId ||
                    !encodedProductName
                ) {

                    console.error(
                        "Missing review information."
                    );

                    return;
                }


                openReviewForm(
                    orderId,
                    encodedProductName
                );

            }

        }
    );
}


/* =========================================================
   START
========================================================= */

loadOrders();


/* =========================================================
   END
========================================================= */