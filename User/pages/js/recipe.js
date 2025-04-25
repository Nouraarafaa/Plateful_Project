document.addEventListener("DOMContentLoaded", () => {
    // Extract the 'id' parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const recipeId = parseInt(params.get("id"));
    
        // Fetch the recipes JSON file
        fetch("../../data/recipes.json")
        .then((response) => {
            if (!response.ok) {
            throw new Error("Failed to fetch recipes");
            }
            return response.json();
        })
        .then((recipes) => {
            // Find the recipe with the matching ID
            const recipe = recipes.find((r) => r.id === recipeId);
            if (!recipe) {
            throw new Error("Recipe not found");
            }

            // Populate the HTML elements with the recipe data
            document.getElementById("recipe-title").textContent = recipe.title;
            document.getElementById("recipe-image").src = recipe.image;
            document.getElementById("recipe-image").alt = recipe.title;
            document.getElementById("recipe-description").textContent = recipe.descriptionCooking;
            document.getElementById("video-link").href = recipe["Watch Video"];

            // Populate the ingredients list
            const ingredientsList = document.getElementById("ingredients-list");
            ingredientsList.innerHTML = ""; // Clear any existing content
            recipe.ingrediants.forEach((ingredient) => {
            const li = document.createElement("li");
            li.textContent = `${ingredient.name}: ${ingredient.quantity}`;
            ingredientsList.appendChild(li);
            });

            // Populate the preparation steps
            const preparationSteps = recipe.steps;
            const stepsList = document.getElementById("preparation-steps");
            stepsList.innerHTML = ""; // Clear any existing content
            preparationSteps.forEach((step) => {
                const li = document.createElement("li");
                li.textContent = step.description;

                // Add click event to toggle completed state
                li.addEventListener("click", () => {
                    li.classList.toggle("completed");
                });
                stepsList.appendChild(li);
            });

            // populate the nutritional_info
            const nutritionalInfo = recipe.nutritional_info;
            const nutritionalInfoDiv = document.getElementById("nutritional-info");
            nutritionalInfoDiv.innerHTML = ""; // Clear any existing content
            for (const [key, value] of Object.entries(nutritionalInfo)) {
                const p = document.createElement("li");
                p.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
                nutritionalInfoDiv.appendChild(p);
            }

            

            // Trigger the animation for the sidebar
            const sidebarElements = document.querySelectorAll(".sidebar-right li, .sidebar-right p");
            sidebarElements.forEach((element, index) => {
                element.style.animationDelay = `${index * 0.2}s`; // Dynamic delay
            });
        })
        .catch((error) => {
            console.error("Error loading recipe:", error);
            document.querySelector(".content").innerHTML = "<p>Failed to load recipe. Please try again later.</p>";
            document.querySelector(".content").style.height = "50vh";
        });
    });