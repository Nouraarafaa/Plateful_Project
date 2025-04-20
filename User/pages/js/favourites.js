document.addEventListener("DOMContentLoaded", () => {
    const favContainer = document.querySelector(".recipes");

    // Fetch favourites from JSON using AJAX
    fetchFavourites();

    function fetchFavourites() {
        // Simulate an AJAX call to fetch recipes
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "../../data/recipes.json", true); // JSON file
        xhr.onload = function () {
            if (xhr.status === 200) {
                const recipes = JSON.parse(xhr.responseText);
                const favourites = JSON.parse(localStorage.getItem("favourites")) || [];

                // Filter recipes to only include favourites
                const favouriteRecipes = recipes.filter((recipe) =>
                    favourites.some((fav) => fav.id === recipe.id)
                );

                if (favouriteRecipes.length === 0) {
                    favContainer.innerHTML = `<p class="no-results">No recipes were added to your favourites.</p>`;
                    return;
                }

                // Render favourite recipes
                favouriteRecipes.forEach((recipe) => {
                    const recipeCard = document.createElement("div");
                    recipeCard.classList.add("recipe-card");

                    recipeCard.innerHTML = `
                        <img src="${recipe.image}" alt="${recipe.title}">
                        <h3>${recipe.title}</h3>
                        <button><a href="../html/recipe.html?id=${recipe.id}">View Recipe</a></button>
                        <button class="remove-btn" data-id="${recipe.id}">Remove</button>
                    `;

                    favContainer.appendChild(recipeCard);
                });

                // Add event listeners to remove buttons
                addRemoveListeners(favourites);
            } else {
                favContainer.innerHTML = `<p class="error">Failed to load recipes. Please try again later.</p>`;
            }
        };
        xhr.onerror = function () {
            favContainer.innerHTML = `<p class="error">An error occurred while fetching recipes.</p>`;
        };
        xhr.send();
    }

    function addRemoveListeners(favourites) {
        const removeButtons = document.querySelectorAll(".remove-btn");
        removeButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                const recipeId = parseInt(button.getAttribute("data-id"));
                const updatedFavourites = favourites.filter((fav) => fav.id !== recipeId);

                // Update favourites in localStorage
                localStorage.setItem("favourites", JSON.stringify(updatedFavourites));

                // Remove the recipe card from the DOM
                const recipeCard = button.closest(".recipe-card");
                recipeCard.remove();

                // Show SweetAlert2 message
                Swal.fire({
                    title: "Recipe removed from your favourites.",
                    text: "You can add it again anytime.",
                    icon: "warning",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#70974C"
                });

                // If no favourites remain, show a message
                if (updatedFavourites.length === 0) {
                    favContainer.innerHTML = `<p class="no-results">No recipes were added to your favourites.</p>`;
                }
            });
        });
    }
});