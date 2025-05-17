document.addEventListener("DOMContentLoaded", () => {
    // Extract the 'id' parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const recipeId = parseInt(params.get("id"));

    // اجلب الوصفة مباشرة من الـ backend
    fetch(`http://127.0.0.1:8000/api/recipes/${recipeId}/`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch recipe");
            }
            return response.json();
        })
        .then((recipe) => {
            displayRecipe(recipe);
        })
        .catch((error) => {
            console.error("Error loading recipe:", error);
            document.querySelector(".content").innerHTML = "<p>Failed to load recipe. Please try again later.</p>";
            document.querySelector(".content").style.height = "50vh";
        });

    function displayRecipe(recipe) {
        if (!recipe) {
            console.error("Recipe not found");
            document.querySelector(".content").innerHTML = "<p>Recipe not found.</p>";
            return;
        }

        // Populate the HTML elements with the recipe data
        document.getElementById("recipe-title").textContent = recipe.title;
        document.getElementById("recipe-image").src = recipe.image;
        document.getElementById("recipe-image").alt = recipe.title;
        document.getElementById("recipe-description").textContent = recipe.description; // أو recipe.descriptionCooking حسب اسم الحقل
        document.getElementById("video-link").href = recipe.watch_video || recipe.Watchvideo || "#";

        // Ingredients
        const ingredientsList = document.getElementById("ingredients-list");
        ingredientsList.innerHTML = "";
        (recipe.ingredients || []).forEach(ingredient => {
            const li = document.createElement("li");
            li.textContent = ingredient.name ? `${ingredient.name} - ${ingredient.quantity}` : ingredient;
            ingredientsList.appendChild(li);
        });

        // Preparation Steps
        const stepsList = document.getElementById("preparation-steps");
        stepsList.innerHTML = "";
        (recipe.steps || []).forEach(step => {
            const li = document.createElement("li");
            li.textContent = step.description || step;

            // Add click event to toggle completed state
            li.addEventListener("click", () => {
                li.classList.toggle("completed");
            });
            stepsList.appendChild(li);
        });

        // Nutritional Info
        const nutritionList = document.getElementById("nutritional-info");
        nutritionList.innerHTML = "";
        if (recipe.nutritional_info) {
            Object.entries(recipe.nutritional_info).forEach(([key, value]) => {
                const li = document.createElement("li");
                li.textContent = `${key}: ${value}`;
                nutritionList.appendChild(li);
            });
        }
        
         // Populate the cooking time
        const cookingTime = recipe.cooking_time;
        const cookingTimeDiv = document.getElementById("cooking-time");
        cookingTimeDiv.innerHTML = `${cookingTime}`;

        const stars = document.querySelectorAll("#user-rating i");
        const feedback = document.getElementById("rating-feedback");
        let selectedRating = 0;

        // get saved rating from local storage (avoid multiple ratings)
        const savedRating = localStorage.getItem(`recipe-rating-${recipeId}`);
        if (savedRating) {
            selectedRating = parseInt(savedRating);
            highlightStars(selectedRating);
            feedback.textContent = `You rated this recipe ${selectedRating} star(s)!`;
            disableStars(); // kill the stars' interactivity
        }

        // set rating
        stars.forEach((star) => {
            star.addEventListener("mouseover", () => {
                highlightStars(star.dataset.value)
            });

            star.addEventListener("mouseout", () => {
                // only reset stars if the rating still isn't set
                if(selectedRating==0)
                {
                resetStars();
                }
            });

            // set the rating on click
            star.addEventListener("click", () => {
                selectedRating = parseInt(star.dataset.value);
                //update product rating
                const sum = 5;
                const weightedSum_0 = sum * recipe.rating;
                recipe.rating = (weightedSum_0 + selectedRating)/(sum+1);
                feedback.textContent = `You rated this recipe ${selectedRating} star(s)!`;
                localStorage.setItem(`recipe-rating-${recipeId}`, selectedRating);
                disableStars(); 
                
            });
        });

        function highlightStars(value) {
            stars.forEach((star) => {
                if (parseInt(star.dataset.value) <= value) 
                {
                    star.classList.add("highlighted");
                } 
                else 
                {
                    star.classList.remove("highlighted");
                }
            });
        }

        function resetStars() {
            stars.forEach((star) => {
                star.classList.remove("highlighted");
            });
        }

        // kill the starts' interactivity
        function disableStars() {
            stars.forEach((star) => {
                star.style.pointerEvents = "none"; 
            });
        }


        // Trigger the animation for the sidebar
        const sidebarElements = document.querySelectorAll(".sidebar-right li, .sidebar-right p");
        sidebarElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.2}s`; // Dynamic delay
        });
    }
});