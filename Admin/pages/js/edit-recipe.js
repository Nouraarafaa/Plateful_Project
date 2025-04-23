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
                <label for="How to prepare the recipe">How to prepare:</label>
                
                <textarea id="How to prepare the recipe" name="How to prepare the recipe">${recipeToEdit.steps.map(step => step.description).join('\n')}
                </textarea>

                <label for="recipe-ingredients">Ingredients:</label>
                <textarea id="recipe-ingredients" name="recipe-ingredients">
    ${recipeToEdit.ingrediants.map(ingredient => {
        const { name, quantity } = ingredient;
        return quantity ? `${name}: ${quantity}` : name;
    }).join('\n')}
</textarea>

                <label for="recipe-video">Recipe Video URL:</label>
                <input type="url" id="recipe-video" name="recipe-video" value="${recipeToEdit.watchVideo}">

                <button type="submit" class="save">Save Changes</button>
            </form>
        `;

        // Add event listener to handle form submission
        const form = document.getElementById("edit-recipe-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // Prevent the default form submission behavior

            // Get updated values from the form
            const updatedTitle = document.getElementById("recipe-name").value;
            const updatedSteps = document.getElementById("How to prepare the recipe").value.split('\n').map((description, index) => ({
                id: index + 1,
                description: description.trim()
            }));
            const updatedIngredients = document.getElementById("recipe-ingredients").value.split('\n').map(line => {
                const [name, quantity] = line.split(':').map(part => part.trim());
                return { 
                    name: name || "", // Default to an empty string if name is undefined
                    quantity: quantity || "" // Default to an empty string if quantity is undefined
                };
            });
            const updatedVideo = document.getElementById("recipe-video").value;

            // Update the recipe object
            recipeToEdit.title = updatedTitle;
            recipeToEdit.steps = updatedSteps;
            recipeToEdit.ingrediants = updatedIngredients;
            recipeToEdit.watchVideo = updatedVideo;

            // Save the updated recipes array back to local storage
            localStorage.setItem("recipes", JSON.stringify(recipes));

            // Provide feedback to the user
            alert("Recipe updated successfully!");
        });
    }
});
