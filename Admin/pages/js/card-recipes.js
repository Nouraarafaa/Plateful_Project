document.addEventListener("DOMContentLoaded", () => {
    const cardsBody = document.querySelector(".cards-body");
    const categoryItems = document.querySelectorAll(".category-item");
    let allRecipes = [];

    // Fetch recipes from the JSON file
    fetch("../../../User/data/recipes.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch recipes");
            }
            return response.json();
        })
        .then(recipes => {
            console.log("Recipes fetched:", recipes);
            allRecipes = recipes;
            displayRecipes(allRecipes);
        })
        .catch(error => {
            console.error("Error loading recipes:", error);
            cardsBody.innerHTML += "<p>Failed to load recipes. Please try again later.</p>";
        });

    // Function to display recipes dynamically
    function displayRecipes(recipes) {
        cardsBody.innerHTML = ""; // Clear existing content

        if (recipes.length === 0) {
            cardsBody.innerHTML = `<p class="no-results">No recipes found for this category.</p>`;
            return;
        }

        recipes.forEach(recipe => {
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
                    <div class="reviews">
                        <span>${recipe.rating}</span>
                        <span>
                            ${generateStars(recipe.rating)}
                        </span>
                    </div>
                </div>
                <div class="card-action">
                    <button><a href="../../../User/pages/html/recipe.html?id=${recipe.id}">View Recipe</a></button>
                    <button><a href="../html/edit-recipe.html?id=${recipe.id}">Edit Recipe</a></button>
                </div>
            `;
            cardsBody.appendChild(card);
        });

        // Add event listeners for the "Remove" buttons
        const removeButtons = document.querySelectorAll(".remove");
        removeButtons.forEach(button => {
            button.addEventListener("click", () => {
                const card = button.closest(".card");
                card.remove();
                Swal.fire({
                    title: "Recipe Removed",
                    text: "The recipe has been successfully removed.",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#70974C"
                });
            });
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
});
