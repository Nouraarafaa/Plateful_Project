document.addEventListener("DOMContentLoaded", () => {
    const loggedInAdmin = JSON.parse(localStorage.getItem("loggedInAdmin"));
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const profileBtns = document.querySelectorAll("#profileBtn"); // Select both desktop and mobile profile buttons
    const favouritesBtns = document.querySelectorAll(".favourites"); // Select both desktop and mobile favorites buttons
    const loginBtns = document.querySelectorAll("#loginBtn"); // Select both desktop and mobile login buttons
    const registerBtns = document.querySelectorAll("#registerBtn"); // Select both desktop and mobile register buttons
    const separator = document.querySelector(".seperator");

    const profileBtn = document.getElementById("profileBtn");
    const recipesBtn = document.getElementById("recipes");
    const contactBtn = document.getElementById("contactBtn");
    const favoriteIcons = document.querySelectorAll(".favourites"); // Select all favorite icons
    const favouritesBtn = document.getElementById("favouritesBtn");

    // Apply logic for admin users
    if (loggedInAdmin) {
        // Admin navigation links
        profileBtns.forEach(btn => btn.querySelector("a").setAttribute("href", "../../../Admin/pages/html/adminProfile.html"));
        favouritesBtns.forEach(btn => btn.style.display = "none");

        if (profileBtn) {
            profileBtn.querySelector("a").setAttribute("href", "../../../Admin/pages/html/adminProfile.html");
        }
        if (recipesBtn) {
            recipesBtn.querySelector("a").setAttribute("href", "../../../Admin/pages/html/card-recipes.html");
        }
        if (contactBtn) {
            contactBtn.querySelector("a").setAttribute("href", "../../../Admin/pages/html/contact.html");
        }

        // Hide login and register buttons for admin
        loginBtns.forEach(btn => btn.style.display = "none");
        registerBtns.forEach(btn => btn.style.display = "none");
        if (separator) separator.style.display = "none";

        // Hide favorite icons for admin
        favoriteIcons.forEach(icon => {
            icon.style.display = "none";
        });
    } 
    // Apply logic for regular users
    else if (loggedInUser) {
        // User navigation links
        profileBtns.forEach(btn => btn.querySelector("a").setAttribute("href", "../../../User/pages/html/profile.html"));

        if (profileBtn) {
            profileBtn.querySelector("a").setAttribute("href", "../../../User/pages/html/profile.html");
        }
        if (recipesBtn) {
            recipesBtn.querySelector("a").setAttribute("href", "../../../User/pages/html/card-recipes.html");
        }
        if (contactBtn) {
            contactBtn.querySelector("a").setAttribute("href", "../../../User/pages/html/contact.html");
        }

        // Hide login and register buttons for user
        loginBtns.forEach(btn => btn.style.display = "none");
        registerBtns.forEach(btn => btn.style.display = "none");
        if (separator) separator.style.display = "none";
    } 
    // Apply logic for guests
    else {
        // Default navigation for guests
        profileBtns.forEach(btn => btn.style.display = "none");
        favouritesBtns.forEach(btn => btn.style.display = "none");

        if (profileBtn) profileBtn.style.display = "none";
        if (recipesBtn) recipesBtn.querySelector("a").setAttribute("href", "../../../User/pages/html/card-recipes.html");
        if (contactBtn) contactBtn.querySelector("a").setAttribute("href", "../../../User/pages/html/contact.html");

        // Show login and register buttons for guests
        loginBtns.forEach(btn => btn.style.display = "block");
        registerBtns.forEach(btn => btn.style.display = "block");
    }

    // Synchronize desktop and mobile navigation
    synchronizeNavigation();

    // Highlight the active page in the navigation
    highlightActivePage();

    // Attach the logout function to the logout button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
});

// Function to synchronize desktop and mobile navigation
function synchronizeNavigation() {
    const desktopNavLinks = document.querySelectorAll(".nav-links a");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav a");

    desktopNavLinks.forEach((desktopLink, index) => {
        if (mobileNavLinks[index]) {
            mobileNavLinks[index].setAttribute("href", desktopLink.getAttribute("href"));
        }
    });
}

// Function to highlight the active page in the navigation
function highlightActivePage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".nav-links a, .mobile-nav a");

    navLinks.forEach(link => {
        if (link.getAttribute("href") && currentPath.includes(link.getAttribute("href").split("/").pop())) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

// Logout function
function logout() {
    localStorage.removeItem("loggedInRole");
    localStorage.removeItem("loggedInAdmin");
    localStorage.removeItem("loggedInUser");
    Swal.fire("Logged Out", "See you next time!", "success").then(() => {
        window.location.href = "../../../index.html";
    });
}