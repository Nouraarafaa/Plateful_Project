window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("Complaint");
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    // Step 1: Render all complaints
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

    // Step 2: Delegate click events for Reply/Delete
    container.addEventListener('click', (event) => {
        const target = event.target;

        // Handle Reply
        if (target.matches('.replyBttn')) {
            const email = target.closest('.complaint-card').querySelector('.email').textContent;
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
            window.open(gmailUrl, '_blank');
        }

        // Handle Delete
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
                    // Step 3: Remove from localStorage
                    complaints = complaints.filter(c => c.email !== emailToDelete);
                    localStorage.setItem("complaints", JSON.stringify(complaints));

                    // Step 4: Remove from DOM
                    card.remove();

                    Swal.fire({
                        title: "Deleted!",
                        text: "The complaint has been removed.",
                        icon: "success",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#70974C"
                    });
                }
            });
        }
    });
});
