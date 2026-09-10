/* =========================================================
   SHOPSPHERE
   CUSTOMER PROFILE JAVASCRIPT
   BACKEND INTEGRATED
========================================================= */

const API_BASE_URL =
    "http://localhost:8080/api";


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
   LOAD CUSTOMER PROFILE
========================================================= */

async function loadProfile() {

    const token =
        localStorage.getItem(
            "shopSphereToken"
        );

    const savedCustomer =
        localStorage.getItem(
            "shopSphereLoggedInUser"
        );


    /* -----------------------------------------
       NO TOKEN
    ----------------------------------------- */

    if (!token) {

        window.location.href =
            "login.html";

        return;
    }


    /* -----------------------------------------
       GET CUSTOMER ID
    ----------------------------------------- */

    let customerId = null;

    if (savedCustomer) {

        try {

            const customer =
                JSON.parse(savedCustomer);

            customerId =
                customer.id;

        } catch (error) {

            console.error(
                "Error reading customer information:",
                error
            );
        }
    }


    /* -----------------------------------------
       CUSTOMER ID NOT FOUND
    ----------------------------------------- */

    if (!customerId) {

        console.error(
            "Customer ID not found."
        );

        window.location.href =
            "login.html";

        return;
    }


    /* -----------------------------------------
       GET PROFILE FROM BACKEND
    ----------------------------------------- */

    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/customers/" +
                customerId,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        /* -----------------------------------------
           UNAUTHORIZED
        ----------------------------------------- */

        if (response.status === 401) {

            localStorage.removeItem(
                "shopSphereToken"
            );

            localStorage.removeItem(
                "shopSphereLoggedInUser"
            );

            window.location.href =
                "login.html";

            return;
        }


        /* -----------------------------------------
           FORBIDDEN
        ----------------------------------------- */

        if (response.status === 403) {

            alert(
                "You are not allowed to access this profile."
            );

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Unable to load customer profile."
            );
        }


        const customer =
            await response.json();


        /* -----------------------------------------
           DISPLAY PROFILE
        ----------------------------------------- */

        if (profileName) {

            profileName.textContent =
                customer.name ||
                "Customer";
        }


        if (profileEmail) {

            profileEmail.textContent =
                customer.email ||
                "";
        }


        if (profileId) {

            profileId.textContent =
                customer.id ||
                "-";
        }


    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

        alert(
            "Unable to load your profile. Please try again."
        );
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
                "shopSphereToken"
            );

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

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProfile();

    }
);

