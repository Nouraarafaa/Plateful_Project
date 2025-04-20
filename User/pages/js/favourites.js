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
    
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: "btn btn-success",
                        cancelButton: "btn btn-danger"
                    },
                    buttonsStyling: false
                });
    
                swalWithBootstrapButtons.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, Remove it!",
                    cancelButtonText: "No, cancel!",
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Remove from localStorage
                        let updatedFavourites = favourites.filter((fav) => fav.id !== recipeId);
                        localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
    
                        // Remove the recipe card
                        const recipeCard = button.closest(".recipe-card");
                        recipeCard.remove();
    
                        // Show success message
                        swalWithBootstrapButtons.fire({
                            title: "Deleted!",
                            text: "The recipe has been removed from your favourites.",
                            icon: "success"
                        });
    
                        // If no favourites remain
                        if (updatedFavourites.length === 0) {
                            favContainer.innerHTML = `<p class="no-results">No recipes were added to your favourites.</p>`;
                        }
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        swalWithBootstrapButtons.fire({
                            title: "Cancelled",
                            text: "Your favourite recipe is safe 😊",
                            icon: "error"
                        });
                    }
                });
            });
        });
    }
});