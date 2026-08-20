/* =========================================================
   SHOPSPHERE
   SELLERS / VENDORS PAGE JAVASCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const sellerSearch =
    document.getElementById("seller-search");

const sellerGrid =
    document.getElementById("seller-grid");

const noSellers =
    document.getElementById("no-sellers");


/* =========================================================
   SEARCH SELLERS
========================================================= */

if (sellerSearch && sellerGrid) {

    sellerSearch.addEventListener(
        "input",
        function () {

            const searchText =
                sellerSearch.value
                    .trim()
                    .toLowerCase();


            const sellerCards =
                sellerGrid.querySelectorAll(
                    ".seller-card"
                );


            let visibleCount = 0;


            sellerCards.forEach(
                function (card) {

                    const cardText =
                        card.textContent
                            .toLowerCase()
                            .trim();


                    const matches =
                        searchText === "" ||
                        cardText.includes(
                            searchText
                        );


                    if (matches) {

                        card.style.display =
                            "flex";

                        visibleCount++;

                    } else {

                        card.style.display =
                            "none";

                    }

                }
            );


            /* =================================================
               NO SELLERS MESSAGE
            ================================================= */

            if (noSellers) {

                if (
                    visibleCount === 0 &&
                    searchText !== ""
                ) {

                    noSellers.classList.remove(
                        "hidden"
                    );

                } else {

                    noSellers.classList.add(
                        "hidden"
                    );

                }

            }

        }
    );

}


/* =========================================================
   VISIT STORE LINKS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const storeLinks =
            document.querySelectorAll(
                ".seller-button-small"
            );


        storeLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function (event) {

                        /*
                         * The href already contains:
                         *
                         * products.html?seller=Store Name
                         *
                         * So we simply allow the normal
                         * navigation to happen.
                         */

                        const url =
                            new URL(
                                link.href,
                                window.location.href
                            );


                        const seller =
                            url.searchParams.get(
                                "seller"
                            );


                        if (!seller) {

                            event.preventDefault();

                            console.error(
                                "Seller name missing from store link."
                            );

                        }

                    }
                );

            }
        );

    }
);


/* =========================================================
   END OF VENDORS JAVASCRIPT
========================================================= */