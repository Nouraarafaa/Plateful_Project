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
            // Highlight the category in the categories bar if it exists
            const categoryBar = document.querySelectorAll('.category-bar .category-item');
            let recipeCategory = Array.isArray(recipeToEdit.category)
                ? recipeToEdit.category[0]
                : recipeToEdit.category || "";

            categoryBar.forEach(item => {
                if (item.textContent.trim() === recipeCategory) {
                    item.classList.add("active");
                } else {
                    item.classList.remove("active");
                }
            });

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

        // Define available categories (you can fetch this from the backend if needed)
        const availableCategories = [
            "Egyptian",
            "Oriental",
            "Western",
            "Grilled",
            "Sea Food",
            "Pasta & Rice",
            "Soups",
            "Salads",
            "Desserts",
            "Drinks",
        ];

        // Get the current category (assume it's the first in the array if it's an array)
        let currentCategory = Array.isArray(recipeToEdit.category)
            ? recipeToEdit.category[0]
            : recipeToEdit.category || "";

        editCont.innerHTML = `
            <h1>Edit Recipe</h1>
            <form class="edit-form" method="POST" id="edit-recipe-form">

                <label for="recipe-name">Recipe Name:</label>
                <input type="text" id="recipe-name" name="recipe-name" 
                    value="${recipeToEdit.title}" 
                    placeholder="It may be called..." required>

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
                <input type="text" id="recipe-desc" name="recipe-desc" 
                    value="${recipeToEdit.description}" 
                    placeholder="How would you describe it?" required>

                <label for="category-select">Category:</label>
                <select id="category-select" name="category-select" required>
                    ${availableCategories.map(cat => 
                        `<option value="${cat}"${cat === currentCategory ? " selected" : ""}>${cat}</option>`
                    ).join("")}
                </select>

                <label for="How to prepare the recipe">How to prepare:</label>
                <textarea id="How to prepare the recipe" name="How to prepare the recipe"
                    placeholder="step 1\nstep2\nstep3\netc...">${recipeToEdit.steps ? recipeToEdit.steps.map(step => step.description).join('\n') : ''}</textarea>

                <label for="recipe-ingredients">Ingredients:</label>
                <textarea id="recipe-ingredients" name="recipe-ingredients"
                    placeholder="ingredient1: this much\ningredient2: that much\netc...">${recipeToEdit.ingredients ? recipeToEdit.ingredients.map(ingredient => {
                    const { name, quantity } = ingredient;
                    return quantity ? `${name}: ${quantity}` : `${name}: no specified quantity`;
                }).join('\n') : ''}</textarea>

                <label for="recipe-time">Cooking time (mins):</label>
                <input type="text" id="recipe-time" name="recipe-time" 
                    value="${recipeToEdit.cooking_time || ''}" 
                    placeholder="10 minutes" required>

                <label for="recipe-nut">Nutritional information:</label>
                <div class="nutritional-info-container">
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-calories">Calories (kcal):</label>
                        <input type="number" id="recipe-nut-calories" name="recipe-nut-calories" 
                            value="${recipeToEdit.nutritional_info?.calories || ''}" 
                            placeholder="10" required>
                    </div>
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-carbohydrates">Carbohydrates (g):</label>
                        <input type="number" id="recipe-nut-carbohydrates" name="recipe-nut-carbohydrates" 
                            value="${recipeToEdit.nutritional_info?.carbohydrates || ''}" 
                            placeholder="10" required>
                    </div>
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-protein">Protein (g):</label>
                        <input type="number" id="recipe-nut-protein" name="recipe-nut-protein" 
                            value="${recipeToEdit.nutritional_info?.protein || ''}" 
                            placeholder="10" required>
                    </div>
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-fat">Fat (g):</label>
                        <input type="number" id="recipe-nut-fat" name="recipe-nut-fat" 
                            value="${recipeToEdit.nutritional_info?.fat || ''}" 
                            placeholder="10" required>
                    </div>
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-fiber">Fiber (g):</label>
                        <input type="number" id="recipe-nut-fiber" name="recipe-nut-fiber" 
                            value="${recipeToEdit.nutritional_info?.fiber || ''}" 
                            placeholder="10" required>
                    </div>
                </div>

                <label for="recipe-video">Recipe Video URL:</label>
                <input type="url" id="recipe-video" name="recipe-video" 
                    value="${recipeToEdit.watch_video || ''}" 
                    placeholder="https://www.website.com (don’t forget the &quot;https://&quot;)">

                <button type="submit" class="save">Save Changes</button>
            </form>
        `;

        const form = document.getElementById("edit-recipe-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Gather updated values
            const updatedTitle = document.getElementById("recipe-name").value;
            const updatedDesc = document.getElementById("recipe-desc").value;
            const stepsValue = document.getElementById("How to prepare the recipe").value.trim();
            const ingredientsValue = document.getElementById("recipe-ingredients").value.trim();
            const updatedCategory = [document.getElementById("category-select").value];

            if (!stepsValue) {
                alert("Please enter at least one step for the recipe.");
                return;
            }
            if (!ingredientsValue) {
                alert("Please enter at least one ingredient for the recipe.");
                return;
            }

            const updatedSteps = stepsValue.split('\n').map((description, index) => ({
                id: index + 1,
                description: description.trim()
            }));
            const updatedIngredients = ingredientsValue.split('\n').map((line, idx) => {
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
                if (res.status === 204) return {}; // No Content, treat as success
                return res.json();
            })
            .then(data => {
                Swal.fire({
                    title: "Success!",
                    text: "Recipe updated successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: "swal-ok-btn"
                    }
                });
            })
            .catch(err => {
                Swal.fire({
                    title: "Error!",
                    text: "Error updating recipe: " + err.message,
                    icon: "error",
                    confirmButtonText: "OK"
                });
            });
        });
    }
});