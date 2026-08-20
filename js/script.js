/* =========================================================
   SHOPSPHERE
   MAIN JAVASCRIPT
   PRODUCTS + FILTERS + SEARCH + CART + PAGINATION
========================================================= */

(function () {

    "use strict";


    /* =========================================================
       GLOBAL SETTINGS
    ========================================================= */

    const CART_KEY = "shopSphereCart";

    const PRODUCTS_PER_PAGE = 8;

    let currentPage = 1;

    let activeCategory = "all";

    let activePrice = "all";

    let activeRating = "all";

    let activeAvailability = "all";

    let searchTerm = "";

    let currentSort = "recommended";



    /* =========================================================
       COMMON HELPERS
    ========================================================= */

    function getCart() {

        try {

            const savedCart =
                JSON.parse(
                    localStorage.getItem(CART_KEY)
                );

            if (Array.isArray(savedCart)) {
                return savedCart;
            }

        } catch (error) {

            console.error(
                "Could not read cart:",
                error
            );

        }

        return [];

    }



    function saveCart(cart) {

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );

    }



    function formatPrice(price) {

        const number =
            Number(
                String(price)
                    .replace("₹", "")
                    .replace(/,/g, "")
                    .trim()
            ) || 0;

        return (
            "₹" +
            number.toLocaleString("en-IN")
        );

    }



    function getNumericPrice(price) {

        return (
            Number(
                String(price)
                    .replace("₹", "")
                    .replace(/,/g, "")
                    .trim()
            ) || 0
        );

    }



    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }



    /* =========================================================
       CART COUNT IN HEADER
    ========================================================= */

    function updateHeaderCartCount() {

        const cart =
            getCart();

        let totalQuantity = 0;

        cart.forEach(function (item) {

            totalQuantity +=
                Number(item.quantity) || 1;

        });


        const cartLinks =
            document.querySelectorAll(
                ".cart-link"
            );


        cartLinks.forEach(function (link) {

            link.textContent =
                totalQuantity > 0
                    ? "Cart (" + totalQuantity + ")"
                    : "Cart";

        });

    }



    /* =========================================================
       READ PRODUCT FROM HTML CARD
    ========================================================= */

    function getProductFromCard(card) {

        if (!card) {
            return null;
        }


        const nameElement =
            card.querySelector(
                ".product-info h3"
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
                ".seller-name strong"
            );


        const imageElement =
            card.querySelector(
                ".product-image img"
            );


        const ratingElement =
            card.querySelector(
                ".product-rating"
            );


        if (!nameElement || !priceElement) {
            return null;
        }


        const name =
            nameElement.textContent.trim();


        const price =
            getNumericPrice(
                priceElement.textContent
            );


        const category =
            card.dataset.category ||
            (
                categoryElement
                    ? categoryElement.textContent
                        .trim()
                        .toLowerCase()
                        .replace(/\s*&\s*/g, "-")
                        .replace(/\s+/g, "-")
                    : ""
            );


        const seller =
            card.dataset.seller ||
            (
                sellerElement
                    ? sellerElement.textContent.trim()
                    : ""
            );


        const image =
            imageElement
                ? imageElement.getAttribute("src")
                : "";


        let rating = 0;


        /*
         * First use data-rating if available.
         */

        if (card.dataset.rating) {

            rating =
                Number(
                    card.dataset.rating
                ) || 0;

        } else if (ratingElement) {

            const stars =
                ratingElement.textContent
                    .trim()
                    .split(" ")[0];

            rating =
                (
                    stars.match(/★/g) || []
                ).length;

        }


        return {

            id: name,

            name: name,

            price: price,

            category: category,

            seller: seller,

            image: image,

            rating: rating,

            quantity: 1

        };

    }



    /* =========================================================
       PRODUCTS PAGE
    ========================================================= */

    function initializeProductsPage() {

        const productGrid =
            document.querySelector(
                ".products-grid"
            );


        if (!productGrid) {
            return;
        }


        const productCards =
            Array.from(
                productGrid.querySelectorAll(
                    ".product-card"
                )
            );


        if (productCards.length === 0) {
            return;
        }


        /*
         * Add missing data attributes automatically.
         * This makes the filtering reliable even if
         * HTML cards do not contain data-price/data-rating.
         */

        productCards.forEach(function (card) {

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


            if (!card.dataset.category) {

                card.dataset.category =
                    product.category;

            }


            if (!card.dataset.seller) {

                card.dataset.seller =
                    product.seller;

            }


            /*
             * Correct View Details URL.
             */

            const detailsLink =
                card.querySelector(
                    ".product-actions a"
                );


            if (detailsLink) {

                detailsLink.href =
                    "product-details.html?product=" +
                    encodeURIComponent(
                        product.name
                    );

            }

        });



        /* =====================================================
           CATEGORY TOP LINKS
        ===================================================== */

        const categoryLinks =
            document.querySelectorAll(
                ".category-links a"
            );


        categoryLinks.forEach(function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    let category =
                        link.dataset.category;


                    if (!category) {

                        category =
                            link.textContent
                                .trim()
                                .toLowerCase();

                        if (
                            category ===
                            "home & kitchen"
                        ) {

                            category =
                                "home-kitchen";

                        }

                    }


                    activeCategory =
                        category || "all";


                    /*
                     * If a category is selected
                     * through the top navigation,
                     * update the sidebar checkbox.
                     */

                    const categoryCheckboxes =
                        document.querySelectorAll(
                            'input[name="category"]'
                        );


                    categoryCheckboxes.forEach(
                        function (checkbox) {

                            checkbox.checked =
                                checkbox.value ===
                                activeCategory;

                        }
                    );


                    currentPage = 1;

                    applyProductFilters();

                }
            );

        });



        /* =====================================================
           CATEGORY CHECKBOXES
        ===================================================== */

        const categoryCheckboxes =
            document.querySelectorAll(
                'input[name="category"]'
            );


        categoryCheckboxes.forEach(
            function (checkbox) {

                checkbox.addEventListener(
                    "change",
                    function () {

                        /*
                         * Only ONE category can
                         * be selected.
                         */

                        if (checkbox.checked) {

                            categoryCheckboxes
                                .forEach(
                                    function (other) {

                                        if (
                                            other !==
                                            checkbox
                                        ) {

                                            other.checked =
                                                false;

                                        }

                                    }
                                );


                            activeCategory =
                                checkbox.value;

                        } else {

                            activeCategory =
                                "all";

                        }


                        /*
                         * Category selection should
                         * reset pagination.
                         */

                        currentPage = 1;

                        applyProductFilters();

                    }
                );

            }
        );



        /* =====================================================
           PRICE CHECKBOXES
        ===================================================== */

        const priceCheckboxes =
            document.querySelectorAll(
                'input[name="price"]'
            );


        priceCheckboxes.forEach(
            function (checkbox) {

                checkbox.addEventListener(
                    "change",
                    function () {

                        /*
                         * Only ONE price range
                         * can be selected.
                         */

                        if (checkbox.checked) {

                            priceCheckboxes
                                .forEach(
                                    function (other) {

                                        if (
                                            other !==
                                            checkbox
                                        ) {

                                            other.checked =
                                                false;

                                        }

                                    }
                                );


                            activePrice =
                                checkbox.value;

                        } else {

                            activePrice =
                                "all";

                        }


                        currentPage = 1;

                        applyProductFilters();

                    }
                );

            }
        );



        /* =====================================================
           RATING CHECKBOXES
        ===================================================== */

        const ratingCheckboxes =
            document.querySelectorAll(
                'input[name="rating"]'
            );


        ratingCheckboxes.forEach(
            function (checkbox) {

                checkbox.addEventListener(
                    "change",
                    function () {

                        /*
                         * Only ONE rating filter.
                         */

                        if (checkbox.checked) {

                            ratingCheckboxes
                                .forEach(
                                    function (other) {

                                        if (
                                            other !==
                                            checkbox
                                        ) {

                                            other.checked =
                                                false;

                                        }

                                    }
                                );


                            activeRating =
                                Number(
                                    checkbox.value
                                );

                        } else {

                            activeRating =
                                "all";

                        }


                        currentPage = 1;

                        applyProductFilters();

                    }
                );

            }
        );



        /* =====================================================
           AVAILABILITY CHECKBOX
        ===================================================== */

        const availabilityCheckboxes =
            document.querySelectorAll(
                'input[name="availability"]'
            );


        availabilityCheckboxes.forEach(
            function (checkbox) {

                checkbox.addEventListener(
                    "change",
                    function () {

                        if (checkbox.checked) {

                            activeAvailability =
                                checkbox.value;

                        } else {

                            activeAvailability =
                                "all";

                        }


                        currentPage = 1;

                        applyProductFilters();

                    }
                );

            }
        );



        /* =====================================================
           CLEAR FILTERS
        ===================================================== */

        const clearButton =
            document.querySelector(
                ".clear-filters"
            );


        if (clearButton) {

            clearButton.addEventListener(
                "click",
                function () {

                    /*
                     * Uncheck every filter.
                     */

                    document
                        .querySelectorAll(
                            '.filter-sidebar input[type="checkbox"]'
                        )
                        .forEach(
                            function (checkbox) {

                                checkbox.checked =
                                    false;

                            }
                        );


                    activeCategory =
                        "all";


                    activePrice =
                        "all";


                    activeRating =
                        "all";


                    activeAvailability =
                        "all";


                    searchTerm =
                        "";


                    const searchInput =
                        document.querySelector(
                            "#header-search"
                        );


                    if (searchInput) {

                        searchInput.value =
                            "";

                    }


                    currentPage = 1;


                    applyProductFilters();

                }
            );

        }



        /* =====================================================
           SORTING
        ===================================================== */

        const sortSelect =
            document.querySelector(
                "#sort"
            );


        if (sortSelect) {

            sortSelect.addEventListener(
                "change",
                function () {

                    currentSort =
                        sortSelect.value;

                    currentPage = 1;

                    applyProductFilters();

                }
            );

        }



        /* =====================================================
           SEARCH
        ===================================================== */

        const searchForm =
            document.querySelector(
                ".search-container form"
            );


        const searchInput =
            document.querySelector(
                "#header-search"
            );


        if (searchForm && searchInput) {

            searchForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    searchTerm =
                        searchInput.value
                            .trim()
                            .toLowerCase();


                    currentPage = 1;

                    applyProductFilters();

                }
            );


            /*
             * Live search while typing.
             */

            searchInput.addEventListener(
                "input",
                function () {

                    searchTerm =
                        searchInput.value
                            .trim()
                            .toLowerCase();


                    currentPage = 1;

                    applyProductFilters();

                }
            );

        }



        /* =====================================================
           INITIAL FILTER
        ===================================================== */

        applyProductFilters();

    }



    /* =========================================================
       PRICE FILTER LOGIC
    ========================================================= */

    function matchesPrice(
        price,
        selectedPrice
    ) {

        if (
            selectedPrice === "all"
        ) {

            return true;

        }


        switch (selectedPrice) {

            case "under-1000":

                return price < 1000;


            case "1000-2500":

                return (
                    price >= 1000 &&
                    price <= 2500
                );


            case "2500-5000":

                return (
                    price > 2500 &&
                    price <= 5000
                );


            case "above-5000":

                return price > 5000;


            default:

                return true;

        }

    }



    /* =========================================================
       FILTER PRODUCTS
    ========================================================= */

    function applyProductFilters() {

        const productGrid =
            document.querySelector(
                ".products-grid"
            );


        if (!productGrid) {
            return;
        }


        let productCards =
            Array.from(
                productGrid.querySelectorAll(
                    ".product-card"
                )
            );


        /*
         * Apply search/category/price/rating/
         * availability.
         */

        let filteredCards =
            productCards.filter(
                function (card) {

                    const product =
                        getProductFromCard(card);


                    if (!product) {
                        return false;
                    }


                    /* CATEGORY */

                    if (
                        activeCategory !==
                        "all" &&
                        product.category !==
                        activeCategory
                    ) {

                        return false;

                    }



                    /* PRICE */

                    if (
                        !matchesPrice(
                            product.price,
                            activePrice
                        )
                    ) {

                        return false;

                    }



                    /* RATING */

                    if (
                        activeRating !==
                        "all" &&
                        product.rating <
                        Number(activeRating)
                    ) {

                        return false;

                    }



                    /* AVAILABILITY */

                    if (
                        activeAvailability ===
                        "in-stock"
                    ) {

                        /*
                         * All current ShopSphere
                         * products are treated as
                         * available.
                         */

                        if (
                            card.dataset.stock ===
                            "out"
                        ) {

                            return false;

                        }

                    }



                    /* SEARCH */

                    if (
                        searchTerm !== ""
                    ) {

                        const searchableText =
                            (
                                product.name +
                                " " +
                                product.category +
                                " " +
                                product.seller
                            )
                                .toLowerCase();


                        if (
                            !searchableText.includes(
                                searchTerm
                            )
                        ) {

                            return false;

                        }

                    }


                    return true;

                }
            );



        /* =====================================================
           SORT
        ===================================================== */

        filteredCards =
            sortProductCards(
                filteredCards
            );



        /* =====================================================
           HIDE EVERYTHING FIRST
        ===================================================== */

        productCards.forEach(
            function (card) {

                card.style.display =
                    "none";

            }
        );



        /* =====================================================
           PAGINATION
        ===================================================== */

        const totalProducts =
            filteredCards.length;


        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    totalProducts /
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


        const startIndex =
            (
                currentPage - 1
            ) *
            PRODUCTS_PER_PAGE;


        const endIndex =
            Math.min(
                startIndex +
                PRODUCTS_PER_PAGE,
                totalProducts
            );


        const visibleCards =
            filteredCards.slice(
                startIndex,
                endIndex
            );



        /*
         * Show only current page.
         */

        visibleCards.forEach(
            function (card) {

                card.style.display =
                    "";

            }
        );



        /* =====================================================
           PRODUCT COUNT
        ===================================================== */

        updateProductCount(
            totalProducts,
            startIndex,
            endIndex
        );



        /* =====================================================
           PAGINATION BUTTONS
        ===================================================== */

        updatePagination(
            totalPages
        );



        /* =====================================================
           EMPTY SEARCH / FILTER RESULT
        ===================================================== */

        updateNoProductsMessage(
            totalProducts,
            productGrid
        );

    }



    /* =========================================================
       SORT PRODUCT CARDS
    ========================================================= */

    function sortProductCards(cards) {

        const sorted =
            [...cards];


        if (
            currentSort ===
            "price-low"
        ) {

            sorted.sort(
                function (a, b) {

                    return (
                        getNumericPrice(
                            getProductFromCard(a)
                                .price
                        ) -
                        getNumericPrice(
                            getProductFromCard(b)
                                .price
                        )
                    );

                }
            );

        }



        else if (
            currentSort ===
            "price-high"
        ) {

            sorted.sort(
                function (a, b) {

                    return (
                        getNumericPrice(
                            getProductFromCard(b)
                                .price
                        ) -
                        getNumericPrice(
                            getProductFromCard(a)
                                .price
                        )
                    );

                }
            );

        }



        else if (
            currentSort ===
            "rating"
        ) {

            sorted.sort(
                function (a, b) {

                    return (
                        getProductFromCard(b)
                            .rating -
                        getProductFromCard(a)
                            .rating
                    );

                }
            );

        }



        else if (
            currentSort ===
            "newest"
        ) {

            /*
             * Since products are already arranged
             * in the HTML, newest simply reverses
             * their current order.
             */

            sorted.reverse();

        }



        return sorted;

    }



    /* =========================================================
       PRODUCT COUNT
    ========================================================= */

    function updateProductCount(
        totalProducts,
        startIndex,
        endIndex
    ) {

        const countElements =
            document.querySelectorAll(
                ".products-toolbar p"
            );


        countElements.forEach(
            function (element) {

                if (
                    totalProducts === 0
                ) {

                    element.textContent =
                        "Showing 0 of 0 products";

                    return;

                }


                element.textContent =
                    "Showing " +
                    (
                        startIndex + 1
                    ) +
                    "–" +
                    endIndex +
                    " of " +
                    totalProducts +
                    " products";

            }
        );

    }



    /* =========================================================
       NO PRODUCTS MESSAGE
    ========================================================= */

    function updateNoProductsMessage(
        totalProducts,
        productGrid
    ) {

        let message =
            productGrid.parentElement
                .querySelector(
                    ".no-products-message"
                );


        if (
            totalProducts === 0
        ) {

            if (!message) {

                message =
                    document.createElement(
                        "div"
                    );

                message.className =
                    "no-products-message";


                message.innerHTML = `
                    <h3>No products found</h3>
                    <p>
                        Try changing your filters
                        or search for another product.
                    </p>
                `;


                productGrid.parentElement
                    .insertBefore(
                        message,
                        productGrid.nextSibling
                    );

            }


            message.style.display =
                "block";

        } else {

            if (message) {

                message.style.display =
                    "none";

            }

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



        /*
         * Previous button.
         */

        const previous =
            document.createElement("a");

        previous.href = "#";

        previous.textContent =
            "←";

        previous.setAttribute(
            "aria-label",
            "Previous page"
        );


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



        /*
         * Page numbers.
         */

        for (
            let page = 1;
            page <= totalPages;
            page++
        ) {

            const pageLink =
                document.createElement(
                    "a"
                );


            pageLink.href = "#";

            pageLink.textContent =
                page;


            if (
                page === currentPage
            ) {

                pageLink.classList.add(
                    "active"
                );

            }


            pageLink.addEventListener(
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
                pageLink
            );

        }



        /*
         * Next button.
         */

        const next =
            document.createElement("a");

        next.href = "#";

        next.textContent =
            "→";

        next.setAttribute(
            "aria-label",
            "Next page"
        );


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



    /* =========================================================
       SCROLL TO PRODUCTS
    ========================================================= */

    function scrollToProducts() {

        const grid =
            document.querySelector(
                ".products-grid"
            );


        if (!grid) {
            return;
        }


        const top =
            grid.getBoundingClientRect()
                .top +
            window.scrollY -
            120;


        window.scrollTo({

            top: top,

            behavior: "smooth"

        });

    }



    /* =========================================================
       ADD TO CART
    ========================================================= */

    function initializeAddToCart() {

        const productCards =
            document.querySelectorAll(
                ".product-card"
            );


        productCards.forEach(
            function (card) {

                const buttons =
                    card.querySelectorAll(
                        ".product-actions button"
                    );


                buttons.forEach(
                    function (button) {

                        button.addEventListener(
                            "click",
                            function () {

                                addProductToCart(
                                    card,
                                    button
                                );

                            }
                        );

                    }
                );

            }
        );

    }



    /* =========================================================
       ADD PRODUCT TO CART
    ========================================================= */

    function addProductToCart(
        card,
        button
    ) {

        const product =
            getProductFromCard(card);


        if (!product) {

            alert(
                "Unable to add this product to cart."
            );

            return;

        }


        let cart =
            getCart();


        /*
         * Check whether product already exists.
         */

        const existingProduct =
            cart.find(
                function (item) {

                    return (
                        item.id ===
                        product.id ||
                        item.name ===
                        product.name
                    );

                }
            );


        if (existingProduct) {

            existingProduct.quantity =
                (
                    Number(
                        existingProduct.quantity
                    ) || 1
                ) + 1;

        } else {

            product.quantity =
                1;

            cart.push(
                product
            );

        }


        saveCart(cart);

        updateHeaderCartCount();


        /*
         * Visual feedback.
         */

        const originalText =
            button.textContent;


        button.textContent =
            "Added ✓";


        button.disabled =
            true;


        setTimeout(
            function () {

                button.textContent =
                    originalText;

                button.disabled =
                    false;

            },
            1000
        );

    }



    /* =========================================================
       CART PAGE
    ========================================================= */

    function initializeCartPage() {

        const cartItemsContainer =
            document.querySelector(
                "#cart-items"
            );


        if (!cartItemsContainer) {
            return;
        }


        renderCartPage();


        /*
         * Checkout button.
         */

        const checkoutButton =
            document.querySelector(
                "#checkout-button"
            );


        if (checkoutButton) {

            checkoutButton.addEventListener(
                "click",
                function () {

                    const cart =
                        getCart();


                    if (
                        cart.length === 0
                    ) {

                        alert(
                            "Your cart is empty. Please add products before checkout."
                        );

                        return;

                    }


                    window.location.href =
                        "checkout.html";

                }
            );

        }

    }



    /* =========================================================
       RENDER CART
    ========================================================= */

    function renderCartPage() {

        const cartItemsContainer =
            document.querySelector(
                "#cart-items"
            );


        const emptyCart =
            document.querySelector(
                "#empty-cart"
            );


        if (!cartItemsContainer) {
            return;
        }


        let cart =
            getCart();


        /*
         * Remove invalid cart items.
         */

        cart =
            cart.filter(
                function (item) {

                    return (
                        item &&
                        item.name &&
                        Number(item.price) >= 0
                    );

                }
            );


        saveCart(cart);


        cartItemsContainer.innerHTML =
            "";


        let totalQuantity = 0;

        let subtotal = 0;



        /* =====================================================
           EMPTY CART
        ===================================================== */

        if (
            cart.length === 0
        ) {

            if (emptyCart) {

                emptyCart.style.display =
                    "block";

            }


            updateCartSummary(
                0,
                0
            );


            updateHeaderCartCount();

            return;

        }



        if (emptyCart) {

            emptyCart.style.display =
                "none";

        }



        /* =====================================================
           CART ITEMS
        ===================================================== */

        cart.forEach(
            function (item, index) {

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


                totalQuantity +=
                    quantity;


                subtotal +=
                    itemTotal;



                const cartItem =
                    document.createElement(
                        "div"
                    );


                cartItem.className =
                    "cart-item";


                cartItem.dataset.index =
                    index;



                cartItem.innerHTML = `

                    <div class="cart-item-image">

                        ${
                            item.image
                                ? `
                                    <img
                                        src="${escapeHtml(item.image)}"
                                        alt="${escapeHtml(item.name)}"
                                    >
                                  `
                                : `
                                    <div class="cart-placeholder">
                                        🛍️
                                    </div>
                                  `
                        }

                    </div>


                    <div class="cart-item-info">

                        <p class="product-category">
                            ${escapeHtml(
                                formatCategory(
                                    item.category
                                )
                            )}
                        </p>

                        <h3>
                            ${escapeHtml(
                                item.name
                            )}
                        </h3>

                        <p class="seller-name">
                            Sold by
                            <strong>
                                ${escapeHtml(
                                    item.seller ||
                                    "ShopSphere Seller"
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
                                class="quantity-minus"
                                data-index="${index}"
                            >
                                −
                            </button>


                            <span class="quantity">
                                ${quantity}
                            </span>


                            <button
                                type="button"
                                class="quantity-plus"
                                data-index="${index}"
                            >
                                +
                            </button>

                        </div>


                        <strong class="cart-item-total">
                            ${formatPrice(
                                itemTotal
                            )}
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


                cartItemsContainer.appendChild(
                    cartItem
                );

            }
        );



        /* =====================================================
           QUANTITY BUTTONS
        ===================================================== */

        cartItemsContainer
            .querySelectorAll(
                ".quantity-minus"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            changeCartQuantity(
                                Number(
                                    button.dataset.index
                                ),
                                -1
                            );

                        }
                    );

                }
            );


        cartItemsContainer
            .querySelectorAll(
                ".quantity-plus"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            changeCartQuantity(
                                Number(
                                    button.dataset.index
                                ),
                                1
                            );

                        }
                    );

                }
            );


        /* =====================================================
           REMOVE BUTTONS
        ===================================================== */

        cartItemsContainer
            .querySelectorAll(
                ".remove-cart-item"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            removeCartItem(
                                Number(
                                    button.dataset.index
                                )
                            );

                        }
                    );

                }
            );



        /* =====================================================
           UPDATE CART SUMMARY
        ===================================================== */

        updateCartSummary(
            totalQuantity,
            subtotal
        );


        updateHeaderCartCount();

    }



    /* =========================================================
       FORMAT CATEGORY
    ========================================================= */

    function formatCategory(
        category
    ) {

        if (!category) {
            return "";
        }


        if (
            category ===
            "home-kitchen"
        ) {

            return "Home & Kitchen";

        }


        return category
            .replace(
                /-/g,
                " "
            )
            .replace(
                /\b\w/g,
                function (letter) {

                    return letter.toUpperCase();

                }
            );

    }



    /* =========================================================
       CHANGE CART QUANTITY
    ========================================================= */

    function changeCartQuantity(
        index,
        change
    ) {

        let cart =
            getCart();


        if (
            !cart[index]
        ) {
            return;
        }


        let quantity =
            Number(
                cart[index].quantity
            ) || 1;


        quantity +=
            change;


        /*
         * If quantity reaches zero,
         * remove the product.
         */

        if (
            quantity <= 0
        ) {

            cart.splice(
                index,
                1
            );

        } else {

            cart[index].quantity =
                quantity;

        }


        saveCart(cart);


        renderCartPage();

        updateHeaderCartCount();

    }



    /* =========================================================
       REMOVE CART ITEM
    ========================================================= */

    function removeCartItem(
        index
    ) {

        let cart =
            getCart();


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


        renderCartPage();

        updateHeaderCartCount();

    }



    /* =========================================================
       CART SUMMARY
    ========================================================= */

    function updateCartSummary(
        totalQuantity,
        subtotal
    ) {

        const countElement =
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



        if (countElement) {

            countElement.textContent =
                totalQuantity +
                (
                    totalQuantity === 1
                        ? " item"
                        : " items"
                );

        }


        /*
         * Delivery is free.
         */

        const delivery =
            subtotal > 0
                ? 0
                : 0;


        const total =
            subtotal +
            delivery;


        if (subtotalElement) {

            subtotalElement.textContent =
                formatPrice(
                    subtotal
                );

        }


        if (deliveryElement) {

            deliveryElement.textContent =
                formatPrice(
                    delivery
                );

        }


        if (totalElement) {

            totalElement.textContent =
                formatPrice(
                    total
                );

        }

    }



    /* =========================================================
       PRODUCT DETAILS PAGE
    ========================================================= */

    function initializeProductDetailsPage() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const productName =
            params.get(
                "product"
            );


        if (!productName) {
            return;
        }


        /*
         * This part works with the existing
         * product-details page if its elements
         * have the common classes/IDs.
         */

        const productNameElements =
            document.querySelectorAll(
                "#product-name, .product-detail-name"
            );


        productNameElements.forEach(
            function (element) {

                element.textContent =
                    productName;

            }
        );

    }



    /* =========================================================
       HEADER SEARCH ON OTHER PAGES
    ========================================================= */

    function initializeHeaderSearch() {

        const searchForm =
            document.querySelector(
                ".search-container form"
            );


        const searchInput =
            document.querySelector(
                "#header-search"
            );


        if (
            !searchForm ||
            !searchInput
        ) {

            return;

        }


        /*
         * Do not duplicate event listener
         * on products page.
         */

        if (
            document.querySelector(
                ".products-grid"
            )
        ) {

            return;

        }


        searchForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const value =
                    searchInput.value.trim();


                if (value === "") {

                    window.location.href =
                        "products.html";

                    return;

                }


                window.location.href =
    "pages/products.html?search=" +
    encodeURIComponent(value);
            }
        );

    }



    /* =========================================================
       LOAD SEARCH FROM URL
    ========================================================= */

    function loadSearchFromUrl() {

        const productsGrid =
            document.querySelector(
                ".products-grid"
            );


        if (!productsGrid) {
            return;
        }


        const params =
            new URLSearchParams(
                window.location.search
            );


        const urlSearch =
            params.get(
                "search"
            );


        if (
            urlSearch
        ) {

            searchTerm =
                urlSearch
                    .trim()
                    .toLowerCase();


            const searchInput =
                document.querySelector(
                    "#header-search"
                );


            if (searchInput) {

                searchInput.value =
                    urlSearch;

            }

        }

    }



    /* =========================================================
       CHECKOUT PAGE
    ========================================================= */

    function initializeCheckoutPage() {

        const checkoutItems =
            document.querySelector(
                "#checkout-items"
            );


        if (!checkoutItems) {
            return;
        }


        renderCheckoutItems();


        initializePaymentMethods();

        initializeCheckoutValidation();

    }



    /* =========================================================
       RENDER CHECKOUT ITEMS
    ========================================================= */

    function renderCheckoutItems() {

        const checkoutItems =
            document.querySelector(
                "#checkout-items"
            );


        if (!checkoutItems) {
            return;
        }


        const checkoutSubtotal =
            document.querySelector(
                "#checkout-subtotal"
            );


        const checkoutTotal =
            document.querySelector(
                "#checkout-total"
            );


        const cart =
            getCart();


        checkoutItems.innerHTML =
            "";


        if (
            cart.length === 0
        ) {

            checkoutItems.innerHTML = `
                <p class="empty-checkout">
                    Your cart is empty.
                </p>
            `;


            if (checkoutSubtotal) {

                checkoutSubtotal.textContent =
                    "₹0";

            }


            if (checkoutTotal) {

                checkoutTotal.textContent =
                    "₹0";

            }


            return;

        }


        let subtotal = 0;


        cart.forEach(
            function (item) {

                const price =
                    getNumericPrice(
                        item.price
                    );


                const quantity =
                    Number(
                        item.quantity
                    ) || 1;


                const itemTotal =
                    price *
                    quantity;


                subtotal +=
                    itemTotal;


                const checkoutItem =
                    document.createElement(
                        "div"
                    );


                checkoutItem.className =
                    "checkout-item";


                checkoutItem.innerHTML = `

                    <div class="checkout-item-image">

                        ${
                            item.image
                                ? `
                                    <img
                                        src="${escapeHtml(item.image)}"
                                        alt="${escapeHtml(item.name)}"
                                    >
                                  `
                                : `
                                    <div class="checkout-placeholder">
                                        🛍️
                                    </div>
                                  `
                        }

                    </div>


                    <div class="checkout-item-info">

                        <h3>
                            ${escapeHtml(
                                item.name
                            )}
                        </h3>

                        <p>
                            Qty: ${quantity}
                        </p>

                    </div>


                    <div class="checkout-item-price">

                        ${formatPrice(
                            itemTotal
                        )}

                    </div>

                `;


                checkoutItems.appendChild(
                    checkoutItem
                );

            }
        );


        if (checkoutSubtotal) {

            checkoutSubtotal.textContent =
                formatPrice(
                    subtotal
                );

        }


        if (checkoutTotal) {

            checkoutTotal.textContent =
                formatPrice(
                    subtotal
                );

        }

    }



    /* =========================================================
       PAYMENT METHODS
    ========================================================= */

    function initializePaymentMethods() {

        const paymentOptions =
            document.querySelectorAll(
                'input[name="payment"]'
            );


        const upiDetails =
            document.querySelector(
                "#upi-details"
            );


        const cardDetails =
            document.querySelector(
                "#card-details"
            );


        const upiAppOptions =
            document.querySelectorAll(
                'input[name="upi-app"]'
            );


        const otherUpiDetails =
            document.querySelector(
                "#other-upi-details"
            );


        function updatePayment() {

            const selected =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            if (upiDetails) {

                upiDetails.style.display =
                    "none";

            }


            if (cardDetails) {

                cardDetails.style.display =
                    "none";

            }


            if (otherUpiDetails) {

                otherUpiDetails.style.display =
                    "none";

            }


            if (!selected) {
                return;
            }


            if (
                selected.value ===
                "upi"
            ) {

                if (upiDetails) {

                    upiDetails.style.display =
                        "block";

                }


                const selectedUpi =
                    document.querySelector(
                        'input[name="upi-app"]:checked'
                    );


                if (
                    selectedUpi &&
                    selectedUpi.value ===
                    "other"
                ) {

                    if (otherUpiDetails) {

                        otherUpiDetails.style.display =
                            "block";

                    }

                }

            }


            if (
                selected.value ===
                "card"
            ) {

                if (cardDetails) {

                    cardDetails.style.display =
                        "block";

                }

            }

        }


        paymentOptions.forEach(
            function (option) {

                option.addEventListener(
                    "change",
                    updatePayment
                );

            }
        );


        upiAppOptions.forEach(
            function (option) {

                option.addEventListener(
                    "change",
                    function () {

                        if (!otherUpiDetails) {
                            return;
                        }


                        if (
                            option.value ===
                            "other"
                        ) {

                            otherUpiDetails.style.display =
                                "block";

                        } else {

                            otherUpiDetails.style.display =
                                "none";

                        }

                    }
                );

            }
        );


        updatePayment();

    }



    /* =========================================================
       CHECKOUT INPUT VALIDATION
    ========================================================= */

    function initializeCheckoutValidation() {

        const phoneInput =
            document.querySelector(
                "#phone"
            );


        if (phoneInput) {

            phoneInput.addEventListener(
                "input",
                function () {

                    phoneInput.value =
                        phoneInput.value
                            .replace(
                                /[^0-9]/g,
                                ""
                            )
                            .slice(
                                0,
                                10
                            );

                }
            );

        }



        const pincodeInput =
            document.querySelector(
                "#pincode"
            );


        if (pincodeInput) {

            pincodeInput.addEventListener(
                "input",
                function () {

                    pincodeInput.value =
                        pincodeInput.value
                            .replace(
                                /[^0-9]/g,
                                ""
                            )
                            .slice(
                                0,
                                6
                            );

                }
            );

        }



        const cardNumberInput =
            document.querySelector(
                "#card-number"
            );


        if (cardNumberInput) {

            cardNumberInput.addEventListener(
                "input",
                function () {

                    cardNumberInput.value =
                        cardNumberInput.value
                            .replace(
                                /[^0-9]/g,
                                ""
                            )
                            .slice(
                                0,
                                16
                            );

                }
            );

        }



        const cvvInput =
            document.querySelector(
                "#cvv"
            );


        if (cvvInput) {

            cvvInput.addEventListener(
                "input",
                function () {

                    cvvInput.value =
                        cvvInput.value
                            .replace(
                                /[^0-9]/g,
                                ""
                            )
                            .slice(
                                0,
                                3
                            );

                }
            );

        }



        const expiryInput =
            document.querySelector(
                "#expiry"
            );


        if (expiryInput) {

            expiryInput.addEventListener(
                "input",
                function () {

                    let value =
                        expiryInput.value
                            .replace(
                                /[^0-9]/g,
                                ""
                            )
                            .slice(
                                0,
                                4
                            );


                    if (
                        value.length > 2
                    ) {

                        value =
                            value.slice(
                                0,
                                2
                            ) +
                            "/" +
                            value.slice(
                                2
                            );

                    }


                    expiryInput.value =
                        value;

                }
            );

        }



        const upiInput =
            document.querySelector(
                "#upi-id"
            );


        if (upiInput) {

            upiInput.addEventListener(
                "input",
                function () {

                    upiInput.value =
                        upiInput.value
                            .replace(
                                /\s/g,
                                ""
                            );

                }
            );

        }



        const checkoutForm =
            document.querySelector(
                "#checkout-form"
            );


        if (!checkoutForm) {
            return;
        }


        checkoutForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const cart =
                    getCart();


                if (
                    cart.length === 0
                ) {

                    alert(
                        "Your cart is empty. Please add products before checkout."
                    );

                    window.location.href =
                        "cart.html";

                    return;

                }


                if (
                    !checkoutForm.checkValidity()
                ) {

                    checkoutForm.reportValidity();

                    return;

                }


                const payment =
                    document.querySelector(
                        'input[name="payment"]:checked'
                    );


                const paymentMethod =
                    payment
                        ? payment.value
                        : "upi";



                /* =================================================
                   UPI VALIDATION
                ================================================= */

                if (
                    paymentMethod ===
                    "upi"
                ) {

                    const selectedUpi =
                        document.querySelector(
                            'input[name="upi-app"]:checked'
                        );


                    if (!selectedUpi) {

                        alert(
                            "Please select a UPI app."
                        );

                        return;

                    }


                    if (
                        selectedUpi.value ===
                        "other"
                    ) {

                        const upiValue =
                            upiInput
                                ? upiInput.value.trim()
                                : "";


                        const upiPattern =
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;


                        if (
                            !upiPattern.test(
                                upiValue
                            )
                        ) {

                            alert(
                                "Please enter a valid UPI ID."
                            );

                            if (upiInput) {

                                upiInput.focus();

                            }

                            return;

                        }

                    }

                }



                /* =================================================
                   CARD VALIDATION
                ================================================= */

                if (
                    paymentMethod ===
                    "card"
                ) {

                    if (
                        !cardNumberInput ||
                        cardNumberInput.value.length !==
                        16
                    ) {

                        alert(
                            "Please enter a valid 16-digit card number."
                        );

                        if (cardNumberInput) {

                            cardNumberInput.focus();

                        }

                        return;

                    }


                    if (
                        !cvvInput ||
                        cvvInput.value.length !==
                        3
                    ) {

                        alert(
                            "Please enter a valid 3-digit CVV."
                        );

                        if (cvvInput) {

                            cvvInput.focus();

                        }

                        return;

                    }


                    if (
                        !expiryInput ||
                        !/^\d{2}\/\d{2}$/
                            .test(
                                expiryInput.value
                            )
                    ) {

                        alert(
                            "Please enter a valid expiry date in MM/YY format."
                        );

                        if (expiryInput) {

                            expiryInput.focus();

                        }

                        return;

                    }

                }



                /* =================================================
                   SAVE ORDER
                ================================================= */

                function getValue(selector) {

                    const element =
                        document.querySelector(
                            selector
                        );

                    return element
                        ? element.value.trim()
                        : "";

                }


                const orderData = {

                    customer: {

                        name:
                            getValue(
                                "#full-name"
                            ),

                        email:
                            getValue(
                                "#email"
                            ),

                        phone:
                            getValue(
                                "#phone"
                            ),

                        address:
                            getValue(
                                "#address"
                            ),

                        city:
                            getValue(
                                "#city"
                            ),

                        state:
                            getValue(
                                "#state"
                            ),

                        pincode:
                            getValue(
                                "#pincode"
                            )

                    },


                    paymentMethod:
                        paymentMethod,


                    upiApp:
                        paymentMethod ===
                        "upi"
                            ? (
                                document.querySelector(
                                    'input[name="upi-app"]:checked'
                                )?.value ||
                                ""
                            )
                            : "",


                    items:
                        cart,


                    orderDate:
                        new Date()
                            .toLocaleString(
                                "en-IN"
                            )

                };



                let orderHistory =
                    JSON.parse(
                        localStorage.getItem(
                            "shopSphereOrders"
                        )
                    ) || [];


                orderHistory.push(
                    orderData
                );


                localStorage.setItem(
                    "shopSphereOrders",
                    JSON.stringify(
                        orderHistory
                    )
                );


                localStorage.setItem(
                    "shopSphereOrder",
                    JSON.stringify(
                        orderData
                    )
                );


                /*
                 * Clear cart after successful order.
                 */

                localStorage.removeItem(
                    CART_KEY
                );


                updateHeaderCartCount();


                window.location.href =
                    "order-confirmation.html";

            }
        );

    }



    /* =========================================================
       PAGE INITIALIZATION
    ========================================================= */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            /*
             * Always update header cart.
             */

            updateHeaderCartCount();


            /*
             * Products page.
             */

            loadSearchFromUrl();

initializeProductsPage();

initializeAddToCart();



            /*
             * Cart page.
             */

            initializeCartPage();



            /*
             * Product details page.
             */

            initializeProductDetailsPage();



            /*
             * Search on other pages.
             */

            initializeHeaderSearch();



            /*
             * Checkout page.
             */

            initializeCheckoutPage();

        }
    );


})();