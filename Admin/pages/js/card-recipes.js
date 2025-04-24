document.addEventListener("DOMContentLoaded", () => {
    const cardsBody = document.querySelector(".cards-body");
    const categoryItems = document.querySelectorAll(".category-item, .subcategory-item");
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

    //enabling the search bar
    const searchInput = document.querySelector(".search input");
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const query = searchInput.value.trim().toLowerCase();
            console.log(query)
            
            const filteredRecipes = allRecipes.filter((recipe) =>
                recipe.title.toLowerCase().includes(query) 
            );

            console.log("Filtered recipes:", filteredRecipes); 

            displayRecipes(filteredRecipes); 
        }
    });

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

            //enable deletion button
            const deleteButton = card.querySelector(".remove");
            deleteButton.addEventListener("click", () => {
            deleteRecipe(recipe.id);
        });

            cardsBody.appendChild(card);
        });

        
        
    }

    function deleteRecipe(recipeId) {
        if (!confirm("Are you sure you want to delete this recipe?")) {
            return;
        }
    
        // Remove the recipe from the recipes array
        allRecipes = allRecipes.filter((recipe) => recipe.id !== recipeId);
    
        // Update local storage
        localStorage.setItem("recipes", JSON.stringify(allRecipes));
    
        displayRecipes(allRecipes);
    
        alert("Recipe deleted successfully!");
    }

    categoryItems.forEach((item) => {
        item.addEventListener("click", () => {
            const selectedCategory = item.textContent.trim();
            categoryItems.forEach((el) => el.classList.remove("active"));
            item.classList.add("active");

            if (selectedCategory === "All") {
                item.classList.add("active");
                displayRecipes(allRecipes);
            }
            else if(item.id === "parent")
            {
                item.classList.add("active");
                //check if a recipe includes a category from the selected ones (subs)
                const selectedSubCategories = Array.from(item.nextElementSibling.childNodes).filter(
                    (child) => child.nodeType === 1 && child.classList.contains("subcategory-item") // Filter only elements with the class "subcategory-item"
                );

                const selectedSubCategoriesNames = selectedSubCategories.map(
                    (subcategory) => subcategory.textContent.trim()
                ); 
                //removing the dropdown symbol
                selectedCategory = selectedCategory.slice(0,-2)
                selectedSubCategoriesNames.push(selectedCategory)
                
                const filteredRecipes = allRecipes.filter((recipe) =>
                    selectedSubCategoriesNames.some((subcategoryName) =>
                        recipe.category.includes(subcategoryName)
                    )
                );
                displayRecipes(filteredRecipes);

            }
            else if(item.classList[0] === "subcategory-item")
            {
                const parentCategory = item.closest(".subcategory-menu").previousElementSibling;
                parentCategory.classList.add("active");
                const filteredRecipes = allRecipes.filter(
                    (recipe) => recipe.category.includes(selectedCategory)
                );
                displayRecipes(filteredRecipes);
            }
            else {
                item.classList.add("active");
                const filteredRecipes = allRecipes.filter(
                    (recipe) => recipe.category.includes(selectedCategory)
                );
                displayRecipes(filteredRecipes);
            }
        });
    });
    // dropdown category selection
    const dropdown = document.querySelector(".dropdown select");
    if (dropdown) {
        dropdown.addEventListener("change", () => {
            const selectedCategory = dropdown.value.trim(); 
            console.log("Selected category from dropdown:", selectedCategory);

            if (selectedCategory === "All") {
                displayRecipes(allRecipes); 
            } 
            else {
                const filteredRecipes = allRecipes.filter((recipe) =>
                    recipe.category.includes(selectedCategory) 
                );
                console.log("selected recipes: ", filteredRecipes)
                displayRecipes(filteredRecipes); 
            }
        });
    }

    
});
