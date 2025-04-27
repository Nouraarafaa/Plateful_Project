document.addEventListener("DOMContentLoaded", () => {
    const loggedInAdmin = JSON.parse(localStorage.getItem("loggedInAdmin"));
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const profileBtns = document.querySelectorAll("#profileBtn"); // Select both desktop and mobile profile buttons
    const favouritesBtns = document.querySelectorAll(".favourites"); // Select both desktop and mobile favorites buttons
    const loginBtns = document.querySelectorAll("#loginBtn"); // Select both desktop and mobile login buttons
    const registerBtns = document.querySelectorAll("#registerBtn"); // Select both desktop and mobile register buttons
    const separator = document.querySelector(".seperator");
    const recipesBtn = document.querySelector("#recipes"); 
    const contactBtn = document.querySelector("#contactBtn"); 

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    // Determine the base path based on the current page
    const basePath = currentPage === "index.html" ? "./" : "../../../";

    if (loggedInAdmin) {
        // Admin navigation links
        profileBtns.forEach(btn => btn.querySelector("a").setAttribute("href", `${basePath}Admin/pages/html/adminProfile.html`));
        recipesBtn.forEach(btn => btn.querySelector("a").setAttribute("href", `${basePath}Admin/pages/html/card-recipes.html`));
        contactBtn.forEach(btn => btn.querySelector("a").setAttribute("href", `${basePath}Admin/pages/html/contact.html`));
        favouritesBtns.forEach(btn => btn.style.display = "none");

        if (separator) separator.style.display = "none";

        loginBtns.forEach(btn => btn.style.display = "none");
        registerBtns.forEach(btn => btn.style.display = "none");
    } else if (loggedInUser) {
        // User navigation links
        profileBtns.forEach(btn => btn.querySelector("a").setAttribute("href", `${basePath}User/pages/html/profile.html`));
        recipesBtn.forEach(btn => btn.querySelector("a").setAttribute("href", `${basePath}User/pages/html/card-recipes.html`));
        contactBtn.forEach(btn => btn.querySelector("a").setAttribute("href", `${basePath}User/pages/html/contact.html`));
        favouritesBtns.forEach(btn => btn.style.display = "block");

        if (separator) separator.style.display = "block";

        loginBtns.forEach(btn => btn.style.display = "none");
        registerBtns.forEach(btn => btn.style.display = "none");
    } else {
        // Default navigation for guests
        profileBtns.forEach(btn => btn.style.display = "none");
        favouritesBtns.forEach(btn => btn.style.display = "none");

        loginBtns.forEach(btn => btn.style.display = "block");
        registerBtns.forEach(btn => btn.style.display = "block");

        if (separator) separator.style.display = "block";
    }

    // Synchronize desktop and mobile navigation
    synchronizeNavigation(basePath);

    // Highlight the active page in the navigation
    highlightActivePage();

    // Attach the logout function to the logout button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
});

// Function to synchronize desktop and mobile navigation
function synchronizeNavigation(basePath) {
    const desktopNavLinks = document.querySelectorAll(".nav-links a");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav a");

    desktopNavLinks.forEach((desktopLink, index) => {
        if (mobileNavLinks[index]) {
            const relativeHref = desktopLink.getAttribute("href");
            mobileNavLinks[index].setAttribute("href", `${basePath}${relativeHref}`);
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