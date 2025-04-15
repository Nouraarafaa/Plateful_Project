
window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("Complaint");
    const complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    complaints.forEach(({ name, email, message }) => {
    const card = document.createElement("div");
    card.classList.add("complaint-card");

    card.innerHTML = `
            <h3>Name: ${name}</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
            <div class="replyBtn">
                <button>Reply</button>
            </div>
        `;

    container.appendChild(card);
});
});
