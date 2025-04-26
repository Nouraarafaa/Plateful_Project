document.addEventListener("DOMContentLoaded", () => {
    let allRecipes = [];
    const storedR = localStorage.getItem("recipes");

    // Declare topRecipesBody at the top
    const topRecipesBody = document.querySelector(".popular-dishes-section");

    if (!topRecipesBody) {
        console.error("Error: .popular-dishes-section element not found in the DOM.");
        return;
    }

    if (storedR) {
        allRecipes = JSON.parse(storedR);

        // Select and display top recipes
        const topRecipes = selectTopRecipes(allRecipes, 4);
        displayTopDishes(topRecipes);
    } else {
        fetch("User/data/recipes.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch recipes");
                }
                return response.json();
            })
            .then((recipes) => {
                allRecipes = recipes;

                // Update local storage
                localStorage.setItem("recipes", JSON.stringify(allRecipes));

                // Select and display top recipes
                const topRecipes = selectTopRecipes(allRecipes, 4);
                displayTopDishes(topRecipes);
            })
            .catch((error) => {
                console.error("Error fetching recipes:", error);
                topRecipesBody.innerHTML = "<p>Failed to load recipes. Please try again later.</p>";
            });
    }

    function selectTopRecipes(recipes, n) {
        // Sort the recipes by rating in descending order
        const sortedRecipes = [...recipes].sort((a, b) => b.rating - a.rating);
        // Select the top n recipes
        return sortedRecipes.slice(0, n);
    }

    function displayTopDishes(topRecipes) {
        topRecipesBody.innerHTML = `<h2>Our Popular Dishes</h2>`;
        const container = document.createElement("div");
        container.classList.add("dishes-container");
        container.innerHTML = "";

        topRecipes.forEach((recipe) => {
            console.log("Displaying recipe:", recipe);
            const dish = document.createElement("div");
            dish.classList.add("dish");
            const adjustedImage = recipe.image.replace(/^(\.\.\/)+/, './');
            const imageSrc = adjustedImage || "/Plateful_Project/imgs/dishs/img-recipe-1.jpg";
            dish.innerHTML = `
                <img src="${imageSrc}" alt="${recipe.title}">
                <div class="dish-overlay">
                    <h3>${recipe.title}</h3>
                    <p>Tastes good</p>
                    <button class="view-btn" onclick="location.href='User/pages/html/recipe.html?id=${recipe.id}'">View</button>
                </div>
            `;

            container.appendChild(dish);
        });

        // Append the container to the topRecipesBody
        topRecipesBody.appendChild(container);
    }

    // Hide "Get Started" button if the user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const getStartedBtn = document.getElementById("getStartedBtn");

    if (loggedInUser && getStartedBtn) {
        getStartedBtn.style.display = "none"; // Hide the button
    }


});
document.addEventListener("DOMContentLoaded", () => {
    // Part for making navbar links active
    let currentPage = window.location.pathname;
    currentPage = currentPage.substring(currentPage.lastIndexOf('/') + 1);

    if (currentPage === '') {
        currentPage = 'index.html';
    }

    // Select all navigation links (both desktop and mobile)
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');

        // Normalize link href to just file name
        const normalizedHref = linkHref.substring(linkHref.lastIndexOf('/') + 1);

        // Remove any previous active
        link.classList.remove('active');

        // Check if the normalized link matches the current page
        if (normalizedHref === currentPage) {
            link.classList.add('active');
        }
    });

});
