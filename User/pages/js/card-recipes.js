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

    const searchInput = document.querySelector(".search input");
    searchInput.addEventListener("keydown", function (event) {
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
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const token = loggedInUser?.access;

        cardsBody.innerHTML = "";

        if (recipes.length === 0) {
            cardsBody.innerHTML = `<p class="no-results">No recipes found for this category.</p>`;
            return;
        }

        if (!token) {
            renderCards(recipes, []);
            return;
        }

        // Get user favourites from API
        fetch("http://127.0.0.1:8000/api/favourites/", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(favourites => {
                renderCards(recipes, favourites);
            })
            .catch(err => {
                console.error("Failed to fetch favourites:", err);
                renderCards(recipes, []);
            });
    }

    function renderCards(recipes, favourites) {
        cardsBody.innerHTML = "";

        recipes.forEach((recipe) => {
            const fav = favourites.find(f => f.recipe === recipe.id);
            const isFavourite = !!fav;

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
                        <span>${recipe.rating.toFixed(1)}</span>
                        <span>${generateStars(recipe.rating)}</span>
                    </div>
                </div>
                <div class="card-action">
                    <a href="../html/recipe.html?id=${recipe.id}" class="view-recipe-btn">View Recipe</a>
                    <button class="addFavourites ${isFavourite ? "active" : ""}" data-recipe-id="${recipe.id}" data-fav-id="${fav?.id || ""}">
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
            `;

            cardsBody.appendChild(card);
        });

        const favButtons = document.querySelectorAll(".addFavourites");
        favButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
                if (!loggedInUser || !loggedInUser.access) {
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

                const token = loggedInUser.access;
                const recipeId = button.getAttribute("data-recipe-id");
                const favId = button.getAttribute("data-fav-id");

                if (button.classList.contains("active")) {
                    // Remove from favourites (DELETE)
                    fetch(`http://127.0.0.1:8000/api/favourites/${favId}/`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                        .then((res) => {
                            if (!res.ok) throw new Error("Failed to remove favourite");
                            button.classList.remove("active");
                            button.removeAttribute("data-fav-id");
                            Swal.fire({
                                title: "Recipe removed from your favourites.",
                                text: "You can add it again anytime.",
                                icon: "warning",
                                confirmButtonText: "OK",
                                confirmButtonColor: "#2d1c0a"
                            });
                        })
                        .catch(err => {
                            console.error(err);
                            Swal.fire("Error", "Could not remove from favourites", "error");
                        });

                } else {
                    // Add to favourites (POST)
                    fetch(`http://127.0.0.1:8000/api/favourites/`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ recipe: recipeId })
                    })
                        .then(res => res.json())
                        .then(data => {
                            button.classList.add("active");
                            button.setAttribute("data-fav-id", data.id);
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Recipe has been added to your Favourites Successfully!",
                                showConfirmButton: false,
                                timer: 1500,
                            });
                        })
                        .catch(err => {
                            console.error(err);
                            Swal.fire("Error", "Could not add to favourites", "error");
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