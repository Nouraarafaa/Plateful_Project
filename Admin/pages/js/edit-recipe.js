document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = parseInt(urlParams.get("id"));
    const editCont = document.querySelector(".edit-container");

    // Check if recipes exist in local storage
    const storedRecipes = localStorage.getItem("recipes");

    if (storedRecipes) {
        // Use recipes from local storage
        const recipes = JSON.parse(storedRecipes);
        console.log("Loaded recipes from local storage:", recipes);

        const recipeToEdit = recipes.find(recipe => recipe.id === recipeId);
        if (recipeToEdit) {
            displayRecipeContent(recipeToEdit, recipes);
        } else {
            editCont.innerHTML = `<p class="no-results">No recipe found for this ID.</p>`;
        }
    } else {
        // Fetch recipes from JSON file and save to local storage
        fetch("../../../User/data/recipes.json")
            .then(res => res.json())
            .then(recipes => {
                console.log("Fetched recipes from JSON file:", recipes);

                // Save recipes to local storage
                localStorage.setItem("recipes", JSON.stringify(recipes));

                const recipeToEdit = recipes.find(recipe => recipe.id === recipeId);
                if (recipeToEdit) {
                    displayRecipeContent(recipeToEdit, recipes);
                } else {
                    editCont.innerHTML = `<p class="no-results">No recipe found for this ID.</p>`;
                }
            })
            .catch(err => {
                console.error("Error loading recipes:", err);
                editCont.innerHTML = `<p class="error">Failed to load recipes. Please try again later.</p>`;
            });
    }

    function displayRecipeContent(recipeToEdit, recipes) {
        editCont.innerHTML = ""; // Clear the container

        if (!recipeToEdit) {
            editCont.innerHTML = `<p class="no-results">No recipe found for this ID.</p>`;
            return;
        }

        console.log("Displaying recipe:", recipeToEdit);
        editCont.innerHTML = `
            <h1>Edit Recipe</h1>
            <form class="edit-form" method="POST" id="edit-recipe-form">

                <label for="recipe-name">Recipe Name:</label>
                <input type="text" id="recipe-name" name="recipe-name" value="${recipeToEdit.title}" placeholder="It may be called..." required>

                <label for="recipe-desc">Recipe Description:</label>
                <input type="text" id="recipe-desc" name="recipe-desc" value="${recipeToEdit.description}" placeholder="How would you describe it?" required>

                <label for="recipe-nut">Nutritional information:</label>
                <div class="nutritional-info-container">
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-calories">Calories (kcal):</label>
                        <input type="number" id="recipe-nut-calories" name="recipe-nut-calories" value="${recipeToEdit.nutritional_info.calories}" placeholder="10" required>
                    </div>
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-carbohydrates">Carbohydrates (g):</label>
                        <input type="number" id="recipe-nut-carbohydrates" name="recipe-nut-carbohydrates" value="${recipeToEdit.nutritional_info.carbohydrates}" placeholder="10" required>
                    </div>
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-protein">Protein (g):</label>
                        <input type="number" id="recipe-nut-protein" name="recipe-nut-protein" value="${recipeToEdit.nutritional_info.protein}" placeholder="10" required>
                    </div>
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-fat">Fat (g):</label>
                        <input type="number" id="recipe-nut-fat" name="recipe-nut-fat" value="${recipeToEdit.nutritional_info.fat}" placeholder="10" required>
                    </div>
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-fiber">Fiber (g):</label>
                        <input type="number" id="recipe-nut-fiber" name="recipe-nut-fiber" value="${recipeToEdit.nutritional_info.fiber}" placeholder="10" required>
                    </div>
                </div>

                <div class="image-edit-container">
                    <div class="image-preview">
                        <img src="${recipeToEdit.image}" alt="Recipe Image">
                    </div>
                    <div class="image-edit">
                        <label for="recipe-image">Recipe Image:</label>
                        <input type="file" id="recipe-image" name="recipe-image">
                    </div>
                </div>
                <label for="How to prepare the recipe">How to prepare:</label>
                
                <textarea id="How to prepare the recipe" name="How to prepare the recipe" placeholder="step 1\nstep2\nstep3\netc...">${recipeToEdit.steps.map(step => step.description).join('\n')}</textarea>

                <label for="recipe-ingredients">Ingredients:</label>
                <textarea id="recipe-ingredients" name="recipe-ingredients" placeholder="ingredient1: this much\ningredient2: that much\netc...">${recipeToEdit.ingrediants.map(ingredient => {
    const { name, quantity } = ingredient;
    return quantity ? `${name}: ${quantity}` : `${name}: no specified quantity`;
}).join('\n')}</textarea>

                <label for="recipe-time">Cooking time (mins):</label>
                <input type="text" id="recipe-time" name="recipe-time" value="${recipeToEdit.cooking_time}" placeholder="10 minutes" required>

                <label for="recipe-video">Recipe Video URL:</label>
                <input type="url" id="recipe-video" name="recipe-video" value="${recipeToEdit.watchVideo}" placeholder="https://www.website.com (don’t forget the &quot;https://&quot;)"">

                <button type="submit" class="save">Save Changes</button>
            </form>
        `;

        const form = document.getElementById("edit-recipe-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // Prevent the default form submission behavior

            // Get updated values from the form
            const updatedTitle = document.getElementById("recipe-name").value;
            const updatedDesc = document.getElementById("recipe-desc").value;
            const updatedSteps = document.getElementById("How to prepare the recipe").value.split('\n').map((description, index) => ({
                id: index + 1,
                description: description.trim()
            }));
            const updatedIngredients = document.getElementById("recipe-ingredients").value.split('\n').map(line => {
                const [name, quantity] = line.split(':').map(part => part.trim());
                return { 
                    name: name, 
                    quantity: quantity 
                };
            });

            const updatedNutritionalInfo = {
                calories: parseInt(document.getElementById("recipe-nut-calories").value, 10),
                carbohydrates: parseInt(document.getElementById("recipe-nut-carbohydrates").value, 10),
                protein: parseInt(document.getElementById("recipe-nut-protein").value, 10),
                fat: parseInt(document.getElementById("recipe-nut-fat").value, 10),
                fiber: parseInt(document.getElementById("recipe-nut-fiber").value, 10)
            };

            const imageInput = document.getElementById("recipe-image");
                if (imageInput.files && imageInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        recipeToEdit.image = e.target.result; // Save the Base64 string
                        saveUpdatedRecipe();
                    };
                    reader.readAsDataURL(imageInput.files[0]); // Convert the file to a Base64 string
                } else {
                    saveUpdatedRecipe();
                }

                function saveUpdatedRecipe() {
                    // Save the updated recipes array back to local storage
                    localStorage.setItem("recipes", JSON.stringify(recipes));
                    alert("Recipe updated successfully!");
                }
                const updatedTime = document.getElementById("recipe-time").value;
            const updatedVideo = document.getElementById("recipe-video").value;

            // Update the recipe object
            recipeToEdit.title = updatedTitle;
            recipeToEdit.description = updatedDesc
            recipeToEdit.nutritional_info = updatedNutritionalInfo
            recipeToEdit.steps = updatedSteps;
            recipeToEdit.ingrediants = updatedIngredients;
            recipeToEdit.cooking_time = updatedTime;
            recipeToEdit.watchVideo = updatedVideo;

            // Save the updated recipes array back to local storage
            localStorage.setItem("recipes", JSON.stringify(recipes));

            alert("Recipe updated successfully!");
        });
    }
});