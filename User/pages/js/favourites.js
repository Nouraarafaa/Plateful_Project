document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("Logged in user in favourites.js:", loggedInUser);

    if (!loggedInUser || !loggedInUser.access) {
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
    const token = loggedInUser.access;

    fetch("http://127.0.0.1:8000/api/favourites/", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch favourites");
            }
            return response.json();
        })
        .then((favorites) => {
            console.log("Fetched favourites:", favorites);

            if (favorites.length === 0) {
                favContainer.innerHTML = `<p class="no-results">No recipes were added to your favourites.</p>`;
                return;
            }

            // fetch all recipes
            fetch("http://127.0.0.1:8000/api/recipes/")
                .then((res) => res.json())
                .then((recipes) => {
                    const favouriteRecipes = recipes.filter((recipe) =>
                        favorites.some((fav) => fav.recipe === recipe.id)
                    );

                    if (favouriteRecipes.length === 0) {
                        favContainer.innerHTML = `<p class="no-results">No recipes were added to your favourites.</p>`;
                        return;
                    }

                    favouriteRecipes.forEach((recipe) => {
                        const favItem = favorites.find((fav) => fav.recipe === recipe.id);

                        const recipeCard = document.createElement("div");
                        recipeCard.classList.add("recipe-card");

                        recipeCard.innerHTML = `
                            <img src="${recipe.image}" alt="${recipe.title}">
                            <h3>${recipe.title}</h3>
                            <button class="view-recipe-btn"><a href="../html/recipe.html?id=${recipe.id}">View Recipe</a></button>
                            <button class="remove-btn" data-id="${favItem.id}">Remove</button>
                        `;

                        favContainer.appendChild(recipeCard);
                    });

                    addRemoveListeners(token);
                });
        })
        .catch((error) => {
            console.error("Error fetching favourites:", error);
            favContainer.innerHTML = `<p class="error">Failed to load favourites. Please try again later.</p>`;
        });

    function addRemoveListeners(token) {
        const removeButtons = document.querySelectorAll(".remove-btn");
        removeButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const favId = button.getAttribute("data-id");

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
                        fetch(`http://127.0.0.1:8000/api/favourites/${favId}/`, {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json"
                            }
                        })
                            .then((res) => {
                                if (!res.ok) {
                                    throw new Error("Failed to remove from favourites");
                                }
                                button.closest(".recipe-card").remove();

                                if (document.querySelectorAll(".recipe-card").length === 0) {
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
                            })
                            .catch((error) => {
                                console.error("Remove error:", error);
                                Swal.fire({
                                    icon: "error",
                                    title: "Error",
                                    text: "Failed to remove from favourites. Please try again.",
                                });
                            });
                    }
                });
            });
        });
    }
});
