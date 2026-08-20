/* =========================================================
   SHOPSPHERE
   CONTACT PAGE JAVASCRIPT
========================================================= */


/* =========================================================
   CONTACT FORM
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const contactForm =
        document.querySelector(".contact-form form");


    if (!contactForm) {
        return;
    }


    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const subject =
            document.getElementById("subject").value.trim();

        const message =
            document.getElementById("message").value.trim();


        /* =================================================
           CHECK EMPTY FIELDS
        ================================================= */

        if (
            name === "" ||
            email === "" ||
            subject === "" ||
            message === ""
        ) {

            alert("Please fill in all fields.");

            return;
        }


        /* =================================================
           CHECK EMAIL
        ================================================= */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            alert("Please enter a valid email address.");

            return;
        }


        /* =================================================
           REMOVE OLD SUCCESS MESSAGE
        ================================================= */

        const oldMessage =
            document.querySelector(".contact-success");


        if (oldMessage) {
            oldMessage.remove();
        }


        /* =================================================
           SUCCESS MESSAGE
        ================================================= */

        const successMessage =
            document.createElement("div");

        successMessage.className =
            "contact-success";

        successMessage.textContent =
            "Thank you, " +
            name +
            "! Your message has been submitted successfully.";


        contactForm.appendChild(successMessage);


        /* =================================================
           CLEAR FORM
        ================================================= */

        contactForm.reset();

    });

});