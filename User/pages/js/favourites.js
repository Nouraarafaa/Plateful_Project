document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("Logged in user in favourites.js:", loggedInUser);

    if (!loggedInUser) {
        Swal.fire({
            title: "Login Required",
            text: "Please log in to access your favourites.",
            icon: "warning",
            showCancelButton: false, 
            confirmButtonText: "Login",
            customClass: {
                confirmButton: "swal-login-btn"
            },
        }).then((result) => {
            if (result.isConfirmed) {
            window.location.href = "../../../Login & Register/pages/html/authentication.html";
            }
        });
        return;
    }

    const favContainer = document.querySelector(".recipes");
    const userFavouritesKey = `favourites_${loggedInUser.email}`;
    const favourites = JSON.parse(localStorage.getItem(userFavouritesKey)) || [];
    console.log("User favourites key:", userFavouritesKey);
    console.log("Favourites data:", favourites);

    fetchFavourites();

    function fetchFavourites() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "../../data/recipes.json", true); // JSON file
        xhr.onload = function () {
            if (xhr.status === 200) {
                const recipes = JSON.parse(xhr.responseText);
                console.log("Recipes loaded from JSON:", recipes);

                if (!Array.isArray(recipes)) {
                    favContainer.innerHTML = `<p class="error">Failed to load recipes. Please try again later.</p>`;
                    return;
                }

                const favouriteRecipes = recipes.filter((recipe) =>
                    favourites.some((fav) => fav.id === recipe.id)
                );
                console.log("Filtered favourite recipes:", favouriteRecipes);

                if (favouriteRecipes.length === 0) {
                    favContainer.innerHTML = `<p class="no-results">No recipes were added to your favourites.</p>`;
                    return;
                }

                favouriteRecipes.forEach((recipe) => {
                    const recipeCard = document.createElement("div");
                    recipeCard.classList.add("recipe-card");

                    recipeCard.innerHTML = `
                        <img src="${recipe.image}" alt="${recipe.title}">
                        <h3>${recipe.title}</h3>
                        <button class="view-recipe-btn"><a href="../html/recipe.html?id=${recipe.id}">View Recipe</a></button>
                        <button class="remove-btn" data-id="${recipe.id}">Remove</button>
                    `;

                    favContainer.appendChild(recipeCard);
                });

                addRemoveListeners(favourites, userFavouritesKey);
            } else {
                favContainer.innerHTML = `<p class="error">Failed to load recipes. Please try again later.</p>`;
            }
        };
        xhr.onerror = function () {
            favContainer.innerHTML = `<p class="error">An error occurred while fetching recipes.</p>`;
        };
        xhr.send();
    }

    function addRemoveListeners(favourites, userFavouritesKey) {
        const removeButtons = document.querySelectorAll(".remove-btn");
        removeButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                const recipeId = parseInt(button.getAttribute("data-id"));

                Swal.fire({
                    title: "Are you sure?",
                    text: "Do you want to remove this recipe from your favourites?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    customClass: {
                        confirmButton: "swal-confirm-btn",
                        cancelButton: "swal-cancel-btn"
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        const updatedFavourites = favourites.filter((fav) => fav.id !== recipeId);
                        localStorage.setItem(userFavouritesKey, JSON.stringify(updatedFavourites));

                        const recipeCard = button.closest(".recipe-card");
                        recipeCard.remove();

                        if (updatedFavourites.length === 0) {
                            favContainer.innerHTML = `<p class="no-results">No recipes were added to your favourites.</p>`;
                        }

                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "The recipe has been removed from your favourites.",
                            text: "You can add it back later if you want.",
                            showConfirmButton: false,
                            timer: 1800,
                        });
                    }
                });
            });
        });
    }
});