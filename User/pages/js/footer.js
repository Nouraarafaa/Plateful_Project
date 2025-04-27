document.addEventListener("DOMContentLoaded", () => {
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
        fetch("../../../User/pages/html/footer.html")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to load footer");
                }
                return response.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => {
                console.error("Error loading footer:", error);
            });
    }
});