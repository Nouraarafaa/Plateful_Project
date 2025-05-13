document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;

    fetch("http://localhost:8000/api/complaint/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, message })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to send message");
        }
        return response.json();
    })
    .then(data => {
        e.target.reset();
        Swal.fire({
            title: "Message sent successfully!!",
            text: "We will reply soon",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#70974C"
        });
    })
    .catch(error => {
        console.error("Error:", error);
        Swal.fire("Oops!", "Something went wrong. Try again later.", "error");
    });
});
