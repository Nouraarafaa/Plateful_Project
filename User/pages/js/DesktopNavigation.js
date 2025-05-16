    document.addEventListener("DOMContentLoaded", () => {
    const loggedInAdmin = JSON.parse(localStorage.getItem("loggedInAdmin"));
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const profileBtn = document.getElementById("profileBtn");
    const recipesBtn = document.getElementById("recipes");
    const contactBtn = document.getElementById("contactBtn");
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const separator = document.querySelector(".seperator");
    const favoriteIcons = document.querySelectorAll(".favourites");
    const favouritesBtn = document.getElementById("favouritesBtn");

    // Get the current page
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    if (loggedInAdmin) {
        // Admin navigation links
        if (profileBtn) {
            profileBtn.querySelector("a").setAttribute(
                "href",
                currentPage === "index.html"
                    ? "./Admin/pages/html/adminProfile.html"
                    : "../../../Admin/pages/html/adminProfile.html"
            );
        }
        if (recipesBtn) {
            recipesBtn.querySelector("a").setAttribute(
                "href",
                currentPage === "index.html"
                    ? "./Admin/pages/html/card-recipes.html"
                    : "../../../Admin/pages/html/card-recipes.html"
            );
        }
        if (contactBtn) {
            contactBtn.querySelector("a").setAttribute(
                "href",
                currentPage === "index.html"
                    ? "./Admin/pages/html/contact.html"
                    : "../../../Admin/pages/html/contact.html"
            );
        }

        // Hide login and register buttons for admin
        if (loginBtn) loginBtn.style.display = "none";
        if (registerBtn) registerBtn.style.display = "none";
        if (separator) separator.style.display = "none";

        // Hide favorite icons for admin
        favoriteIcons.forEach(icon => {
            icon.style.display = "none";
        });
    } else if (loggedInUser) {
        // User navigation links
        if (profileBtn) {
            profileBtn.querySelector("a").setAttribute(
                "href",
                currentPage === "index.html"
                    ? "./User/pages/html/profile.html"
                    : "../../../User/pages/html/profile.html"
            );
        }
        if (recipesBtn) {
            recipesBtn.querySelector("a").setAttribute(
                "href",
                currentPage === "index.html"
                    ? "./User/pages/html/card-recipes.html"
                    : "../../../User/pages/html/card-recipes.html"
            );
        }
        if (contactBtn) {
            contactBtn.querySelector("a").setAttribute(
                "href",
                currentPage === "index.html"
                    ? "./User/pages/html/contact.html"
                    : "../../../User/pages/html/contact.html"
            );
        }

        // Hide login and register buttons for user
        if (loginBtn) loginBtn.style.display = "none";
        if (registerBtn) registerBtn.style.display = "none";
        if (separator) separator.style.display = "none";
    } else {
        // Default navigation for guests
        if (profileBtn) profileBtn.style.display = "none";
        if (recipesBtn) {
            recipesBtn.querySelector("a").setAttribute(
                "href",
                currentPage === "index.html"
                    ? "./User/pages/html/card-recipes.html"
                    : "../../../User/pages/html/card-recipes.html"
            );
        }
        if (contactBtn) {
            contactBtn.querySelector("a").setAttribute(
                "href",
                currentPage === "index.html"
                    ? "./User/pages/html/contact.html"
                    : "../../../User/pages/html/contact.html"
            );
        }
    }

    // Additional logic for guests
    if (!loggedInUser && !loggedInAdmin) {
        if (profileBtn) profileBtn.style.display = "none";
        if (favouritesBtn) favouritesBtn.style.display = "none";
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
