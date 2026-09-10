/* =========================================================
   SHOPSPHERE
   REGISTER PAGE JAVASCRIPT

   BACKEND INTEGRATION
   - Customer Registration
   - MySQL Persistence
   - BCrypt Password Handling by Backend
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("REGISTER JS LOADED");

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const registerForm =
        document.getElementById("register-form");

    const registerName =
        document.getElementById("register-name");

    const registerEmail =
        document.getElementById("register-email");

    const registerPhone =
        document.getElementById("register-phone");

    const registerPassword =
        document.getElementById("register-password");

    const registerConfirmPassword =
        document.getElementById("register-confirm-password");

    const registerTerms =
        document.getElementById("register-terms");

    const registerMessage =
        document.getElementById("register-message");


    /* =====================================================
       BACKEND URL
    ===================================================== */

    const API_BASE_URL =
        "http://localhost:8080/api";


    /* =====================================================
       SHOW MESSAGE
    ===================================================== */

    function showRegisterMessage(message, type) {

        if (!registerMessage) {
            return;
        }

        registerMessage.textContent = message;

        registerMessage.className =
            "register-message " + type;
    }


    /* =====================================================
       REGISTER
    ===================================================== */

    if (!registerForm) {
        return;
    }


    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* =============================================
               GET VALUES
            ============================================= */

            const name =
                registerName.value.trim();

            const email =
                registerEmail.value
                    .trim()
                    .toLowerCase();

            const phone =
                registerPhone.value.trim();

            const password =
                registerPassword.value;

            const confirmPassword =
                registerConfirmPassword.value;


            /* =============================================
               CLEAR MESSAGE
            ============================================= */

            showRegisterMessage("", "");


            /* =============================================
               NAME VALIDATION
            ============================================= */

            if (name === "") {

                showRegisterMessage(
                    "Please enter your full name.",
                    "error"
                );

                registerName.focus();

                return;
            }


            if (name.length < 2) {

                showRegisterMessage(
                    "Name must contain at least 2 characters.",
                    "error"
                );

                registerName.focus();

                return;
            }


            /* =============================================
               EMAIL VALIDATION
            ============================================= */

            if (email === "") {

                showRegisterMessage(
                    "Please enter your email address.",
                    "error"
                );

                registerEmail.focus();

                return;
            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                showRegisterMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                registerEmail.focus();

                return;
            }


            /* =============================================
               PHONE VALIDATION
            ============================================= */

            if (!/^[0-9]{10}$/.test(phone)) {

                showRegisterMessage(
                    "Please enter a valid 10-digit phone number.",
                    "error"
                );

                registerPhone.focus();

                return;
            }


            /* =============================================
               PASSWORD VALIDATION
            ============================================= */

            if (password.length < 6) {

                showRegisterMessage(
                    "Password must contain at least 6 characters.",
                    "error"
                );

                registerPassword.focus();

                return;
            }


            /* =============================================
               CONFIRM PASSWORD
            ============================================= */

            if (password !== confirmPassword) {

                showRegisterMessage(
                    "Passwords do not match.",
                    "error"
                );

                registerConfirmPassword.focus();

                return;
            }


            /* =============================================
               TERMS
            ============================================= */

            if (!registerTerms.checked) {

                showRegisterMessage(
                    "Please accept the Terms & Conditions.",
                    "error"
                );

                return;
            }


            /* =============================================
               SHOW LOADING MESSAGE
            ============================================= */

            showRegisterMessage(
                "Creating your account...",
                "success"
            );


            /* =============================================
               SEND CUSTOMER TO SPRING BOOT
            ============================================= */

            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/customers/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name: name,
                                email: email,
                                password: password
                            })
                        }
                    );


                /* =========================================
                   READ RESPONSE
                ========================================= */

                const contentType =
                    response.headers.get("content-type") || "";

                let data;

                if (contentType.includes("application/json")) {

                    data =
                        await response.json();

                } else {

                    data =
                        await response.text();
                }


                /* =========================================
                   REGISTRATION FAILED
                ========================================= */

                if (!response.ok) {

                    let errorMessage =
                        "Registration failed. Please try again.";

                    if (typeof data === "string" && data.trim() !== "") {

                        errorMessage = data;

                    } else if (
                        data &&
                        data.message
                    ) {

                        errorMessage =
                            data.message;
                    }

                    showRegisterMessage(
                        errorMessage,
                        "error"
                    );

                    return;
                }


                /* =========================================
                   REGISTRATION SUCCESSFUL
                ========================================= */

                console.log(
                    "Customer registered successfully:",
                    data
                );


                showRegisterMessage(
                    "Account created successfully! Redirecting to login...",
                    "success"
                );


                /* =========================================
                   REDIRECT TO LOGIN
                ========================================= */

                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    1200
                );

            } catch (error) {

                console.error(
                    "Customer registration error:",
                    error
                );


                showRegisterMessage(
                    "Unable to connect to the server. Please make sure the ShopSphere backend is running.",
                    "error"
                );

            }

        }
    );

});