/* =========================================================
   SHOPSPHERE
   ORDER CONFIRMATION PAGE JAVASCRIPT
   BACKEND INTEGRATION
========================================================= */

const API_BASE_URL =
    "http://localhost:8080/api";

const TOKEN_KEY =
    "shopSphereToken";

const CUSTOMER_KEY =
    "shopSphereLoggedInUser";


/* =========================================================
   GET PAGE ELEMENTS
========================================================= */

const orderIdElement =
    document.querySelector("#order-id");

const orderDateElement =
    document.querySelector("#order-date");

const orderPaymentElement =
    document.querySelector("#order-payment");

const customerDetails =
    document.querySelector("#customer-details");

const confirmedItems =
    document.querySelector("#confirmed-items");

const confirmedTotal =
    document.querySelector("#confirmed-total");


/* =========================================================
   GET CUSTOMER
========================================================= */

function getCustomerData() {

    try {

        const data =
            localStorage.getItem(
                CUSTOMER_KEY
            );

        if (!data) {
            return null;
        }

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Customer data error:",
            error
        );

        return null;
    }
}


/* =========================================================
   API REQUEST
========================================================= */

async function apiRequest(
    endpoint,
    options = {}
) {

    const token =
        localStorage.getItem(
            TOKEN_KEY
        );


    const requestOptions = {

        ...options,

        headers: {

            ...(options.headers || {}),

            "Content-Type":
                "application/json"

        }

    };


    if (token) {

        requestOptions.headers.Authorization =
            "Bearer " + token;

    }


    const response =
        await fetch(
            API_BASE_URL + endpoint,
            requestOptions
        );


    const text =
        await response.text();


    let data = text;


    try {

        data =
            text
                ? JSON.parse(text)
                : null;

    } catch (error) {

        // Response is plain text.
    }


    if (!response.ok) {

        const message =
            typeof data === "string"
                ? data
                : (
                    data &&
                    data.message
                        ? data.message
                        : "Request failed."
                );

        throw new Error(
            message
        );

    }


    return data;
}


/* =========================================================
   GET ORDER ID FROM URL
========================================================= */

function getOrderIdFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const orderId =
        params.get("orderId");


    if (!orderId) {

        return null;

    }


    return orderId;

}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

    const number =
        Number(price) || 0;


    return (
        "₹" +
        number.toLocaleString(
            "en-IN"
        )
    );

}


/* =========================================================
   NORMALIZE STATUS
========================================================= */

function normalizeStatus(
    status
) {

    const value =
        String(
            status ||
            "PLACED"
        )
            .trim()
            .toUpperCase();


    if (
        value === "CONFIRMED"
    ) {

        return "Confirmed";

    }


    if (
        value === "SHIPPED"
    ) {

        return "Shipped";

    }


    if (
        value === "DELIVERED"
    ) {

        return "Delivered";

    }


    if (
        value === "CANCELLED"
    ) {

        return "Cancelled";

    }


    return "Placed";

}


/* =========================================================
   LOAD ORDER FROM BACKEND
========================================================= */

async function loadOrderConfirmation() {

    /* =====================================================
       GET ORDER ID
    ===================================================== */

    const orderId =
        getOrderIdFromURL();


    if (!orderId) {

        showOrderError(
            "No order ID was provided."
        );

        return;

    }


    /* =====================================================
       CHECK TOKEN
    ===================================================== */

    const token =
        localStorage.getItem(
            TOKEN_KEY
        );


    if (!token) {

        showOrderError(
            "Please login to view your order."
        );

        return;

    }


    /* =====================================================
       LOAD ORDER
    ===================================================== */

    let orderData;


    try {

        orderData =
            await apiRequest(
                "/orders/" +
                encodeURIComponent(
                    orderId
                )
            );

    } catch (error) {

        console.error(
            "Unable to load order:",
            error
        );


        showOrderError(
            error.message ||
            "Unable to load order details."
        );

        return;

    }


    if (!orderData) {

        showOrderError(
            "Order details were not found."
        );

        return;

    }


    /* =====================================================
       DISPLAY ORDER ID
    ===================================================== */

    if (orderIdElement) {

        orderIdElement.textContent =
            "#" + orderData.id;

    }


    /* =====================================================
       ORDER DATE
       =====================================================

       The current backend Order entity does not
       contain an order date field.

    */

    if (orderDateElement) {

        orderDateElement.textContent =
            "Date not available";

    }


    /* =====================================================
       PAYMENT METHOD
       =====================================================

       Payment method is not currently stored in
       the backend Order entity.

    */

    if (orderPaymentElement) {

        orderPaymentElement.textContent =
            "Not specified";

    }


    /* =====================================================
       CUSTOMER DETAILS
    ===================================================== */

    if (customerDetails) {

        const customer =
            getCustomerData();


        if (customer) {

            customerDetails.innerHTML = `

                <div class="customer-info-item">

                    <span>
                        Name
                    </span>

                    <strong>
                        ${
                            customer.name ||
                            customer.fullName ||
                            "--"
                        }
                    </strong>

                </div>


                <div class="customer-info-item">

                    <span>
                        Email
                    </span>

                    <strong>
                        ${
                            customer.email ||
                            "--"
                        }
                    </strong>

                </div>


                <div class="customer-info-item">

                    <span>
                        Phone
                    </span>

                    <strong>
                        ${
                            customer.phone ||
                            "--"
                        }
                    </strong>

                </div>


                <div class="customer-info-item">

                    <span>
                        Customer ID
                    </span>

                    <strong>
                        ${
                            orderData.customerId ||
                            "--"
                        }
                    </strong>

                </div>

            `;

        } else {

            customerDetails.innerHTML = `

                <div class="customer-info-item">

                    <span>
                        Customer ID
                    </span>

                    <strong>
                        ${
                            orderData.customerId ||
                            "--"
                        }
                    </strong>

                </div>

            `;

        }

    }


    /* =====================================================
       ORDER ITEMS
    ===================================================== */

    if (confirmedItems) {

        confirmedItems.innerHTML = "";


        const items =
            Array.isArray(
                orderData.items
            )
                ? orderData.items
                : [];


        if (items.length === 0) {

            confirmedItems.innerHTML = `

                <p class="no-order-message">
                    No product information available.
                </p>

            `;

        } else {

            items.forEach(
                function(item) {

                    const price =
                        Number(
                            item.price
                        ) || 0;


                    const quantity =
                        Number(
                            item.quantity
                        ) || 1;


                    const itemTotal =
                        price *
                        quantity;


                    const itemElement =
                        document.createElement(
                            "div"
                        );


                    itemElement.className =
                        "confirmed-item";


                    itemElement.innerHTML = `

                        <div class="confirmed-item-info">

                            <h3>
                                ${
                                    item.productName ||
                                    item.name ||
                                    "Product"
                                }
                            </h3>

                            <p>
                                Qty: ${quantity}
                            </p>

                            <small>
                                Price: ${formatPrice(price)}
                            </small>

                        </div>


                        <strong
                            class="confirmed-item-price"
                        >

                            ${formatPrice(itemTotal)}

                        </strong>

                    `;


                    confirmedItems.appendChild(
                        itemElement
                    );

                }
            );

        }

    }


    /* =====================================================
       TOTAL
    ===================================================== */

    if (confirmedTotal) {

        confirmedTotal.textContent =
            formatPrice(
                orderData.totalAmount
            );

    }


    /* =====================================================
       ORDER STATUS
    ===================================================== */

    const status =
        normalizeStatus(
            orderData.status
        );


    /*
     * If the page contains an element for status,
     * display the current backend status.
     */

    const statusElement =
        document.querySelector(
            "#order-status"
        );


    if (statusElement) {

        statusElement.textContent =
            status;

    }


    console.log(
        "Order confirmation loaded:",
        orderData
    );

}


/* =========================================================
   SHOW ERROR
========================================================= */

function showOrderError(
    message
) {

    if (customerDetails) {

        customerDetails.innerHTML = `

            <div class="no-order-message">

                <p>
                    ${message}
                </p>

                <a
                    href="products.html"
                    class="start-shopping-button"
                >
                    Continue Shopping
                </a>

            </div>

        `;

    }

}


/* =========================================================
   INITIALIZE PAGE
========================================================= */

loadOrderConfirmation();


/* =========================================================
   END OF ORDER CONFIRMATION JAVASCRIPT
========================================================= */
