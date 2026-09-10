document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    // =====================================================
    // API BASE URL
    // =====================================================

    var API_BASE_URL = "http://localhost:8080/api";


    // =====================================================
    // GET HTML ELEMENTS
    // =====================================================

    var loginForm =
        document.getElementById("admin-login-form");

    var emailInput =
        document.getElementById("admin-email");

    var passwordInput =
        document.getElementById("admin-password");

    var loginButton =
        document.getElementById("admin-login-button");

    var message =
        document.getElementById("admin-login-message");


    // =====================================================
    // ADMIN LOGIN
    // =====================================================

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            var email =
                emailInput.value.trim();

            var password =
                passwordInput.value;


            // =================================================
            // VALIDATION
            // =================================================

            if (!email || !password) {

                message.textContent =
                    "Please enter email and password.";

                return;
            }


            // =================================================
            // LOGIN BUTTON
            // =================================================

            loginButton.disabled = true;

            loginButton.textContent =
                "Logging in...";

            message.textContent = "";


            try {

                // =================================================
                // SEND LOGIN REQUEST
                // =================================================

                var response =
                    await fetch(
                        API_BASE_URL + "/admin/login",
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


                // =================================================
                // READ RESPONSE AS TEXT FIRST
                // =================================================

                var responseText =
                    await response.text();


                // =================================================
                // LOGIN FAILED
                // =================================================

                if (!response.ok) {

                    throw new Error(
                        responseText ||
                        "Invalid admin email or password."
                    );
                }


                // =================================================
                // CONVERT SUCCESS RESPONSE TO JSON
                // =================================================

                var data;

                try {

                    data =
                        JSON.parse(responseText);

                }
                catch (jsonError) {

                    throw new Error(
                        "Invalid response received from server."
                    );
                }


                // =================================================
                // CHECK TOKEN
                // =================================================

                if (!data.token) {

                    throw new Error(
                        "Admin login succeeded, but no token was received."
                    );
                }


                // =================================================
                // SAVE ADMIN JWT TOKEN
                // =================================================

                localStorage.setItem(
                    "shopSphereToken",
                    data.token
                );


                // =================================================
                // SAVE ADMIN INFORMATION
                // =================================================

                if (data.admin) {

                    localStorage.setItem(
                        "shopSphereCurrentAdmin",
                        JSON.stringify(data.admin)
                    );
                }


                // =================================================
                // SUCCESS MESSAGE
                // =================================================

                message.textContent =
                    "Admin login successful!";


                // =================================================
                // REDIRECT TO ADMIN DASHBOARD
                // =================================================

                setTimeout(
                    function () {

                        window.location.href =
                            "admin-dashboard.html";

                    },
                    500
                );

            }
            catch (error) {

                console.error(
                    "Admin login error:",
                    error
                );


                message.textContent =
                    error.message ||
                    "Admin login failed.";


                loginButton.disabled =
                    false;

                loginButton.textContent =
                    "Login as Admin";
            }

        }
    );

});

