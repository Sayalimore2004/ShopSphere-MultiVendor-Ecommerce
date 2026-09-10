const API_BASE_URL = "http://localhost:8080/api";

document.addEventListener("DOMContentLoaded", function () {
    const contactForm =
        document.querySelector(".contact-form form");

    if (!contactForm) return;

    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const subject =
            document.getElementById("subject").value.trim();

        const message =
            document.getElementById("message").value.trim();

        if (
            name === "" ||
            email === "" ||
            subject === "" ||
            message === ""
        ) {
            alert("Please fill in all fields.");
            return;
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        const oldMessage =
            document.querySelector(".contact-success");

        if (oldMessage) {
            oldMessage.remove();
        }

        try {
            const response =
                await fetch(
                    API_BASE_URL + "/contact",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name: name,
                            email: email,
                            subject: subject,
                            message: message
                        })
                    }
                );

            const text = await response.text();

            let data = text;

            try {
                data = text ? JSON.parse(text) : null;
            } catch (error) {
                // Response is plain text.
            }

            if (!response.ok) {
                const errorMessage =
                    typeof data === "string"
                        ? data
                        : (
                            data && data.message
                                ? data.message
                                : "Unable to submit your message."
                        );

                throw new Error(errorMessage);
            }

            const successMessage =
                document.createElement("div");

            successMessage.className =
                "contact-success";

            successMessage.textContent =
                "Thank you, " +
                name +
                "! Your message has been submitted successfully.";

            contactForm.appendChild(successMessage);

            contactForm.reset();

            console.log(
                "Contact message saved:",
                data
            );

        } catch (error) {
            console.error(
                "Contact form error:",
                error
            );

            alert(
                error.message ||
                "Unable to submit your message. Please try again."
            );
        }
    });
});