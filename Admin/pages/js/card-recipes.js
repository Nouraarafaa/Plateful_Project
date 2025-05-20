document.addEventListener("DOMContentLoaded", () => {
    const cardsBody = document.querySelector(".cards-body");
    const categoryItems = document.querySelectorAll(".category-item, .subcategory-item");
    let allRecipes = [];

    fetch("http://127.0.0.1:8000/api/recipes/")
        .then((response) => response.json())
        .then((data) => {
            const recipes = Array.isArray(data) ? data : data.results;
            allRecipes = recipes;
            displayRecipes(allRecipes);
        })
        .catch((error) => {
            console.error("Error loading recipes:", error);
            cardsBody.innerHTML = "<p>Failed to load recipes. Please try again later.</p>";
        });

    //enabling the search bar
    const searchInput = document.querySelector(".search input");

    searchInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            const query = searchInput.value.trim();
            let url = "http://127.0.0.1:8000/api/recipes/";
            if (query) {
                url += `?search=${encodeURIComponent(query)}`;
            }
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    const recipes = Array.isArray(data) ? data : data.results;
                    displayRecipes(recipes);
                });
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
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to undo this action!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#70974C",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                // Send DELETE request to backend
                fetch(`http://127.0.0.1:8000/api/recipes/${recipeId}/`, {
                    method: "DELETE"
                })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to delete recipe");
                    // Remove the recipe from the recipes array
                    allRecipes = allRecipes.filter((recipe) => recipe.id !== recipeId);

                    // Update local storage
                    localStorage.setItem("recipes", JSON.stringify(allRecipes));

                    // Re-render the recipes
                    displayRecipes(allRecipes);

                    Swal.fire({
                        title: "Deleted!",
                        text: "The recipe has been deleted successfully.",
                        icon: "success",
                        confirmButtonColor: "#2d1c0a",
                    });
                })
                .catch(err => {
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to delete recipe: " + err.message,
                        icon: "error",
                        confirmButtonColor: "#d33",
                    });
                });
            }
        });
    }
    categoryItems.forEach((item) => {
        item.addEventListener("click", () => {
            var selectedCategory = item.textContent.trim();
            categoryItems.forEach((el) => el.classList.remove("active"));
            item.classList.add("active");

            let url = "http://127.0.0.1:8000/api/recipes/";

            if (selectedCategory !== "All") {
                // Remove dropdown symbol if present
                if (item.id === "parent") {
                    selectedCategory = selectedCategory.slice(0, -2);
                }
                url += `?category=${encodeURIComponent(selectedCategory)}`;
            }

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    const recipes = Array.isArray(data) ? data : data.results;
                    displayRecipes(recipes);
                })
                .catch(error => {
                    cardsBody.innerHTML = "<p>Failed to load recipes. Please try again later.</p>";
                });
        });
    });

    // dropdown category selection
    const dropdown = document.querySelector(".dropdown select");
    if (dropdown) {
        dropdown.addEventListener("change", () => {
            const selectedCategory = dropdown.value.trim(); 

            if (selectedCategory === "All") {
                displayRecipes(allRecipes); 
            } 
            else {
                const filteredRecipes = allRecipes.filter((recipe) =>
                    recipe.category.includes(selectedCategory) 
                );
                displayRecipes(filteredRecipes); 
            }
        });
    }

    
});
