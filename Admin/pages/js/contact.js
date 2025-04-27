window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("Complaint");
    if (!container) {
        console.error("Error: #Complaint element not found in the DOM.");
        return;
    }

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    // Check if there are no complaints
    if (complaints.length === 0) {
        container.innerHTML = ""; // Clear any existing content
        const noComplaintsMessage = document.createElement("p");
        noComplaintsMessage.textContent = "No user complaints yet.";
        noComplaintsMessage.classList.add("no-complaints-message");
        container.appendChild(noComplaintsMessage);
        return;
    }

    complaints.forEach(({ name, email, message }) => {
        const card = document.createElement("div");
        card.classList.add("complaint-card");

        card.innerHTML = `
            <h3>Name: ${name}</h3>
            <p><strong>Email:</strong> <span class="email">${email}</span></p>
            <p><strong>Message:</strong> ${message}</p>
            <div class="replyBtn">
                <button class="replyBttn">Reply</button>
                <button class="deleteBttn">Delete</button>
            </div>
        `;

        container.appendChild(card);
    });

    container.addEventListener('click', (event) => {
        const target = event.target;

        if (target.matches('.replyBttn')) {
            const email = target.closest('.complaint-card').querySelector('.email').textContent;
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
            window.open(gmailUrl, '_blank');
        }

        if (target.matches('.deleteBttn')) {
            const card = target.closest('.complaint-card');
            const emailToDelete = card.querySelector('.email').textContent;

            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#70974C",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    complaints = complaints.filter(c => c.email !== emailToDelete);
                    localStorage.setItem("complaints", JSON.stringify(complaints));

                    card.remove();

                    // Check if there are no complaints left
                    if (complaints.length === 0) {
                        const noComplaintsMessage = document.createElement("p");
                        noComplaintsMessage.textContent = "No user complaints yet.";
                        noComplaintsMessage.classList.add("no-complaints-message");
                        container.appendChild(noComplaintsMessage);
                    }

                    Swal.fire({
                        title: "Deleted!",
                        text: "The complaint has been removed.",
                        icon: "success",
                        confirmButtonText: "OK",
                        customClass: {
                            confirmButton: "swal-ok-btn"
                        },
                    });
                }
            });
        }
    });
});