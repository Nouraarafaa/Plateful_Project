window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("Complaint");
    if (!container) {
        console.error("Error: #Complaint element not found in the DOM.");
        return;
    }

    // Fetch complaints from the server
    fetch("http://127.0.0.1:8000/api/complaints/")
        .then(response => response.json())
        .then(complaints => {
            if (complaints.length === 0) {
                container.innerHTML = "<p>No user complaints yet.</p>";
                return;
            }

            complaints.forEach(({ id, name, email, message }) => {
                const card = document.createElement("div");
                card.classList.add("complaint-card");
                card.dataset.id = id;

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
                    const idToDelete = target.closest('.complaint-card').dataset.id;
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
                            // Send DELETE request to remove the complaint from the backend
                            fetch(`http://127.0.0.1:8000/api/complaints/delete/${idToDelete}/`, {
                                method: 'DELETE',
                            })
                            .then(response => response.json())
                            .then(() => {
                                target.closest('.complaint-card').remove();
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "The complaint has been removed.",
                                    icon: "success",
                                    confirmButtonText: "OK"
                                });
                            })
                            .catch(error => console.error('Error:', error));
                        }
                    });
                }
            });
        })
        .catch(error => console.error('Error:', error));
});
