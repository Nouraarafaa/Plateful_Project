document.addEventListener("DOMContentLoaded", () => {
    const cardsBody = document.querySelector(".cards-body");
    const categoryItems = document.querySelectorAll(".category-item");
    let allRecipes = [];

    // Check if recipes exist in local storage
    const storedRecipes = localStorage.getItem("recipes");

    if (storedRecipes) {
        // Use recipes from local storage
        allRecipes = JSON.parse(storedRecipes);
        console.log("Loaded recipes from local storage:", allRecipes);
        displayRecipes(allRecipes);
    } else {
        // Fetch recipes from JSON file and save to local storage
        fetch("../../../User/data/recipes.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch recipes");
                }
                return response.json();
            })
            .then((recipes) => {
                console.log("Recipes fetched:", recipes);
                allRecipes = recipes;
                localStorage.setItem("recipes", JSON.stringify(allRecipes));
                displayRecipes(allRecipes);
            })
            .catch((error) => {
                console.error("Error loading recipes:", error);
                cardsBody.innerHTML = "<p>Failed to load recipes. Please try again later.</p>";
            });
    }

    function displayRecipes(recipes) {
        
        cardsBody.innerHTML = "";

        if (recipes.length === 0) {
            cardsBody.innerHTML = `<p class="no-results">No recipes found for this category.</p>`;
            return;
        }
        
        cardsBody.innerHTML = `<div class="card">
            <div class="add-recipe">
                <button class="new-recipe">
                <a href="../html/new-recipe.html">
                    <i class="fa-solid fa-plus"></i>
                    Add New Recipe
                </a>
                </button>
            </div>
            </div>`;
        recipes.forEach((recipe) => {
            console.log("Displaying recipe:", recipe);
            const card = document.createElement("div");
            card.classList.add("card");

            

            card.innerHTML = `
                <button class="remove"> <i class="fa-solid fa-trash-can"></i> </button>
                <div class="card-image">
                    <img src="${recipe.image}" alt="${recipe.title}">
                </div>
                <div class="card-content">
                    <h2>${recipe.title}</h2>
                    <p>${recipe.description}</p>
                </div>
                
                <div class="card-action">
                    <button><a href="../../../User/pages/html/recipe.html?id=${recipe.id}">View Recipe</a></button>
                    <button><a href="../html/edit-recipe.html?id=${recipe.id}">Edit Recipe</a></button>
                </div>
            `;

            cardsBody.appendChild(card);
        });

        
        
    }

    categoryItems.forEach((item) => {
        item.addEventListener("click", () => {
            const selectedCategory = item.textContent.trim();
            categoryItems.forEach((el) => el.classList.remove("active"));
            item.classList.add("active");

            if (selectedCategory === "All") {
                displayRecipes(allRecipes);
            } else {
                const filteredRecipes = allRecipes.filter(
                    (recipe) => recipe.category === selectedCategory
                );
                displayRecipes(filteredRecipes);
            }
        });
    });

    
});
