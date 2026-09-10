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
        async function (event) {

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
               BACKEND REGISTRATION
            ================================================= */

            try {

                showSellerMessage(
                    "Creating seller account...",
                    "success"
                );

                const response =
                    await fetch(
                        "http://localhost:8080/api/sellers/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name: name,
                                email: email,
                                password: password,
                                storeName: storeName,
                                category: category
                            })
                        }
                    );

                const data =
                    await response.json();

                /* =================================================
                   REGISTRATION FAILED
                ================================================= */

                if (!response.ok) {

                    showSellerMessage(
                        data.message ||
                        data ||
                        "Seller registration failed.",
                        "error"
                    );

                    return;
                }

                /* =================================================
                   REGISTRATION SUCCESS
                ================================================= */

                showSellerMessage(
                    "Seller account created successfully! Please login to continue.",
                    "success"
                );

                sellerForm.reset();

                /*
                 * IMPORTANT:
                 * No automatic redirect here.
                 *
                 * Seller must now go to the Seller Login page
                 * and login using the registered email/password.
                 */

            } catch (error) {

                console.error(
                    "Seller registration error:",
                    error
                );

                showSellerMessage(
                    "Unable to connect to the server. Please make sure the backend is running.",
                    "error"
                );
            }
        }
    );

});

