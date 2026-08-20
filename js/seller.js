/* =========================================================
   SHOPSPHERE
   SELLER PAGE JAVASCRIPT
========================================================= */

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
       FORM SUBMISSION
    ===================================================== */

    if (!sellerForm) {
        console.error("Seller form not found.");
        return;
    }


    sellerForm.addEventListener("submit", function (event) {

        /* STOP PAGE RELOAD */
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
           CREATE SELLER APPLICATION
        ================================================= */

        const application = {

            id: Date.now(),

            name: name,

            email: email,

            storeName: storeName,

            category: category,

            status: "Pending",

            submittedAt:
                new Date().toLocaleString("en-IN")

        };


        /* =================================================
           GET EXISTING APPLICATIONS
        ================================================= */

        let applications =
            JSON.parse(
                localStorage.getItem(
                    "shopSphereSellerApplications"
                )
            ) || [];


        if (!Array.isArray(applications)) {

            applications = [];

        }


        /* =================================================
           SAVE APPLICATION
        ================================================= */

        applications.push(application);


        localStorage.setItem(
            "shopSphereSellerApplications",
            JSON.stringify(applications)
        );


        /* =================================================
           SUCCESS MESSAGE
        ================================================= */

        showSellerMessage(
            "Seller application submitted successfully!",
            "success"
        );


        /* =================================================
           CLEAR FORM
        ================================================= */

        sellerForm.reset();


        /* =================================================
           SCROLL TO MESSAGE
        ================================================= */

        sellerMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

});