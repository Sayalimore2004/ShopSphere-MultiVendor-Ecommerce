/* =========================================================
   SHOPSPHERE
   SELLER DASHBOARD JAVASCRIPT

   FEATURES:
   - Store Information
   - Edit Store
   - Add Product
   - Edit Product
   - Delete Product
   - Stock Management
   - Order Management
   - Order Status
   - Total Products
   - Total Orders
   - Total Sales
   - Platform Commission
   - Seller Earnings
   - Best Selling Product

   STORAGE:
   shopSphereCurrentSeller
   shopSphereSellerProducts
   shopSphereOrders
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* =====================================================
       STORAGE KEYS
    ===================================================== */

    const SELLER_KEY = "shopSphereCurrentSeller";
    const PRODUCTS_KEY = "shopSphereSellerProducts";
    const ORDERS_KEY = "shopSphereOrders";


    /* =====================================================
       COMMISSION
    ===================================================== */

    const COMMISSION_RATE = 0.10;


    /* =====================================================
       STORAGE HELPERS
    ===================================================== */

    function getCurrentSeller() {

        try {

            const data = localStorage.getItem(SELLER_KEY);

            if (!data) {
                return null;
            }

            return JSON.parse(data);

        } catch (error) {

            console.error("Error reading seller:", error);

            return null;
        }
    }


    function saveCurrentSeller(seller) {

        try {

            localStorage.setItem(
                SELLER_KEY,
                JSON.stringify(seller)
            );

        } catch (error) {

            console.error("Error saving seller:", error);
        }
    }


    function getProducts() {

        try {

            const data =
                localStorage.getItem(PRODUCTS_KEY);

            if (!data) {
                return [];
            }

            const products = JSON.parse(data);

            return Array.isArray(products)
                ? products
                : [];

        } catch (error) {

            console.error("Error reading products:", error);

            return [];
        }
    }


    function saveProducts(products) {

        try {

            localStorage.setItem(
                PRODUCTS_KEY,
                JSON.stringify(products)
            );

        } catch (error) {

            console.error("Error saving products:", error);
        }
    }


    function getOrders() {

        try {

            const data =
                localStorage.getItem(ORDERS_KEY);

            if (!data) {
                return [];
            }

            const orders = JSON.parse(data);

            return Array.isArray(orders)
                ? orders
                : [];

        } catch (error) {

            console.error("Error reading orders:", error);

            return [];
        }
    }


    function saveOrders(orders) {

        try {

            localStorage.setItem(
                ORDERS_KEY,
                JSON.stringify(orders)
            );

        } catch (error) {

            console.error("Error saving orders:", error);
        }
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

    function formatPrice(value) {

        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "0";
        }

        return number.toLocaleString("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }


    /* =====================================================
       COMMISSION
    ===================================================== */

    function calculateCommission(amount) {

        const value = Number(amount) || 0;

        return value * COMMISSION_RATE;
    }


    function calculateSellerEarnings(amount) {

        const value = Number(amount) || 0;

        return value - calculateCommission(value);
    }


    /* =====================================================
       LOAD SELLER INFORMATION
    ===================================================== */

    function loadSellerInformation() {

        const seller = getCurrentSeller();


        const storeNameElement =
            document.getElementById("seller-store-name");


        const sellerDetailsElement =
            document.getElementById("seller-details");


        const storeInfoName =
            document.getElementById("store-info-name");


        const storeInfoOwner =
            document.getElementById("store-info-owner");


        const storeInfoEmail =
            document.getElementById("store-info-email");


        const storeInfoCategory =
            document.getElementById("store-info-category");


        if (!seller) {

            if (storeNameElement) {
                storeNameElement.textContent =
                    "Vendor Dashboard";
            }

            if (sellerDetailsElement) {
                sellerDetailsElement.textContent =
                    "No seller information found.";
            }

            if (storeInfoName) {
                storeInfoName.textContent = "—";
            }

            if (storeInfoOwner) {
                storeInfoOwner.textContent = "—";
            }

            if (storeInfoEmail) {
                storeInfoEmail.textContent = "—";
            }

            if (storeInfoCategory) {
                storeInfoCategory.textContent = "—";
            }

            return;
        }


        if (storeNameElement) {

            storeNameElement.textContent =
                "Welcome, " +
                (seller.storeName || "Seller");
        }


        if (sellerDetailsElement) {

            sellerDetailsElement.textContent =
                (seller.category || "Store") +
                " store • Owner: " +
                (seller.name || "Seller");
        }


        if (storeInfoName) {

            storeInfoName.textContent =
                seller.storeName || "—";
        }


        if (storeInfoOwner) {

            storeInfoOwner.textContent =
                seller.name || "—";
        }


        if (storeInfoEmail) {

            storeInfoEmail.textContent =
                seller.email || "—";
        }


        if (storeInfoCategory) {

            storeInfoCategory.textContent =
                seller.category || "—";
        }
    }


    /* =====================================================
       EDIT STORE
    ===================================================== */

    function openEditStoreForm() {

        const seller = getCurrentSeller();

        if (!seller) {

            alert(
                "Seller information not found. Please register again."
            );

            return;
        }


        const container =
            document.getElementById(
                "edit-store-form-container"
            );


        if (!container) {
            return;
        }


        const nameInput =
            document.getElementById(
                "edit-seller-name"
            );


        const emailInput =
            document.getElementById(
                "edit-seller-email"
            );


        const storeInput =
            document.getElementById(
                "edit-store-name"
            );


        const categoryInput =
            document.getElementById(
                "edit-seller-category"
            );


        if (nameInput) {
            nameInput.value = seller.name || "";
        }


        if (emailInput) {
            emailInput.value = seller.email || "";
        }


        if (storeInput) {
            storeInput.value =
                seller.storeName || "";
        }


        if (categoryInput) {
            categoryInput.value =
                seller.category || "";
        }


        const message =
            document.getElementById(
                "edit-store-message"
            );


        if (message) {

            message.textContent = "";

            message.className =
                "edit-store-message";
        }


        container.hidden = false;


        container.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }


    function closeEditStoreForm() {

        const container =
            document.getElementById(
                "edit-store-form-container"
            );


        const form =
            document.getElementById(
                "edit-store-form"
            );


        if (container) {
            container.hidden = true;
        }


        if (form) {
            form.reset();
        }
    }


    function updateStoreInformation(event) {

        event.preventDefault();


        const seller = getCurrentSeller();


        if (!seller) {

            alert(
                "Seller information not found. Please register again."
            );

            return;
        }


        const name =
            document.getElementById(
                "edit-seller-name"
            )?.value.trim() || "";


        const email =
            document.getElementById(
                "edit-seller-email"
            )?.value.trim() || "";


        const storeName =
            document.getElementById(
                "edit-store-name"
            )?.value.trim() || "";


        const category =
            document.getElementById(
                "edit-seller-category"
            )?.value || "";


        const message =
            document.getElementById(
                "edit-store-message"
            );


        if (
            !name ||
            !email ||
            !storeName ||
            !category
        ) {

            if (message) {

                message.textContent =
                    "Please enter all store details.";

                message.className =
                    "edit-store-message error";
            }

            return;
        }


        seller.name = name;
        seller.email = email;
        seller.storeName = storeName;
        seller.category = category;


        seller.updatedAt =
            new Date().toLocaleString("en-IN");


        saveCurrentSeller(seller);


        /* Update seller name in existing products */

        const products = getProducts();


        products.forEach(function (product) {

            if (
                String(product.sellerId) ===
                String(seller.id)
            ) {

                product.sellerName =
                    seller.storeName;
            }
        });


        saveProducts(products);


        loadSellerInformation();
        displayProducts();
        displaySellerOrders();


        if (message) {

            message.textContent =
                "Store information updated successfully.";

            message.className =
                "edit-store-message success";
        }


        setTimeout(function () {

            closeEditStoreForm();

        }, 1000);
    }


    /* =====================================================
       RESET PRODUCT FORM
    ===================================================== */

    function resetProductForm() {

        const form =
            document.getElementById(
                "product-form"
            );


        const submitButton =
            document.getElementById(
                "product-submit-button"
            );


        const cancelButton =
            document.getElementById(
                "cancel-product-edit"
            );


        const title =
            document.getElementById(
                "product-form-title"
            );


        const description =
            document.getElementById(
                "product-form-description"
            );


        if (form) {

            form.reset();

            delete form.dataset.editingId;
        }


        if (submitButton) {

            submitButton.textContent =
                "Add Product";
        }


        if (cancelButton) {

            cancelButton.hidden = true;
        }


        if (title) {

            title.textContent =
                "Add New Product";
        }


        if (description) {

            description.textContent =
                "Add a product to your ShopSphere store.";
        }
    }


    /* =====================================================
       STOCK
    ===================================================== */

    function getStockStatus(stock) {

        const quantity =
            Number(stock) || 0;


        if (quantity <= 0) {
            return "Out of Stock";
        }


        if (quantity <= 5) {
            return "Low Stock";
        }


        return "In Stock";
    }


    function getStockClass(stock) {

        const quantity =
            Number(stock) || 0;


        if (quantity <= 0) {
            return "stock-out";
        }


        if (quantity <= 5) {
            return "stock-low";
        }


        return "stock-in";
    }


    /* =====================================================
       DISPLAY PRODUCTS
    ===================================================== */

    function displayProducts() {

        const productList =
            document.getElementById(
                "product-list"
            );


        const totalProducts =
            document.getElementById(
                "total-products"
            );


        if (!productList) {
            return;
        }


        const seller =
            getCurrentSeller();


        const allProducts =
            getProducts();


        if (!seller) {

            productList.innerHTML = `

                <div class="no-products">

                    <h3>No seller found</h3>

                    <p>
                        Please register as a seller first.
                    </p>

                </div>

            `;


            if (totalProducts) {
                totalProducts.textContent = "0";
            }

            return;
        }


        const sellerProducts =
            allProducts.filter(function (product) {

                return (
                    String(product.sellerId) ===
                    String(seller.id)
                );
            });


        if (totalProducts) {

            totalProducts.textContent =
                sellerProducts.length;
        }


        if (sellerProducts.length === 0) {

            productList.innerHTML = `

                <div class="no-products">

                    <h3>
                        No products yet
                    </h3>

                    <p>
                        Add your first product
                        using the form above.
                    </p>

                </div>

            `;

            return;
        }


        productList.innerHTML = "";


        sellerProducts.forEach(function (product) {

            const card =
                document.createElement("article");


            card.className =
                "vendor-product-card";


            const stock =
                Number(product.stock) || 0;


            const status =
                product.status || "pending";


            card.innerHTML = `

                <img
                    class="vendor-product-image"
                    src="${escapeHtml(product.image)}"
                    alt="${escapeHtml(product.name)}"
                    onerror="this.style.display='none';"
                >


                <div class="vendor-product-content">

                    <h3>
                        ${escapeHtml(product.name)}
                    </h3>


                    <p class="vendor-product-price">
                        ₹${formatPrice(product.price)}
                    </p>


                    <p>
                        Category:
                        ${escapeHtml(product.category)}
                    </p>


                    <div class="vendor-product-stock">

                        <span
                            class="stock-status ${getStockClass(stock)}"
                        >
                            ${getStockStatus(stock)}
                        </span>


                        <div class="stock-controls">

                            <button
                                type="button"
                                class="stock-button"
                                data-id="${escapeHtml(product.id)}"
                                data-action="decrease"
                            >
                                −
                            </button>


                            <span class="stock-quantity">
                                ${stock}
                            </span>


                            <button
                                type="button"
                                class="stock-button"
                                data-id="${escapeHtml(product.id)}"
                                data-action="increase"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <p>
                        ${escapeHtml(product.description)}
                    </p>


                    <p class="product-status">

                        Status:

                        <strong>
                            ${escapeHtml(status)}
                        </strong>

                    </p>


                    <div class="vendor-product-actions">

                        <button
                            type="button"
                            class="edit-product"
                            data-id="${escapeHtml(product.id)}"
                        >
                            Edit
                        </button>


                        <button
                            type="button"
                            class="delete-product"
                            data-id="${escapeHtml(product.id)}"
                        >
                            Delete
                        </button>

                    </div>

                </div>
            `;


            productList.appendChild(card);
        });


        addEditEvents();
        addDeleteEvents();
        addStockEvents();
    }


    /* =====================================================
       EDIT PRODUCT EVENTS
    ===================================================== */

    function addEditEvents() {

        document
            .querySelectorAll(".edit-product")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const productId =
                            String(button.dataset.id);


                        const seller =
                            getCurrentSeller();


                        if (!seller) {

                            alert(
                                "Seller information not found."
                            );

                            return;
                        }


                        const products =
                            getProducts();


                        const product =
                            products.find(
                                function (item) {

                                    return (
                                        String(item.id) ===
                                        productId &&

                                        String(item.sellerId) ===
                                        String(seller.id)
                                    );
                                }
                            );


                        if (!product) {

                            alert(
                                "Product not found."
                            );

                            return;
                        }


                        const form =
                            document.getElementById(
                                "product-form"
                            );


                        if (!form) {
                            return;
                        }


                        const nameInput =
                            document.getElementById(
                                "product-name"
                            );


                        const priceInput =
                            document.getElementById(
                                "product-price"
                            );


                        const categoryInput =
                            document.getElementById(
                                "product-category"
                            );


                        const stockInput =
                            document.getElementById(
                                "product-stock"
                            );


                        const imageInput =
                            document.getElementById(
                                "product-image"
                            );


                        const descriptionInput =
                            document.getElementById(
                                "product-description"
                            );


                        if (nameInput) {
                            nameInput.value =
                                product.name || "";
                        }


                        if (priceInput) {
                            priceInput.value =
                                product.price ?? "";
                        }


                        if (categoryInput) {
                            categoryInput.value =
                                product.category || "";
                        }


                        if (stockInput) {
                            stockInput.value =
                                product.stock ?? 0;
                        }


                        if (imageInput) {
                            imageInput.value =
                                product.image || "";
                        }


                        if (descriptionInput) {
                            descriptionInput.value =
                                product.description || "";
                        }


                        form.dataset.editingId =
                            product.id;


                        const submitButton =
                            document.getElementById(
                                "product-submit-button"
                            );


                        const cancelButton =
                            document.getElementById(
                                "cancel-product-edit"
                            );


                        const title =
                            document.getElementById(
                                "product-form-title"
                            );


                        const description =
                            document.getElementById(
                                "product-form-description"
                            );


                        if (submitButton) {
                            submitButton.textContent =
                                "Update Product";
                        }


                        if (cancelButton) {
                            cancelButton.hidden = false;
                        }


                        if (title) {
                            title.textContent =
                                "Edit Product";
                        }


                        if (description) {
                            description.textContent =
                                "Update the details of your product.";
                        }


                        form.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    }
                );

            });
    }


    /* =====================================================
       DELETE PRODUCT
    ===================================================== */

    function addDeleteEvents() {

        document
            .querySelectorAll(".delete-product")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const productId =
                            String(button.dataset.id);


                        if (
                            !confirm(
                                "Are you sure you want to delete this product?"
                            )
                        ) {
                            return;
                        }


                        const seller =
                            getCurrentSeller();


                        if (!seller) {

                            alert(
                                "Seller information not found."
                            );

                            return;
                        }


                        let products =
                            getProducts();


                        products =
                            products.filter(
                                function (product) {

                                    return !(
                                        String(product.id) ===
                                        productId &&

                                        String(product.sellerId) ===
                                        String(seller.id)
                                    );
                                }
                            );


                        saveProducts(products);


                        resetProductForm();

                        displayProducts();


                        alert(
                            "Product deleted successfully!"
                        );
                    }
                );

            });
    }


    /* =====================================================
       STOCK EVENTS
    ===================================================== */

    function addStockEvents() {

        document
            .querySelectorAll(".stock-button")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        updateProductStock(
                            String(button.dataset.id),
                            button.dataset.action
                        );

                    }
                );

            });
    }


    /* =====================================================
       UPDATE STOCK
    ===================================================== */

    function updateProductStock(
        productId,
        action
    ) {

        const seller =
            getCurrentSeller();


        if (!seller) {

            alert(
                "Seller information not found."
            );

            return;
        }


        const products =
            getProducts();


        const index =
            products.findIndex(
                function (product) {

                    return (
                        String(product.id) ===
                        String(productId) &&

                        String(product.sellerId) ===
                        String(seller.id)
                    );
                }
            );


        if (index === -1) {

            alert(
                "Product not found."
            );

            return;
        }


        let stock =
            Number(products[index].stock) || 0;


        if (action === "increase") {
            stock++;
        }


        if (
            action === "decrease" &&
            stock > 0
        ) {
            stock--;
        }


        products[index].stock =
            stock;


        products[index].updatedAt =
            new Date().toLocaleString("en-IN");


        saveProducts(products);


        displayProducts();
    }


    /* =====================================================
       PRODUCT FORM
    ===================================================== */

    const productForm =
        document.getElementById(
            "product-form"
        );


    if (productForm) {

        productForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const seller =
                    getCurrentSeller();


                if (!seller) {

                    alert(
                        "Seller information not found. Please register again."
                    );

                    return;
                }


                const name =
                    document.getElementById(
                        "product-name"
                    )?.value.trim() || "";


                const price =
                    Number(
                        document.getElementById(
                            "product-price"
                        )?.value
                    );


                const category =
                    document.getElementById(
                        "product-category"
                    )?.value || "";


                const stock =
                    Number(
                        document.getElementById(
                            "product-stock"
                        )?.value
                    );


                const image =
                    document.getElementById(
                        "product-image"
                    )?.value.trim() || "";


                const description =
                    document.getElementById(
                        "product-description"
                    )?.value.trim() || "";


                if (
                    !name ||
                    !category ||
                    !image ||
                    !description ||
                    !Number.isFinite(price) ||
                    price <= 0 ||
                    !Number.isFinite(stock) ||
                    stock < 0
                ) {

                    alert(
                        "Please enter valid product details."
                    );

                    return;
                }


                const products =
                    getProducts();


                const editingId =
                    productForm.dataset.editingId;


                /* =================================================
                   UPDATE EXISTING PRODUCT
                ================================================= */

                if (editingId) {

                    const index =
                        products.findIndex(
                            function (product) {

                                return (
                                    String(product.id) ===
                                    String(editingId) &&

                                    String(product.sellerId) ===
                                    String(seller.id)
                                );
                            }
                        );


                    if (index === -1) {

                        alert(
                            "Unable to update product."
                        );

                        resetProductForm();

                        return;
                    }


                    products[index].name =
                        name;

                    products[index].price =
                        price;

                    products[index].category =
                        category;

                    products[index].stock =
                        stock;

                    products[index].image =
                        image;

                    products[index].description =
                        description;

                    products[index].updatedAt =
                        new Date().toLocaleString("en-IN");


                    saveProducts(products);


                    resetProductForm();

                    displayProducts();


                    alert(
                        "Product updated successfully!"
                    );


                    return;
                }


                /* =================================================
                   CREATE NEW PRODUCT
                ================================================= */

                const product = {

                    id: Date.now(),

                    sellerId:
                        seller.id,

                    sellerName:
                        seller.storeName,

                    name:
                        name,

                    price:
                        price,

                    category:
                        category,

                    stock:
                        stock,

                    image:
                        image,

                    description:
                        description,

                    status:
                        "pending",

                    createdAt:
                        new Date().toLocaleString("en-IN")
                };


                products.push(product);


                saveProducts(products);


                resetProductForm();

                displayProducts();


                alert(
                    "Product added successfully!"
                );
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

                resetProductForm();

            }
        );
    }


    /* =====================================================
       NORMALIZE ORDER ITEMS
    ===================================================== */

    function getOrderItems(order) {

        if (!order) {
            return [];
        }


        if (Array.isArray(order.items)) {

            return order.items.map(
                function (item) {

                    const quantity =
                        Number(
                            item.quantity ??
                            item.qty ??
                            1
                        ) || 1;


                    const price =
                        Number(
                            item.price ?? 0
                        ) || 0;


                    let totalAmount =
                        Number(
                            item.totalAmount
                        );


                    if (
                        !Number.isFinite(
                            totalAmount
                        )
                    ) {

                        totalAmount =
                            price * quantity;
                    }


                    return {

                        productId:
                            item.productId ??
                            item.id ??
                            null,

                        productName:
                            item.productName ??
                            item.name ??
                            "Product",

                        sellerId:
                            item.sellerId ??
                            order.sellerId ??
                            null,

                        quantity:
                            quantity,

                        price:
                            price,

                        totalAmount:
                            totalAmount
                    };
                }
            );
        }


        /* Single-product order */

        const quantity =
            Number(
                order.quantity || 1
            ) || 1;


        const price =
            Number(
                order.price || 0
            ) || 0;


        let totalAmount =
            Number(
                order.totalAmount
            );


        if (!Number.isFinite(totalAmount)) {

            totalAmount =
                price * quantity;
        }


        return [{

            productId:
                order.productId ??
                order.productID ??
                null,

            productName:
                order.productName ??
                "Product",

            sellerId:
                order.sellerId ??
                null,

            quantity:
                quantity,

            price:
                price,

            totalAmount:
                totalAmount
        }];
    }


    /* =====================================================
       GET SELLER ORDER ITEMS
    ===================================================== */

    function getSellerOrderItems(
        order,
        sellerId
    ) {

        const items =
            getOrderItems(order);


        return items.filter(
            function (item) {

                return (
                    String(item.sellerId) ===
                    String(sellerId)
                );
            }
        );
    }


    /* =====================================================
       GET ORDER STATUS
    ===================================================== */

    function getOrderStatus(order) {

        if (!order || !order.status) {
            return "Pending";
        }


        return String(order.status)
            .toLowerCase()
            .replace(/^\w/, function (letter) {
                return letter.toUpperCase();
            });
    }


    /* =====================================================
       DISPLAY SELLER ORDERS
    ===================================================== */

    function displaySellerOrders() {

        const ordersList =
            document.getElementById(
                "seller-orders-list"
            );


        if (!ordersList) {
            return;
        }


        const totalOrders =
            document.getElementById(
                "total-orders"
            );


        const totalSales =
            document.getElementById(
                "total-sales"
            );


        const totalCommission =
            document.getElementById(
                "total-commission"
            );


        const sellerEarnings =
            document.getElementById(
                "seller-earnings"
            );


        const seller =
            getCurrentSeller();


        /* =================================================
           ALWAYS RESET FINANCIAL VALUES FIRST
           This guarantees ₹0 when there are no orders.
        ================================================= */

        if (totalOrders) {
            totalOrders.textContent = "0";
        }


        if (totalSales) {
            totalSales.textContent = "₹0";
        }


        if (totalCommission) {
            totalCommission.textContent = "₹0";
        }


        if (sellerEarnings) {
            sellerEarnings.textContent = "₹0";
        }


        displayBestSellingProduct([]);


        /* =================================================
           NO SELLER
        ================================================= */

        if (!seller) {

            ordersList.innerHTML = `

                <div class="no-orders">

                    <h3>
                        Seller information not found
                    </h3>

                    <p>
                        Please register as a seller first.
                    </p>

                </div>
            `;

            return;
        }


        const allOrders =
            getOrders();


        const sellerOrders = [];


        allOrders.forEach(
            function (order) {

                const sellerItems =
                    getSellerOrderItems(
                        order,
                        seller.id
                    );


                if (sellerItems.length > 0) {

                    sellerOrders.push({

                        order: order,

                        items: sellerItems
                    });
                }
            }
        );


        /* =================================================
           NO SELLER ORDERS
        ================================================= */

        if (sellerOrders.length === 0) {

            if (totalOrders) {
                totalOrders.textContent = "0";
            }


            if (totalSales) {
                totalSales.textContent = "₹0";
            }


            if (totalCommission) {
                totalCommission.textContent = "₹0";
            }


            if (sellerEarnings) {
                sellerEarnings.textContent = "₹0";
            }


            displayBestSellingProduct([]);


            ordersList.innerHTML = `

                <div class="no-orders">

                    <h3>
                        No orders yet
                    </h3>

                    <p>
                        Orders for your products will
                        appear here.
                    </p>

                </div>
            `;

            return;
        }


        /* =================================================
           TOTAL ORDER COUNT
        ================================================= */

        if (totalOrders) {

            totalOrders.textContent =
                sellerOrders.length;
        }


        /* =================================================
           TOTAL SALES
        ================================================= */

        let totalSalesAmount = 0;


        sellerOrders.forEach(
            function (sellerOrder) {

                const status =
                    getOrderStatus(
                        sellerOrder.order
                    );


                if (status === "Cancelled") {
                    return;
                }


                sellerOrder.items.forEach(
                    function (item) {

                        totalSalesAmount +=
                            Number(
                                item.totalAmount
                            ) || 0;
                    }
                );
            }
        );


        /* =================================================
           COMMISSION
        ================================================= */

        const commissionAmount =
            calculateCommission(
                totalSalesAmount
            );


        /* =================================================
           SELLER EARNINGS
        ================================================= */

        const earningsAmount =
            calculateSellerEarnings(
                totalSalesAmount
            );


        if (totalSales) {

            totalSales.textContent =
                "₹" +
                formatPrice(
                    totalSalesAmount
                );
        }


        if (totalCommission) {

            totalCommission.textContent =
                "₹" +
                formatPrice(
                    commissionAmount
                );
        }


        if (sellerEarnings) {

            sellerEarnings.textContent =
                "₹" +
                formatPrice(
                    earningsAmount
                );
        }


        /* =================================================
           BEST SELLING PRODUCT
        ================================================= */

        displayBestSellingProduct(
            sellerOrders
        );


        /* =================================================
           DISPLAY ORDERS
        ================================================= */

        ordersList.innerHTML = "";


        sellerOrders.forEach(
            function (sellerOrder) {

                const order =
                    sellerOrder.order;


                const orderCard =
                    document.createElement(
                        "article"
                    );


                orderCard.className =
                    "seller-order-card";


                const productHtml =
                    sellerOrder.items
                        .map(
                            function (item) {

                                return `

                                    <div class="seller-order-product">

                                        <strong>
                                            ${escapeHtml(
                                                item.productName
                                            )}
                                        </strong>

                                        <span>
                                            Qty:
                                            ${item.quantity}
                                        </span>

                                        <span>
                                            ₹${formatPrice(
                                                item.totalAmount
                                            )}
                                        </span>

                                    </div>

                                `;
                            }
                        )
                        .join("");


                const sellerOrderTotal =
                    sellerOrder.items.reduce(
                        function (
                            total,
                            item
                        ) {

                            return (
                                total +
                                (
                                    Number(
                                        item.totalAmount
                                    ) || 0
                                )
                            );

                        },
                        0
                    );


                const orderCommission =
                    calculateCommission(
                        sellerOrderTotal
                    );


                const orderSellerEarnings =
                    calculateSellerEarnings(
                        sellerOrderTotal
                    );


                const status =
                    getOrderStatus(order);


                orderCard.innerHTML = `

                    <div class="seller-order-header">

                        <div>

                            <h3 class="seller-order-id">

                                Order #
                                ${escapeHtml(order.id)}

                            </h3>


                            <p class="seller-order-date">

                                ${escapeHtml(
                                    order.createdAt || "—"
                                )}

                            </p>

                        </div>

                    </div>


                    <div class="seller-order-details">


                        <div class="seller-order-detail">

                            <span>
                                Customer
                            </span>

                            <strong>

                                ${escapeHtml(
                                    order.customerName ||
                                    order.customer?.name ||
                                    "Customer"
                                )}

                            </strong>

                        </div>


                        <div class="seller-order-detail">

                            <span>
                                Products
                            </span>

                            <div>
                                ${productHtml}
                            </div>

                        </div>


                        <div class="seller-order-detail">

                            <span>
                                Gross Sales
                            </span>

                            <strong>

                                ₹${formatPrice(
                                    sellerOrderTotal
                                )}

                            </strong>

                        </div>


                        <div class="seller-order-detail">

                            <span>
                                ShopSphere Commission
                            </span>

                            <strong>

                                ₹${formatPrice(
                                    orderCommission
                                )}

                                <small>
                                    (10%)
                                </small>

                            </strong>

                        </div>


                        <div class="seller-order-detail">

                            <span>
                                Seller Earnings
                            </span>

                            <strong>

                                ₹${formatPrice(
                                    orderSellerEarnings
                                )}

                            </strong>

                        </div>


                    </div>


                    <div class="seller-order-status">

                        <span class="order-status-label">
                            Order Status
                        </span>


                        <select
                            class="order-status-select"
                            data-order-id="${escapeHtml(order.id)}"
                        >

                            <option
                                value="Pending"
                                ${status === "Pending" ? "selected" : ""}
                            >
                                Pending
                            </option>


                            <option
                                value="Confirmed"
                                ${status === "Confirmed" ? "selected" : ""}
                            >
                                Confirmed
                            </option>


                            <option
                                value="Shipped"
                                ${status === "Shipped" ? "selected" : ""}
                            >
                                Shipped
                            </option>


                            <option
                                value="Delivered"
                                ${status === "Delivered" ? "selected" : ""}
                            >
                                Delivered
                            </option>


                            <option
                                value="Cancelled"
                                ${status === "Cancelled" ? "selected" : ""}
                            >
                                Cancelled
                            </option>

                        </select>

                    </div>
                `;


                ordersList.appendChild(orderCard);
            }
        );


        addOrderStatusEvents();
    }


    /* =====================================================
       BEST SELLING PRODUCT
    ===================================================== */

    function displayBestSellingProduct(
        sellerOrders
    ) {

        let bestSellingElement =
            document.getElementById(
                "best-selling-product"
            );


        /* Create card only if it does not already exist */

        if (!bestSellingElement) {

            const totalSalesElement =
                document.getElementById(
                    "total-sales"
                );


            if (
                totalSalesElement &&
                totalSalesElement.parentElement
            ) {

                bestSellingElement =
                    document.createElement("div");


                bestSellingElement.id =
                    "best-selling-product";


                bestSellingElement.className =
                    "dashboard-stat-card best-selling-card";


                totalSalesElement.parentElement
                    .insertAdjacentElement(
                        "afterend",
                        bestSellingElement
                    );
            }
        }


        if (!bestSellingElement) {
            return;
        }


        /* =================================================
           NO SALES
        ================================================= */

        if (
            !Array.isArray(sellerOrders) ||
            sellerOrders.length === 0
        ) {

            bestSellingElement.innerHTML = `

                <div class="best-selling-content">

                    <span class="best-selling-icon">
                        🏆
                    </span>

                    <div>

                        <h3>
                            Best-Selling Product
                        </h3>

                        <p>
                            No sales yet
                        </p>

                    </div>

                </div>

            `;

            return;
        }


        const productSales = {};


        sellerOrders.forEach(
            function (sellerOrder) {

                const status =
                    getOrderStatus(
                        sellerOrder.order
                    );


                if (status === "Cancelled") {
                    return;
                }


                sellerOrder.items.forEach(
                    function (item) {

                        const productId =
                            item.productId ??
                            item.productName;


                        if (
                            !productSales[productId]
                        ) {

                            productSales[productId] = {

                                name:
                                    item.productName ||
                                    "Product",

                                quantity:
                                    0,

                                sales:
                                    0
                            };
                        }


                        productSales[productId].quantity +=
                            Number(
                                item.quantity
                            ) || 0;


                        productSales[productId].sales +=
                            Number(
                                item.totalAmount
                            ) || 0;
                    }
                );
            }
        );


        const products =
            Object.values(productSales);


        if (products.length === 0) {

            bestSellingElement.innerHTML = `

                <div class="best-selling-content">

                    <span class="best-selling-icon">
                        🏆
                    </span>

                    <div>

                        <h3>
                            Best-Selling Product
                        </h3>

                        <p>
                            No sales yet
                        </p>

                    </div>

                </div>

            `;

            return;
        }


        products.sort(
            function (a, b) {

                if (
                    b.quantity !==
                    a.quantity
                ) {

                    return (
                        b.quantity -
                        a.quantity
                    );
                }


                return (
                    b.sales -
                    a.sales
                );
            }
        );


        const bestProduct =
            products[0];


        bestSellingElement.innerHTML = `

            <div class="best-selling-content">

                <span class="best-selling-icon">
                    🏆
                </span>


                <div class="best-selling-info">

                    <h3>
                        Best-Selling Product
                    </h3>


                    <strong class="best-selling-name">

                        ${escapeHtml(
                            bestProduct.name
                        )}

                    </strong>


                    <p class="best-selling-quantity">

                        ${bestProduct.quantity}

                        ${
                            bestProduct.quantity === 1
                                ? "unit"
                                : "units"
                        }

                        sold

                    </p>


                    <p class="best-selling-sales">

                        Sales:
                        ₹${formatPrice(
                            bestProduct.sales
                        )}

                    </p>

                </div>

            </div>

        `;
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
                        function () {

                            updateOrderStatus(
                                select.dataset.orderId,
                                select.value
                            );

                        }
                    );

                }
            );
    }


    /* =====================================================
       UPDATE ORDER STATUS
    ===================================================== */

    function updateOrderStatus(
        orderId,
        newStatus
    ) {

        const seller =
            getCurrentSeller();


        if (!seller) {

            alert(
                "Seller information not found."
            );

            return;
        }


        const orders =
            getOrders();


        const index =
            orders.findIndex(
                function (order) {

                    return (
                        String(order.id) ===
                        String(orderId) &&

                        (
                            String(order.sellerId) ===
                            String(seller.id) ||

                            getSellerOrderItems(
                                order,
                                seller.id
                            ).length > 0
                        )
                    );
                }
            );


        if (index === -1) {

            alert(
                "Order not found."
            );

            return;
        }


        orders[index].status =
            newStatus;


        orders[index].updatedAt =
            new Date().toLocaleString("en-IN");


        saveOrders(orders);


        displaySellerOrders();
    }


    /* =====================================================
       EDIT STORE BUTTON
    ===================================================== */

    const editStoreButton =
        document.getElementById(
            "edit-store-button"
        );


    if (editStoreButton) {

        editStoreButton.addEventListener(
            "click",
            openEditStoreForm
        );
    }


    /* =====================================================
       EDIT STORE FORM
    ===================================================== */

    const editStoreForm =
        document.getElementById(
            "edit-store-form"
        );


    if (editStoreForm) {

        editStoreForm.addEventListener(
            "submit",
            updateStoreInformation
        );
    }


    /* =====================================================
       CANCEL STORE EDIT
    ===================================================== */

    const cancelEditStore =
        document.getElementById(
            "cancel-edit-store"
        );


    if (cancelEditStore) {

        cancelEditStore.addEventListener(
            "click",
            closeEditStoreForm
        );
    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    loadSellerInformation();

    displayProducts();

    displaySellerOrders();

});