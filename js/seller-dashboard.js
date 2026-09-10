/* =========================================================
   SHOPSPHERE SELLER DASHBOARD
   Complete Backend Connected Version
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       CONFIGURATION
    ===================================================== */

    const API_BASE_URL = "http://localhost:8080/api";

    const SELLER_KEY = "shopSphereCurrentSeller";
    const TOKEN_KEY = "shopSphereToken";

    const COMMISSION_RATE = 0.10;


    /* =====================================================
       HELPER - GET CURRENT SELLER
    ===================================================== */

    function getCurrentSeller() {

        const sellerData =
            localStorage.getItem(SELLER_KEY);

        if (!sellerData) {
            return null;
        }

        try {

            return JSON.parse(sellerData);

        } catch (error) {

            console.error(
                "Invalid seller data in localStorage:",
                error
            );

            return null;
        }
    }


    /* =====================================================
       HELPER - API REQUEST
    ===================================================== */

    async function apiRequest(
        endpoint,
        options = {}
    ) {

        const token =
            localStorage.getItem(TOKEN_KEY);

        const headers = {

            "Content-Type":
                "application/json",

            ...(options.headers || {})

        };


        if (token) {

            headers["Authorization"] =
                "Bearer " + token;

        }


        const response =
            await fetch(
                API_BASE_URL + endpoint,
                {
                    ...options,
                    headers: headers
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            console.error(
                "Authentication failed."
            );

            localStorage.removeItem(
                SELLER_KEY
            );

            localStorage.removeItem(
                TOKEN_KEY
            );

            window.location.href =
                "seller-login.html";

            throw new Error(
                "Authentication failed"
            );
        }


        const text =
            await response.text();


        if (!response.ok) {

            throw new Error(
                text ||
                "Request failed"
            );
        }


        if (!text) {

            return null;
        }


        try {

            return JSON.parse(text);

        } catch {

            return text;
        }
    }


    /* =====================================================
       GET ORDER STATUS
    ===================================================== */

    function getOrderStatus(order) {

        if (!order || !order.status) {

            return "PLACED";
        }

        return String(
            order.status
        ).toUpperCase();
    }


    /* =====================================================
       LOAD SELLER INFORMATION
    ===================================================== */

    async function loadSellerInformation() {

        const seller =
            getCurrentSeller();


        if (!seller || !seller.id) {

            window.location.href =
                "seller-login.html";

            return null;
        }


        try {

            const sellerData =
                await apiRequest(
                    `/sellers/${seller.id}`
                );


            /* =================================================
               UPDATE LOCAL SELLER DATA
            ================================================= */

            const updatedSeller = {

                ...seller,

                ...sellerData

            };


            localStorage.setItem(
                SELLER_KEY,
                JSON.stringify(updatedSeller)
            );


            /* =================================================
               WELCOME SECTION
            ================================================= */

            const storeNameElement =
                document.getElementById(
                    "seller-store-name"
                );


            if (storeNameElement) {

                storeNameElement.textContent =
                    sellerData.storeName ||
                    sellerData.name ||
                    "Vendor Dashboard";
            }


            const sellerDetailsElement =
                document.getElementById(
                    "seller-details"
                );


            if (sellerDetailsElement) {

                sellerDetailsElement.textContent =
                    `Welcome to ${sellerData.storeName || sellerData.name || "your ShopSphere store"}.`;
            }


            /* =================================================
               STORE INFORMATION
            ================================================= */

            const storeInfoName =
                document.getElementById(
                    "store-info-name"
                );


            if (storeInfoName) {

                storeInfoName.textContent =
                    sellerData.storeName ||
                    sellerData.name ||
                    "—";
            }


            const storeInfoOwner =
                document.getElementById(
                    "store-info-owner"
                );


            if (storeInfoOwner) {

                storeInfoOwner.textContent =
                    sellerData.name ||
                    "—";
            }


            const storeInfoEmail =
                document.getElementById(
                    "store-info-email"
                );


            if (storeInfoEmail) {

                storeInfoEmail.textContent =
                    sellerData.email ||
                    "—";
            }


            const storeInfoCategory =
                document.getElementById(
                    "store-info-category"
                );


            if (storeInfoCategory) {

                storeInfoCategory.textContent =
                    sellerData.category ||
                    "—";
            }


            /* =================================================
               FILL EDIT STORE FORM
            ================================================= */

            const editName =
                document.getElementById(
                    "edit-seller-name"
                );

            const editEmail =
                document.getElementById(
                    "edit-seller-email"
                );

            const editStoreName =
                document.getElementById(
                    "edit-store-name"
                );

            const editCategory =
                document.getElementById(
                    "edit-seller-category"
                );


            if (editName) {

                editName.value =
                    sellerData.name || "";
            }


            if (editEmail) {

                editEmail.value =
                    sellerData.email || "";
            }


            if (editStoreName) {

                editStoreName.value =
                    sellerData.storeName || "";
            }


            if (editCategory) {

                editCategory.value =
                    sellerData.category || "";
            }


            return sellerData;

        } catch (error) {

            console.error(
                "Error loading seller information:",
                error
            );

            return seller;
        }
    }


    /* =====================================================
       LOAD SELLER PRODUCTS
    ===================================================== */

    async function loadSellerProducts() {

        const seller =
            getCurrentSeller();


        if (!seller || !seller.id) {

            return [];
        }


        const productList =
            document.getElementById(
                "product-list"
            );


        try {

            const products =
                await apiRequest(
                    `/products/seller/${seller.id}`
                );


            const sellerProducts =
                Array.isArray(products)
                    ? products
                    : [];


            /* =================================================
               TOTAL PRODUCTS
            ================================================= */

            const totalProducts =
                document.getElementById(
                    "total-products"
                );


            if (totalProducts) {

                totalProducts.textContent =
                    sellerProducts.length;
            }


            /* =================================================
               DISPLAY PRODUCTS
            ================================================= */

            if (!productList) {

                return sellerProducts;
            }


            productList.innerHTML = "";


            if (sellerProducts.length === 0) {

                productList.innerHTML = `

                    <div class="empty-products">

                        <h3>
                            No Products Yet
                        </h3>

                        <p>
                            Add your first product to your store.
                        </p>

                    </div>

                `;

                return sellerProducts;
            }


            sellerProducts.forEach(
                function (product) {

                    const productCard =
                        document.createElement(
                            "div"
                        );


                    productCard.className =
                        "seller-product-card";


                    const status =
                        product.status ||
                        "APPROVED";


                    productCard.innerHTML = `

                        <div class="seller-product-image">

                            <img
                                src="${product.imageUrl || "../images/placeholder.jpg"}"
                                alt="${product.name || "Product"}"
                                onerror="this.style.display='none'"
                            >

                        </div>


                        <div class="seller-product-content">

                            <h3>
                                ${product.name || "Unnamed Product"}
                            </h3>


                            <p class="seller-product-category">
                                ${product.category || "—"}
                            </p>


                            <p class="seller-product-description">
                                ${product.description || ""}
                            </p>


                            <div class="seller-product-details">

                                <strong>
                                    ₹${Number(product.price || 0).toFixed(2)}
                                </strong>

                                <span>
                                    Stock: ${product.stock ?? 0}
                                </span>

                            </div>


                            <div class="seller-product-status">

                                <span>
                                    Status: ${status}
                                </span>

                            </div>


                            <div class="seller-product-actions">

                                <button
                                    type="button"
                                    class="edit-product-button"
                                    data-product-id="${product.id}"
                                >
                                    Edit
                                </button>


                                <button
                                    type="button"
                                    class="delete-product-button"
                                    data-product-id="${product.id}"
                                >
                                    Delete
                                </button>


                                <button
                                    type="button"
                                    class="stock-minus-button"
                                    data-product-id="${product.id}"
                                >
                                    −
                                </button>


                                <button
                                    type="button"
                                    class="stock-plus-button"
                                    data-product-id="${product.id}"
                                >
                                    +
                                </button>

                            </div>

                        </div>

                    `;


                    productList.appendChild(
                        productCard
                    );

                }
            );


            attachProductEvents(
                sellerProducts
            );


            return sellerProducts;

        } catch (error) {

            console.error(
                "Error loading seller products:",
                error
            );


            if (productList) {

                productList.innerHTML = `

                    <div class="error-message">

                        <h3>
                            Unable to Load Products
                        </h3>

                        <p>
                            Please refresh the page.
                        </p>

                    </div>

                `;
            }


            return [];
        }
    }


    /* =====================================================
       ADD PRODUCT
    ===================================================== */

    async function addProduct(productData) {

        const seller =
            getCurrentSeller();


        if (!seller || !seller.id) {

            alert(
                "Please login again."
            );

            return;
        }


        productData.sellerId =
            seller.id;


        productData.status =
            "PENDING";


        try {

            await apiRequest(
                "/products",
                {
                    method: "POST",

                    body:
                        JSON.stringify(
                            productData
                        )
                }
            );


            alert(
                "Product added successfully! Waiting for admin approval."
            );


            document
                .getElementById(
                    "product-form"
                )
                .reset();


            document
                .getElementById(
                    "product-form-title"
                )
                .textContent =
                    "Add New Product";


            document
                .getElementById(
                    "product-submit-button"
                )
                .textContent =
                    "Add Product";


            document
                .getElementById(
                    "cancel-product-edit"
                )
                .hidden = true;


            await loadSellerProducts();


        } catch (error) {

            console.error(
                "Error adding product:",
                error
            );


            alert(
                "Unable to add product."
            );
        }
    }


    /* =====================================================
       EDIT PRODUCT
    ===================================================== */

    let editingProductId = null;


    async function updateProduct(
        productId,
        productData
    ) {

        try {

            const seller =
                getCurrentSeller();


            productData.sellerId =
                seller.id;


            await apiRequest(
                `/products/${productId}`,
                {
                    method: "PUT",

                    body:
                        JSON.stringify(
                            productData
                        )
                }
            );


            alert(
                "Product updated successfully."
            );


            editingProductId = null;


            const form =
                document.getElementById(
                    "product-form"
                );


            form.reset();


            document
                .getElementById(
                    "product-form-title"
                )
                .textContent =
                    "Add New Product";


            document
                .getElementById(
                    "product-submit-button"
                )
                .textContent =
                    "Add Product";


            document
                .getElementById(
                    "cancel-product-edit"
                )
                .hidden = true;


            await loadSellerProducts();


        } catch (error) {

            console.error(
                "Error updating product:",
                error
            );


            alert(
                "Unable to update product."
            );
        }
    }


    /* =====================================================
       DELETE PRODUCT
    ===================================================== */

    async function deleteProduct(
        productId
    ) {

        const confirmed =
            confirm(
                "Are you sure you want to delete this product?"
            );


        if (!confirmed) {

            return;
        }


        try {

            await apiRequest(
                `/products/${productId}`,
                {
                    method: "DELETE"
                }
            );


            alert(
                "Product deleted successfully."
            );


            await loadSellerProducts();


        } catch (error) {

            console.error(
                "Error deleting product:",
                error
            );


            alert(
                "Unable to delete product."
            );
        }
    }


    /* =====================================================
       UPDATE STOCK
    ===================================================== */

    async function updateStock(
        productId,
        change
    ) {

        try {

            const product =
                await apiRequest(
                    `/products/${productId}`
                );


            if (!product) {

                return;
            }


            const currentStock =
                Number(product.stock) || 0;


            const newStock =
                currentStock + change;


            if (newStock < 0) {

                alert(
                    "Stock cannot be negative."
                );

                return;
            }


            product.stock =
                newStock;


            await apiRequest(
                `/products/${productId}`,
                {
                    method: "PUT",

                    body:
                        JSON.stringify(
                            product
                        )
                }
            );


            await loadSellerProducts();


        } catch (error) {

            console.error(
                "Error updating stock:",
                error
            );


            alert(
                "Unable to update stock."
            );
        }
    }


    /* =====================================================
       PRODUCT EVENTS
    ===================================================== */

    function attachProductEvents(
        products
    ) {

        document
            .querySelectorAll(
                ".edit-product-button"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const productId =
                                Number(
                                    button.dataset.productId
                                );


                            const product =
                                products.find(
                                    function (item) {

                                        return Number(
                                            item.id
                                        ) === productId;

                                    }
                                );


                            if (!product) {

                                return;
                            }


                            editingProductId =
                                product.id;


                            document
                                .getElementById(
                                    "product-name"
                                )
                                .value =
                                    product.name || "";


                            document
                                .getElementById(
                                    "product-price"
                                )
                                .value =
                                    product.price || "";


                            document
                                .getElementById(
                                    "product-category"
                                )
                                .value =
                                    product.category || "";


                            document
                                .getElementById(
                                    "product-stock"
                                )
                                .value =
                                    product.stock || 0;


                            document
                                .getElementById(
                                    "product-image"
                                )
                                .value =
                                    product.imageUrl || "";


                            document
                                .getElementById(
                                    "product-description"
                                )
                                .value =
                                    product.description || "";


                            document
                                .getElementById(
                                    "product-form-title"
                                )
                                .textContent =
                                    "Edit Product";


                            document
                                .getElementById(
                                    "product-submit-button"
                                )
                                .textContent =
                                    "Update Product";


                            document
                                .getElementById(
                                    "cancel-product-edit"
                                )
                                .hidden = false;


                            window.scrollTo(
                                {
                                    top: 0,
                                    behavior: "smooth"
                                }
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".delete-product-button"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            deleteProduct(
                                Number(
                                    button.dataset.productId
                                )
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".stock-minus-button"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            updateStock(
                                Number(
                                    button.dataset.productId
                                ),
                                -1
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".stock-plus-button"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            updateStock(
                                Number(
                                    button.dataset.productId
                                ),
                                1
                            );

                        }
                    );

                }
            );
    }


    /* =====================================================
       PRODUCT FORM SUBMIT
    ===================================================== */

    const productForm =
        document.getElementById(
            "product-form"
        );


    if (productForm) {

        productForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const productData = {

                    name:
                        document
                            .getElementById(
                                "product-name"
                            )
                            .value
                            .trim(),

                    price:
                        Number(
                            document
                                .getElementById(
                                    "product-price"
                                )
                                .value
                        ),

                    category:
                        document
                            .getElementById(
                                "product-category"
                            )
                            .value,

                    stock:
                        Number(
                            document
                                .getElementById(
                                    "product-stock"
                                )
                                .value
                        ),

                    imageUrl:
                        document
                            .getElementById(
                                "product-image"
                            )
                            .value
                            .trim(),

                    description:
                        document
                            .getElementById(
                                "product-description"
                            )
                            .value
                            .trim()

                };


                if (
                    !productData.name ||
                    !productData.category ||
                    !productData.imageUrl ||
                    !productData.description ||
                    productData.price <= 0 ||
                    productData.stock < 0
                ) {

                    alert(
                        "Please enter all product details correctly."
                    );

                    return;
                }


                if (editingProductId) {

                    await updateProduct(
                        editingProductId,
                        productData
                    );

                } else {

                    await addProduct(
                        productData
                    );

                }

            }
        );
    }


    /* =====================================================
       CANCEL PRODUCT EDIT
    ===================================================== */

    const cancelProductEdit =
        document.getElementById(
            "cancel-product-edit"
        );


    if (cancelProductEdit) {

        cancelProductEdit.addEventListener(
            "click",
            function () {

                editingProductId = null;


                document
                    .getElementById(
                        "product-form"
                    )
                    .reset();


                document
                    .getElementById(
                        "product-form-title"
                    )
                    .textContent =
                        "Add New Product";


                document
                    .getElementById(
                        "product-submit-button"
                    )
                    .textContent =
                        "Add Product";


                cancelProductEdit.hidden =
                    true;

            }
        );
    }


    /* =====================================================
       EDIT STORE
    ===================================================== */

    const editStoreButton =
        document.getElementById(
            "edit-store-button"
        );


    const editStoreContainer =
        document.getElementById(
            "edit-store-form-container"
        );


    const cancelEditStore =
        document.getElementById(
            "cancel-edit-store"
        );


    if (editStoreButton) {

        editStoreButton.addEventListener(
            "click",
            function () {

                if (editStoreContainer) {

                    editStoreContainer.hidden =
                        false;

                }

            }
        );
    }


    if (cancelEditStore) {

        cancelEditStore.addEventListener(
            "click",
            function () {

                if (editStoreContainer) {

                    editStoreContainer.hidden =
                        true;

                }

            }
        );
    }


    /* =====================================================
       UPDATE STORE
    ===================================================== */

    const editStoreForm =
        document.getElementById(
            "edit-store-form"
        );


    if (editStoreForm) {

        editStoreForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const seller =
                    getCurrentSeller();


                if (!seller || !seller.id) {

                    return;
                }


                const sellerData = {

                    name:
                        document
                            .getElementById(
                                "edit-seller-name"
                            )
                            .value
                            .trim(),

                    email:
                        document
                            .getElementById(
                                "edit-seller-email"
                            )
                            .value
                            .trim()
                            .toLowerCase(),

                    storeName:
                        document
                            .getElementById(
                                "edit-store-name"
                            )
                            .value
                            .trim(),

                    category:
                        document
                            .getElementById(
                                "edit-seller-category"
                            )
                            .value

                };


                const message =
                    document.getElementById(
                        "edit-store-message"
                    );


                try {

                    const updatedSeller =
                        await apiRequest(
                            `/sellers/${seller.id}`,
                            {
                                method: "PUT",

                                body:
                                    JSON.stringify(
                                        sellerData
                                    )
                            }
                        );


                    const newSeller =
                        {
                            ...seller,
                            ...updatedSeller
                        };


                    localStorage.setItem(
                        SELLER_KEY,
                        JSON.stringify(
                            newSeller
                        )
                    );


                    if (message) {

                        message.textContent =
                            "Store updated successfully.";

                        message.className =
                            "edit-store-message success";
                    }


                    await loadSellerInformation();


                    setTimeout(
                        function () {

                            if (
                                editStoreContainer
                            ) {

                                editStoreContainer.hidden =
                                    true;

                            }

                        },
                        1000
                    );


                } catch (error) {

                    console.error(
                        "Error updating store:",
                        error
                    );


                    if (message) {

                        message.textContent =
                            "Unable to update store.";

                        message.className =
                            "edit-store-message error";
                    }

                }

            }
        );
    }


    /* =====================================================
       SELLER ORDERS
    ===================================================== */

    async function displaySellerOrders() {

        const ordersContainer =
            document.getElementById(
                "seller-orders-list"
            );


        if (!ordersContainer) {

            return;
        }


        try {

            const seller =
                getCurrentSeller();


            if (!seller || !seller.id) {

                ordersContainer.innerHTML =
                    "<p>Please login again.</p>";

                return;
            }


            const sellerId =
                seller.id;


            const response =
                await apiRequest(
                    `/orders/seller/${sellerId}`
                );


            const sellerOrderItems =
                Array.isArray(response)
                    ? response
                    : [];


            /* =================================================
               NO ORDERS
            ================================================= */

            if (
                sellerOrderItems.length === 0
            ) {

                ordersContainer.innerHTML = `

                    <div class="empty-orders">

                        <h3>
                            No Orders Yet
                        </h3>

                        <p>
                            Orders containing your products will appear here.
                        </p>

                    </div>

                `;


                updateOrderSummary(
                    0,
                    0
                );


                return;
            }


            /* =================================================
               GROUP ITEMS BY ORDER
            ================================================= */

            const groupedOrders = {};


            sellerOrderItems.forEach(
                function (item) {

                    const orderId =
                        item.orderId;


                    if (!orderId) {

                        return;
                    }


                    if (
                        !groupedOrders[orderId]
                    ) {

                        groupedOrders[orderId] = {

                            orderId:
                                orderId,

                            customerId:
                                item.customerId,

                            status:
                                item.status ||
                                "PLACED",

                            items: []

                        };

                    }


                    groupedOrders[
                        orderId
                    ].items.push({

                        productId:
                            item.productId,

                        productName:
                            item.productName ||
                            "Product",

                        quantity:
                            Number(
                                item.quantity
                            ) || 0,

                        price:
                            Number(
                                item.price
                            ) || 0

                    });

                }
            );


            const orders =
                Object.values(
                    groupedOrders
                );


            /* =================================================
               CALCULATE SALES
            ================================================= */

            let totalSales = 0;


            orders.forEach(
                function (order) {

                    order.items.forEach(
                        function (item) {

                            totalSales +=
                                Number(
                                    item.price
                                ) *
                                Number(
                                    item.quantity
                                );

                        }
                    );

                }
            );


            const commission =
                totalSales *
                COMMISSION_RATE;


            const earnings =
                totalSales -
                commission;


            updateOrderSummary(
                totalSales,
                commission,
                earnings
            );


            /* =================================================
               DISPLAY ORDERS
            ================================================= */

            ordersContainer.innerHTML =
                "";


            orders.forEach(
                function (order) {

                    const status =
                        getOrderStatus(
                            order
                        );


                    const statusDisplay =
                        status.charAt(0) +
                        status.slice(1)
                            .toLowerCase();


                    let orderTotal = 0;

                    let itemsHTML = "";


                    order.items.forEach(
                        function (item) {

                            const itemTotal =
                                Number(
                                    item.price
                                ) *
                                Number(
                                    item.quantity
                                );


                            orderTotal +=
                                itemTotal;


                            itemsHTML += `

                                <div class="order-item">

                                    <div class="order-item-details">

                                        <strong>
                                            ${item.productName}
                                        </strong>

                                        <span>
                                            Quantity: ${item.quantity}
                                        </span>

                                    </div>


                                    <div class="order-item-price">

                                        ₹${itemTotal.toFixed(2)}

                                    </div>

                                </div>

                            `;

                        }
                    );


                    const orderCard =
                        document.createElement(
                            "div"
                        );


                    orderCard.className =
                        "seller-order-card";


                    orderCard.innerHTML = `

                        <div class="order-card-header">

                            <div>

                                <h3>
                                    Order #${order.orderId}
                                </h3>

                                <p>
                                    Customer #${order.customerId}
                                </p>

                            </div>


                            <div class="order-status-section">

                                <label
                                    for="status-${order.orderId}"
                                >
                                    Status
                                </label>


                                <select
                                    id="status-${order.orderId}"
                                    class="order-status-select"
                                    data-order-id="${order.orderId}"
                                >

                                    <option
                                        value="PLACED"
                                        ${status === "PLACED" ? "selected" : ""}
                                    >
                                        Placed
                                    </option>


                                    <option
                                        value="CONFIRMED"
                                        ${status === "CONFIRMED" ? "selected" : ""}
                                    >
                                        Confirmed
                                    </option>


                                    <option
                                        value="SHIPPED"
                                        ${status === "SHIPPED" ? "selected" : ""}
                                    >
                                        Shipped
                                    </option>


                                    <option
                                        value="DELIVERED"
                                        ${status === "DELIVERED" ? "selected" : ""}
                                    >
                                        Delivered
                                    </option>


                                    <option
                                        value="CANCELLED"
                                        ${status === "CANCELLED" ? "selected" : ""}
                                    >
                                        Cancelled
                                    </option>

                                </select>

                            </div>

                        </div>


                        <div class="order-card-body">


                            <div class="order-info">

                                <div>

                                    <span class="label">
                                        Order ID
                                    </span>

                                    <span class="value">
                                        #${order.orderId}
                                    </span>

                                </div>


                                <div>

                                    <span class="label">
                                        Customer ID
                                    </span>

                                    <span class="value">
                                        #${order.customerId}
                                    </span>

                                </div>


                                <div>

                                    <span class="label">
                                        Status
                                    </span>

                                    <span class="value">
                                        ${statusDisplay}
                                    </span>

                                </div>

                            </div>


                            <div class="order-items">

                                <h4>
                                    Products
                                </h4>

                                ${itemsHTML}

                            </div>


                            <div class="order-card-footer">


                                <div>

                                    <span>
                                        Seller Sales
                                    </span>

                                    <strong>
                                        ₹${orderTotal.toFixed(2)}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Commission (10%)
                                    </span>

                                    <strong>
                                        ₹${(
                                            orderTotal *
                                            COMMISSION_RATE
                                        ).toFixed(2)}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Your Earnings
                                    </span>

                                    <strong>
                                        ₹${(
                                            orderTotal -
                                            (
                                                orderTotal *
                                                COMMISSION_RATE
                                            )
                                        ).toFixed(2)}
                                    </strong>

                                </div>


                            </div>


                        </div>

                    `;


                    ordersContainer.appendChild(
                        orderCard
                    );

                }
            );


            addOrderStatusEvents();


        } catch (error) {

            console.error(
                "Error loading seller orders:",
                error
            );


            ordersContainer.innerHTML = `

                <div class="error-message">

                    <h3>
                        Unable to Load Orders
                    </h3>

                    <p>
                        Please refresh the page and try again.
                    </p>

                </div>

            `;

        }

    }


    /* =====================================================
       ORDER SUMMARY
    ===================================================== */

    function updateOrderSummary(
        totalSales,
        commission,
        earnings
    ) {

        const totalSalesElement =
            document.getElementById(
                "total-sales"
            );


        if (totalSalesElement) {

            totalSalesElement.textContent =
                `₹${Number(totalSales).toFixed(2)}`;
        }


        const commissionElement =
            document.getElementById(
                "total-commission"
            );


        if (commissionElement) {

            commissionElement.textContent =
                `₹${Number(commission).toFixed(2)}`;
        }


        const earningsElement =
            document.getElementById(
                "seller-earnings"
            );


        if (earningsElement) {

            earningsElement.textContent =
                `₹${Number(earnings).toFixed(2)}`;
        }

    }


    /* =====================================================
       ORDER STATUS EVENTS
    ===================================================== */

    function addOrderStatusEvents() {

        document
            .querySelectorAll(
                ".order-status-select"
            )
            .forEach(
                function (select) {

                    select.addEventListener(
                        "change",
                        async function () {

                            const orderId =
                                Number(
                                    select.dataset.orderId
                                );


                            const newStatus =
                                select.value;


                            await updateOrderStatus(
                                orderId,
                                newStatus
                            );

                        }
                    );

                }
            );

    }


    /* =====================================================
       UPDATE ORDER STATUS
    ===================================================== */

    async function updateOrderStatus(
        orderId,
        newStatus
    ) {

        const seller =
            getCurrentSeller();


        if (!seller || !seller.id) {

            return;
        }


        try {

            await apiRequest(
                `/orders/${orderId}/status?sellerId=${seller.id}&status=${newStatus}`,
                {
                    method: "PUT"
                }
            );


            alert(
                "Order status updated successfully."
            );


            await displaySellerOrders();


        } catch (error) {

            console.error(
                "Error updating order status:",
                error
            );


            alert(
                "Unable to update order status."
            );


            await displaySellerOrders();

        }

    }


    /* =====================================================
       TOTAL ORDERS
    ===================================================== */

    async function loadTotalOrders() {

        const seller =
            getCurrentSeller();


        if (!seller || !seller.id) {

            return;
        }


        try {

            const response =
                await apiRequest(
                    `/orders/seller/${seller.id}`
                );


            const orderItems =
                Array.isArray(response)
                    ? response
                    : [];


            const uniqueOrderIds =
                new Set();


            orderItems.forEach(
                function (item) {

                    if (item.orderId) {

                        uniqueOrderIds.add(
                            item.orderId
                        );

                    }

                }
            );


            const totalOrders =
                document.getElementById(
                    "total-orders"
                );


            if (totalOrders) {

                totalOrders.textContent =
                    uniqueOrderIds.size;
            }


        } catch (error) {

            console.error(
                "Error loading total orders:",
                error
            );

        }

    }


    /* =====================================================
       INITIAL DASHBOARD LOAD
    ===================================================== */

    async function initializeDashboard() {

        console.log(
            "ShopSphere Seller Dashboard loading..."
        );


        const seller =
            getCurrentSeller();


        if (!seller || !seller.id) {

            console.error(
                "Seller session not found."
            );


            window.location.href =
                "seller-login.html";

            return;
        }


        console.log(
            "Logged in seller:",
            seller
        );


        /*
         * Load everything independently.
         */

        await loadSellerInformation();

        await loadSellerProducts();

        await displaySellerOrders();

        await loadTotalOrders();


        console.log(
            "Seller dashboard loaded successfully."
        );

    }


    /* =====================================================
       START DASHBOARD
    ===================================================== */

    initializeDashboard();

});