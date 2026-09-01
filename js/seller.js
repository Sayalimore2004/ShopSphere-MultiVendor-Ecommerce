document.addEventListener("DOMContentLoaded", function () {

    const sellerForm =
        document.getElementById("seller-form-element");

    const sellerMessage =
        document.getElementById("seller-message");


    /* =====================================================
       SHOW MESSAGE
    ===================================================== */

    function showSellerMessage(message, type) {

        if (!sellerMessage) {
            return;
        }

        sellerMessage.textContent = message;

        sellerMessage.className =
            "seller-message " + type;
    }


    /* =====================================================
       CHECK FORM
    ===================================================== */

    if (!sellerForm) {

        console.error(
            "Seller form not found."
        );

        return;
    }


    /* =====================================================
       FORM SUBMISSION
    ===================================================== */

    sellerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* =================================================
               GET FORM VALUES
            ================================================= */

            const name =
                document
                    .getElementById("seller-name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("seller-email")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("seller-password")
                    .value
                    .trim();


            const storeName =
                document
                    .getElementById("store-name")
                    .value
                    .trim();


            const category =
                document
                    .getElementById("seller-category")
                    .value;


            /* =================================================
               VALIDATION
            ================================================= */

            if (
                name === "" ||
                email === "" ||
                password === "" ||
                storeName === "" ||
                category === ""
            ) {

                showSellerMessage(
                    "Please fill in all the required details.",
                    "error"
                );

                return;
            }


            /* =================================================
               EMAIL VALIDATION
            ================================================= */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                showSellerMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            /* =================================================
               PASSWORD VALIDATION
            ================================================= */

            if (password.length < 6) {

                showSellerMessage(
                    "Password must be at least 6 characters.",
                    "error"
                );

                return;
            }


            /* =================================================
               CREATE SELLER
            ================================================= */

            const seller = {

                id: Date.now(),

                name: name,

                email: email,

                password: password,

                storeName: storeName,

                category: category,

                status: "Active",

                submittedAt:
                    new Date().toLocaleString("en-IN")

            };


            /* =================================================
               GET EXISTING SELLERS
            ================================================= */

            let sellers =
                JSON.parse(
                    localStorage.getItem(
                        "shopSphereSellerApplications"
                    )
                ) || [];


            if (!Array.isArray(sellers)) {

                sellers = [];

            }


            /* =================================================
               CHECK DUPLICATE EMAIL
            ================================================= */

            const existingSeller =
                sellers.find(
                    function (existing) {

                        return (
                            existing.email ===
                            email
                        );

                    }
                );


            if (existingSeller) {

                showSellerMessage(
                    "A seller account with this email already exists.",
                    "error"
                );

                return;
            }


            /* =================================================
               SAVE SELLER
            ================================================= */

            sellers.push(seller);


            localStorage.setItem(
                "shopSphereSellerApplications",
                JSON.stringify(sellers)
            );


            /* =================================================
               SAVE CURRENT SELLER
            ================================================= */

            localStorage.setItem(
                "shopSphereCurrentSeller",
                JSON.stringify(seller)
            );


            /* =================================================
               SUCCESS
            ================================================= */

            showSellerMessage(
                "Seller account created successfully!",
                "success"
            );


            /* =================================================
               REDIRECT
            ================================================= */

            sellerForm.reset();

            window.location.href =
                "seller-dashboard.html";

        }
    );

});