document.addEventListener("DOMContentLoaded", () => {
    const loggedInAdmin = JSON.parse(localStorage.getItem("loggedInAdmin"));
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const profileBtn = document.querySelectorAll("#profileBtn");
    const favouritesBtn = document.querySelectorAll(".favourites");
    const loginBtn = document.querySelectorAll("#loginBtn");
    const registerBtn = document.querySelectorAll("#registerBtn");
    const separator = document.querySelector(".seperator");

    if (loggedInAdmin) {
        // Admin navigation links
        profileBtn.forEach(btn => btn.querySelector("a").setAttribute("href", "../../../Admin/pages/html/adminProfile.html"));
        favouritesBtn.forEach(btn => btn.style.display = "none");

        // Hide login and register buttons for admin
        loginBtn.forEach(btn => btn.style.display = "none");
        registerBtn.forEach(btn => btn.style.display = "none");
        if (separator) separator.style.display = "none";
    } else if (loggedInUser) {
        // User navigation links
        profileBtn.forEach(btn => btn.querySelector("a").setAttribute("href", "../../../User/pages/html/profile.html"));

        // Hide login and register buttons for user
        loginBtn.forEach(btn => btn.style.display = "none");
        registerBtn.forEach(btn => btn.style.display = "none");
        if (separator) separator.style.display = "none";
    } else {
        // Default navigation for guests
        profileBtn.forEach(btn => btn.style.display = "none");
        favouritesBtn.forEach(btn => btn.style.display = "none");
    }

    // Attach the logout function to the logout button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
});

function logout() {
    localStorage.removeItem("loggedInRole");
    localStorage.removeItem("loggedInAdmin");
    localStorage.removeItem("loggedInUser");
    Swal.fire("Logged Out", "See you next time!", "success").then(() => {
        window.location.href = "../../../index.html";
    });
}