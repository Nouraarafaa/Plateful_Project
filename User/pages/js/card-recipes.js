// Fetch recipes from a JSON file
document.addEventListener("DOMContentLoaded", () => {
    const cardsBody = document.querySelector(".cards-body");

  // Fetch data from recipes.json
    fetch("../../data/recipes.json")
    .then((response) => {
        if (!response.ok) {
        throw new Error("Failed to fetch recipes");
        }
    return response.json();
    })
    .then((recipes) => {
      // Generate recipe cards dynamically
        recipes.forEach((recipe) => {
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
    })
    .catch((error) => {
        console.error("Error loading recipes:", error);
        cardsBody.innerHTML = "<p>Failed to load recipes. Please try again later.</p>";
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