document.addEventListener("DOMContentLoaded", () => {
    const cardsBody = document.querySelector(".cards-body");
    const categoryItems = document.querySelectorAll(".category-item, .subcategory-item");
    let allRecipes = [];

    // Check if recipes exist in localStorage
    const storedRecipes = localStorage.getItem("recipes");

    if (storedRecipes) {
        // Load recipes from localStorage
        console.log("Loading recipes from localStorage...");
        allRecipes = JSON.parse(storedRecipes);
        displayRecipes(allRecipes);
    } else {
        // Fetch recipes from JSON file and store them in localStorage
        console.log("Fetching recipes from JSON file...");
        fetch("../../data/recipes.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch recipes");
                }
                return response.json();
            })
            .then((recipes) => {
                console.log("Recipes fetched:", recipes);
                allRecipes = recipes;

                // update local storage
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
        const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
        cardsBody.innerHTML = "";

        if (recipes.length === 0) {
            cardsBody.innerHTML = `<p class="no-results">No recipes found for this category.</p>`;
            return;
        }

        recipes.forEach((recipe) => {
            console.log("Displaying recipe:", recipe);
            const card = document.createElement("div");
            card.classList.add("card");

            const isFavourite = favourites.some((fav) => fav.id === recipe.id);

            card.innerHTML = `
                <div class="card-image">
                    <img src="${recipe.image}" alt="${recipe.title}">
                </div>
                <div class="card-content">
                    <h2>${recipe.title}</h2>
                    <p>${recipe.description}</p>
                    <div class="reviews">
                        <span>${recipe.rating.toFixed(1)}</span>
                        <span>
                            ${generateStars(recipe.rating)}
                        </span>
                    </div>
                </div>
                <div class="card-action">
                    <a href="../html/recipe.html?id=${recipe.id}" class="view-recipe-btn">View Recipe</a>
                    <button class="addFavourites ${isFavourite ? "active" : ""}" data-id="${recipe.id}">
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
            `;

            cardsBody.appendChild(card);
        });

        const favButtons = document.querySelectorAll(".addFavourites");
        favButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

                if (!isLoggedIn) {
                    Swal.fire({
                        icon: "warning",
                        title: "Login Required",
                        text: "You must log in first to add recipes to favourites.",
                        confirmButtonText: "Login",
                        confirmButtonColor: "#2d1c0a"
                    }).then(() => {
                        window.location.href = "../../../Login & Register/pages/html/userAuth.html"; 
                    });
                    return;
                }

                let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
                const recipeId = parseInt(button.getAttribute("data-id"));
                const recipe = allRecipes.find((r) => r.id === recipeId);

                if (button.classList.contains("active")) {
                    favourites = favourites.filter((fav) => fav.id !== recipeId);
                    localStorage.setItem("favourites", JSON.stringify(favourites));
                    button.classList.remove("active");

                    Swal.fire({
                        title: "Recipe removed from your favourites.",
                        text: "You can add it again anytime.",
                        icon: "warning",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#2d1c0a"
                    });
                } else {
                    favourites.push(recipe);
                    localStorage.setItem("favourites", JSON.stringify(favourites));
                    button.classList.add("active");

                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Recipe has been added to your Favourites Successfully!",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            });
        });
    }

    categoryItems.forEach((item) => {
        item.addEventListener("click", () => {
            var selectedCategory = item.textContent.trim();
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

    

    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        var halfStar = 0;
        if (rating%1>=0.5)
        {
            halfStar=1;
        }
        const emptyStars = 5 - fullStars - halfStar;
        let starsHTML = "";
    
        for (let i = 0; i < fullStars; i++) 
        {
            starsHTML += `<i class="fa-solid fa-star filled-star"></i>`;
        }
        if (halfStar) {
            starsHTML += `<i class="fa-solid fa-star-half-stroke half-star"></i>`;
        }
        for (let i = 0; i < emptyStars; i++) 
        {
            starsHTML += `<i class="fa-solid fa-star empty-star"></i>`;
        }
    
        return starsHTML;
    }

    
});