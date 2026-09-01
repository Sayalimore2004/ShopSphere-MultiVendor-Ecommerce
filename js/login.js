/* =========================================================
   SHOPSPHERE
   LOGIN PAGE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

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
       SHOW MESSAGE
    ===================================================== */

    function showLoginMessage(message, type) {

        if (!loginMessage) {
            return;
        }

        loginMessage.textContent =
            message;

        loginMessage.className =
            "login-message " + type;

    }


    /* =====================================================
       GET SELLERS
    ===================================================== */

    function getSellers() {

        try {

            const savedSellers =
                JSON.parse(
                    localStorage.getItem(
                        "shopSphereSellerApplications"
                    )
                ) || [];

            return Array.isArray(savedSellers)
                ? savedSellers
                : [];

        } catch (error) {

            console.error(
                "Error reading sellers:",
                error
            );

            return [];

        }

    }


    /* =====================================================
       GET CUSTOMERS
    ===================================================== */

    function getUsers() {

        try {

            const savedUsers =
                JSON.parse(
                    localStorage.getItem(
                        "shopSphereUsers"
                    )
                ) || [];

            return Array.isArray(savedUsers)
                ? savedUsers
                : [];

        } catch (error) {

            console.error(
                "Error reading users:",
                error
            );

            return [];

        }

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

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


                /* =========================================
                   CHECK SELLER LOGIN FIRST
                ========================================= */

                const sellers =
                    getSellers();


                const seller =
                    sellers.find(
                        function (item) {

                            return (
                                item.email &&
                                item.email.toLowerCase() ===
                                    email &&
                                item.password ===
                                    password
                            );

                        }
                    );


                if (seller) {

                    /* Save currently logged-in seller */

                    localStorage.setItem(
                        "shopSphereCurrentSeller",
                        JSON.stringify(seller)
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


                /* =========================================
                   CHECK CUSTOMER LOGIN
                ========================================= */

                const users =
                    getUsers();


                const user =
                    users.find(
                        function (item) {

                            return (
                                item.email &&
                                item.email.toLowerCase() ===
                                    email &&
                                item.password ===
                                    password
                            );

                        }
                    );


                if (!user) {

                    showLoginMessage(
                        "Invalid email or password.",
                        "error"
                    );

                    return;

                }


                /* Save logged-in customer */

                const loggedInUser = {

                    id: user.id,

                    name: user.name,

                    email: user.email

                };


                localStorage.setItem(
                    "shopSphereLoggedInUser",
                    JSON.stringify(
                        loggedInUser
                    )
                );


                localStorage.setItem(
                    "shopSphereUserType",
                    "customer"
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