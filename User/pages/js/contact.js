// Check if the user is logged in
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
    Swal.fire({
        title: "Login Required",
        text: "Please log in to access the Contact Us page.",
        icon: "warning",
        showCancelButton: false,
        confirmButtonText: "Login",
        customClass: {
            confirmButton: "swal-login-btn"
        },
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "../../../Login & Register/pages/html/authentication.html";
        }
    });
}
// Access the contact form
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent actual form submission

        const name = e.target.name.value.trim();
        const email = e.target.email.value.trim();
        const message = e.target.message.value.trim();

        // Validate form fields
        if (!name || !email || !message) {
            Swal.fire({
                title: "Message Sent Successfully!",
                text: "We will get back to you soon.",
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "swal-ok-btn"
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "../html/card-recipes.html"; 
                }
            });
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                title: "Error",
                text: "Please enter a valid email address!",
                icon: "error",
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "swal-ok-btn"
                },
            });
            return;
        }

        // Use a user-specific key for storing messages
        const messagesKey = `messages_${loggedInUser.email}`;
        let messages = JSON.parse(localStorage.getItem(messagesKey)) || [];

        // Add the new message
        messages.push({ name, email, message });

        // Save the messages back to localStorage
        localStorage.setItem(messagesKey, JSON.stringify(messages));

        // Clear the form
        e.target.reset();

        // Show success message
        Swal.fire({
            title: "Message Sent Successfully!",
            text: "We will get back to you soon.",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: "swal-ok-btn"
            },
        }).then(() => {
            window.location.href = "../html/card-recipes.html"; // Redirect to another page if needed
        });
    });
} else {
    console.error("Error: #contactForm element not found in the DOM.");
}