
document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault(); // prevent actual form submission
    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;

    // Get current data or set empty array
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    // Add new complaint
    complaints.push({ name, email, message });

    // Save back to localStorage
    localStorage.setItem("complaints", JSON.stringify(complaints));

    // Optionally clear the form
    e.target.reset();

    Swal.fire({
        title: "Message sent successfully!!",
        text: "We will reply soon",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#70974C"
    });

});