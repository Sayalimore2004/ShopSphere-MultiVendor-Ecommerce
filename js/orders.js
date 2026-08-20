/* =========================================================
   SHOPSPHERE
   MY ORDERS PAGE JAVASCRIPT
========================================================= */


/* =========================================================
   ORDERS CONTAINER
========================================================= */

const ordersList =
    document.querySelector("#orders-list");


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

        const upiApp =
            order.upiApp || "";


        if (
            upiApp === "google-pay" ||
            upiApp === "googlepay" ||
            upiApp === "gpay"
        ) {
            return "Google Pay";
        }


        if (
            upiApp === "phonepe" ||
            upiApp === "phone-pay"
        ) {
            return "PhonePe";
        }


        if (upiApp === "paytm") {
            return "Paytm";
        }


        if (upiApp === "other") {
            return "Other UPI";
        }


        return "UPI";
    }


    return order.paymentMethod;
}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

    const number =
        parseFloat(
            String(price || "0")
                .replace("₹", "")
                .replace(/,/g, "")
        ) || 0;


    return "₹" +
        number.toLocaleString("en-IN");
}


/* =========================================================
   LOAD ALL ORDERS
========================================================= */

function loadOrders() {

    if (!ordersList) {
        return;
    }


    /* =====================================================
       GET ORDER HISTORY
    ===================================================== */

    let orderHistory =
        JSON.parse(
            localStorage.getItem(
                "shopSphereOrders"
            )
        ) || [];


    /* Make sure it is an array */

    if (!Array.isArray(orderHistory)) {
        orderHistory = [];
    }


    /* =====================================================
       NO ORDERS
    ===================================================== */

    if (orderHistory.length === 0) {

        ordersList.innerHTML = `

            <div class="no-orders">

                <div class="no-orders-icon">
                    🛍️
                </div>

                <h2>
                    No Orders Yet
                </h2>

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

    orderHistory =
        orderHistory.slice().reverse();


    ordersList.innerHTML = "";


    /* =====================================================
       DISPLAY EACH ORDER
    ===================================================== */

    orderHistory.forEach(
        function (orderData, index) {

            if (!orderData) {
                return;
            }


            /* =================================================
               ORDER ITEMS
            ================================================= */

            const items =
                Array.isArray(orderData.items)
                    ? orderData.items
                    : [];


            /* =================================================
               ORDER ID
            ================================================= */

            const orderId =
                orderData.orderId ||
                (
                    "SS" +
                    String(
                        orderHistory.length - index
                    ).padStart(4, "0")
                );


            /* =================================================
               PAYMENT
            ================================================= */

            const paymentMethod =
                getPaymentMethod(orderData);


            /* =================================================
               ITEM COUNT
            ================================================= */

            let itemCount = 0;


            if (
                typeof orderData.itemCount ===
                "number"
            ) {

                itemCount =
                    orderData.itemCount;

            } else {

                items.forEach(
                    function (item) {

                        itemCount +=
                            Number(
                                item.quantity
                            ) || 1;

                    }
                );

            }


            /* =================================================
               TOTAL
            ================================================= */

            let total = 0;


            if (
                typeof orderData.total ===
                "number"
            ) {

                total =
                    orderData.total;

            } else {

                items.forEach(
                    function (item) {

                        const price =
                            parseFloat(
                                String(
                                    item.price || "0"
                                )
                                    .replace(
                                        "₹",
                                        ""
                                    )
                                    .replace(
                                        /,/g,
                                        ""
                                    )
                            ) || 0;


                        const quantity =
                            Number(
                                item.quantity
                            ) || 1;


                        total +=
                            price * quantity;

                    }
                );

            }


            /* =================================================
               CREATE ORDER CARD
            ================================================= */

            const orderCard =
                document.createElement("div");


            orderCard.className =
                "order-card";


            orderCard.innerHTML = `

                <!-- =========================================
                     ORDER HEADER
                ========================================== -->

                <div class="order-card-header">

                    <div>

                        <h2>
                            Order #${orderId}
                        </h2>

                        <p>
                            ${
                                orderData.orderDate ||
                                "Date unavailable"
                            }
                        </p>

                    </div>


                    <span class="order-status">
                        Confirmed
                    </span>

                </div>


                <!-- =========================================
                     ORDER DETAILS
                ========================================== -->

                <div class="order-card-details">


                    <div class="order-detail">

                        <span>
                            Payment
                        </span>

                        <strong>
                            ${paymentMethod}
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


                <!-- =========================================
                     PRODUCTS
                ========================================== -->

                <div class="order-card-products">

                    ${
                        items.length > 0

                        ? items.map(
                            function (item) {

                                const quantity =
                                    Number(
                                        item.quantity
                                    ) || 1;


                                const itemPrice =
                                    parseFloat(
                                        String(
                                            item.price || "0"
                                        )
                                            .replace(
                                                "₹",
                                                ""
                                            )
                                            .replace(
                                                /,/g,
                                                ""
                                            )
                                    ) || 0;


                                const itemTotal =
                                    itemPrice *
                                    quantity;


                                return `

                                    <div
                                        class="order-product"
                                    >

                                        <div
                                            class="order-product-info"
                                        >

                                            <h3>
                                                ${
                                                    item.name ||
                                                    "Product"
                                                }
                                            </h3>

                                            <p>
                                                Quantity:
                                                ${quantity}
                                            </p>

                                            <small>
                                                Price:
                                                ${formatPrice(
                                                    itemPrice
                                                )}
                                            </small>

                                        </div>


                                        <strong>
                                            ${formatPrice(
                                                itemTotal
                                            )}
                                        </strong>

                                    </div>

                                `;

                            }
                        ).join("")

                        : `

                            <p class="no-order-message">
                                No product information available.
                            </p>

                        `
                    }

                </div>


                <!-- =========================================
                     CUSTOMER INFORMATION
                ========================================== -->

                ${
                    orderData.customer
                    ? `

                        <div class="order-customer">

                            <h3>
                                Delivery Details
                            </h3>

                            <p>
                                ${
                                    orderData.customer.name ||
                                    ""
                                }
                            </p>

                            <p>
                                ${
                                    orderData.customer.address ||
                                    ""
                                },
                                ${
                                    orderData.customer.city ||
                                    ""
                                }
                            </p>

                            <p>
                                ${
                                    orderData.customer.state ||
                                    ""
                                }
                                -
                                ${
                                    orderData.customer.pincode ||
                                    ""
                                }
                            </p>

                        </div>

                    `
                    : ""
                }


                <!-- =========================================
                     ORDER FOOTER
                ========================================== -->

                <div class="order-card-footer">

                    <a
                        href="order-confirmation.html"
                        class="view-order-button"
                    >
                        View Order
                    </a>

                </div>

            `;


            ordersList.appendChild(
                orderCard
            );

        }
    );

}


/* =========================================================
   LOAD ORDERS
========================================================= */

loadOrders();


/* =========================================================
   END OF ORDERS JAVASCRIPT
========================================================= */