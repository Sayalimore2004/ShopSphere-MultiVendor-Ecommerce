/* =========================================================
   SHOPSPHERE
   REGISTER PAGE JAVASCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

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


/* =========================================================
   SHOW MESSAGE
========================================================= */

function showRegisterMessage(message, type) {

    if (!registerMessage) {
        return;
    }

    registerMessage.textContent = message;

    registerMessage.className =
        "register-message " + type;

}


/* =========================================================
   GET USERS
========================================================= */

function getRegisteredUsers() {

    const savedUsers =
        localStorage.getItem("shopSphereUsers");


    if (!savedUsers) {

        return [];

    }


    try {

        const users =
            JSON.parse(savedUsers);


        if (Array.isArray(users)) {

            return users;

        }


        return [];

    } catch (error) {

        console.error(
            "Error reading users:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE USERS
========================================================= */

function saveRegisteredUsers(users) {

    localStorage.setItem(
        "shopSphereUsers",
        JSON.stringify(users)
    );

}


/* =========================================================
   REGISTER
========================================================= */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* ---------------------------------------------
               GET VALUES
            --------------------------------------------- */

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


            /* ---------------------------------------------
               CLEAR MESSAGE
            --------------------------------------------- */

            showRegisterMessage(
                "",
                ""
            );


            /* =================================================
               NAME VALIDATION
            ================================================= */

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


            /* =================================================
               EMAIL VALIDATION
            ================================================= */

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


            /* =================================================
               PHONE VALIDATION
            ================================================= */

            if (!/^[0-9]{10}$/.test(phone)) {

                showRegisterMessage(
                    "Please enter a valid 10-digit phone number.",
                    "error"
                );

                registerPhone.focus();

                return;

            }


            /* =================================================
               PASSWORD VALIDATION
            ================================================= */

            if (password.length < 6) {

                showRegisterMessage(
                    "Password must contain at least 6 characters.",
                    "error"
                );

                registerPassword.focus();

                return;

            }


            /* =================================================
               CONFIRM PASSWORD
            ================================================= */

            if (password !== confirmPassword) {

                showRegisterMessage(
                    "Passwords do not match.",
                    "error"
                );

                registerConfirmPassword.focus();

                return;

            }


            /* =================================================
               TERMS
            ================================================= */

            if (!registerTerms.checked) {

                showRegisterMessage(
                    "Please accept the Terms & Conditions.",
                    "error"
                );

                return;

            }


            /* =================================================
               GET EXISTING USERS
            ================================================= */

            const users =
                getRegisteredUsers();


            /* =================================================
               CHECK DUPLICATE EMAIL
            ================================================= */

            const existingUser =
                users.find(
                    function (user) {

                        return (
                            user.email &&
                            user.email.toLowerCase() === email
                        );

                    }
                );


            if (existingUser) {

                showRegisterMessage(
                    "An account with this email already exists.",
                    "error"
                );

                registerEmail.focus();

                return;

            }


            /* =================================================
               CREATE USER
            ================================================= */

            const newUser = {

                id:
                    "user_" +
                    Date.now(),

                name:
                    name,

                email:
                    email,

                phone:
                    phone,

                password:
                    password

            };


            /* =================================================
               ADD USER
            ================================================= */

            users.push(newUser);


            /* =================================================
               SAVE USER
            ================================================= */

            saveRegisteredUsers(users);


            /* =================================================
               SUCCESS MESSAGE
            ================================================= */

            showRegisterMessage(
                "Account created successfully! Redirecting to login...",
                "success"
            );


            /* =================================================
               REDIRECT TO LOGIN
            ================================================= */

            setTimeout(
                function () {

                    window.location.href =
                        "login.html";

                },
                1200
            );

        }
    );

}