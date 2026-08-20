javascript
/* =========================================================
   SHOPSPHERE
   CUSTOMER PROFILE JAVASCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const profileName =
    document.getElementById("profile-name");

const profileEmail =
    document.getElementById("profile-email");

const profileId =
    document.getElementById("profile-id");

const logoutButton =
    document.getElementById("logout-button");


/* =========================================================
   GET LOGGED-IN USER
========================================================= */

function getLoggedInUser() {

    const savedUser =
        localStorage.getItem(
            "shopSphereLoggedInUser"
        );


    if (!savedUser) {
        return null;
    }


    try {

        return JSON.parse(savedUser);

    } catch (error) {

        console.error(
            "Error reading logged-in user:",
            error
        );

        return null;
    }
}


/* =========================================================
   LOAD PROFILE
========================================================= */

function loadProfile() {

    const user =
        getLoggedInUser();


    /* -----------------------------------------
       NO USER LOGGED IN
    ----------------------------------------- */

    if (!user) {

        window.location.href =
            "login.html";

        return;
    }


    /* -----------------------------------------
       DISPLAY USER INFORMATION
    ----------------------------------------- */

    if (profileName) {

        profileName.textContent =
            user.name || "Customer";
    }


    if (profileEmail) {

        profileEmail.textContent =
            user.email || "";
    }


    if (profileId) {

        profileId.textContent =
            user.id || "-";
    }

}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "shopSphereLoggedInUser"
            );


            window.location.href =
                "login.html";

        }
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

loadProfile();

