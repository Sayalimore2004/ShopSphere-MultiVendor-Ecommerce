/* =========================================================
   SHOPSPHERE
   MAIN JAVASCRIPT

   FEATURES:
   - 24 DEFAULT PRODUCTS
   - APPROVED SELLER PRODUCTS
   - 8 PRODUCTS PER PAGE
   - FILTERS
   - SEARCH
   - SORTING
   - CART
   - PRODUCT DETAILS
   - CHECKOUT
========================================================= */

(function () {

    "use strict";


    /* =========================================================
       STORAGE KEYS
    ========================================================= */

    const CART_KEY = "shopSphereCart";
    const SELLER_PRODUCTS_KEY = "shopSphereSellerProducts";
    const ORDERS_KEY = "shopSphereOrders";
    const SINGLE_ORDER_KEY = "shopSphereOrder";

    const PRODUCTS_PER_PAGE = 8;


    /* =========================================================
       PAGE STATE
    ========================================================= */

    let currentPage = 1;

    let activeCategory = "all";
    let activePrice = "all";
    let activeRating = "all";
    let activeAvailability = "all";

    let searchTerm = "";

    let currentSort = "recommended";


    /* =========================================================
       BASIC HELPERS
    ========================================================= */

    function getPageName() {

        return window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    }


    function formatPrice(price) {

        const number = Number(
            String(price)
                .replace("₹", "")
                .replace(/,/g, "")
                .trim()
        ) || 0;

        return "₹" + number.toLocaleString("en-IN");

    }


    function getNumericPrice(price) {

        return Number(
            String(price)
                .replace("₹", "")
                .replace(/,/g, "")
                .trim()
        ) || 0;

    }


    function escapeHtml(value) {

        return String(
            value == null ? "" : value
        )
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    }


    function normalizeCategory(category) {

        return String(category || "")
            .trim()
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

    }


    function formatCategory(category) {

        if (!category) {
            return "";
        }

        if (
            normalizeCategory(category) ===
            "home-and-kitchen"
        ) {
            return "Home & Kitchen";
        }

        return String(category)
            .replace(/-/g, " ")
            .replace(/\b\w/g, function (letter) {
                return letter.toUpperCase();
            });

    }


    /* =========================================================
       CART
    ========================================================= */

    function getCart() {

        try {

            const cart = JSON.parse(
                localStorage.getItem(CART_KEY)
            );

            return Array.isArray(cart)
                ? cart
                : [];

        } catch (error) {

            console.error(
                "Cart read error:",
                error
            );

            return [];

        }

    }


    function saveCart(cart) {

        try {

            localStorage.setItem(
                CART_KEY,
                JSON.stringify(cart)
            );

        } catch (error) {

            console.error(
                "Cart save error:",
                error
            );

        }

    }


    function updateHeaderCartCount() {

        const cart = getCart();

        let quantity = 0;

        cart.forEach(function (item) {

            quantity += Math.max(
                1,
                Number(item.quantity) || 1
            );

        });


        document
            .querySelectorAll(".cart-link")
            .forEach(function (link) {

                link.textContent =
                    quantity > 0
                        ? "Cart (" + quantity + ")"
                        : "Cart";

            });

    }


    /* =========================================================
       SELLER PRODUCTS
    ========================================================= */

    function getSellerProducts() {

        try {

            const products = JSON.parse(
                localStorage.getItem(
                    SELLER_PRODUCTS_KEY
                )
            );

            return Array.isArray(products)
                ? products
                : [];

        } catch (error) {

            console.error(
                "Seller products read error:",
                error
            );

            return [];

        }

    }


    /* =========================================================
       PRODUCT FROM CARD
    ========================================================= */

    function getProductFromCard(card) {

        if (!card) {
            return null;
        }


        const nameElement =
            card.querySelector(".product-info h3");

        const priceElement =
            card.querySelector(".product-price");


        if (
            !nameElement ||
            !priceElement
        ) {
            return null;
        }


        const categoryElement =
            card.querySelector(".product-category");

        const sellerElement =
            card.querySelector(".seller-name strong");

        const imageElement =
            card.querySelector(".product-image img");

        const ratingElement =
            card.querySelector(".product-rating");


        const name =
            nameElement.textContent.trim();


        const price =
            getNumericPrice(
                priceElement.textContent
            );


        let category =
            card.dataset.category || "";


        if (
            !category &&
            categoryElement
        ) {

            category =
                categoryElement.textContent.trim();

        }


        let seller =
            card.dataset.seller || "";


        if (
            !seller &&
            sellerElement
        ) {

            seller =
                sellerElement.textContent.trim();

        }


        const image =
            imageElement
                ? imageElement.getAttribute("src") || ""
                : "";


        let rating =
            Number(
                card.dataset.rating || 0
            );


        if (
            !rating &&
            ratingElement
        ) {

            rating =
                (
                    ratingElement.textContent.match(/★/g)
                    || []
                ).length;

        }


        const id =
            card.dataset.productId ||
            card.dataset.sellerProductId ||
            name;


        let stock = 999;


        if (
            card.dataset.stock === "out"
        ) {

            stock = 0;

        }


        return {

            id: id,

            name: name,

            price: price,

            category: category,

            seller:
                seller ||
                "ShopSphere",

            sellerId:
                card.dataset.sellerId || "",

            image: image,

            rating:
                rating || 4,

            stock: stock,

            description:
                getCardDescription(card),

            quantity: 1

        };

    }


    /* =========================================================
       PRODUCT DESCRIPTION
    ========================================================= */

    function getCardDescription(card) {

        const description =
            card.querySelector(
                ".product-description"
            );


        if (description) {

            return description
                .textContent
                .trim();

        }


        const paragraphs =
            card.querySelectorAll(
                ".product-info > p"
            );


        for (
            let i = 0;
            i < paragraphs.length;
            i++
        ) {

            const paragraph =
                paragraphs[i];


            if (

                !paragraph.classList.contains(
                    "product-category"
                ) &&

                !paragraph.classList.contains(
                    "product-price"
                ) &&

                !paragraph.classList.contains(
                    "seller-name"
                ) &&

                !paragraph.classList.contains(
                    "product-rating"
                )

            ) {

                return paragraph
                    .textContent
                    .trim();

            }

        }


        return "No description available.";

    }


    /* =========================================================
       FIX VIEW DETAILS LINKS
       
       THIS FIXES THE HOME PAGE ISSUE.

       Home page:
       pages/product-details.html

       becomes:
       pages/product-details.html?product=ProductName
    ========================================================= */

    function initializeProductDetailsLinks() {

        const cards =
            document.querySelectorAll(
                ".product-card"
            );


        cards.forEach(function (card) {

            const link =
                card.querySelector(
                    ".product-actions a"
                );


            if (!link) {
                return;
            }


            const nameElement =
                card.querySelector(
                    ".product-info h3"
                );


            if (!nameElement) {
                return;
            }


            const productName =
                nameElement.textContent.trim();


            if (!productName) {
                return;
            }


            /*
               Determine correct relative path.

               Home page:
               index.html
               → pages/product-details.html

               Products page:
               pages/products.html
               → product-details.html
            */

            const pageName =
                getPageName();


            if (
                pageName === "index.html" ||
                pageName === ""
            ) {

                link.href =
                    "pages/product-details.html?product=" +
                    encodeURIComponent(
                        productName
                    );

            } else {

                link.href =
                    "product-details.html?product=" +
                    encodeURIComponent(
                        productName
                    );

            }

        });

    }


    /* =========================================================
       LOAD APPROVED SELLER PRODUCTS
    ========================================================= */

    function loadSellerProducts() {

        const grid =
            document.querySelector(
                ".products-grid"
            );


        if (!grid) {
            return;
        }


        const sellerProducts =
            getSellerProducts();


        grid.querySelectorAll(
            ".seller-product-card"
        ).forEach(function (card) {

            card.remove();

        });


        sellerProducts.forEach(
            function (product) {

                if (
                    !product ||
                    !product.name
                ) {
                    return;
                }


                /*
                   ONLY APPROVED PRODUCTS
                */

                const status =
                    String(
                        product.status || ""
                    )
                    .trim()
                    .toLowerCase();


                if (
                    status !== "approved"
                ) {

                    return;

                }


                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "product-card seller-product-card";


                card.dataset.sellerProductId =
                    product.id ||
                    product.name;


                card.dataset.productName =
                    product.name;


                card.dataset.category =
                    normalizeCategory(
                        product.category
                    );


                card.dataset.seller =
                    product.sellerName ||
                    product.seller ||
                    "ShopSphere Seller";


                card.dataset.sellerId =
                    product.sellerId || "";


                card.dataset.price =
                    Number(product.price) || 0;


                card.dataset.rating =
                    Number(product.rating) || 4;


                card.dataset.stock =
                    Number(product.stock) > 0
                        ? "in-stock"
                        : "out";


                const rating =
                    Math.max(
                        0,
                        Math.min(
                            5,
                            Number(
                                product.rating
                            ) || 4
                        )
                    );


                const fullStars =
                    "★".repeat(
                        Math.floor(rating)
                    );


                const emptyStars =
                    "☆".repeat(
                        5 -
                        Math.floor(rating)
                    );


                const seller =
                    product.sellerName ||
                    product.seller ||
                    "ShopSphere Seller";


                card.innerHTML =

                    '<div class="product-image">' +

                        '<img src="' +
                            escapeHtml(
                                product.image || ""
                            ) +
                            '" alt="' +
                            escapeHtml(
                                product.name
                            ) +
                        '">' +

                    '</div>' +

                    '<div class="product-info">' +

                        '<p class="product-category">' +
                            escapeHtml(
                                formatCategory(
                                    product.category
                                )
                            ) +
                        '</p>' +

                        '<h3>' +
                            escapeHtml(
                                product.name
                            ) +
                        '</h3>' +

                        '<p class="product-description">' +
                            escapeHtml(
                                product.description || ""
                            ) +
                        '</p>' +

                        '<div class="product-rating">' +
                            fullStars +
                            emptyStars +
                            ' <span>Seller Product</span>' +
                        '</div>' +

                        '<p class="product-price">' +
                            formatPrice(
                                product.price
                            ) +
                        '</p>' +

                        '<p class="seller-name">' +
                            'Sold by <strong>' +
                            escapeHtml(
                                seller
                            ) +
                            '</strong>' +
                        '</p>' +

                        '<div class="product-actions">' +

                            '<a href="product-details.html?product=' +
                                encodeURIComponent(
                                    product.name
                                ) +
                            '">' +
                                'View Details' +
                            '</a>' +

                            '<button type="button"' +

                                (
                                    Number(
                                        product.stock
                                    ) <= 0
                                        ? " disabled"
                                        : ""
                                ) +

                            '>' +

                                (
                                    Number(
                                        product.stock
                                    ) <= 0
                                        ? "Out of Stock"
                                        : "Add to Cart"
                                ) +

                            '</button>' +

                        '</div>' +

                    '</div>';


                grid.appendChild(card);

            }
        );

    }


    /* =========================================================
       PRODUCTS PAGE
    ========================================================= */

    function initializeProductsPage() {

        const grid =
            document.querySelector(
                ".products-grid"
            );


        if (!grid) {
            return;
        }


        /*
           Existing HTML contains the
           24 DEFAULT PRODUCTS.

           We only ADD approved seller products.
        */

        loadSellerProducts();


        const cards =
            Array.from(
                grid.querySelectorAll(
                    ".product-card"
                )
            );


        cards.forEach(
            function (card) {

                const product =
                    getProductFromCard(card);


                if (!product) {
                    return;
                }


                card.dataset.productName =
                    product.name;


                card.dataset.price =
                    product.price;


                card.dataset.rating =
                    product.rating;


                if (
                    !card.dataset.category
                ) {

                    card.dataset.category =
                        normalizeCategory(
                            product.category
                        );

                }


                if (
                    !card.dataset.seller
                ) {

                    card.dataset.seller =
                        product.seller;

                }


                if (
                    !card.dataset.stock
                ) {

                    card.dataset.stock =
                        product.stock > 0
                            ? "in-stock"
                            : "out";

                }

            }
        );


        initializeCategoryFilters();

        initializePriceFilters();

        initializeRatingFilters();

        initializeAvailabilityFilters();

        initializeClearFilters();

        initializeSorting();

        initializeProductSearch();

        initializeAddToCart();

        applyProductFilters();

    }


    /* =========================================================
       CATEGORY FILTERS
    ========================================================= */

    function initializeCategoryFilters() {

        document
            .querySelectorAll(
                ".category-links a"
            )
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();


                        let category =
                            link.dataset.category;


                        if (!category) {

                            category =
                                link.textContent.trim();

                        }


                        activeCategory =
                            normalizeCategory(
                                category
                            );


                        currentPage = 1;


                        document
                            .querySelectorAll(
                                'input[name="category"]'
                            )
                            .forEach(
                                function (checkbox) {

                                    checkbox.checked =
                                        normalizeCategory(
                                            checkbox.value
                                        ) ===
                                        activeCategory;

                                }
                            );


                        applyProductFilters();

                    }
                );

            });


        document
            .querySelectorAll(
                'input[name="category"]'
            )
            .forEach(function (checkbox) {

                checkbox.addEventListener(
                    "change",
                    function () {

                        document
                            .querySelectorAll(
                                'input[name="category"]'
                            )
                            .forEach(
                                function (other) {

                                    if (
                                        other !== checkbox
                                    ) {

                                        other.checked =
                                            false;

                                    }

                                }
                            );


                        activeCategory =
                            checkbox.checked
                                ? normalizeCategory(
                                    checkbox.value
                                )
                                : "all";


                        currentPage = 1;

                        applyProductFilters();

                    }
                );

            });

    }


    /* =========================================================
       PRICE FILTERS
    ========================================================= */

    function initializePriceFilters() {

        document
            .querySelectorAll(
                'input[name="price"]'
            )
            .forEach(function (checkbox) {

                checkbox.addEventListener(
                    "change",
                    function () {

                        document
                            .querySelectorAll(
                                'input[name="price"]'
                            )
                            .forEach(
                                function (other) {

                                    if (
                                        other !== checkbox
                                    ) {

                                        other.checked =
                                            false;

                                    }

                                }
                            );


                        activePrice =
                            checkbox.checked
                                ? checkbox.value
                                : "all";


                        currentPage = 1;

                        applyProductFilters();

                    }
                );

            });

    }


    /* =========================================================
       RATING FILTERS
    ========================================================= */

    function initializeRatingFilters() {

        document
            .querySelectorAll(
                'input[name="rating"]'
            )
            .forEach(function (checkbox) {

                checkbox.addEventListener(
                    "change",
                    function () {

                        document
                            .querySelectorAll(
                                'input[name="rating"]'
                            )
                            .forEach(
                                function (other) {

                                    if (
                                        other !== checkbox
                                    ) {

                                        other.checked =
                                            false;

                                    }

                                }
                            );


                        activeRating =
                            checkbox.checked
                                ? Number(
                                    checkbox.value
                                )
                                : "all";


                        currentPage = 1;

                        applyProductFilters();

                    }
                );

            });

    }


    /* =========================================================
       AVAILABILITY
    ========================================================= */

    function initializeAvailabilityFilters() {

        document
            .querySelectorAll(
                'input[name="availability"]'
            )
            .forEach(function (checkbox) {

                checkbox.addEventListener(
                    "change",
                    function () {

                        document
                            .querySelectorAll(
                                'input[name="availability"]'
                            )
                            .forEach(
                                function (other) {

                                    if (
                                        other !== checkbox
                                    ) {

                                        other.checked =
                                            false;

                                    }

                                }
                            );


                        activeAvailability =
                            checkbox.checked
                                ? checkbox.value
                                : "all";


                        currentPage = 1;

                        applyProductFilters();

                    }
                );

            });

    }


    /* =========================================================
       CLEAR FILTERS
    ========================================================= */

    function initializeClearFilters() {

        const button =
            document.querySelector(
                ".clear-filters"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(
                        '.filter-sidebar input[type="checkbox"]'
                    )
                    .forEach(function (checkbox) {

                        checkbox.checked = false;

                    });


                activeCategory = "all";
                activePrice = "all";
                activeRating = "all";
                activeAvailability = "all";

                searchTerm = "";

                currentPage = 1;


                const input =
                    document.querySelector(
                        "#header-search"
                    );


                if (input) {

                    input.value = "";

                }


                applyProductFilters();

            }
        );

    }


    /* =========================================================
       SORTING
    ========================================================= */

    function initializeSorting() {

        const select =
            document.querySelector(
                "#sort"
            );


        if (!select) {
            return;
        }


        currentSort =
            select.value ||
            "recommended";


        select.addEventListener(
            "change",
            function () {

                currentSort =
                    select.value;

                currentPage = 1;

                applyProductFilters();

            }
        );

    }


    /* =========================================================
       SEARCH
    ========================================================= */

    function initializeProductSearch() {

        const input =
            document.querySelector(
                "#header-search"
            );


        if (!input) {
            return;
        }


        const form =
            input.closest("form");


        if (
            form &&
            form.dataset.initialized !== "true"
        ) {

            form.dataset.initialized =
                "true";


            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    searchTerm =
                        input.value
                            .trim()
                            .toLowerCase();


                    currentPage = 1;

                    applyProductFilters();

                }
            );

        }


        input.addEventListener(
            "input",
            function () {

                searchTerm =
                    input.value
                        .trim()
                        .toLowerCase();


                currentPage = 1;

                applyProductFilters();

            }
        );

    }


    /* =========================================================
       PRICE MATCH
    ========================================================= */

    function matchesPrice(price) {

        if (
            activePrice === "all"
        ) {

            return true;

        }


        if (
            activePrice === "under-1000"
        ) {

            return price < 1000;

        }


        if (
            activePrice === "1000-2500"
        ) {

            return (
                price >= 1000 &&
                price <= 2500
            );

        }


        if (
            activePrice === "2500-5000"
        ) {

            return (
                price > 2500 &&
                price <= 5000
            );

        }


        if (
            activePrice === "above-5000"
        ) {

            return price > 5000;

        }


        return true;

    }


    /* =========================================================
       FILTER + PAGINATION
    ========================================================= */

    function applyProductFilters() {

        const grid =
            document.querySelector(
                ".products-grid"
            );


        if (!grid) {
            return;
        }


        const cards =
            Array.from(
                grid.querySelectorAll(
                    ".product-card"
                )
            );


        let filtered =
            cards.filter(
                function (card) {

                    const product =
                        getProductFromCard(card);


                    if (!product) {
                        return false;
                    }


                    if (

                        activeCategory !== "all" &&

                        normalizeCategory(
                            product.category
                        ) !==
                        normalizeCategory(
                            activeCategory
                        )

                    ) {

                        return false;

                    }


                    if (
                        !matchesPrice(
                            product.price
                        )
                    ) {

                        return false;

                    }


                    if (

                        activeRating !== "all" &&

                        product.rating <
                        Number(
                            activeRating
                        )

                    ) {

                        return false;

                    }


                    if (

                        activeAvailability ===
                        "in-stock" &&

                        card.dataset.stock ===
                        "out"

                    ) {

                        return false;

                    }


                    if (searchTerm) {

                        const text =
                            (
                                product.name +
                                " " +
                                product.category +
                                " " +
                                product.seller
                            )
                            .toLowerCase();


                        if (
                            !text.includes(
                                searchTerm
                            )
                        ) {

                            return false;

                        }

                    }


                    return true;

                }
            );


        filtered =
            sortProductCards(
                filtered
            );


        cards.forEach(
            function (card) {

                card.style.display =
                    "none";

            }
        );


        const total =
            filtered.length;


        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    total /
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


        const start =
            (
                currentPage - 1
            ) *
            PRODUCTS_PER_PAGE;


        const end =
            Math.min(
                start +
                PRODUCTS_PER_PAGE,
                total
            );


        filtered
            .slice(start, end)
            .forEach(
                function (card) {

                    card.style.display =
                        "";

                }
            );


        updateProductCount(
            total,
            start,
            end
        );


        updatePagination(
            totalPages
        );


        showNoProductsMessage(
            total,
            grid
        );


        /*
           IMPORTANT:
           Make sure dynamically generated
           seller product links also work.
        */

        initializeProductDetailsLinks();

    }


    /* =========================================================
       SORT
    ========================================================= */

    function sortProductCards(cards) {

        const result =
            cards.slice();


        if (
            currentSort === "price-low"
        ) {

            result.sort(
                function (a, b) {

                    return (
                        getProductFromCard(a).price -
                        getProductFromCard(b).price
                    );

                }
            );

        }


        if (
            currentSort === "price-high"
        ) {

            result.sort(
                function (a, b) {

                    return (
                        getProductFromCard(b).price -
                        getProductFromCard(a).price
                    );

                }
            );

        }


        if (
            currentSort === "rating"
        ) {

            result.sort(
                function (a, b) {

                    return (
                        getProductFromCard(b).rating -
                        getProductFromCard(a).rating
                    );

                }
            );

        }


        if (
            currentSort === "newest"
        ) {

            result.reverse();

        }


        return result;

    }


    /* =========================================================
       PRODUCT COUNT
    ========================================================= */

    function updateProductCount(
        total,
        start,
        end
    ) {

        document
            .querySelectorAll(
                ".products-toolbar p"
            )
            .forEach(
                function (element) {

                    if (total === 0) {

                        element.textContent =
                            "Showing 0 of 0 products";

                    } else {

                        element.textContent =
                            "Showing " +
                            (start + 1) +
                            "–" +
                            end +
                            " of " +
                            total +
                            " products";

                    }

                }
            );

    }


    /* =========================================================
       NO PRODUCTS
    ========================================================= */

    function showNoProductsMessage(
        total,
        grid
    ) {

        const parent =
            grid.parentElement;


        if (!parent) {
            return;
        }


        let message =
            parent.querySelector(
                ".no-products-message"
            );


        if (total === 0) {

            if (!message) {

                message =
                    document.createElement(
                        "div"
                    );


                message.className =
                    "no-products-message";


                message.innerHTML =
                    "<h3>No products found</h3>" +
                    "<p>Try changing your filters or search.</p>";


                parent.appendChild(
                    message
                );

            }


            message.style.display =
                "block";


        } else if (message) {

            message.style.display =
                "none";

        }

    }


    /* =========================================================
       PAGINATION
    ========================================================= */

    function updatePagination(
        totalPages
    ) {

        const pagination =
            document.querySelector(
                ".pagination"
            );


        if (!pagination) {
            return;
        }


        pagination.innerHTML = "";


        const previous =
            document.createElement(
                "a"
            );


        previous.href = "#";

        previous.textContent = "←";


        if (
            currentPage <= 1
        ) {

            previous.classList.add(
                "disabled"
            );

        }


        previous.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                if (
                    currentPage > 1
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

            const link =
                document.createElement(
                    "a"
                );


            link.href = "#";

            link.textContent =
                page;


            if (
                page === currentPage
            ) {

                link.classList.add(
                    "active"
                );

            }


            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    currentPage =
                        page;


                    applyProductFilters();

                    scrollToProducts();

                }
            );


            pagination.appendChild(
                link
            );

        }


        const next =
            document.createElement(
                "a"
            );


        next.href = "#";

        next.textContent = "→";


        if (
            currentPage >=
            totalPages
        ) {

            next.classList.add(
                "disabled"
            );

        }


        next.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


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


    function scrollToProducts() {

        const grid =
            document.querySelector(
                ".products-grid"
            );


        if (!grid) {
            return;
        }


        const position =
            grid.getBoundingClientRect()
                .top +
            window.scrollY -
            100;


        window.scrollTo({

            top: position,

            behavior: "smooth"

        });

    }


    /* =========================================================
       ADD TO CART
    ========================================================= */

    function initializeAddToCart() {

        document
            .querySelectorAll(
                ".product-card"
            )
            .forEach(
                function (card) {

                    const button =
                        card.querySelector(
                            ".product-actions button"
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
                        function () {

                            addCardProductToCart(
                                card,
                                button
                            );

                        }
                    );

                }
            );

    }


    function addCardProductToCart(
        card,
        button
    ) {

        const product =
            getProductFromCard(
                card
            );


        if (!product) {

            alert(
                "Unable to add this product."
            );

            return;

        }


        if (
            card.dataset.stock ===
            "out"
        ) {

            alert(
                "This product is currently out of stock."
            );

            return;

        }


        const cart =
            getCart();


        const existing =
            cart.find(
                function (item) {

                    return String(item.id) ===
                        String(product.id);

                }
            );


        if (existing) {

            existing.quantity =
                (
                    Number(
                        existing.quantity
                    ) || 1
                ) + 1;

        } else {

            product.quantity = 1;

            cart.push(product);

        }


        saveCart(cart);

        updateHeaderCartCount();


        const original =
            button.textContent;


        button.textContent =
            "Added ✓";


        button.disabled =
            true;


        setTimeout(
            function () {

                button.textContent =
                    original;

                button.disabled =
                    false;

            },
            1000
        );

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


        const requested =
            params.get("product");


        if (!requested) {

            showProductNotFound();

            return;

        }


        const requestedName =
            String(requested)
                .trim()
                .toLowerCase();


        let product = null;


        /* =====================================================
           1. APPROVED SELLER PRODUCT
        ===================================================== */

        const sellerProducts =
            getSellerProducts();


        for (
            let i = 0;
            i < sellerProducts.length;
            i++
        ) {

            const item =
                sellerProducts[i];


            if (
                !item ||
                !item.name
            ) {

                continue;

            }


            const status =
                String(
                    item.status || ""
                )
                .trim()
                .toLowerCase();


            if (
                status !== "approved"
            ) {

                continue;

            }


            if (
                String(item.name)
                    .trim()
                    .toLowerCase() ===
                requestedName
            ) {

                product =
                    normalizeProduct(
                        item,
                        true
                    );

                break;

            }

        }


        /* =====================================================
           2. DEFAULT PRODUCTS

           Read products.html
        ===================================================== */

        if (!product) {

            try {

                const response =
                    await fetch(
                        "products.html"
                    );


                if (
                    response.ok
                ) {

                    const html =
                        await response.text();


                    const parser =
                        new DOMParser();


                    const productDocument =
                        parser.parseFromString(
                            html,
                            "text/html"
                        );


                    const cards =
                        productDocument.querySelectorAll(
                            ".product-card"
                        );


                    for (
                        let i = 0;
                        i < cards.length;
                        i++
                    ) {

                        const card =
                            cards[i];


                        const cardProduct =
                            getProductFromCard(
                                card
                            );


                        if (!cardProduct) {
                            continue;
                        }


                        if (
                            cardProduct.name
                                .trim()
                                .toLowerCase() ===
                            requestedName
                        ) {

                            product =
                                cardProduct;

                            break;

                        }

                    }

                }

            } catch (error) {

                console.error(
                    "Could not read products.html:",
                    error
                );

            }

        }


        /* =====================================================
           3. GLOBAL PRODUCTS FALLBACK
        ===================================================== */

        if (!product) {

            try {

                if (
                    typeof products !==
                    "undefined" &&
                    Array.isArray(products)
                ) {

                    for (
                        let i = 0;
                        i < products.length;
                        i++
                    ) {

                        const item =
                            products[i];


                        if (
                            !item ||
                            !item.name
                        ) {

                            continue;

                        }


                        if (
                            String(item.name)
                                .trim()
                                .toLowerCase() ===
                            requestedName
                        ) {

                            product =
                                normalizeProduct(
                                    item,
                                    false
                                );

                            break;

                        }

                    }

                }

            } catch (error) {

                console.log(
                    "No global products variable."
                );

            }

        }


        /* =====================================================
           NOT FOUND
        ===================================================== */

        if (!product) {

            console.error(
                "PRODUCT NOT FOUND:",
                requested
            );


            showProductNotFound();

            return;

        }


        displayProductDetails(
            product
        );

    }


    /* =========================================================
       NORMALIZE PRODUCT
    ========================================================= */

    function normalizeProduct(
        item,
        sellerProduct
    ) {

        item =
            item || {};


        return {

            id:
                item.id ||
                item.productId ||
                item.name ||
                Date.now(),

            name:
                item.name ||
                "Product",

            category:
                item.category ||
                "",

            image:
                item.image ||
                item.imageUrl ||
                "",

            price:
                Number(
                    item.price
                ) || 0,

            rating:
                Number(
                    item.rating
                ) || 4,

            reviews:
                item.reviews ||
                "ShopSphere product",

            seller:
                item.sellerName ||
                item.seller ||
                (
                    sellerProduct
                        ? "ShopSphere Seller"
                        : "ShopSphere"
                ),

            sellerId:
                item.sellerId ||
                "",

            description:
                item.description ||
                "No description available.",

            stock:
                item.stock == null
                    ? 999
                    : Number(
                        item.stock
                    )

        };

    }


    /* =========================================================
       PRODUCT NOT FOUND
    ========================================================= */

    function showProductNotFound() {

        const container =
            document.querySelector(
                ".product-details-container"
            );


        if (!container) {
            return;
        }


        container.innerHTML =

            '<div class="no-product">' +

                '<h2>Product Not Found</h2>' +

                '<p>' +
                    'This product is no longer available.' +
                '</p>' +

                '<a href="products.html">' +
                    'Back to Products' +
                '</a>' +

            '</div>';

    }


    /* =========================================================
       DISPLAY PRODUCT DETAILS
    ========================================================= */

    function displayProductDetails(
        product
    ) {

        document
            .querySelectorAll(
                "#product-name, #details-product-name, .product-detail-name"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        product.name;

                }
            );


        document
            .querySelectorAll(
                "#product-image, #details-product-image, .product-detail-image img, .product-image-large img"
            )
            .forEach(
                function (image) {

                    if (
                        product.image
                    ) {

                        image.src =
                            product.image;

                    }


                    image.alt =
                        product.name;

                }
            );


        document
            .querySelectorAll(
                "#product-price, #details-product-price, .product-detail-price"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        formatPrice(
                            product.price
                        );

                }
            );


        document
            .querySelectorAll(
                "#product-category, #details-product-category, #info-category, .product-detail-category"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        formatCategory(
                            product.category
                        );

                }
            );


        document
            .querySelectorAll(
                "#product-description, #details-product-description, .product-detail-description"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        product.description ||
                        "No description available.";

                }
            );


        document
            .querySelectorAll(
                "#product-seller, #details-product-seller, #info-seller, .product-detail-seller"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        product.seller ||
                        "ShopSphere Seller";

                }
            );


        document
            .querySelectorAll(
                "#product-rating, #details-product-rating, .product-detail-rating"
            )
            .forEach(
                function (element) {

                    const rating =
                        Math.max(
                            0,
                            Math.min(
                                5,
                                Number(
                                    product.rating
                                ) || 0
                            )
                        );


                    const full =
                        "★".repeat(
                            Math.floor(
                                rating
                            )
                        );


                    const empty =
                        "☆".repeat(
                            5 -
                            Math.floor(
                                rating
                            )
                        );


                    element.innerHTML =
                        full +
                        empty +
                        " (" +
                        escapeHtml(
                            product.reviews
                        ) +
                        ")";

                }
            );


        const stock =
            Number(
                product.stock
            ) || 0;


        document
            .querySelectorAll(
                "#product-stock, #details-product-stock, .product-detail-stock"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        stock > 0
                            ? "In Stock"
                            : "Out of Stock";

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

        const quantityElement =
            document.querySelector(
                "#product-quantity"
            );


        const minusButton =
            document.querySelector(
                "#quantity-minus"
            );


        const plusButton =
            document.querySelector(
                "#quantity-plus"
            );


        const addButton =
            document.querySelector(
                "#details-add-to-cart"
            );


        const buyButton =
            document.querySelector(
                "#buy-now-button"
            );


        let quantity = 1;


        const stock =
            Number(
                product.stock
            ) || 0;


        function updateQuantityDisplay() {

            if (
                quantityElement
            ) {

                quantityElement.textContent =
                    quantity;

            }

        }


        updateQuantityDisplay();


        if (minusButton) {

            minusButton.addEventListener(
                "click",
                function () {

                    if (
                        quantity > 1
                    ) {

                        quantity--;

                    }


                    updateQuantityDisplay();

                }
            );

        }


        if (plusButton) {

            plusButton.addEventListener(
                "click",
                function () {

                    if (
                        stock <= 0
                    ) {

                        alert(
                            "This product is currently out of stock."
                        );

                        return;

                    }


                    if (
                        quantity >= stock
                    ) {

                        alert(
                            "Only " +
                            stock +
                            " item(s) available."
                        );

                        return;

                    }


                    quantity++;

                    updateQuantityDisplay();

                }
            );

        }


        if (addButton) {

            addButton.addEventListener(
                "click",
                function () {

                    addProductToCart(
                        product,
                        quantity
                    );

                }
            );

        }


        if (buyButton) {

            buyButton.addEventListener(
                "click",
                function () {

                    if (
                        stock <= 0
                    ) {

                        alert(
                            "This product is currently out of stock."
                        );

                        return;

                    }


                    addProductToCart(
                        product,
                        quantity
                    );


                    window.location.href =
                        "cart.html";

                }
            );

        }

    }


    /* =========================================================
       ADD PRODUCT DETAILS TO CART
    ========================================================= */

    function addProductToCart(
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

            return;

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

            return;

        }


        const cart =
            getCart();


        const existing =
            cart.find(
                function (item) {

                    return String(
                        item.id
                    ) ===
                    String(
                        product.id
                    );

                }
            );


        if (existing) {

            const newQuantity =
                (
                    Number(
                        existing.quantity
                    ) || 1
                ) +
                quantity;


            if (
                newQuantity >
                stock
            ) {

                alert(
                    "Only " +
                    stock +
                    " item(s) available."
                );

                return;

            }


            existing.quantity =
                newQuantity;

        } else {

            cart.push({

                id:
                    product.id,

                name:
                    product.name,

                price:
                    product.price,

                category:
                    product.category,

                seller:
                    product.seller,

                sellerId:
                    product.sellerId,

                sellerName:
                    product.seller,

                image:
                    product.image,

                rating:
                    product.rating,

                quantity:
                    quantity

            });

        }


        saveCart(cart);

        updateHeaderCartCount();


        alert(
            product.name +
            " (" +
            quantity +
            ") added to cart!"
        );

    }


    /* =========================================================
       LOAD SEARCH FROM URL
    ========================================================= */

    function loadSearchFromUrl() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const value =
            params.get("search");


        if (!value) {
            return;
        }


        searchTerm =
            value
                .trim()
                .toLowerCase();


        const input =
            document.querySelector(
                "#header-search"
            );


        if (input) {

            input.value =
                value;

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
                        form.dataset.initialized ===
                        "true"
                    ) {

                        return;

                    }


                    form.dataset.initialized =
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

                                currentPage = 1;

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
   CART PAGE
========================================================= */

function initializeCartPage() {

    const cartItemsContainer =
        document.querySelector("#cart-items");

    if (!cartItemsContainer) {
        return;
    }

    displayCartItems();
    initializeCheckoutButton();

}


/* =========================================================
   DISPLAY CART ITEMS
========================================================= */

function displayCartItems() {

    const container =
        document.querySelector("#cart-items");

    const emptyCart =
        document.querySelector("#empty-cart");

    const itemCount =
        document.querySelector("#cart-item-count");

    const subtotalElement =
        document.querySelector("#cart-subtotal");

    const deliveryElement =
        document.querySelector("#cart-delivery");

    const totalElement =
        document.querySelector("#cart-total");


    if (!container) {
        return;
    }


    const cart = getCart();


    /* =====================================================
       EMPTY CART
    ===================================================== */

    if (cart.length === 0) {

        container.innerHTML = "";

        if (emptyCart) {
            emptyCart.style.display = "block";
        }

        if (itemCount) {
            itemCount.textContent = "0 items";
        }

        if (subtotalElement) {
            subtotalElement.textContent = "₹0";
        }

        if (deliveryElement) {
            deliveryElement.textContent = "₹0";
        }

        if (totalElement) {
            totalElement.textContent = "₹0";
        }

        return;
    }


    /* =====================================================
       CART HAS PRODUCTS
    ===================================================== */

    if (emptyCart) {
        emptyCart.style.display = "none";
    }


    container.innerHTML = "";


    let subtotal = 0;
    let totalQuantity = 0;


    cart.forEach(function (product, index) {

        const quantity =
            Math.max(
                1,
                Number(product.quantity) || 1
            );


        const price =
            Number(product.price) || 0;


        subtotal +=
            price * quantity;


        totalQuantity +=
            quantity;


        const item =
            document.createElement("div");


        item.className =
            "cart-item";


        item.dataset.index =
            index;


        item.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${escapeHtml(product.image || "")}"
                    alt="${escapeHtml(product.name || "Product")}"
                >

            </div>


            <div class="cart-item-details">

                <h3>
                    ${escapeHtml(product.name || "Product")}
                </h3>

                <p class="cart-item-category">
                    ${escapeHtml(
                        formatCategory(product.category || "")
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
                    ${formatPrice(price)}
                </p>

            </div>


            <div class="cart-item-actions">

                <div class="quantity-controls">

                    <button
                        type="button"
                        class="cart-quantity-minus"
                        data-index="${index}"
                    >
                        −
                    </button>

                    <span class="cart-quantity">
                        ${quantity}
                    </span>

                    <button
                        type="button"
                        class="cart-quantity-plus"
                        data-index="${index}"
                    >
                        +
                    </button>

                </div>


                <strong class="cart-item-total">
                    ${formatPrice(price * quantity)}
                </strong>


                <button
                    type="button"
                    class="remove-cart-item"
                    data-index="${index}"
                >
                    Remove
                </button>

            </div>

        `;


        container.appendChild(item);

    });


    /* =====================================================
       UPDATE SUMMARY
    ===================================================== */

    /*
       Free delivery for now.
       We can change this later if you want delivery charges.
    */

    const delivery = 0;

    const total =
        subtotal + delivery;


    if (itemCount) {

        itemCount.textContent =
            totalQuantity +
            (
                totalQuantity === 1
                    ? " item"
                    : " items"
            );

    }


    if (subtotalElement) {

        subtotalElement.textContent =
            formatPrice(subtotal);

    }


    if (deliveryElement) {

        deliveryElement.textContent =
            formatPrice(delivery);

    }


    if (totalElement) {

        totalElement.textContent =
            formatPrice(total);

    }


    initializeCartItemButtons();

}


/* =========================================================
   CART ITEM BUTTONS
========================================================= */

function initializeCartItemButtons() {

    document
        .querySelectorAll(".cart-quantity-minus")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            button.dataset.index
                        );


                    changeCartQuantity(
                        index,
                        -1
                    );

                }
            );

        });


    document
        .querySelectorAll(".cart-quantity-plus")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            button.dataset.index
                        );


                    changeCartQuantity(
                        index,
                        1
                    );

                }
            );

        });


    document
        .querySelectorAll(".remove-cart-item")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            button.dataset.index
                        );


                    removeCartItem(index);

                }
            );

        });

}


/* =========================================================
   CHANGE CART QUANTITY
========================================================= */

function changeCartQuantity(
    index,
    change
) {

    const cart = getCart();


    if (
        !cart[index]
    ) {
        return;
    }


    const currentQuantity =
        Number(
            cart[index].quantity
        ) || 1;


    const newQuantity =
        currentQuantity + change;


    if (
        newQuantity <= 0
    ) {

        cart.splice(
            index,
            1
        );

    } else {

        cart[index].quantity =
            newQuantity;

    }


    saveCart(cart);

    updateHeaderCartCount();

    displayCartItems();

}


/* =========================================================
   REMOVE CART ITEM
========================================================= */

function removeCartItem(index) {

    const cart = getCart();


    if (
        !cart[index]
    ) {
        return;
    }


    cart.splice(
        index,
        1
    );


    saveCart(cart);

    updateHeaderCartCount();

    displayCartItems();

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
        function () {

            const cart =
                getCart();


            if (
                cart.length === 0
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

    function initializeCheckoutPage() {

        if (
            getPageName() !== "checkout.html"
        ) {
            return;
        }


        const cart = getCart();


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


        /* =====================================================
           EMPTY CART
        ===================================================== */

        if (cart.length === 0) {

            itemsContainer.innerHTML =
                "<p>Your cart is empty.</p>";

            subtotalElement.textContent =
                "₹0";

            totalElement.textContent =
                "₹0";

            return;

        }


        /* =====================================================
           DISPLAY CART ITEMS
        ===================================================== */

        itemsContainer.innerHTML = "";


        let subtotal = 0;


        cart.forEach(function (item) {

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
                price * quantity;


            subtotal += itemTotal;


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
                            item.image || ""
                        ) +
                        '" alt="' +
                        escapeHtml(
                            item.name
                        ) +
                    '">' +

                '</div>' +

                '<div class="checkout-item-info">' +

                    '<h3>' +
                        escapeHtml(
                            item.name
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


            itemsContainer.appendChild(
                itemElement
            );

        });


        /* =====================================================
           UPDATE SUMMARY
        ===================================================== */

        subtotalElement.textContent =
            formatPrice(
                subtotal
            );


        /*
           Delivery is FREE
        */

        totalElement.textContent =
            formatPrice(
                subtotal
            );


        /* =====================================================
           PLACE ORDER
        ===================================================== */

        const checkoutForm =
            document.querySelector(
                "#checkout-form"
            );


        if (
            checkoutForm &&
            checkoutForm.dataset.initialized !== "true"
        ) {

            checkoutForm.dataset.initialized =
                "true";


            checkoutForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    const currentCart =
                        getCart();


                    if (
                        currentCart.length === 0
                    ) {

                        alert(
                            "Your cart is empty."
                        );

                        return;

                    }


                    let orderTotal = 0;


                    currentCart.forEach(
                        function (item) {

                            orderTotal +=
                                getNumericPrice(
                                    item.price
                                ) *
                                Math.max(
                                    1,
                                    Number(
                                        item.quantity
                                    ) || 1
                                );

                        }
                    );


                    const formData =
                        new FormData(
                            checkoutForm
                        );


                    const order = {

                        id:
                            "ORD-" +
                            Date.now(),

                        customer: {

                            fullName:
                                formData.get(
                                    "fullName"
                                ),

                            email:
                                formData.get(
                                    "email"
                                ),

                            phone:
                                formData.get(
                                    "phone"
                                ),

                            address:
                                formData.get(
                                    "address"
                                ),

                            city:
                                formData.get(
                                    "city"
                                ),

                            state:
                                formData.get(
                                    "state"
                                ),

                            pincode:
                                formData.get(
                                    "pincode"
                                )

                        },

                        paymentMethod:
                            formData.get(
                                "payment"
                            ),

                        items:
                            currentCart,

                        total:
                            orderTotal,

                        status:
                            "Placed",

                        date:
                            new Date()
                                .toISOString()

                    };


                    /* =================================================
                       SAVE ORDER
                    ================================================= */

                    let orders = [];


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

                            orders = [];

                        }

                    } catch (error) {

                        orders = [];

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


                    /* =================================================
                       CLEAR CART AFTER ORDER
                    ================================================= */

                    localStorage.removeItem(
                        CART_KEY
                    );


                    updateHeaderCartCount();


                    /* =================================================
                       GO TO ORDER SUCCESS PAGE
                    ================================================= */

                    window.location.href =
                        "orders.html";

                }
            );

        }

    }



   

    /* =========================================================
       DOM READY
    ========================================================= */

   document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateHeaderCartCount();

        loadSearchFromUrl();

        initializeHeaderSearch();

        initializeProductDetailsLinks();

        initializeProductsPage();

        initializeProductDetailsPage();

        initializeCartPage();

        initializeCheckoutPage();

    }
);
})();