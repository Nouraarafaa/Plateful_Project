// Fetch recipes from a JSON file
document.addEventListener("DOMContentLoaded", () => {
    const cardsBody = document.querySelector(".cards-body");
    const categoryItems = document.querySelectorAll(".category-item"); // Select all category items
    let allRecipes = []; // Store all recipes for filtering

    // Fetch data from recipes.json
    fetch("../../data/recipes.json")
        .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch recipes");
        }
        return response.json();
        })
        .then((recipes) => {
        console.log("Recipes fetched:", recipes); // Log the fetched recipes
        allRecipes = recipes; // Store recipes for later use
        displayRecipes(allRecipes); // Display all recipes initially
        })
        .catch((error) => {
        console.error("Error loading recipes:", error);
        cardsBody.innerHTML = "<p>Failed to load recipes. Please try again later.</p>";
        });

    // Function to display recipes
    function displayRecipes(recipes) {
        cardsBody.innerHTML = ""; // Clear existing cards
        if (recipes.length === 0) {
            // Display "No results" message if no recipes match
            cardsBody.innerHTML = `<p class="no-results">No recipes found for this category.</p>`;
            return;
        }

        recipes.forEach((recipe) => {
            console.log("Displaying recipe:", recipe); // Log each recipe being displayed
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <div class="card-image">
                <img src="${recipe.image}" alt="${recipe.title}">
                </div>
                <div class="card-content">
                <h2>${recipe.title}</h2>
                <p>${recipe.description}</p>
                <div class="reviews">
                    <span>${recipe.rating}</span>
                    <span>
                    ${generateStars(recipe.rating)}
                    </span>
                </div>
                </div>
                <div class="card-action">
                <a href="../html/recipe.html?id=${recipe.id}" class="view-recipe-btn">View Recipe</a>
                <button class="addFavourites"><i class="fa-solid fa-heart"></i></button>
                </div>
            `;

            cardsBody.appendChild(card);
        });
    }

    // Add event listeners to category items
    categoryItems.forEach((item) => {
        item.addEventListener("click", () => {
        const selectedCategory = item.textContent.trim(); // Get the selected category name

        // Remove 'active' class from all items and add it to the clicked item
        categoryItems.forEach((el) => el.classList.remove("active"));
        item.classList.add("active");

        // Filter recipes based on the selected category
        if (selectedCategory === "All") {
            displayRecipes(allRecipes); // Show all recipes if "All" is selected
        } else {
            const filteredRecipes = allRecipes.filter(
            (recipe) => recipe.category === selectedCategory
            );
            displayRecipes(filteredRecipes); // Show filtered recipes
        }
        });
    });
});

// Helper function to generate star ratings
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    let starsHTML = "";

    for (let i = 0; i < fullStars; i++) {
        starsHTML += `<i class="fa-solid fa-star yellow"></i>`;
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += `<i class="fa-solid fa-star"></i>`;
    }

    return starsHTML;
}