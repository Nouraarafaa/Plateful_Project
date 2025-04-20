
document.addEventListener("DOMContentLoaded", () => {
    const favContainer = document.querySelector(".recipes");
    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

    if (favourites.length === 0) {
        favContainer.innerHTML = "<p>No recipes were added to your favourites.</p>";
        return;
    }

    // Render favourite recipes
    favourites.forEach((recipe, index) => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <button><a href="../html/recipe.html?id=${recipe.id}">View Recipe</a></button>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;

        favContainer.appendChild(recipeCard);
    });

    // Add event listeners to remove buttons
    const removeButtons = document.querySelectorAll(".remove-btn");
removeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        const index = event.target.getAttribute("data-index");
        favourites.splice(index, 1);
        localStorage.setItem("favourites", JSON.stringify(favourites));

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
        if (favourites.length === 0) {
            const favContainer = document.querySelector(".recipes");
            favContainer.innerHTML = "<p>No recipes were added to your favourites.</p>";
        }
    });
});
});