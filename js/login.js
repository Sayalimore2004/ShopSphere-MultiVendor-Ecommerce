
/* =========================================================
   SHOPSPHERE
   LOGIN PAGE JAVASCRIPT

   BACKEND INTEGRATION
   - Seller Login
   - Customer Login
   - JWT Token Storage
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("LOGIN JS LOADED");

    const loginForm =
        document.getElementById("login-form");

    const loginEmail =
        document.getElementById("login-email");

    const loginPassword =
        document.getElementById("login-password");

    const loginMessage =
        document.getElementById("login-message");

    const forgotPassword =
        document.getElementById("forgot-password");


    /* =====================================================
       BACKEND URL
    ===================================================== */

    const API_BASE_URL =
        "http://localhost:8080/api";


    /* =====================================================
       SHOW MESSAGE
    ===================================================== */

    function showLoginMessage(message, type) {

        if (!loginMessage) {
            return;
        }

        loginMessage.textContent = message;

        loginMessage.className =
            "login-message " + type;
    }


    /* =====================================================
       LOGIN
    ===================================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const email =
                    loginEmail.value
                        .trim()
                        .toLowerCase();


                const password =
                    loginPassword.value;


                /* =========================================
                   VALIDATION
                ========================================= */

                if (email === "") {

                    showLoginMessage(
                        "Please enter your email address.",
                        "error"
                    );

                    loginEmail.focus();

                    return;
                }


                if (password === "") {

                    showLoginMessage(
                        "Please enter your password.",
                        "error"
                    );

                    loginPassword.focus();

                    return;
                }


                showLoginMessage(
                    "Logging in...",
                    "success"
                );


                /* =========================================
                   TRY SELLER LOGIN
                ========================================= */

                try {

                    const sellerResponse =
                        await fetch(
                            `${API_BASE_URL}/sellers/login`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    email: email,
                                    password: password
                                })
                            }
                        );


                    if (sellerResponse.ok) {

                        const data =
                            await sellerResponse.json();


                        /* Save JWT token */

                        localStorage.setItem(
                            "shopSphereToken",
                            data.token
                        );


                        /* Save logged-in seller */

                        localStorage.setItem(
                            "shopSphereCurrentSeller",
                            JSON.stringify(
                                data.seller
                            )
                        );


                        localStorage.setItem(
                            "shopSphereUserType",
                            "seller"
                        );


                        showLoginMessage(
                            "Seller login successful! Redirecting...",
                            "success"
                        );


                        setTimeout(
                            function () {

                                window.location.href =
                                    "seller-dashboard.html";

                            },
                            700
                        );


                        return;
                    }


                } catch (error) {

                    console.error(
                        "Seller login error:",
                        error
                    );

                }


                /* =========================================
                   TRY CUSTOMER LOGIN
                ========================================= */

                try {

                    const customerResponse =
                        await fetch(
                            `${API_BASE_URL}/customers/login`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    email: email,
                                    password: password
                                })
                            }
                        );


                    if (customerResponse.ok) {

                        const data =
                            await customerResponse.json();


                        /* Save JWT token */

                        localStorage.setItem(
                            "shopSphereToken",
                            data.token
                        );


                        /* Save logged-in customer */

                        localStorage.setItem(
                            "shopSphereLoggedInUser",
                            JSON.stringify(
                                data.customer
                            )
                        );


                        localStorage.setItem(
                            "shopSphereUserType",
                            "customer"
                        );


                        /* Remove old seller session */

                        localStorage.removeItem(
                            "shopSphereCurrentSeller"
                        );


                        showLoginMessage(
                            "Login successful! Redirecting...",
                            "success"
                        );


                        setTimeout(
                            function () {

                                window.location.href =
                                    "../index.html";

                            },
                            700
                        );


                        return;
                    }


                } catch (error) {

                    console.error(
                        "Customer login error:",
                        error
                    );

                }


                /* =========================================
                   INVALID LOGIN
                ========================================= */

                showLoginMessage(
                    "Invalid email or password.",
                    "error"
                );

            }
        );

    }


    /* =====================================================
       FORGOT PASSWORD
    ===================================================== */

    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                alert(
                    "Password reset functionality will be added later."
                );

            }
        );

    }

});

