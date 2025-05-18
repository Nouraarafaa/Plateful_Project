document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = parseInt(urlParams.get("id"));
    const editCont = document.querySelector(".edit-container");

    // Fetch the recipe from the Django REST API
    fetch(`http://127.0.0.1:8000/api/recipes/${recipeId}/`)
        .then(res => {
            if (!res.ok) throw new Error("Recipe not found");
            return res.json();
        })
        .then(recipeToEdit => {
            displayRecipeContent(recipeToEdit);
        })
        .catch(err => {
            console.error("Error loading recipe:", err);
            editCont.innerHTML = `<p class="error">Failed to load recipe. Please try again later.</p>`;
        });

    function displayRecipeContent(recipeToEdit) {
        editCont.innerHTML = ""; // Clear the container

        if (!recipeToEdit) {
            editCont.innerHTML = `<p class="no-results">No recipe found for this ID.</p>`;
            return;
        }

        editCont.innerHTML = `
            <h1>Edit Recipe</h1>
            <form class="edit-form" method="POST" id="edit-recipe-form">

                <label for="recipe-name">Recipe Name:</label>
                <input type="text" id="recipe-name" name="recipe-name" value="${recipeToEdit.title}" required>

                <div class="image-edit-container">
                    <div class="image-preview">
                        <img src="${recipeToEdit.image}" alt="Recipe Image">
                    </div>
                    <div class="image-edit">
                        <label for="recipe-image">Recipe Image:</label>
                        <input type="file" id="recipe-image" name="recipe-image">
                    </div>
                </div>

                <label for="recipe-desc">Recipe Description:</label>
                <input type="text" id="recipe-desc" name="recipe-desc" value="${recipeToEdit.description}" required>

                <label for="How to prepare the recipe">How to prepare:</label>
                <textarea id="How to prepare the recipe" name="How to prepare the recipe">${recipeToEdit.steps ? recipeToEdit.steps.map(step => step.description).join('\n') : ''}</textarea>

                <label for="recipe-ingredients">Ingredients:</label>
                <textarea id="recipe-ingredients" name="recipe-ingredients">${recipeToEdit.ingredients ? recipeToEdit.ingredients.map(ingredient => {
                    const { name, quantity } = ingredient;
                    return quantity ? `${name}: ${quantity}` : `${name}: no specified quantity`;
                }).join('\n') : ''}</textarea>

                <label for="recipe-time">Cooking time (mins):</label>
                <input type="text" id="recipe-time" name="recipe-time" value="${recipeToEdit.cooking_time || ''}" required>

                <label for="recipe-nut">Nutritional information:</label>
                <div class="nutritional-info-container">
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-calories">Calories (kcal):</label>
                        <input type="number" id="recipe-nut-calories" name="recipe-nut-calories" value="${recipeToEdit.nutritional_info?.calories || ''}" required>
                    </div>
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-carbohydrates">Carbohydrates (g):</label>
                        <input type="number" id="recipe-nut-carbohydrates" name="recipe-nut-carbohydrates" value="${recipeToEdit.nutritional_info?.carbohydrates || ''}" required>
                    </div>
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-protein">Protein (g):</label>
                        <input type="number" id="recipe-nut-protein" name="recipe-nut-protein" value="${recipeToEdit.nutritional_info?.protein || ''}" required>
                    </div>
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-fat">Fat (g):</label>
                        <input type="number" id="recipe-nut-fat" name="recipe-nut-fat" value="${recipeToEdit.nutritional_info?.fat || ''}" required>
                    </div>
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-fiber">Fiber (g):</label>
                        <input type="number" id="recipe-nut-fiber" name="recipe-nut-fiber" value="${recipeToEdit.nutritional_info?.fiber || ''}" required>
                    </div>
                </div>

                <label for="recipe-video">Recipe Video URL:</label>
                <input type="url" id="recipe-video" name="recipe-video" value="${recipeToEdit.watchVideo || ''}">

                <button type="submit" class="save">Save Changes</button>
            </form>
        `;

        const form = document.getElementById("edit-recipe-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Gather updated values
            const updatedTitle = document.getElementById("recipe-name").value;
            const updatedDesc = document.getElementById("recipe-desc").value;
            const updatedSteps = document.getElementById("How to prepare the recipe").value.split('\n').map((description, index) => ({
                id: index + 1,
                description: description.trim()
            }));
            const updatedIngredients = document.getElementById("recipe-ingredients").value.split('\n').map((line, idx) => {
                const [name, quantity] = line.split(':').map(part => part.trim());
                return {
                    id: idx + 1,
                    name: name || "",
                    quantity: quantity || "1"
                };
            });
            const updatedNutritionalInfo = {
                calories: parseInt(document.getElementById("recipe-nut-calories").value, 10),
                carbohydrates: parseInt(document.getElementById("recipe-nut-carbohydrates").value, 10),
                protein: parseInt(document.getElementById("recipe-nut-protein").value, 10),
                fat: parseInt(document.getElementById("recipe-nut-fat").value, 10),
                fiber: parseInt(document.getElementById("recipe-nut-fiber").value, 10)
            };
            const updatedTime = document.getElementById("recipe-time").value;
            const updatedVideo = document.getElementById("recipe-video").value;
            const imageInput = document.getElementById("recipe-image");

            // Add any other required fields here
            const updatedCategory = ["Fast Food"]; // Or get from a select/input if needed
            const updatedDifficulty = "Easy"; // Or get from a select/input if needed
            const updatedCuisine = "American"; // Or get from a select/input if needed
            const updatedPreparationTime = "10 minutes";
            const updatedTotalTime = "30 minutes";
            const updatedDescriptionCooking = "Default";
            const updatedRating = 4.6;

            // Use FormData for PATCH (including image if changed)
            const formData = new FormData();
            formData.append("title", updatedTitle);
            formData.append("description", updatedDesc);
            formData.append("steps", JSON.stringify(updatedSteps));
            formData.append("ingredients", JSON.stringify(updatedIngredients));
            formData.append("cooking_time", updatedTime);
            formData.append("nutritional_info", JSON.stringify(updatedNutritionalInfo));
            formData.append("watch_video", updatedVideo);
            formData.append("category", JSON.stringify(updatedCategory));
            formData.append("difficulty", updatedDifficulty);
            formData.append("cuisine", updatedCuisine);
            formData.append("preparation_time", updatedPreparationTime);
            formData.append("total_time", updatedTotalTime);
            formData.append("description_cooking", updatedDescriptionCooking);
            formData.append("rating", updatedRating);

            // Only append image if a new file is selected
            if (imageInput.files && imageInput.files[0]) {
                formData.append("image", imageInput.files[0]);
            }

            fetch(`http://127.0.0.1:8000/api/recipes/${recipeId}/`, {
                method: "PATCH",
                body: formData
            })
            .then(res => {
                if (!res.ok) throw new Error("Failed to update recipe");
                return res.json();
            })
            .then(data => {
                alert("Recipe updated successfully!");
                // Optionally, redirect or update the UI
            })
            .catch(err => {
                alert("Error updating recipe: " + err.message);
            });
        });
    }
});