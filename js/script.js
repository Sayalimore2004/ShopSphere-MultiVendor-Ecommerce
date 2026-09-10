(function () {
    "use strict";

    /* =========================================================
       CONFIGURATION
    ========================================================= */

    const API_BASE_URL = "http://localhost:8080/api";

    const CART_KEY = "shopSphereCart";
    const ORDERS_KEY = "shopSphereOrders";
    const SINGLE_ORDER_KEY = "shopSphereOrder";

    const TOKEN_KEY = "shopSphereToken";
    const CUSTOMER_KEY = "shopSphereLoggedInUser";
    const USER_TYPE_KEY = "shopSphereUserType";

    const PRODUCTS_PER_PAGE = 8;

    let currentPage = 1;

    let activeCategory = "all";
    let activePrice = "all";
    let activeRating = "all";
    let activeAvailability = "all";

    let searchTerm = "";

    let currentSort = "recommended";


    /* =========================================================
       PAGE NAME
    ========================================================= */

    function getPageName() {

        const pathname =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();

        return pathname || "index.html";

    }


    /* =========================================================
       CUSTOMER AUTHENTICATION
    ========================================================= */

    function getCustomerData() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    CUSTOMER_KEY
                )
            ) || null;

        } catch (error) {

            return null;

        }

    }


    function getCustomerId() {

        const customer =
            getCustomerData();

        if (!customer) {
            return null;
        }

        return (
            customer.id ||
            customer.customerId ||
            null
        );

    }


    function isCustomerLoggedIn() {

        const token =
            localStorage.getItem(
                TOKEN_KEY
            );

        const userType =
            localStorage.getItem(
                USER_TYPE_KEY
            );

        const customerId =
            getCustomerId();

        return (
            userType === "customer" &&
            !!token &&
            !!customerId
        );

    }


    /* =========================================================
       API REQUEST
    ========================================================= */

    async function apiRequest(
        endpoint,
        options
    ) {

        options =
            options || {};

        const headers =
            options.headers || {};

        headers["Content-Type"] =
            "application/json";

        const token =
            localStorage.getItem(
                TOKEN_KEY
            );

        if (token) {

            headers["Authorization"] =
                "Bearer " + token;

        }

        options.headers =
            headers;

        const response =
            await fetch(
                API_BASE_URL +
                endpoint,
                options
            );

        const contentType =
            response.headers.get(
                "content-type"
            ) || "";

        let data;

        if (
            contentType.includes(
                "application/json"
            )
        ) {

            data =
                await response.json();

        } else {

            data =
                await response.text();

        }

        if (!response.ok) {

            let message =
                "Request failed.";

            if (
                typeof data ===
                "string" &&
                data.trim()
            ) {

                message =
                    data;

            } else if (
                data &&
                data.message
            ) {

                message =
                    data.message;

            } else if (
                data &&
                data.error
            ) {

                message =
                    data.error;

            }

            throw new Error(
                message
            );

        }

        return data;

    }


    /* =========================================================
       GENERAL HELPERS
    ========================================================= */

    function formatPrice(price) {

        const value =
            Number(price) || 0;

        return (
            "₹" +
            value.toLocaleString(
                "en-IN",
                {
                    maximumFractionDigits: 2
                }
            )
        );

    }


    function getNumericPrice(price) {

        if (
            typeof price ===
            "number"
        ) {

            return price;

        }

        return Number(
            String(price || "")
                .replace(/₹/g, "")
                .replace(/,/g, "")
                .replace(/[^\d.-]/g, "")
        ) || 0;

    }


    function escapeHtml(value) {

        return String(
            value == null
                ? ""
                : value
        )
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =========================================================
       CATEGORY NORMALIZATION
       
       Handles:
       Home & Kitchen
       Home and Kitchen
       home-kitchen
       home-and-kitchen
       HOME & KITCHEN
       ========================================================= */

    function normalizeCategory(category) {

        let value =
            String(
                category || ""
            )
                .trim()
                .toLowerCase();

        value =
            value
                .replace(/&/g, " and ");

        value =
            value
                .replace(/\band\b/g, "and");

        value =
            value
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

        /*
           Canonical category names.
        */

        const aliases = {

            "home-kitchen":
                "home-and-kitchen",

            "home-and-kitchen":
                "home-and-kitchen",

            "home-kitchen-category":
                "home-and-kitchen",

            "homeandkitchen":
                "home-and-kitchen",

            "fashion":
                "fashion",

            "electronics":
                "electronics",

            "beauty":
                "beauty"

        };

        return (
            aliases[value] ||
            value
        );

    }


    function categoriesMatch(
        categoryA,
        categoryB
    ) {

        const a =
            normalizeCategory(
                categoryA
            );

        const b =
            normalizeCategory(
                categoryB
            );

        if (
            !a ||
            !b
        ) {

            return false;

        }

        return a === b;

    }


    function formatCategory(
        category
    ) {

        const value =
            String(
                category || ""
            )
                .trim()
                .replace(/-/g, " ");

        return value
            .split(" ")
            .filter(Boolean)
            .map(
                function (word) {

                    return (
                        word.charAt(0)
                            .toUpperCase() +
                        word.slice(1)
                    );

                }
            )
            .join(" ");

    }


    function normalizeProductName(
        name
    ) {

        return String(
            name || ""
        )
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");

    }


    /* =========================================================
       SELLER NAME
    ========================================================= */

    function getKnownSellerName(
        sellerId
    ) {

        const id =
            Number(
                sellerId
            );

        const sellers = {

            16: "Fashion Hub",
            17: "Style Avenue",
            18: "Tech World",
            19: "Home Store",
            20: "Glow Store"

        };

        return (
            sellers[id] ||
            "ShopSphere"
        );

    }


    /* =========================================================
       BACKEND PRODUCT HELPERS
    ========================================================= */

    function isBackendProduct(
        product
    ) {

        return !!(
            product &&
            product.backendProduct &&
            product.id
        );

    }


    async function getBackendProduct(
        productId
    ) {

        if (!productId) {
            return null;
        }

        try {

            return await apiRequest(
                "/products/" +
                encodeURIComponent(
                    productId
                )
            );

        } catch (error) {

            console.error(
                "Get backend product error:",
                error
            );

            return null;

        }

    }


    function normalizeBackendProduct(
        product
    ) {

        if (!product) {
            return null;
        }

        const sellerId =
            Number(
                product.sellerId
            ) || null;

        const sellerName =
            product.sellerName ||
            product.seller ||
            getKnownSellerName(
                sellerId
            );

        return {

            id:
                product.id,

            productId:
                product.id,

            name:
                product.name ||
                "Product",

            price:
                Number(
                    product.price
                ) || 0,

            category:
                product.category ||
                "",

            stock:
                Math.max(
                    0,
                    Number(
                        product.stock
                    ) || 0
                ),

            image:
                product.imageUrl ||
                product.image ||
                "",

            imageUrl:
                product.imageUrl ||
                product.image ||
                "",

            description:
                product.description ||
                "",

            seller:
                sellerName,

            sellerName:
                sellerName,

            sellerId:
                sellerId,

            status:
                product.status ||
                "APPROVED",

            rating:
                Number(
                    product.rating
                ) || 4,

            reviews:
                Number(
                    product.reviews
                ) || 0,

            quantity:
                1,

            backendProduct:
                true

        };

    }


    /* =========================================================
       GET PRODUCT FROM CARD
    ========================================================= */

    function getProductFromCard(
        card
    ) {

        if (!card) {
            return null;
        }

        const nameElement =
            card.querySelector(
                ".product-info h3, h3"
            );

        const priceElement =
            card.querySelector(
                ".product-price"
            );

        const categoryElement =
            card.querySelector(
                ".product-category"
            );

        const sellerElement =
            card.querySelector(
                ".seller-name strong, .seller-name"
            );

        const imageElement =
            card.querySelector(
                ".product-image img, img"
            );

        const ratingElement =
            card.querySelector(
                ".product-rating"
            );

        const name =
            card.dataset.productName ||
            (
                nameElement
                    ? nameElement.textContent.trim()
                    : ""
            );

        const price =
            card.dataset.price !== undefined
                ? getNumericPrice(
                    card.dataset.price
                )
                : getNumericPrice(
                    priceElement
                        ? priceElement.textContent
                        : 0
                );

        const category =
            card.dataset.category ||
            (
                categoryElement
                    ? categoryElement.textContent.trim()
                    : ""
            );

        const seller =
            card.dataset.seller ||
            (
                sellerElement
                    ? sellerElement.textContent.trim()
                    : "ShopSphere"
            );

        const image =
            imageElement
                ? (
                    imageElement.getAttribute(
                        "src"
                    ) || ""
                )
                : "";

        let rating =
            card.dataset.rating ||
            "";

        if (!rating && ratingElement) {

            const ratingMatch =
                ratingElement.textContent.match(
                    /([0-5](?:\.\d+)?)/
                );

            rating =
                ratingMatch
                    ? ratingMatch[1]
                    : 4;

        }

        const productId =
            card.dataset.productId ||
            card.dataset.productid ||
            card.dataset.backendProductId ||
            "";

        const sellerId =
            card.dataset.sellerId ||
            "";

        const stock =
            card.dataset.stock !== undefined
                ? Number(
                    card.dataset.stock
                )
                : 0;

        return {

            id:
                productId
                    ? Number(productId)
                    : null,

            productId:
                productId
                    ? Number(productId)
                    : null,

            name:
                name,

            price:
                price,

            category:
                category,

            seller:
                seller,

            sellerName:
                seller,

            sellerId:
                sellerId
                    ? Number(sellerId)
                    : null,

            image:
                image,

            imageUrl:
                image,

            rating:
                Number(rating) || 4,

            reviews:
                0,

            stock:
                stock,

            description:
                card.dataset.description ||
                "",

            backendProduct:
                card.dataset.backend === "true" ||
                !!productId

        };

    }


    /* =========================================================
       BACKEND CART
    ========================================================= */

    async function getBackendCart() {

        if (
            !isCustomerLoggedIn()
        ) {

            return [];

        }

        const customerId =
            getCustomerId();

        try {

            const cart =
                await apiRequest(
                    "/cart/customer/" +
                    encodeURIComponent(
                        customerId
                    )
                );

            return Array.isArray(
                cart
            )
                ? cart
                : [];

        } catch (error) {

            console.error(
                "Backend cart error:",
                error
            );

            return [];

        }

    }


    async function getDetailedBackendCart() {

        const cart =
            await getBackendCart();

        if (
            !Array.isArray(cart) ||
            cart.length === 0
        ) {

            return [];

        }

        const detailedCart =
            [];

        for (
            const cartItem of cart
        ) {

            try {

                const product =
                    await getBackendProduct(
                        cartItem.productId
                    );

                if (!product) {
                    continue;
                }

                const normalized =
                    normalizeBackendProduct(
                        product
                    );

                normalized.quantity =
                    Math.max(
                        1,
                        Number(
                            cartItem.quantity
                        ) || 1
                    );

                normalized.cartId =
                    cartItem.id;

                detailedCart.push(
                    normalized
                );

            } catch (error) {

                console.error(
                    "Cart product loading error:",
                    error
                );

            }

        }

        return detailedCart;

    }


    async function updateHeaderCartCount() {

        const countElements =
            document.querySelectorAll(
                "#cart-count, .cart-count, [data-cart-count]"
            );

        if (
            countElements.length === 0
        ) {

            return;

        }

        if (
            !isCustomerLoggedIn()
        ) {

            countElements.forEach(
                function (element) {

                    element.textContent =
                        "0";

                }
            );

            return;

        }

        try {

            const cart =
                await getBackendCart();

            const count =
                cart.reduce(
                    function (
                        total,
                        item
                    ) {

                        return (
                            total +
                            (
                                Number(
                                    item.quantity
                                ) || 0
                            )
                        );

                    },
                    0
                );

            countElements.forEach(
                function (element) {

                    element.textContent =
                        count;

                }
            );

        } catch (error) {

            console.error(
                "Header cart count error:",
                error
            );

        }

    }


    /* =========================================================
       LOAD APPROVED PRODUCTS
    ========================================================= */

    async function loadApprovedProducts() {

        const productGrid =
            document.querySelector(
                ".products-grid"
            );

        if (!productGrid) {
            return [];
        }

        try {

            const approvedProducts =
                await apiRequest(
                    "/products/approved"
                );

            const backendProducts =
                Array.isArray(
                    approvedProducts
                )
                    ? approvedProducts.map(
                        normalizeBackendProduct
                    ).filter(Boolean)
                    : [];

            /*
               Remove previously generated seller cards.
            */

            productGrid
                .querySelectorAll(
                    ".seller-product-card"
                )
                .forEach(
                    function (card) {

                        card.remove();

                    }
                );


            const staticCards =
                Array.from(
                    productGrid.querySelectorAll(
                        ".product-card"
                    )
                );


            const representedNames =
                new Set();


            /*
               Connect existing static cards
               to their backend products.
            */

            staticCards.forEach(
                function (card) {

                    const oldProduct =
                        getProductFromCard(
                            card
                        );

                    if (!oldProduct) {
                        return;
                    }

                    const backendProduct =
                        backendProducts.find(
                            function (product) {

                                return (
                                    normalizeProductName(
                                        product.name
                                    ) ===
                                    normalizeProductName(
                                        oldProduct.name
                                    )
                                );

                            }
                        );

                    if (!backendProduct) {
                        return;
                    }

                    representedNames.add(
                        normalizeProductName(
                            backendProduct.name
                        )
                    );

                    card.dataset.productId =
                        backendProduct.id;

                    card.dataset.productName =
                        backendProduct.name;

                    card.dataset.category =
                        backendProduct.category;

                    card.dataset.price =
                        backendProduct.price;

                    card.dataset.sellerId =
                        backendProduct.sellerId || "";

                    card.dataset.seller =
                        backendProduct.seller ||
                        "ShopSphere";

                    card.dataset.stock =
                        backendProduct.stock;

                    card.dataset.backend =
                        "true";

                    card.dataset.description =
                        backendProduct.description ||
                        "";

                    /*
                       Keep the existing image from
                       the HTML because paths such as
                       ../images/tshirt.jpg are already correct.
                    */

                    const categoryElement =
                        card.querySelector(
                            ".product-category"
                        );

                    if (
                        categoryElement &&
                        backendProduct.category
                    ) {

                        categoryElement.textContent =
                            formatCategory(
                                backendProduct.category
                            );

                    }

                    const sellerElement =
                        card.querySelector(
                            ".seller-name strong, .seller-name"
                        );

                    if (
                        sellerElement
                    ) {

                        sellerElement.textContent =
                            backendProduct.seller ||
                            "ShopSphere";

                    }

                    const priceElement =
                        card.querySelector(
                            ".product-price"
                        );

                    if (
                        priceElement
                    ) {

                        priceElement.textContent =
                            formatPrice(
                                backendProduct.price
                            );

                    }

                }
            );


            /*
               Add backend-approved products that
               are not already represented by
               existing static cards.
            */

            backendProducts.forEach(
                function (product) {

                    const normalizedName =
                        normalizeProductName(
                            product.name
                        );

                    if (
                        representedNames.has(
                            normalizedName
                        )
                    ) {

                        return;

                    }

                    const card =
                        createBackendProductCard(
                            product
                        );

                    if (card) {

                        productGrid.appendChild(
                            card
                        );

                    }

                }
            );


            /*
               Remove legacy local cart.
               Backend cart is source of truth.
            */

            localStorage.removeItem(
                CART_KEY
            );


            return backendProducts;

        } catch (error) {

            console.error(
                "Approved products loading error:",
                error
            );

            return [];

        }

    }


    /* =========================================================
       CREATE BACKEND PRODUCT CARD
    ========================================================= */

    function createBackendProductCard(
        product
    ) {

        if (!product) {
            return null;
        }

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "product-card seller-product-card";

        card.dataset.productId =
            product.id;

        card.dataset.productName =
            product.name;

        card.dataset.category =
            product.category;

        card.dataset.price =
            product.price;

        card.dataset.sellerId =
            product.sellerId || "";

        card.dataset.seller =
            product.seller || "ShopSphere";

        card.dataset.stock =
            product.stock;

        card.dataset.rating =
            product.rating || 4;

        card.dataset.description =
            product.description || "";

        card.dataset.backend =
            "true";


        const image =
            product.image ||
            "";


        const rating =
            Math.max(
                1,
                Math.min(
                    5,
                    Math.round(
                        Number(
                            product.rating
                        ) || 4
                    )
                )
            );


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${escapeHtml(image)}"
                    alt="${escapeHtml(product.name)}"
                >

            </div>

            <div class="product-info">

                <p class="product-category">
                    ${escapeHtml(
                        formatCategory(
                            product.category
                        )
                    )}
                </p>

                <h3>
                    ${escapeHtml(
                        product.name
                    )}
                </h3>

                <p class="product-price">
                    ${formatPrice(
                        product.price
                    )}
                </p>

                <p class="product-rating">
                    ${"★".repeat(rating)}
                </p>

                <p class="seller-name">
                    Sold by:
                    <strong>
                        ${escapeHtml(
                            product.seller ||
                            "ShopSphere"
                        )}
                    </strong>
                </p>

            </div>

            <div class="product-actions">

                <button
                    type="button"
                    class="add-to-cart"
                >
                    Add to Cart
                </button>

                <a
                    href="product-details.html?productId=${encodeURIComponent(product.id)}"
                    class="view-details"
                >
                    View Details
                </a>

            </div>

        `;

        return card;

    }


    /* =========================================================
       PRODUCT DETAILS LINKS
    ========================================================= */

    function initializeProductDetailsLinks() {

        document
            .querySelectorAll(
                ".product-card"
            )
            .forEach(
                function (card) {

                    const product =
                        getProductFromCard(
                            card
                        );

                    if (!product) {
                        return;
                    }

                    const links =
                        card.querySelectorAll(
                            "a"
                        );

                    links.forEach(
                        function (link) {

                            const text =
                                link.textContent
                                    .trim()
                                    .toLowerCase();

                            if (
                                text.includes(
                                    "detail"
                                ) ||
                                link.classList.contains(
                                    "view-details"
                                )
                            ) {

                                const isProductsPage =
                                    getPageName() ===
                                    "products.html";

                                const prefix =
                                    isProductsPage
                                        ? ""
                                        : "";

                                link.href =
                                    prefix +
                                    "product-details.html?productId=" +
                                    encodeURIComponent(
                                        product.id
                                    );

                            }

                        }
                    );

                }
            );

    }


    /* =========================================================
       PRODUCT PAGE INITIALIZATION
    ========================================================= */

    async function initializeProductsPage() {

        const productGrid =
            document.querySelector(
                ".products-grid"
            );

        if (!productGrid) {
            return;
        }

        await loadApprovedProducts();


        productGrid
            .querySelectorAll(
                ".product-card"
            )
            .forEach(
                function (card) {

                    const product =
                        getProductFromCard(
                            card
                        );

                    if (!product) {
                        return;
                    }

                    if (
                        product.category
                    ) {

                        card.dataset.category =
                            product.category;

                    }

                    if (
                        product.price !==
                        undefined
                    ) {

                        card.dataset.price =
                            product.price;

                    }

                    if (
                        product.rating
                    ) {

                        card.dataset.rating =
                            product.rating;

                    }

                    if (
                        product.stock !==
                        undefined
                    ) {

                        card.dataset.stock =
                            product.stock;

                    }

                }
            );


        initializeProductDetailsLinks();

        initializeProductFilters();

        initializeSorting();

        initializeProductSearch();

        initializeAddToCart();

        initializeBrowseCategories();

        applyProductFilters();

    }


    /* =========================================================
       PRODUCT FILTER INITIALIZATION
       
       Category = one at a time
       Price = one at a time
       Rating = one at a time
       Availability = one at a time
    ========================================================= */

    function initializeProductFilters() {

        const categoryCheckboxes =
            document.querySelectorAll(
                "input[name='category'], input[data-filter='category']"
            );


        categoryCheckboxes.forEach(
            function (checkbox) {

                if (
                    checkbox.dataset.filterInitialized ===
                    "true"
                ) {

                    return;

                }

                checkbox.dataset.filterInitialized =
                    "true";


                checkbox.addEventListener(
                    "change",
                    function () {

                        if (
                            this.checked
                        ) {

                            categoryCheckboxes.forEach(
                                function (other) {

                                    if (
                                        other !==
                                        this
                                    ) {

                                        other.checked =
                                            false;

                                    }

                                }.bind(this)
                            );

                            activeCategory =
                                normalizeCategory(
                                    this.value ||
                                    this.dataset.category ||
                                    ""
                                ) ||
                                "all";

                        } else {

                            activeCategory =
                                "all";

                        }

                        currentPage =
                            1;

                        applyProductFilters();

                    }
                );

            }
        );


        const priceCheckboxes =
            document.querySelectorAll(
                "input[name='price'], input[data-filter='price']"
            );


        priceCheckboxes.forEach(
            function (checkbox) {

                if (
                    checkbox.dataset.filterInitialized ===
                    "true"
                ) {

                    return;

                }

                checkbox.dataset.filterInitialized =
                    "true";


                checkbox.addEventListener(
                    "change",
                    function () {

                        if (
                            this.checked
                        ) {

                            priceCheckboxes.forEach(
                                function (other) {

                                    if (
                                        other !==
                                        this
                                    ) {

                                        other.checked =
                                            false;

                                    }

                                }.bind(this)
                            );

                            activePrice =
                                this.value ||
                                this.dataset.price ||
                                "all";

                        } else {

                            activePrice =
                                "all";

                        }

                        currentPage =
                            1;

                        applyProductFilters();

                    }
                );

            }
        );


        const ratingCheckboxes =
            document.querySelectorAll(
                "input[name='rating'], input[data-filter='rating']"
            );


        ratingCheckboxes.forEach(
            function (checkbox) {

                if (
                    checkbox.dataset.filterInitialized ===
                    "true"
                ) {

                    return;

                }

                checkbox.dataset.filterInitialized =
                    "true";


                checkbox.addEventListener(
                    "change",
                    function () {

                        if (
                            this.checked
                        ) {

                            ratingCheckboxes.forEach(
                                function (other) {

                                    if (
                                        other !==
                                        this
                                    ) {

                                        other.checked =
                                            false;

                                    }

                                }.bind(this)
                            );

                            activeRating =
                                this.value ||
                                "all";

                        } else {

                            activeRating =
                                "all";

                        }

                        currentPage =
                            1;

                        applyProductFilters();

                    }
                );

            }
        );


        const availabilityCheckboxes =
            document.querySelectorAll(
                "input[name='availability'], input[data-filter='availability']"
            );


        availabilityCheckboxes.forEach(
            function (checkbox) {

                if (
                    checkbox.dataset.filterInitialized ===
                    "true"
                ) {

                    return;

                }

                checkbox.dataset.filterInitialized =
                    "true";


                checkbox.addEventListener(
                    "change",
                    function () {

                        if (
                            this.checked
                        ) {

                            availabilityCheckboxes.forEach(
                                function (other) {

                                    if (
                                        other !==
                                        this
                                    ) {

                                        other.checked =
                                            false;

                                    }

                                }.bind(this)
                            );

                            activeAvailability =
                                this.value ||
                                "all";

                        } else {

                            activeAvailability =
                                "all";

                        }

                        currentPage =
                            1;

                        applyProductFilters();

                    }
                );

            }
        );


        /*
           Set the correct checkbox state
           if URL parameters were loaded first.
        */

        syncFilterCheckboxes();

    }


    /* =========================================================
       SYNC FILTER CHECKBOXES
    ========================================================= */

    function syncFilterCheckboxes() {

        const categoryCheckboxes =
            document.querySelectorAll(
                "input[name='category'], input[data-filter='category']"
            );


        categoryCheckboxes.forEach(
            function (checkbox) {

                const value =
                    normalizeCategory(
                        checkbox.value ||
                        checkbox.dataset.category ||
                        ""
                    );

                checkbox.checked =
                    activeCategory !== "all" &&
                    categoriesMatch(
                        value,
                        activeCategory
                    );

            }
        );


        const priceCheckboxes =
            document.querySelectorAll(
                "input[name='price'], input[data-filter='price']"
            );


        priceCheckboxes.forEach(
            function (checkbox) {

                checkbox.checked =
                    activePrice !== "all" &&
                    normalizeFilterText(
                        checkbox.value ||
                        checkbox.dataset.price ||
                        ""
                    ) ===
                    normalizeFilterText(
                        activePrice
                    );

            }
        );


        const ratingCheckboxes =
            document.querySelectorAll(
                "input[name='rating'], input[data-filter='rating']"
            );


        ratingCheckboxes.forEach(
            function (checkbox) {

                checkbox.checked =
                    activeRating !== "all" &&
                    normalizeFilterText(
                        checkbox.value
                    ) ===
                    normalizeFilterText(
                        activeRating
                    );

            }
        );


        const availabilityCheckboxes =
            document.querySelectorAll(
                "input[name='availability'], input[data-filter='availability']"
            );


        availabilityCheckboxes.forEach(
            function (checkbox) {

                checkbox.checked =
                    activeAvailability !== "all" &&
                    normalizeFilterText(
                        checkbox.value
                    ) ===
                    normalizeFilterText(
                        activeAvailability
                    );

            }
        );

    }


    function normalizeFilterText(
        value
    ) {

        return String(
            value || ""
        )
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");

    }


    /* =========================================================
       PRICE MATCHING
    ========================================================= */

    function matchesPrice(
        product,
        priceFilter
    ) {

        if (
            !priceFilter ||
            priceFilter === "all"
        ) {

            return true;

        }


        const price =
            getNumericPrice(
                product.price
            );


        const filter =
            String(
                priceFilter
            )
                .toLowerCase()
                .replace(/₹/g, "")
                .replace(/,/g, "")
                .trim();


        if (
            filter.includes(
                "under"
            ) ||
            filter.includes(
                "below"
            ) ||
            filter.includes(
                "less"
            )
        ) {

            const number =
                Number(
                    filter.replace(
                        /[^0-9.]/g,
                        ""
                    )
                );

            return (
                !isNaN(number) &&
                price <= number
            );

        }


        if (
            filter.includes(
                "above"
            ) ||
            filter.includes(
                "over"
            ) ||
            filter.includes(
                "more"
            )
        ) {

            const number =
                Number(
                    filter.replace(
                        /[^0-9.]/g,
                        ""
                    )
                );

            return (
                !isNaN(number) &&
                price >= number
            );

        }


        /*
           Supports:
           500-1000
           ₹500 - ₹1000
           500 to 1000
        */

        const numbers =
            filter.match(
                /\d+(?:\.\d+)?/g
            );


        if (
            numbers &&
            numbers.length >= 2
        ) {

            const minimum =
                Number(
                    numbers[0]
                );

            const maximum =
                Number(
                    numbers[1]
                );

            return (
                price >= minimum &&
                price <= maximum
            );

        }


        /*
           If filter itself is only a number,
           treat it as an exact upper limit.
        */

        if (
            numbers &&
            numbers.length === 1
        ) {

            const number =
                Number(
                    numbers[0]
                );

            if (
                !isNaN(number)
            ) {

                return (
                    price <= number
                );

            }

        }


        return true;

    }


    /* =========================================================
       RATING MATCHING
    ========================================================= */

    function matchesRating(
        product,
        ratingFilter
    ) {

        if (
            !ratingFilter ||
            ratingFilter === "all"
        ) {

            return true;

        }


        const rating =
            Number(
                product.rating
            ) || 0;


        const numbers =
            String(
                ratingFilter
            ).match(
                /\d+(?:\.\d+)?/
            );


        if (!numbers) {
            return true;
        }


        const required =
            Number(
                numbers[0]
            );


        const text =
            String(
                ratingFilter
            )
                .toLowerCase();


        if (
            text.includes(
                "above"
            ) ||
            text.includes(
                "over"
            ) ||
            text.includes(
                "and above"
            )
        ) {

            return (
                rating >= required
            );

        }


        return (
            rating >= required
        );

    }


    /* =========================================================
       AVAILABILITY MATCHING
    ========================================================= */

    function matchesAvailability(
        product,
        availabilityFilter
    ) {

        if (
            !availabilityFilter ||
            availabilityFilter === "all"
        ) {

            return true;

        }


        const stock =
            Number(
                product.stock
            ) || 0;


        const filter =
            String(
                availabilityFilter
            )
                .toLowerCase();


        if (
            filter.includes(
                "out"
            )
        ) {

            return stock <= 0;

        }


        if (
            filter.includes(
                "available"
            ) ||
            filter.includes(
                "in stock"
            ) ||
            filter.includes(
                "stock"
            )
        ) {

            return stock > 0;

        }


        return true;

    }


    /* =========================================================
       APPLY PRODUCT FILTERS
    ========================================================= */

    function applyProductFilters() {

        const productGrid =
            document.querySelector(
                ".products-grid"
            );

        if (!productGrid) {
            return;
        }


        const cards =
            Array.from(
                productGrid.querySelectorAll(
                    ".product-card"
                )
            );


        const matchingCards =
            cards.filter(
                function (card) {

                    const product =
                        getProductFromCard(
                            card
                        );

                    if (!product) {
                        return false;
                    }


                    const categoryMatches =
                        activeCategory === "all" ||
                        categoriesMatch(
                            product.category,
                            activeCategory
                        );


                    const priceMatches =
                        matchesPrice(
                            product,
                            activePrice
                        );


                    const ratingMatches =
                        matchesRating(
                            product,
                            activeRating
                        );


                    const availabilityMatches =
                        matchesAvailability(
                            product,
                            activeAvailability
                        );


                    const searchableText =
                        (
                            String(
                                product.name ||
                                ""
                            ) +
                            " " +
                            String(
                                product.category ||
                                ""
                            ) +
                            " " +
                            String(
                                product.seller ||
                                ""
                            ) +
                            " " +
                            String(
                                product.description ||
                                ""
                            )
                        )
                            .toLowerCase();


                    const searchMatches =
                        !searchTerm ||
                        searchableText.includes(
                            searchTerm
                        );


                    return (
                        categoryMatches &&
                        priceMatches &&
                        ratingMatches &&
                        availabilityMatches &&
                        searchMatches
                    );

                }
            );


        /*
           Sort matching cards.
        */

        sortProductCards(
            matchingCards
        );


        /*
           Hide every product first.
        */

        cards.forEach(
            function (card) {

                card.style.display =
                    "none";

            }
        );


        /*
           Make sure current page is valid.
        */

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    matchingCards.length /
                    PRODUCTS_PER_PAGE
                )
            );


        if (
            currentPage >
            totalPages
        ) {

            currentPage =
                totalPages;

        }


        if (
            currentPage <
            1
        ) {

            currentPage =
                1;

        }


        const startIndex =
            (
                currentPage - 1
            ) *
            PRODUCTS_PER_PAGE;


        const visibleCards =
            matchingCards.slice(
                startIndex,
                startIndex +
                PRODUCTS_PER_PAGE
            );


        visibleCards.forEach(
            function (card) {

                card.style.display =
                    "";

            }
        );


        updateProductCount(
            matchingCards.length
        );


        updatePagination(
            matchingCards.length
        );


        showNoProductsMessage(
            matchingCards.length
        );


        initializeProductDetailsLinks();

        initializeAddToCart();

    }


    /* =========================================================
       SORT PRODUCT CARDS
    ========================================================= */

    function sortProductCards(
        cards
    ) {

        if (
            !Array.isArray(
                cards
            )
        ) {

            return;

        }


        cards.sort(
            function (cardA, cardB) {

                const productA =
                    getProductFromCard(
                        cardA
                    );


                const productB =
                    getProductFromCard(
                        cardB
                    );


                if (
                    !productA ||
                    !productB
                ) {

                    return 0;

                }


                if (
                    currentSort ===
                    "price-low"
                ) {

                    return (
                        getNumericPrice(
                            productA.price
                        ) -
                        getNumericPrice(
                            productB.price
                        )
                    );

                }


                if (
                    currentSort ===
                    "price-high"
                ) {

                    return (
                        getNumericPrice(
                            productB.price
                        ) -
                        getNumericPrice(
                            productA.price
                        )
                    );

                }


                if (
                    currentSort ===
                    "rating"
                ) {

                    return (
                        Number(
                            productB.rating
                        ) -
                        Number(
                            productA.rating
                        )
                    );

                }


                if (
                    currentSort ===
                    "newest"
                ) {

                    const idA =
                        Number(
                            productA.id
                        ) || 0;

                    const idB =
                        Number(
                            productB.id
                        ) || 0;

                    return (
                        idB -
                        idA
                    );

                }


                return 0;

            }
        );


        const productGrid =
            document.querySelector(
                ".products-grid"
            );


        if (!productGrid) {
            return;
        }


        cards.forEach(
            function (card) {

                productGrid.appendChild(
                    card
                );

            }
        );

    }


    /* =========================================================
       PRODUCT COUNT
       
       Example:
       1-8 of 26 products
       9-16 of 26 products
       17-24 of 26 products
       25-26 of 26 products
    ========================================================= */

    function updateProductCount(
        count
    ) {

        const elements =
            document.querySelectorAll(
                "#product-count, .product-count"
            );


        let start =
            0;

        let end =
            0;


        if (
            count > 0
        ) {

            start =
                (
                    currentPage - 1
                ) *
                PRODUCTS_PER_PAGE +
                1;


            end =
                Math.min(
                    currentPage *
                    PRODUCTS_PER_PAGE,
                    count
                );

        }


        elements.forEach(
            function (element) {

                if (
                    count === 0
                ) {

                    element.textContent =
                        "0 products";

                    return;

                }


                element.textContent =
                    start +
                    "-" +
                    end +
                    " of " +
                    count +
                    (
                        count === 1
                            ? " product"
                            : " products"
                    );

            }
        );

    }


    /* =========================================================
       NO PRODUCTS MESSAGE
    ========================================================= */

    function showNoProductsMessage(
        count
    ) {

        const productGrid =
            document.querySelector(
                ".products-grid"
            );


        if (!productGrid) {
            return;
        }


        let message =
            productGrid.querySelector(
                ".no-products-message"
            );


        if (
            count === 0
        ) {

            if (!message) {

                message =
                    document.createElement(
                        "div"
                    );

                message.className =
                    "no-products-message";

                message.textContent =
                    "No products found.";

                productGrid.appendChild(
                    message
                );

            }


            message.style.display =
                "block";

        } else if (
            message
        ) {

            message.style.display =
                "none";

        }

    }


    /* =========================================================
       PAGINATION
    ========================================================= */

    function updatePagination(
        totalProducts
    ) {

        const pagination =
            document.querySelector(
                ".pagination"
            );


        if (!pagination) {
            return;
        }


        const totalPages =
            Math.ceil(
                totalProducts /
                PRODUCTS_PER_PAGE
            );


        if (
            totalPages <= 1
        ) {

            pagination.innerHTML =
                "";

            return;

        }


        pagination.innerHTML =
            "";


        const previous =
            document.createElement(
                "button"
            );


        previous.type =
            "button";

        previous.textContent =
            "Previous";

        previous.disabled =
            currentPage <= 1;


        previous.addEventListener(
            "click",
            function () {

                if (
                    currentPage >
                    1
                ) {

                    currentPage--;

                    applyProductFilters();

                    scrollToProducts();

                }

            }
        );


        pagination.appendChild(
            previous
        );


        for (
            let page = 1;
            page <= totalPages;
            page++
        ) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";

            button.textContent =
                page;


            if (
                page ===
                currentPage
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.addEventListener(
                "click",
                function () {

                    currentPage =
                        page;

                    applyProductFilters();

                    scrollToProducts();

                }
            );


            pagination.appendChild(
                button
            );

        }


        const next =
            document.createElement(
                "button"
            );


        next.type =
            "button";

        next.textContent =
            "Next";

        next.disabled =
            currentPage >=
            totalPages;


        next.addEventListener(
            "click",
            function () {

                if (
                    currentPage <
                    totalPages
                ) {

                    currentPage++;

                    applyProductFilters();

                    scrollToProducts();

                }

            }
        );


        pagination.appendChild(
            next
        );

    }


    /* =========================================================
       SCROLL TO PRODUCTS
    ========================================================= */

    function scrollToProducts() {

        const productGrid =
            document.querySelector(
                ".products-grid"
            );


        if (
            productGrid
        ) {

            productGrid.scrollIntoView(
                {
                    behavior:
                        "smooth",

                    block:
                        "start"
                }
            );

        }

    }


    /* =========================================================
       SORTING
    ========================================================= */

    function initializeSorting() {

        const sortSelect =
            document.querySelector(
                "#sort-products, #sort-select, .sort-select"
            );


        if (
            !sortSelect
        ) {

            return;

        }


        if (
            sortSelect.dataset.sortInitialized ===
            "true"
        ) {

            return;

        }


        sortSelect.dataset.sortInitialized =
            "true";


        sortSelect.addEventListener(
            "change",
            function () {

                const value =
                    this.value;


                if (
                    value ===
                    "price-low" ||
                    value ===
                    "low-to-high"
                ) {

                    currentSort =
                        "price-low";

                } else if (
                    value ===
                    "price-high" ||
                    value ===
                    "high-to-low"
                ) {

                    currentSort =
                        "price-high";

                } else if (
                    value ===
                    "rating"
                ) {

                    currentSort =
                        "rating";

                } else if (
                    value ===
                    "newest"
                ) {

                    currentSort =
                        "newest";

                } else {

                    currentSort =
                        "recommended";

                }


                currentPage =
                    1;


                applyProductFilters();

            }
        );

    }


    /* =========================================================
       PRODUCT SEARCH
    ========================================================= */

    function initializeProductSearch() {

        const searchInputs =
            document.querySelectorAll(
                "#product-search, .product-search input, input[data-product-search]"
            );


        searchInputs.forEach(
            function (input) {

                if (
                    input.dataset.productSearchInitialized ===
                    "true"
                ) {

                    return;

                }


                input.dataset.productSearchInitialized =
                    "true";


                input.addEventListener(
                    "input",
                    function () {

                        searchTerm =
                            this.value
                                .trim()
                                .toLowerCase();


                        currentPage =
                            1;


                        applyProductFilters();

                    }
                );

            }
        );

    }


    /* =========================================================
       BROWSE CATEGORIES
       
       Supports category buttons/cards/links
       on index.html and products.html.

       Examples supported:
       ?category=Fashion
       ?category=Electronics
       ?category=Home%20%26%20Kitchen
       ?category=home-kitchen
       ========================================================= */

    function initializeBrowseCategories() {

        const categoryLinks =
            document.querySelectorAll(
                "[data-category-link], .category-link, .browse-category, .category-card a, .category-card button, [data-browse-category]"
            );


        categoryLinks.forEach(
            function (element) {

                if (
                    element.dataset.browseCategoryInitialized ===
                    "true"
                ) {

                    return;

                }


                element.dataset.browseCategoryInitialized =
                    "true";


                element.addEventListener(
                    "click",
                    function (event) {

                        const category =
                            element.dataset.category ||
                            element.dataset.categoryLink ||
                            element.dataset.browseCategory ||
                            element.getAttribute(
                                "data-category"
                            );


                        /*
                           Do not interfere with actual
                           product filter checkboxes.
                        */

                        if (
                            !category ||
                            element.matches(
                                "input[type='checkbox']"
                            )
                        ) {

                            return;

                        }


                        const normalized =
                            normalizeCategory(
                                category
                            );


                        if (!normalized) {
                            return;
                        }


                        /*
                           If already on products page,
                           filter directly.
                        */

                        if (
                            getPageName() ===
                            "products.html"
                        )    
                        {

                            event.preventDefault();

                            activeCategory =
                                normalized;

                            currentPage =
                                1;

                            syncFilterCheckboxes();

                            applyProductFilters();

                            return;

                        }


                        /*
                           From homepage, go to
                           products.html with category.
                        */

                        event.preventDefault();


                        const productsPath =
                            "pages/products.html";


                        window.location.href =
                            productsPath +
                            "?category=" +
                            encodeURIComponent(
                                category
                            );

                    }
                );

            }
        );

    }


    /* =========================================================
       LOAD SEARCH + CATEGORY + PRICE FROM URL
    ========================================================= */

    function loadSearchFromUrl() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        /*
           SEARCH
        */

        const searchValue =
            params.get(
                "search"
            );


        if (
            searchValue
        ) {

            searchTerm =
                searchValue
                    .trim()
                    .toLowerCase();


            const headerInput =
                document.querySelector(
                    "#header-search"
                );


            if (
                headerInput
            ) {

                headerInput.value =
                    searchValue;

            }


            const productInput =
                document.querySelector(
                    "#product-search"
                );


            if (
                productInput
            ) {

                productInput.value =
                    searchValue;

            }

        }


        /*
           CATEGORY
        */

        const categoryValue =
            params.get(
                "category"
            );


        if (
            categoryValue
        ) {

            activeCategory =
                normalizeCategory(
                    categoryValue
                ) ||
                "all";

        }


        /*
           PRICE
        */

        const priceValue =
            params.get(
                "price"
            );


        if (
            priceValue
        ) {

            activePrice =
                priceValue;

        }


        /*
           RATING
        */

        const ratingValue =
            params.get(
                "rating"
            );


        if (
            ratingValue
        ) {

            activeRating =
                ratingValue;

        }


        /*
           AVAILABILITY
        */

        const availabilityValue =
            params.get(
                "availability"
            );


        if (
            availabilityValue
        ) {

            activeAvailability =
                availabilityValue;

        }

    }


    /* =========================================================
       HEADER SEARCH
    ========================================================= */

    function initializeHeaderSearch() {

        document
            .querySelectorAll(
                ".search-container form"
            )
            .forEach(
                function (form) {

                    if (
                        form.dataset.headerSearchInitialized ===
                        "true"
                    ) {

                        return;

                    }


                    form.dataset.headerSearchInitialized =
                        "true";


                    const input =
                        form.querySelector(
                            "#header-search, input[type='search'], input[type='text']"
                        );


                    if (!input) {
                        return;
                    }


                    form.addEventListener(
                        "submit",
                        function (event) {

                            event.preventDefault();


                            const value =
                                input.value.trim();


                            if (!value) {

                                window.location.href =
                                    getPageName() ===
                                    "index.html"
                                        ? "pages/products.html"
                                        : "products.html";

                                return;

                            }


                            if (
                                getPageName() ===
                                "products.html"
                            ) {

                                searchTerm =
                                    value.toLowerCase();

                                currentPage =
                                    1;

                                applyProductFilters();

                            } else {

                                const productsPath =
                                    getPageName() ===
                                    "index.html"
                                        ? "pages/products.html"
                                        : "products.html";


                                window.location.href =
                                    productsPath +
                                    "?search=" +
                                    encodeURIComponent(
                                        value
                                    );

                            }

                        }
                    );

                }
            );

    }


    /* =========================================================
       ADD TO CART BUTTONS
    ========================================================= */

    function initializeAddToCart() {

        document
            .querySelectorAll(
                ".product-card .product-actions button"
            )
            .forEach(
                function (button) {

                    const text =
                        button.textContent
                            .trim()
                            .toLowerCase();


                    if (
                        !text.includes(
                            "add"
                        ) ||
                        !text.includes(
                            "cart"
                        )
                    ) {

                        return;

                    }


                    if (
                        button.dataset.initialized ===
                        "true"
                    ) {

                        return;

                    }


                    button.dataset.initialized =
                        "true";


                    button.addEventListener(
                        "click",
                        async function () {

                            const card =
                                button.closest(
                                    ".product-card"
                                );


                            if (!card) {
                                return;
                            }


                            await addCardProductToCart(
                                card,
                                button
                            );

                        }
                    );

                }
            );

    }


    /* =========================================================
       ADD CARD PRODUCT TO CART
    ========================================================= */

    async function addCardProductToCart(
        card,
        button
    ) {

        const product =
            getProductFromCard(
                card
            );


        if (!product) {

            alert(
                "Product information could not be loaded."
            );

            return false;

        }


        if (
            !isBackendProduct(
                product
            )
        ) {

            alert(
                "This product is not connected to the backend database yet."
            );

            return false;

        }


        return await addProductToBackendCart(
            product,
            1,
            button
        );

    }


    /* =========================================================
       ADD PRODUCT TO BACKEND CART
    ========================================================= */

    async function addProductToBackendCart(
        product,
        quantity,
        button
    ) {

        if (
            !isCustomerLoggedIn()
        ) {

            alert(
                "Please login as a customer before adding products to cart."
            );

            return false;

        }


        const stock =
            Number(
                product.stock
            ) || 0;


        if (
            stock <= 0
        ) {

            alert(
                "This product is currently out of stock."
            );

            return false;

        }


        quantity =
            Math.max(
                1,
                Number(
                    quantity
                ) || 1
            );


        if (
            quantity >
            stock
        ) {

            alert(
                "Only " +
                stock +
                " item(s) available."
            );

            return false;

        }


        try {

            await apiRequest(
                "/cart",
                {

                    method:
                        "POST",

                    body:
                        JSON.stringify(
                            {

                                productId:
                                    Number(
                                        product.id
                                    ),

                                quantity:
                                    quantity

                            }
                        )

                }
            );


            await updateHeaderCartCount();


            if (
                button
            ) {

                const originalText =
                    button.textContent;


                button.textContent =
                    "Added";


                button.disabled =
                    true;


                setTimeout(
                    function () {

                        button.textContent =
                            originalText;

                        button.disabled =
                            false;

                    },
                    1200
                );

            }


            alert(
                product.name +
                " (" +
                quantity +
                ") added to cart!"
            );


            return true;

        } catch (error) {

            console.error(
                "Backend cart error:",
                error
            );


            alert(
                "Could not add product to cart.\n\n" +
                error.message
            );


            return false;

        }

    }


    /* =========================================================
       ADD PRODUCT DETAILS TO CART
    ========================================================= */

    async function addProductToCart(
        product,
        quantity
    ) {

        const stock =
            Number(
                product.stock
            ) || 0;


        if (
            stock <= 0
        ) {

            alert(
                "This product is currently out of stock."
            );

            return false;

        }


        quantity =
            Math.max(
                1,
                Number(
                    quantity
                ) || 1
            );


        if (
            quantity >
            stock
        ) {

            alert(
                "Only " +
                stock +
                " item(s) available."
            );

            return false;

        }


        if (
            !isBackendProduct(
                product
            )
        ) {

            alert(
                "This product is not connected to the backend database yet."
            );

            return false;

        }


        if (
            !isCustomerLoggedIn()
        ) {

            alert(
                "Please login as a customer before adding products to cart."
            );

            return false;

        }


        try {

            await apiRequest(
                "/cart",
                {

                    method:
                        "POST",

                    body:
                        JSON.stringify(
                            {

                                productId:
                                    Number(
                                        product.id
                                    ),

                                quantity:
                                    quantity

                            }
                        )

                }
            );


            await updateHeaderCartCount();


            alert(
                product.name +
                " (" +
                quantity +
                ") added to cart!"
            );


            return true;

        } catch (error) {

            console.error(
                "Backend cart error:",
                error
            );


            alert(
                "Could not add product to cart.\n" +
                error.message
            );


            return false;

        }

    }


    /* =========================================================
       CART PAGE
    ========================================================= */

    async function initializeCartPage() {

        const cartItemsContainer =
            document.querySelector(
                "#cart-items"
            );


        if (
            !cartItemsContainer
        ) {

            return;

        }


        if (
            !isCustomerLoggedIn()
        ) {

            showCartLoginMessage();

            return;

        }


        await displayCartItems();


        initializeCheckoutButton();

    }


    /* =========================================================
       CART LOGIN MESSAGE
    ========================================================= */

    function showCartLoginMessage() {

        const container =
            document.querySelector(
                "#cart-items"
            );


        const emptyCart =
            document.querySelector(
                "#empty-cart"
            );


        if (
            container
        ) {

            container.innerHTML =
                "<p>Please login as a customer to view your cart.</p>";

        }


        if (
            emptyCart
        ) {

            emptyCart.style.display =
                "none";

        }


        const itemCount =
            document.querySelector(
                "#cart-item-count"
            );


        const subtotalElement =
            document.querySelector(
                "#cart-subtotal"
            );


        const deliveryElement =
            document.querySelector(
                "#cart-delivery"
            );


        const totalElement =
            document.querySelector(
                "#cart-total"
            );


        if (
            itemCount
        ) {

            itemCount.textContent =
                "0 items";

        }


        if (
            subtotalElement
        ) {

            subtotalElement.textContent =
                "₹0";

        }


        if (
            deliveryElement
        ) {

            deliveryElement.textContent =
                "₹0";

        }


        if (
            totalElement
        ) {

            totalElement.textContent =
                "₹0";

        }

    }


    /* =========================================================
       DISPLAY CART ITEMS
    ========================================================= */

    async function displayCartItems() {

        const container =
            document.querySelector(
                "#cart-items"
            );


        const emptyCart =
            document.querySelector(
                "#empty-cart"
            );


        const itemCount =
            document.querySelector(
                "#cart-item-count"
            );


        const subtotalElement =
            document.querySelector(
                "#cart-subtotal"
            );


        const deliveryElement =
            document.querySelector(
                "#cart-delivery"
            );


        const totalElement =
            document.querySelector(
                "#cart-total"
            );


        if (!container) {
            return;
        }


        if (
            !isCustomerLoggedIn()
        ) {

            showCartLoginMessage();

            return;

        }


        const backendCart =
            await getDetailedBackendCart();


        const hasItems =
            backendCart.length >
            0;


        if (!hasItems) {

            container.innerHTML =
                "";


            if (
                emptyCart
            ) {

                emptyCart.style.display =
                    "block";

            }


            if (
                itemCount
            ) {

                itemCount.textContent =
                    "0 items";

            }


            if (
                subtotalElement
            ) {

                subtotalElement.textContent =
                    "₹0";

            }


            if (
                deliveryElement
            ) {

                deliveryElement.textContent =
                    "₹0";

            }


            if (
                totalElement
            ) {

                totalElement.textContent =
                    "₹0";

            }


            return;

        }


        if (
            emptyCart
        ) {

            emptyCart.style.display =
                "none";

        }


        container.innerHTML =
            "";


        let subtotal =
            0;


        let totalQuantity =
            0;


        backendCart.forEach(
            function (product) {

                const quantity =
                    Math.max(
                        1,
                        Number(
                            product.quantity
                        ) || 1
                    );


                const price =
                    Number(
                        product.price
                    ) || 0;


                subtotal +=
                    price *
                    quantity;


                totalQuantity +=
                    quantity;


                renderCartItem(
                    container,
                    product,
                    quantity,
                    product.cartId,
                    true
                );

            }
        );


        const delivery =
            0;


        const total =
            subtotal +
            delivery;


        if (
            itemCount
        ) {

            itemCount.textContent =
                totalQuantity +
                (
                    totalQuantity === 1
                        ? " item"
                        : " items"
                );

        }


        if (
            subtotalElement
        ) {

            subtotalElement.textContent =
                formatPrice(
                    subtotal
                );

        }


        if (
            deliveryElement
        ) {

            deliveryElement.textContent =
                formatPrice(
                    delivery
                );

        }


        if (
            totalElement
        ) {

            totalElement.textContent =
                formatPrice(
                    total
                );

        }


        initializeCartItemButtons();

    }


    /* =========================================================
       RENDER CART ITEM
    ========================================================= */

    function renderCartItem(
        container,
        product,
        quantity,
        identifier,
        backendProduct
    ) {

        const price =
            Number(
                product.price
            ) || 0;


        const item =
            document.createElement(
                "div"
            );


        item.className =
            "cart-item";


        item.dataset.index =
            identifier;


        item.dataset.backend =
            "true";


        item.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${escapeHtml(
                        product.image || ""
                    )}"
                    alt="${escapeHtml(
                        product.name ||
                        "Product"
                    )}"
                >

            </div>


            <div class="cart-item-details">

                <h3>
                    ${escapeHtml(
                        product.name ||
                        "Product"
                    )}
                </h3>


                <p class="cart-item-category">
                    ${escapeHtml(
                        formatCategory(
                            product.category ||
                            ""
                        )
                    )}
                </p>


                <p class="cart-item-seller">
                    Sold by:
                    <strong>
                        ${escapeHtml(
                            product.seller ||
                            product.sellerName ||
                            "ShopSphere"
                        )}
                    </strong>
                </p>


                <p class="cart-item-price">
                    ${formatPrice(
                        price
                    )}
                </p>

            </div>


            <div class="cart-item-actions">

                <div class="quantity-controls">

                    <button
                        type="button"
                        class="cart-quantity-minus"
                        data-index="${identifier}"
                        data-backend="true"
                    >
                        −
                    </button>


                    <span class="cart-quantity">
                        ${quantity}
                    </span>


                    <button
                        type="button"
                        class="cart-quantity-plus"
                        data-index="${identifier}"
                        data-backend="true"
                    >
                        +
                    </button>

                </div>


                <strong class="cart-item-total">
                    ${formatPrice(
                        price *
                        quantity
                    )}
                </strong>


                <button
                    type="button"
                    class="remove-cart-item"
                    data-index="${identifier}"
                    data-backend="true"
                >
                    Remove
                </button>

            </div>

        `;


        container.appendChild(
            item
        );

    }


    /* =========================================================
       CART ITEM BUTTONS
    ========================================================= */

    function initializeCartItemButtons() {

        document
            .querySelectorAll(
                ".cart-quantity-minus"
            )
            .forEach(
                function (button) {

                    if (
                        button.dataset.initialized ===
                        "true"
                    ) {

                        return;

                    }


                    button.dataset.initialized =
                        "true";


                    button.addEventListener(
                        "click",
                        async function () {

                            const index =
                                button.dataset.index;


                            await changeCartQuantity(
                                index,
                                -1
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".cart-quantity-plus"
            )
            .forEach(
                function (button) {

                    if (
                        button.dataset.initialized ===
                        "true"
                    ) {

                        return;

                    }


                    button.dataset.initialized =
                        "true";


                    button.addEventListener(
                        "click",
                        async function () {

                            const index =
                                button.dataset.index;


                            await changeCartQuantity(
                                index,
                                1
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".remove-cart-item"
            )
            .forEach(
                function (button) {

                    if (
                        button.dataset.initialized ===
                        "true"
                    ) {

                        return;

                    }


                    button.dataset.initialized =
                        "true";


                    button.addEventListener(
                        "click",
                        async function () {

                            const index =
                                button.dataset.index;


                            await removeCartItem(
                                index
                            );

                        }
                    );

                }
            );

    }


    /* =========================================================
       CHANGE CART QUANTITY
    ========================================================= */

    async function changeCartQuantity(
        cartId,
        change
    ) {

        if (
            !isCustomerLoggedIn()
        ) {

            alert(
                "Please login as a customer."
            );

            return;

        }


        cartId =
            Number(
                cartId
            );


        if (
            !cartId
        ) {

            return;

        }


        try {

            const backendCart =
                await getBackendCart();


            const cartItem =
                backendCart.find(
                    function (item) {

                        return (
                            Number(
                                item.id
                            ) ===
                            cartId
                        );

                    }
                );


            if (!cartItem) {

                alert(
                    "Cart item not found."
                );

                await displayCartItems();

                return;

            }


            const currentQuantity =
                Number(
                    cartItem.quantity
                ) || 1;


            const newQuantity =
                currentQuantity +
                change;


            if (
                newQuantity <= 0
            ) {

                await apiRequest(
                    "/cart/" +
                    encodeURIComponent(
                        cartId
                    ),
                    {

                        method:
                            "DELETE"

                    }
                );

            } else {

                const product =
                    await getBackendProduct(
                        cartItem.productId
                    );


                if (
                    product &&
                    Number(
                        product.stock
                    ) <
                    newQuantity
                ) {

                    alert(
                        "Only " +
                        Number(
                            product.stock
                        ) +
                        " item(s) available."
                    );

                    return;

                }


                await apiRequest(
                    "/cart/" +
                    encodeURIComponent(
                        cartId
                    ) +
                    "?quantity=" +
                    encodeURIComponent(
                        newQuantity
                    ),
                    {

                        method:
                            "PUT"

                    }
                );

            }


            await updateHeaderCartCount();

            await displayCartItems();

        } catch (error) {

            console.error(
                "Backend cart quantity error:",
                error
            );


            alert(
                error.message
            );

        }

    }


    /* =========================================================
       REMOVE CART ITEM
    ========================================================= */

    async function removeCartItem(
        cartId
    ) {

        if (
            !isCustomerLoggedIn()
        ) {

            alert(
                "Please login as a customer."
            );

            return;

        }


        try {

            await apiRequest(
                "/cart/" +
                encodeURIComponent(
                    Number(
                        cartId
                    )
                ),
                {

                    method:
                        "DELETE"

                }
            );


            await updateHeaderCartCount();

            await displayCartItems();

        } catch (error) {

            console.error(
                "Backend remove cart error:",
                error
            );


            alert(
                error.message
            );

        }

    }


    /* =========================================================
       CHECKOUT BUTTON
    ========================================================= */

    function initializeCheckoutButton() {

        const button =
            document.querySelector(
                "#checkout-button"
            );


        if (!button) {
            return;
        }


        if (
            button.dataset.initialized ===
            "true"
        ) {

            return;

        }


        button.dataset.initialized =
            "true";


        button.addEventListener(
            "click",
            async function () {

                if (
                    !isCustomerLoggedIn()
                ) {

                    alert(
                        "Please login as a customer before checkout."
                    );

                    return;

                }


                const backendCart =
                    await getBackendCart();


                if (
                    backendCart.length ===
                    0
                ) {

                    alert(
                        "Your cart is empty."
                    );

                    return;

                }


                window.location.href =
                    "checkout.html";

            }
        );

    }


    /* =========================================================
       CHECKOUT PAGE
    ========================================================= */

    async function initializeCheckoutPage() {

        if (
            getPageName() !==
            "checkout.html"
        ) {

            return;

        }


        const itemsContainer =
            document.querySelector(
                "#checkout-items"
            );


        const subtotalElement =
            document.querySelector(
                "#checkout-subtotal"
            );


        const totalElement =
            document.querySelector(
                "#checkout-total"
            );


        if (
            !itemsContainer ||
            !subtotalElement ||
            !totalElement
        ) {

            return;

        }


        if (
            !isCustomerLoggedIn()
        ) {

            itemsContainer.innerHTML =
                "<p>Please login as a customer before checkout.</p>";

            subtotalElement.textContent =
                "₹0";

            totalElement.textContent =
                "₹0";

            return;

        }


        const backendCart =
            await getDetailedBackendCart();


        if (
            backendCart.length ===
            0
        ) {

            itemsContainer.innerHTML =
                "<p>Your cart is empty.</p>";

            subtotalElement.textContent =
                "₹0";

            totalElement.textContent =
                "₹0";

            return;

        }


        itemsContainer.innerHTML =
            "";


        let subtotal =
            0;


        backendCart.forEach(
            function (item) {

                const price =
                    getNumericPrice(
                        item.price
                    );


                const quantity =
                    Math.max(
                        1,
                        Number(
                            item.quantity
                        ) || 1
                    );


                const itemTotal =
                    price *
                    quantity;


                subtotal +=
                    itemTotal;


                renderCheckoutItem(
                    itemsContainer,
                    item,
                    quantity,
                    itemTotal
                );

            }
        );


        subtotalElement.textContent =
            formatPrice(
                subtotal
            );


        totalElement.textContent =
            formatPrice(
                subtotal
            );


        initializePlaceOrder(
            backendCart
        );

    }


    /* =========================================================
       RENDER CHECKOUT ITEM
    ========================================================= */

    function renderCheckoutItem(
        container,
        item,
        quantity,
        itemTotal
    ) {

        const itemElement =
            document.createElement(
                "div"
            );


        itemElement.className =
            "checkout-item";


        itemElement.innerHTML =

            '<div class="checkout-item-image">' +

                '<img src="' +
                    escapeHtml(
                        item.image ||
                        ""
                    ) +
                    '" alt="' +
                    escapeHtml(
                        item.name ||
                        "Product"
                    ) +
                '">' +

            '</div>' +

            '<div class="checkout-item-info">' +

                '<h3>' +
                    escapeHtml(
                        item.name ||
                        "Product"
                    ) +
                '</h3>' +

                '<p>' +
                    'Qty: ' +
                    quantity +
                '</p>' +

                '<strong>' +
                    formatPrice(
                        itemTotal
                    ) +
                '</strong>' +

            '</div>';


        container.appendChild(
            itemElement
        );

    }


    /* =========================================================
       PLACE ORDER
    ========================================================= */

    function initializePlaceOrder(
        backendCart
    ) {

        const checkoutForm =
            document.querySelector(
                "#checkout-form"
            );


        if (!checkoutForm) {
            return;
        }


        if (
            checkoutForm.dataset.initialized ===
            "true"
        ) {

            return;

        }


        checkoutForm.dataset.initialized =
            "true";


        checkoutForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                if (
                    !isCustomerLoggedIn()
                ) {

                    alert(
                        "Please login as a customer before placing the order."
                    );

                    return;

                }


                const currentCart =
                    await getDetailedBackendCart();


                if (
                    currentCart.length ===
                    0
                ) {

                    alert(
                        "Your cart is empty."
                    );

                    return;

                }


                await placeBackendOrder(
                    checkoutForm,
                    currentCart
                );

            }
        );

    }


    /* =========================================================
       PLACE BACKEND ORDER
    ========================================================= */

    async function placeBackendOrder(
        checkoutForm,
        backendCart
    ) {

        const customerId =
            getCustomerId();


        if (!customerId) {

            alert(
                "Customer information not found. Please login again."
            );

            return;

        }


        const orderItems =
            backendCart.map(
                function (item) {

                    return {

                        productId:
                            Number(
                                item.productId ||
                                item.id
                            ),

                        quantity:
                            Math.max(
                                1,
                                Number(
                                    item.quantity
                                ) || 1
                            )

                    };

                }
            );


        const invalidItem =
            orderItems.find(
                function (item) {

                    return (
                        !item.productId ||
                        isNaN(
                            item.productId
                        )
                    );

                }
            );


        if (
            invalidItem
        ) {

            alert(
                "One or more products have an invalid product ID."
            );

            return;

        }


        const requestBody = {

            customerId:
                Number(
                    customerId
                ),

            items:
                orderItems

        };


        console.log(
            "Sending PlaceOrderRequest:",
            requestBody
        );


        try {

            const savedOrder =
                await apiRequest(
                    "/orders",
                    {

                        method:
                            "POST",

                        body:
                            JSON.stringify(
                                requestBody
                            )

                    }
                );


            console.log(
                "Backend order created:",
                savedOrder
            );


            const localOrder = {

                id:
                    savedOrder &&
                    savedOrder.id
                        ? savedOrder.id
                        : (
                            "ORD-" +
                            Date.now()
                        ),

                customerId:
                    Number(
                        customerId
                    ),

                items:
                    backendCart.map(
                        function (item) {

                            return {

                                id:
                                    item.productId ||
                                    item.id,

                                productId:
                                    item.productId ||
                                    item.id,

                                name:
                                    item.name,

                                price:
                                    Number(
                                        item.price
                                    ) || 0,

                                quantity:
                                    Math.max(
                                        1,
                                        Number(
                                            item.quantity
                                        ) || 1
                                    ),

                                image:
                                    item.image ||
                                    "",

                                category:
                                    item.category ||
                                    "",

                                seller:
                                    item.seller ||
                                    "ShopSphere"

                            };

                        }
                    ),

                total:
                    savedOrder &&
                    savedOrder.totalAmount != null
                        ? savedOrder.totalAmount
                        : backendCart.reduce(
                            function (
                                total,
                                item
                            ) {

                                return (
                                    total +
                                    (
                                        Number(
                                            item.price
                                        ) || 0
                                    ) *
                                    (
                                        Number(
                                            item.quantity
                                        ) || 1
                                    )
                                );

                            },
                            0
                        ),

                status:
                    savedOrder &&
                    savedOrder.status
                        ? savedOrder.status
                        : "PLACED",

                date:
                    new Date()
                        .toISOString(),

                customer:
                    {

                        fullName:
                            getFormValue(
                                checkoutForm,
                                "fullName"
                            ),

                        email:
                            getFormValue(
                                checkoutForm,
                                "email"
                            ),

                        phone:
                            getFormValue(
                                checkoutForm,
                                "phone"
                            ),

                        address:
                            getFormValue(
                                checkoutForm,
                                "address"
                            ),

                        city:
                            getFormValue(
                                checkoutForm,
                                "city"
                            ),

                        state:
                            getFormValue(
                                checkoutForm,
                                "state"
                            ),

                        pincode:
                            getFormValue(
                                checkoutForm,
                                "pincode"
                            )

                    },

                paymentMethod:
                    getFormValue(
                        checkoutForm,
                        "payment"
                    )

            };


            saveLocalOrderCopy(
                localOrder
            );


            localStorage.removeItem(
                CART_KEY
            );


            await updateHeaderCartCount();


            alert(
                "Order placed successfully!"
            );


            window.location.href =
                "orders.html";


        } catch (error) {

            console.error(
                "Place backend order error:",
                error
            );


            alert(
                "Could not place order.\n\n" +
                error.message
            );

        }

    }


    /* =========================================================
       FORM VALUE HELPER
    ========================================================= */

    function getFormValue(
        form,
        name
    ) {

        if (!form) {
            return "";
        }


        const element =
            form.querySelector(
                '[name="' +
                name +
                '"]'
            );


        return element
            ? element.value
            : "";

    }


    /* =========================================================
       SAVE LOCAL ORDER COPY
    ========================================================= */

    function saveLocalOrderCopy(
        order
    ) {

        let orders =
            [];


        try {

            orders =
                JSON.parse(
                    localStorage.getItem(
                        ORDERS_KEY
                    )
                ) || [];


            if (
                !Array.isArray(
                    orders
                )
            ) {

                orders =
                    [];

            }

        } catch (error) {

            orders =
                [];

        }


        orders.push(
            order
        );


        localStorage.setItem(
            ORDERS_KEY,
            JSON.stringify(
                orders
            )
        );


        localStorage.setItem(
            SINGLE_ORDER_KEY,
            JSON.stringify(
                order
            )
        );

    }


    /* =========================================================
       CUSTOMER ORDER HISTORY
    ========================================================= */

    async function getCustomerOrderHistory() {

        if (
            !isCustomerLoggedIn()
        ) {

            return [];

        }


        const customerId =
            getCustomerId();


        try {

            const orders =
                await apiRequest(
                    "/orders/customer/" +
                    encodeURIComponent(
                        customerId
                    ) +
                    "/history"
                );


            return Array.isArray(
                orders
            )
                ? orders
                : [];

        } catch (error) {

            console.error(
                "Customer order history error:",
                error
            );

            return [];

        }

    }


    /* =========================================================
       PRODUCT DETAILS PAGE
    ========================================================= */

    async function initializeProductDetailsPage() {

        if (
            getPageName() !==
            "product-details.html"
        ) {

            return;

        }


        const params =
            new URLSearchParams(
                window.location.search
            );


        const productId =
            params.get(
                "productId"
            );


        const productName =
            params.get(
                "product"
            );


        let product =
            null;


        /*
           1. Backend Product ID
        */

        if (
            productId
        ) {

            const backendProduct =
                await getBackendProduct(
                    productId
                );


            if (
                backendProduct
            ) {

                product =
                    normalizeBackendProduct(
                        backendProduct
                    );

            }

        }


        /*
           2. Approved backend product
              by name.
        */

        if (
            !product &&
            productName
        ) {

            try {

                const approved =
                    await apiRequest(
                        "/products/approved"
                    );


                if (
                    Array.isArray(
                        approved
                    )
                ) {

                    const found =
                        approved.find(
                            function (item) {

                                return (
                                    normalizeProductName(
                                        item.name
                                    ) ===
                                    normalizeProductName(
                                        productName
                                    )
                                );

                            }
                        );


                    if (
                        found
                    ) {

                        product =
                            normalizeBackendProduct(
                                found
                            );

                    }

                }

            } catch (error) {

                console.error(
                    "Approved product details error:",
                    error
                );

            }

        }


        /*
           3. Static product fallback.
        */

        if (
            !product &&
            productName
        ) {

            product =
                await getStaticProductFromProductsPage(
                    productName
                );

        }


        if (!product) {

            displayProductNotFound();

            return;

        }


        displayProductDetails(
            product
        );

    }


    /* =========================================================
       GET STATIC PRODUCT FROM PRODUCTS PAGE
    ========================================================= */

    async function getStaticProductFromProductsPage(
        productName
    ) {

        try {

            const productsPath =
                getPageName() ===
                "product-details.html"
                    ? "products.html"
                    : "pages/products.html";


            const response =
                await fetch(
                    productsPath
                );


            if (
                !response.ok
            ) {

                return null;

            }


            const html =
                await response.text();


            const parser =
                new DOMParser();


            const documentObject =
                parser.parseFromString(
                    html,
                    "text/html"
                );


            const cards =
                documentObject.querySelectorAll(
                    ".product-card"
                );


            for (
                const card of cards
            ) {

                const product =
                    getProductFromCard(
                        card
                    );


                if (
                    product &&
                    normalizeProductName(
                        product.name
                    ) ===
                    normalizeProductName(
                        productName
                    )
                ) {

                    return product;

                }

            }

        } catch (error) {

            console.error(
                "Static product fallback error:",
                error
            );

        }


        return null;

    }


    /* =========================================================
       DISPLAY PRODUCT NOT FOUND
    ========================================================= */

    function displayProductNotFound() {

        const nameElements =
            document.querySelectorAll(
                ".product-detail-name, #product-name, .product-details h1"
            );


        nameElements.forEach(
            function (element) {

                element.textContent =
                    "Product not found";

            }
        );


        const descriptionElements =
            document.querySelectorAll(
                ".product-detail-description, #product-description"
            );


        descriptionElements.forEach(
            function (element) {

                element.textContent =
                    "The requested product could not be found.";

            }
        );

    }


    /* =========================================================
       DISPLAY PRODUCT DETAILS
    ========================================================= */

    function displayProductDetails(
        product
    ) {

        if (!product) {
            return;
        }


        const nameElements =
            document.querySelectorAll(
                "#product-name, .product-detail-name, .product-details h1"
            );


        nameElements.forEach(
            function (element) {

                element.textContent =
                    product.name ||
                    "Product";

            }
        );


        const imageElements =
            document.querySelectorAll(
                "#product-image, .product-detail-image img, .product-details-image img"
            );


        imageElements.forEach(
            function (element) {

                if (
                    product.image
                ) {

                    element.src =
                        product.image;

                }


                element.alt =
                    product.name ||
                    "Product";

            }
        );


        const priceElements =
            document.querySelectorAll(
                "#product-price, .product-detail-price, .product-details-price"
            );


        priceElements.forEach(
            function (element) {

                element.textContent =
                    formatPrice(
                        product.price
                    );

            }
        );


        const categoryElements =
            document.querySelectorAll(
                "#product-category, .product-detail-category, .product-details-category"
            );


        categoryElements.forEach(
            function (element) {

                element.textContent =
                    formatCategory(
                        product.category
                    );

            }
        );


        const descriptionElements =
            document.querySelectorAll(
                "#product-description, .product-detail-description, .product-details-description"
            );


        descriptionElements.forEach(
            function (element) {

                element.textContent =
                    product.description ||
                    "No description available.";

            }
        );


        const sellerElements =
            document.querySelectorAll(
                "#product-seller, .product-detail-seller, .product-details-seller"
            );


        sellerElements.forEach(
            function (element) {

                element.textContent =
                    product.seller ||
                    product.sellerName ||
                    "ShopSphere";

            }
        );


        const ratingElements =
            document.querySelectorAll(
                "#product-rating, .product-detail-rating, .product-details-rating"
            );


        ratingElements.forEach(
            function (element) {

                const rating =
                    Math.max(
                        1,
                        Math.min(
                            5,
                            Math.round(
                                Number(
                                    product.rating
                                ) || 4
                            )
                        )
                    );


                element.textContent =
                    "★".repeat(
                        rating
                    );

            }
        );


        const stockElements =
            document.querySelectorAll(
                "#product-stock, .product-detail-stock, .product-details-stock"
            );


        stockElements.forEach(
            function (element) {

                const stock =
                    Number(
                        product.stock
                    ) || 0;


                if (
                    stock <= 0
                ) {

                    element.textContent =
                        "Out of Stock";

                } else {

                    element.textContent =
                        stock +
                        " available";

                }

            }
        );


        initializeProductQuantity(
            product
        );

    }


    /* =========================================================
       PRODUCT QUANTITY
    ========================================================= */

    function initializeProductQuantity(
        product
    ) {

        const quantityInput =
            document.querySelector(
                "#quantity, .quantity-input"
            );


        const minusButton =
            document.querySelector(
                "#quantity-minus, .quantity-minus"
            );


        const plusButton =
            document.querySelector(
                "#quantity-plus, .quantity-plus"
            );


        const addButton =
            document.querySelector(
                "#add-to-cart, .add-to-cart-detail"
            );


        const buyButton =
            document.querySelector(
                "#buy-now, .buy-now"
            );


        let quantity =
            1;


        const stock =
            Math.max(
                0,
                Number(
                    product.stock
                ) || 0
            );


        if (
            quantityInput
        ) {

            quantity =
                Math.max(
                    1,
                    Number(
                        quantityInput.value
                    ) || 1
                );

        }


        if (
            stock <= 0
        ) {

            quantity =
                0;


            if (
                quantityInput
            ) {

                quantityInput.value =
                    "0";

            }


            if (
                addButton
            ) {

                addButton.disabled =
                    true;

            }


            if (
                buyButton
            ) {

                buyButton.disabled =
                    true;

            }

        }


        function updateQuantityDisplay() {

            if (
                quantityInput
            ) {

                quantityInput.value =
                    quantity;

            }

        }


        if (
            minusButton &&
            minusButton.dataset.initialized !==
                "true"
        ) {

            minusButton.dataset.initialized =
                "true";


            minusButton.addEventListener(
                "click",
                function () {

                    if (
                        quantity >
                        1
                    ) {

                        quantity--;

                        updateQuantityDisplay();

                    }

                }
            );

        }


        if (
            plusButton &&
            plusButton.dataset.initialized !==
                "true"
        ) {

            plusButton.dataset.initialized =
                "true";


            plusButton.addEventListener(
                "click",
                function () {

                    if (
                        quantity <
                        stock
                    ) {

                        quantity++;

                        updateQuantityDisplay();

                    } else {

                        alert(
                            "Only " +
                            stock +
                            " item(s) available."
                        );

                    }

                }
            );

        }


        if (
            quantityInput &&
            quantityInput.dataset.initialized !==
                "true"
        ) {

            quantityInput.dataset.initialized =
                "true";


            quantityInput.addEventListener(
                "change",
                function () {

                    let value =
                        Number(
                            this.value
                        ) || 1;


                    if (
                        value <
                        1
                    ) {

                        value =
                            1;

                    }


                    if (
                        value >
                        stock
                    ) {

                        value =
                            stock;


                        alert(
                            "Only " +
                            stock +
                            " item(s) available."
                        );

                    }


                    quantity =
                        value;


                    updateQuantityDisplay();

                }
            );

        }


        if (
            addButton &&
            addButton.dataset.initialized !==
                "true"
        ) {

            addButton.dataset.initialized =
                "true";


            addButton.addEventListener(
                "click",
                async function () {

                    if (
                        stock <= 0
                    ) {

                        alert(
                            "This product is currently out of stock."
                        );

                        return;

                    }


                    const added =
                        await addProductToCart(
                            product,
                            quantity
                        );


                    if (
                        added
                    ) {

                        const originalText =
                            addButton.textContent;


                        addButton.textContent =
                            "Added to Cart";


                        setTimeout(
                            function () {

                                addButton.textContent =
                                    originalText;

                            },
                            1200
                        );

                    }

                }
            );

        }


        if (
            buyButton &&
            buyButton.dataset.initialized !==
                "true"
        ) {

            buyButton.dataset.initialized =
                "true";


            buyButton.addEventListener(
                "click",
                async function () {

                    if (
                        stock <= 0
                    ) {

                        alert(
                            "This product is currently out of stock."
                        );

                        return;

                    }


                    const added =
                        await addProductToCart(
                            product,
                            quantity
                        );


                    if (
                        added
                    ) {

                        window.location.href =
                            "cart.html";

                    }

                }
            );

        }

    }


    /* =========================================================
       DOM READY
    ========================================================= */

    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            console.log(
                "ShopSphere main script loaded."
            );


            /*
               Read URL parameters first.
            */

            loadSearchFromUrl();


            /*
               Header search.
            */

            initializeHeaderSearch();


            /*
               Product links.
            */

            initializeProductDetailsLinks();


            /*
               Product page.
            */

            await initializeProductsPage();


            /*
               Product details page.
            */

            await initializeProductDetailsPage();


            /*
               Cart page.
            */

            await initializeCartPage();


            /*
               Checkout page.
            */

            await initializeCheckoutPage();


            /*
               Header cart count.
            */

            await updateHeaderCartCount();

        }
    );


})();