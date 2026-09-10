document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    var API_BASE_URL = "http://localhost:8080/api";
    var TOKEN_KEY = "shopSphereToken";


    // =====================================================
    // GET TOKEN
    // =====================================================

    function getToken() {

        return localStorage.getItem(TOKEN_KEY);
    }


    // =====================================================
    // API REQUEST
    // =====================================================

    async function apiRequest(endpoint, options) {

        options = options || {};

        var headers = {
            "Content-Type": "application/json"
        };

        var token = getToken();

        if (token) {

            headers["Authorization"] =
                "Bearer " + token;
        }


        var response =
            await fetch(
                API_BASE_URL + endpoint,
                {
                    method: options.method || "GET",
                    headers: headers,
                    body: options.body || undefined
                }
            );


        if (response.status === 401) {

            alert(
                "Admin session expired. Please login again."
            );

            window.location.href =
                "admin-login.html";

            return null;
        }


        if (response.status === 403) {

            alert(
                "You are not authorized to perform this action."
            );

            return null;
        }


        if (!response.ok) {

            var errorText =
                await response.text();

            throw new Error(
                errorText || "Request failed"
            );
        }


        var contentType =
            response.headers.get("content-type");


        if (
            contentType &&
            contentType.indexOf("application/json") !== -1
        ) {

            return await response.json();
        }


        return await response.text();
    }


    // =====================================================
    // PRODUCT STATUS CLASS
    // =====================================================

    function getStatusClass(status) {

        status =
            String(
                status || "PENDING"
            ).toUpperCase();


        if (status === "APPROVED") {

            return "status-approved";
        }


        if (status === "REJECTED") {

            return "status-rejected";
        }


        return "status-pending";
    }


    // =====================================================
    // ORDER STATUS CLASS
    // =====================================================

    function getOrderStatusClass(status) {

        status =
            String(
                status || "PLACED"
            ).toUpperCase();


        if (status === "DELIVERED") {

            return "order-status-delivered";
        }


        if (status === "CANCELLED") {

            return "order-status-cancelled";
        }


        if (status === "SHIPPED") {

            return "order-status-shipped";
        }


        if (status === "CONFIRMED") {

            return "order-status-confirmed";
        }


        return "order-status-placed";
    }


    // =====================================================
    // PRICE FORMAT
    // =====================================================

    function formatPrice(price) {

        return Number(price || 0)
            .toLocaleString("en-IN");
    }


    // =====================================================
    // LOAD ALL PRODUCTS
    // =====================================================

    async function loadProducts() {

        try {

            var pendingProducts =
                await apiRequest(
                    "/products/admin/pending"
                );


            if (pendingProducts === null) {

                return;
            }


            var approvedProducts =
                await apiRequest(
                    "/products/approved"
                );


            if (approvedProducts === null) {

                return;
            }


            var rejectedProducts =
                await apiRequest(
                    "/products/admin/rejected"
                );


            if (rejectedProducts === null) {

                return;
            }


            var products = [];


            // Pending

            if (Array.isArray(pendingProducts)) {

                pendingProducts.forEach(
                    function (product) {

                        product.status =
                            "PENDING";

                        products.push(product);
                    }
                );
            }


            // Approved

            if (Array.isArray(approvedProducts)) {

                approvedProducts.forEach(
                    function (product) {

                        product.status =
                            "APPROVED";

                        products.push(product);
                    }
                );
            }


            // Rejected

            if (Array.isArray(rejectedProducts)) {

                rejectedProducts.forEach(
                    function (product) {

                        product.status =
                            "REJECTED";

                        products.push(product);
                    }
                );
            }


            displayProducts(products);

        }
        catch (error) {

            console.error(
                "Error loading products:",
                error
            );


            var productList =
                document.getElementById(
                    "admin-product-list"
                );


            if (productList) {

                productList.innerHTML = "";


                var errorBox =
                    document.createElement("div");

                errorBox.className =
                    "admin-empty";


                var errorTitle =
                    document.createElement("h3");

                errorTitle.textContent =
                    "Unable to load products";


                var errorMessage =
                    document.createElement("p");

                errorMessage.textContent =
                    "Please make sure the ShopSphere backend is running.";


                errorBox.appendChild(
                    errorTitle
                );

                errorBox.appendChild(
                    errorMessage
                );


                productList.appendChild(
                    errorBox
                );
            }
        }
    }


    // =====================================================
    // DISPLAY PRODUCT STATISTICS
    // =====================================================

    function displayStatistics(products) {

        var total =
            document.getElementById(
                "admin-total-products"
            );


        var pending =
            document.getElementById(
                "admin-pending-products"
            );


        var approved =
            document.getElementById(
                "admin-approved-products"
            );


        var rejected =
            document.getElementById(
                "admin-rejected-products"
            );


        var pendingCount = 0;
        var approvedCount = 0;
        var rejectedCount = 0;


        products.forEach(
            function (product) {

                var status =
                    String(
                        product.status || "PENDING"
                    ).toUpperCase();


                if (status === "PENDING") {

                    pendingCount++;
                }


                if (status === "APPROVED") {

                    approvedCount++;
                }


                if (status === "REJECTED") {

                    rejectedCount++;
                }
            }
        );


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


    // =====================================================
    // DISPLAY PRODUCTS
    // =====================================================

    function displayProducts(products) {

        var productList =
            document.getElementById(
                "admin-product-list"
            );


        if (!productList) {

            return;
        }


        displayStatistics(products);


        var filter =
            document.getElementById(
                "admin-product-filter"
            );


        var selectedFilter =
            filter
                ? filter.value
                : "all";


        var filteredProducts =
            products.filter(
                function (product) {

                    var status =
                        String(
                            product.status || "PENDING"
                        ).toLowerCase();


                    if (
                        selectedFilter === "all"
                    ) {

                        return true;
                    }


                    return status ===
                        selectedFilter;
                }
            );


        productList.innerHTML = "";


        if (
            filteredProducts.length === 0
        ) {

            var emptyBox =
                document.createElement("div");

            emptyBox.className =
                "admin-empty";


            var emptyTitle =
                document.createElement("h3");

            emptyTitle.textContent =
                "No products found";


            var emptyMessage =
                document.createElement("p");

            emptyMessage.textContent =
                "There are no products matching this filter.";


            emptyBox.appendChild(
                emptyTitle
            );

            emptyBox.appendChild(
                emptyMessage
            );


            productList.appendChild(
                emptyBox
            );


            return;
        }


        filteredProducts.forEach(
            function (product) {

                createProductCard(
                    productList,
                    product
                );
            }
        );


        addApprovalEvents();
    }


    // =====================================================
    // CREATE PRODUCT CARD
    // =====================================================

    function createProductCard(
        productList,
        product
    ) {

        var status =
            String(
                product.status || "PENDING"
            ).toUpperCase();


        var card =
            document.createElement("article");

        card.className =
            "admin-product-card";


        // Image

        var imageContainer =
            document.createElement("div");

        imageContainer.className =
            "admin-product-image-container";


        var image =
            document.createElement("img");

        image.className =
            "admin-product-image";


        image.src =
            product.imageUrl ||
            "../images/placeholder.jpg";


        image.alt =
            product.name || "Product";


        imageContainer.appendChild(
            image
        );


        // Content

        var content =
            document.createElement("div");

        content.className =
            "admin-product-content";


        // Header

        var header =
            document.createElement("div");

        header.className =
            "admin-product-header";


        var headerInfo =
            document.createElement("div");


        var label =
            document.createElement("p");

        label.className =
            "admin-product-label";

        label.textContent =
            "PRODUCT";


        var title =
            document.createElement("h3");

        title.textContent =
            product.name || "Product";


        headerInfo.appendChild(
            label
        );

        headerInfo.appendChild(
            title
        );


        var statusBadge =
            document.createElement("span");


        statusBadge.className =
            "admin-product-status " +
            getStatusClass(status);


        statusBadge.textContent =
            status;


        header.appendChild(
            headerInfo
        );

        header.appendChild(
            statusBadge
        );


        // Details

        var details =
            document.createElement("div");

        details.className =
            "admin-product-details";


        addDetail(
            details,
            "Seller ID",
            product.sellerId
        );


        addDetail(
            details,
            "Category",
            product.category
        );


        addDetail(
            details,
            "Price",
            "₹" +
            formatPrice(product.price)
        );


        addDetail(
            details,
            "Stock",
            Number(product.stock || 0)
        );


        // Description

        var descriptionBox =
            document.createElement("div");

        descriptionBox.className =
            "admin-product-description";


        var descriptionLabel =
            document.createElement("span");

        descriptionLabel.textContent =
            "Description";


        var description =
            document.createElement("p");

        description.textContent =
            product.description ||
            "No description available.";


        descriptionBox.appendChild(
            descriptionLabel
        );

        descriptionBox.appendChild(
            description
        );


        // Actions

        var actions =
            document.createElement("div");

        actions.className =
            "admin-product-actions";


        var approveButton =
            document.createElement("button");

        approveButton.type =
            "button";

        approveButton.className =
            "approve-product";

        approveButton.dataset.id =
            product.id;

        approveButton.textContent =
            "Approve";


        if (status === "APPROVED") {

            approveButton.disabled =
                true;
        }


        var rejectButton =
            document.createElement("button");

        rejectButton.type =
            "button";

        rejectButton.className =
            "reject-product";

        rejectButton.dataset.id =
            product.id;

        rejectButton.textContent =
            "Reject";


        if (status === "REJECTED") {

            rejectButton.disabled =
                true;
        }


        actions.appendChild(
            approveButton
        );

        actions.appendChild(
            rejectButton
        );


        content.appendChild(
            header
        );

        content.appendChild(
            details
        );

        content.appendChild(
            descriptionBox
        );

        content.appendChild(
            actions
        );


        card.appendChild(
            imageContainer
        );

        card.appendChild(
            content
        );


        productList.appendChild(
            card
        );
    }


    // =====================================================
    // ADD DETAIL
    // =====================================================

    function addDetail(
        parent,
        labelText,
        valueText
    ) {

        var box =
            document.createElement("div");


        var label =
            document.createElement("span");

        label.textContent =
            labelText;


        var value =
            document.createElement("strong");

        value.textContent =
            valueText;


        box.appendChild(
            label
        );

        box.appendChild(
            value
        );


        parent.appendChild(
            box
        );
    }


    // =====================================================
    // APPROVAL EVENTS
    // =====================================================

    function addApprovalEvents() {

        var approveButtons =
            document.querySelectorAll(
                ".approve-product"
            );


        approveButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        var productId =
                            button.dataset.id;


                        updateProductStatus(
                            productId,
                            "APPROVED"
                        );
                    }
                );
            }
        );


        var rejectButtons =
            document.querySelectorAll(
                ".reject-product"
            );


        rejectButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        var productId =
                            button.dataset.id;


                        updateProductStatus(
                            productId,
                            "REJECTED"
                        );
                    }
                );
            }
        );
    }


    // =====================================================
    // UPDATE PRODUCT STATUS
    // =====================================================

    async function updateProductStatus(
        productId,
        newStatus
    ) {

        try {

            var product =
                await apiRequest(
                    "/products/" +
                    productId
                );


            if (!product) {

                return;
            }


            var productName =
                product.name ||
                "Product";


            var action =
                newStatus === "APPROVED"
                    ? "Approve"
                    : "Reject";


            var confirmed =
                confirm(
                    action +
                    ' "' +
                    productName +
                    '"?'
                );


            if (!confirmed) {

                return;
            }


            var endpoint;


            if (
                newStatus === "APPROVED"
            ) {

                endpoint =
                    "/products/admin/approve/" +
                    productId;

            }
            else {

                endpoint =
                    "/products/admin/reject/" +
                    productId;
            }


            await apiRequest(
                endpoint,
                {
                    method: "PUT"
                }
            );


            alert(
                "Product " +
                newStatus.toLowerCase() +
                " successfully."
            );


            await loadProducts();

        }
        catch (error) {

            console.error(
                "Error updating product:",
                error
            );


            alert(
                "Could not update product status."
            );
        }
    }


    // =====================================================
    // LOAD ADMIN ORDERS
    // =====================================================

    async function loadOrders() {

        try {

            var orders =
                await apiRequest(
                    "/orders/admin"
                );


            if (orders === null) {

                return;
            }


            displayOrders(orders);

        }
        catch (error) {

            console.error(
                "Error loading orders:",
                error
            );


            var orderList =
                document.getElementById(
                    "admin-order-list"
                );


            if (orderList) {

                orderList.innerHTML = "";


                var errorBox =
                    document.createElement("div");

                errorBox.className =
                    "admin-empty";


                var errorTitle =
                    document.createElement("h3");

                errorTitle.textContent =
                    "Unable to load orders";


                var errorMessage =
                    document.createElement("p");

                errorMessage.textContent =
                    "Please make sure the ShopSphere backend is running.";


                errorBox.appendChild(
                    errorTitle
                );

                errorBox.appendChild(
                    errorMessage
                );


                orderList.appendChild(
                    errorBox
                );
            }
        }
    }


    // =====================================================
    // DISPLAY ORDERS
    // =====================================================

    function displayOrders(orders) {

        var orderList =
            document.getElementById(
                "admin-order-list"
            );


        if (!orderList) {

            return;
        }


        orderList.innerHTML = "";


        if (
            !Array.isArray(orders) ||
            orders.length === 0
        ) {

            var emptyBox =
                document.createElement("div");

            emptyBox.className =
                "admin-empty";


            var emptyTitle =
                document.createElement("h3");

            emptyTitle.textContent =
                "No orders found";


            var emptyMessage =
                document.createElement("p");

            emptyMessage.textContent =
                "There are currently no customer orders.";


            emptyBox.appendChild(
                emptyTitle
            );

            emptyBox.appendChild(
                emptyMessage
            );


            orderList.appendChild(
                emptyBox
            );


            return;
        }


        orders.forEach(
            function (order) {

                createOrderCard(
                    orderList,
                    order
                );
            }
        );


        addOrderEvents();
    }


    // =====================================================
    // CREATE ORDER CARD
    // =====================================================

    function createOrderCard(
        orderList,
        order
    ) {

        var status =
            String(
                order.status || "PLACED"
            ).toUpperCase();


        var card =
            document.createElement("article");

        card.className =
            "admin-order-card";


        // -------------------------------------------------
        // ORDER HEADER
        // -------------------------------------------------

        var header =
            document.createElement("div");

        header.className =
            "admin-order-header";


        var headerInfo =
            document.createElement("div");


        var label =
            document.createElement("p");

        label.className =
            "admin-order-label";

        label.textContent =
            "ORDER";


        var orderTitle =
            document.createElement("h3");

        orderTitle.textContent =
            "#" + order.id;


        headerInfo.appendChild(
            label
        );

        headerInfo.appendChild(
            orderTitle
        );


        var statusBadge =
            document.createElement("span");

        statusBadge.className =
            "admin-order-status " +
            getOrderStatusClass(status);

        statusBadge.textContent =
            status;


        header.appendChild(
            headerInfo
        );

        header.appendChild(
            statusBadge
        );


        // -------------------------------------------------
        // ORDER DETAILS
        // -------------------------------------------------

        var details =
            document.createElement("div");

        details.className =
            "admin-order-details";


        addDetail(
            details,
            "Customer ID",
            order.customerId
        );


        addDetail(
            details,
            "Order Total",
            "₹" +
            formatPrice(order.totalAmount)
        );


        addDetail(
            details,
            "Current Status",
            status
        );


        // -------------------------------------------------
        // STATUS UPDATE
        // -------------------------------------------------

        var statusSection =
            document.createElement("div");

        statusSection.className =
            "admin-order-status-section";


        var statusLabel =
            document.createElement("label");

        statusLabel.textContent =
            "Update Order Status";


        var statusSelect =
            document.createElement("select");

        statusSelect.className =
            "admin-order-status-select";

        statusSelect.dataset.id =
            order.id;


        var statuses = [
            "PLACED",
            "CONFIRMED",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED"
        ];


        statuses.forEach(
            function (statusOption) {

                var option =
                    document.createElement("option");

                option.value =
                    statusOption;

                option.textContent =
                    statusOption;


                if (
                    statusOption === status
                ) {

                    option.selected =
                        true;
                }


                statusSelect.appendChild(
                    option
                );
            }
        );


        var updateButton =
            document.createElement("button");

        updateButton.type =
            "button";

        updateButton.className =
            "admin-update-order";

        updateButton.dataset.id =
            order.id;

        updateButton.textContent =
            "Update Status";


        statusSection.appendChild(
            statusLabel
        );

        statusSection.appendChild(
            statusSelect
        );

        statusSection.appendChild(
            updateButton
        );


        // -------------------------------------------------
        // PUT ORDER CARD TOGETHER
        // -------------------------------------------------

        card.appendChild(
            header
        );

        card.appendChild(
            details
        );

        card.appendChild(
            statusSection
        );


        orderList.appendChild(
            card
        );
    }


    // =====================================================
    // ORDER EVENTS
    // =====================================================

    function addOrderEvents() {

        var updateButtons =
            document.querySelectorAll(
                ".admin-update-order"
            );


        updateButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        var orderId =
                            button.dataset.id;


                        var select =
                            document.querySelector(
                                '.admin-order-status-select[data-id="' +
                                orderId +
                                '"]'
                            );


                        if (!select) {

                            return;
                        }


                        var newStatus =
                            select.value;


                        updateOrderStatus(
                            orderId,
                            newStatus
                        );
                    }
                );
            }
        );
    }


    // =====================================================
    // UPDATE ORDER STATUS
    // =====================================================

    async function updateOrderStatus(
        orderId,
        newStatus
    ) {

        try {

            var confirmed =
                confirm(
                    "Update order #" +
                    orderId +
                    " status to " +
                    newStatus +
                    "?"
                );


            if (!confirmed) {

                return;
            }


            await apiRequest(
                "/orders/admin/" +
                orderId +
                "/status?status=" +
                encodeURIComponent(newStatus),
                {
                    method: "PUT"
                }
            );


            alert(
                "Order status updated successfully."
            );


            await loadOrders();

        }
        catch (error) {

            console.error(
                "Error updating order status:",
                error
            );


            alert(
                "Could not update order status."
            );
        }
    }


    // =====================================================
    // PRODUCT FILTER
    // =====================================================

    var filter =
        document.getElementById(
            "admin-product-filter"
        );


    if (filter) {

        filter.addEventListener(
            "change",
            loadProducts
        );
    }


    // =====================================================
    // INITIALIZE
    // =====================================================

    loadProducts();

    loadOrders();

});