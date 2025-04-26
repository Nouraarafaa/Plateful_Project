document.addEventListener("DOMContentLoaded", () => {
    const loggedInAdmin = JSON.parse(localStorage.getItem("loggedInAdmin"));
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const profileBtn = document.getElementById("profileBtn");
    const recipesBtn = document.getElementById("recipes");
    const contactBtn = document.getElementById("contactBtn");
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const separator = document.querySelector(".seperator");
    const favoriteIcons = document.querySelectorAll(".favourites"); // Select all favorite icons
    const favouritesBtn = document.getElementById("favouritesBtn");

    if (loggedInAdmin) {
        // Admin navigation links
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
            profileBtn.querySelector("a").setAttribute("href", "../../../User/pages/html/profile.html");
        }
        if (recipesBtn) {
            recipesBtn.querySelector("a").setAttribute("href", "../../../User/pages/html/card-recipes.html");
        }
        if (contactBtn) {
            contactBtn.querySelector("a").setAttribute("href", "../../../User/pages/html/contact.html");
        }

        // Hide login and register buttons for user
        if (loginBtn) loginBtn.style.display = "none";
        if (registerBtn) registerBtn.style.display = "none";
        if (separator) separator.style.display = "none";
    } else {
        // Default navigation for guests
        if (profileBtn) profileBtn.style.display = "none";
        if (recipesBtn) recipesBtn.querySelector("a").setAttribute("href", "../../../User/pages/html/card-recipes.html");
        if (contactBtn) contactBtn.querySelector("a").setAttribute("href", "../../../User/pages/html/contact.html");
        //this new
        if (favouritesBtn) favouritesBtn.style.display = "none";
    }

    // Attach the logout function to the logout button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

    //this new
    const currentPath = window.location.pathname;
    const basePath = currentPath.substring(0, currentPath.lastIndexOf("/") + 1);

    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (!href.startsWith("http") && !href.startsWith("#")) {
            link.setAttribute("href", basePath + href);
        }
    });
});

function logout() {
    localStorage.removeItem("loggedInRole");
    localStorage.removeItem("loggedInAdmin");
    localStorage.removeItem("loggedInUser");
    Swal.fire("Logged Out", "See you next time!", "success").then(() => {
        window.location.href = "../../../index.html";
    });
}