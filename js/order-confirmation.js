/* =========================================================
   SHOPSPHERE
   ORDER CONFIRMATION PAGE JAVASCRIPT
========================================================= */


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
   LOAD SAVED ORDER
========================================================= */

function loadOrderConfirmation() {

    const savedOrder =
        localStorage.getItem("shopSphereOrder");


    /* =====================================================
       CHECK IF ORDER EXISTS
    ===================================================== */

    if (!savedOrder) {

        if (customerDetails) {

            customerDetails.innerHTML = `
                <p class="no-order-message">
                    No recent order was found.
                </p>
            `;

        }

        return;
    }


    let orderData;


    try {

        orderData =
            JSON.parse(savedOrder);

    } catch (error) {

        console.error(
            "Unable to read order data:",
            error
        );

        return;
    }



    /* =====================================================
       CREATE ORDER ID
    ===================================================== */

    let orderId =
        localStorage.getItem("shopSphereOrderId");


    if (!orderId) {

        orderId =
            "SS" +
            Date.now()
                .toString()
                .slice(-8);


        localStorage.setItem(
            "shopSphereOrderId",
            orderId
        );

    }



    /* =====================================================
       ORDER ID
    ===================================================== */

    if (orderIdElement) {

        orderIdElement.textContent =
            "#" + orderId;

    }



    /* =====================================================
       ORDER DATE
    ===================================================== */

    if (orderDateElement) {

        orderDateElement.textContent =
            orderData.orderDate || "--";

    }



    /* =====================================================
       PAYMENT METHOD
    ===================================================== */

    if (orderPaymentElement) {

        let paymentText =
            "UPI";


        if (
            orderData.paymentMethod ===
            "card"
        ) {

            paymentText =
                "Credit / Debit Card";

        }


        if (
            orderData.paymentMethod ===
            "cod"
        ) {

            paymentText =
                "Cash on Delivery";

        }


        if (
            orderData.paymentMethod ===
            "upi"
        ) {

            let upiApp =
                orderData.upiApp;


            if (
                upiApp ===
                "google-pay"
            ) {

                paymentText =
                    "Google Pay";

            } else if (
                upiApp ===
                "phonepe"
            ) {

                paymentText =
                    "PhonePe";

            } else if (
                upiApp ===
                "paytm"
            ) {

                paymentText =
                    "Paytm";

            } else if (
                upiApp ===
                "other"
            ) {

                paymentText =
                    "Other UPI";

            } else {

                paymentText =
                    "UPI";

            }

        }


        orderPaymentElement.textContent =
            paymentText;

    }



    /* =====================================================
       CUSTOMER INFORMATION
    ===================================================== */

    if (
        customerDetails &&
        orderData.customer
    ) {

        const customer =
            orderData.customer;


        customerDetails.innerHTML = `

            <div class="customer-info-item">

                <span>
                    Name
                </span>

                <strong>
                    ${customer.name || "--"}
                </strong>

            </div>


            <div class="customer-info-item">

                <span>
                    Email
                </span>

                <strong>
                    ${customer.email || "--"}
                </strong>

            </div>


            <div class="customer-info-item">

                <span>
                    Phone
                </span>

                <strong>
                    ${customer.phone || "--"}
                </strong>

            </div>


            <div class="customer-info-item">

                <span>
                    Address
                </span>

                <strong>
                    ${customer.address || "--"}
                </strong>

            </div>


            <div class="customer-info-item">

                <span>
                    City
                </span>

                <strong>
                    ${customer.city || "--"}
                </strong>

            </div>


            <div class="customer-info-item">

                <span>
                    State
                </span>

                <strong>
                    ${customer.state || "--"}
                </strong>

            </div>


            <div class="customer-info-item">

                <span>
                    PIN Code
                </span>

                <strong>
                    ${customer.pincode || "--"}
                </strong>

            </div>

        `;

    }



    /* =====================================================
       ORDER ITEMS
    ===================================================== */

    if (
        confirmedItems &&
        Array.isArray(orderData.items)
    ) {

        confirmedItems.innerHTML = "";


        let total =
            0;


        orderData.items.forEach(
            function (item) {


                const price =
                    parseFloat(
                        String(item.price)
                            .replace("₹", "")
                            .replace(/,/g, "")
                    ) || 0;


                const quantity =
                    Number(item.quantity) || 1;


                const itemTotal =
                    price * quantity;


                total +=
                    itemTotal;


                const itemElement =
                    document.createElement(
                        "div"
                    );


                itemElement.className =
                    "confirmed-item";


                itemElement.innerHTML = `

                    <div class="confirmed-item-info">

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            Qty: ${quantity}
                        </p>

                    </div>


                    <strong class="confirmed-item-price">

                        ₹${itemTotal.toLocaleString(
                            "en-IN"
                        )}

                    </strong>

                `;


                confirmedItems.appendChild(
                    itemElement
                );

            }
        );


        /* =================================================
           TOTAL
        ================================================= */

        if (confirmedTotal) {

            confirmedTotal.textContent =
                "₹" +
                total.toLocaleString(
                    "en-IN"
                );

        }

    }

}



/* =========================================================
   CLEAR CART AFTER ORDER
========================================================= */

function clearCartAfterOrder() {

    localStorage.removeItem(
        "shopSphereCart"
    );

}



/* =========================================================
   INITIALIZE PAGE
========================================================= */

loadOrderConfirmation();

clearCartAfterOrder();



/* =========================================================
   END OF ORDER CONFIRMATION JAVASCRIPT
========================================================= */