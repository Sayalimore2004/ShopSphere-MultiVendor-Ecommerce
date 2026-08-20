/* =========================================================
   SHOPSPHERE
   LOGIN PAGE JAVASCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

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


/* =========================================================
   SHOW MESSAGE
========================================================= */

function showLoginMessage(message, type) {

    if (!loginMessage) {
        return;
    }

    loginMessage.textContent = message;

    loginMessage.className =
        "login-message " + type;
}


/* =========================================================
   GET USERS
========================================================= */

function getUsers() {

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
   LOGIN
========================================================= */

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


            /* -----------------------------------------
               EMAIL VALIDATION
            ----------------------------------------- */

            if (email === "") {

                showLoginMessage(
                    "Please enter your email address.",
                    "error"
                );

                loginEmail.focus();

                return;
            }


            /* -----------------------------------------
               PASSWORD VALIDATION
            ----------------------------------------- */

            if (password === "") {

                showLoginMessage(
                    "Please enter your password.",
                    "error"
                );

                loginPassword.focus();

                return;
            }


            /* -----------------------------------------
               GET USERS
            ----------------------------------------- */

            const users =
                getUsers();


            /* -----------------------------------------
               FIND USER
            ----------------------------------------- */

            const user =
                users.find(function (item) {

                    return (
                        item.email &&
                        item.email.toLowerCase() === email &&
                        item.password === password
                    );

                });


            /* -----------------------------------------
               INVALID LOGIN
            ----------------------------------------- */

            if (!user) {

                showLoginMessage(
                    "Invalid email or password.",
                    "error"
                );

                return;
            }


            /* -----------------------------------------
               SAVE LOGGED-IN USER
            ----------------------------------------- */

            const loggedInUser = {

                id: user.id,

                name: user.name,

                email: user.email

            };


            localStorage.setItem(
                "shopSphereLoggedInUser",
                JSON.stringify(loggedInUser)
            );


            /* -----------------------------------------
               SUCCESS
            ----------------------------------------- */

            showLoginMessage(
                "Login successful! Redirecting...",
                "success"
            );


            /* -----------------------------------------
               REDIRECT
            ----------------------------------------- */

            setTimeout(function () {

                window.location.href =
                    "../index.html";

            }, 1000);

        }
    );

}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            alert(
                "Password reset functionality will be added soon."
            );

        }
    );

}