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
                <!-- Form fields here -->
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

            const updatedTime = document.getElementById("recipe-time").value;
            const updatedVideo = document.getElementById("recipe-video").value;

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
                // Update the recipe object
                recipeToEdit.title = updatedTitle;
                recipeToEdit.description = updatedDesc;
                recipeToEdit.nutritional_info = updatedNutritionalInfo;
                recipeToEdit.steps = updatedSteps;
                recipeToEdit.ingrediants = updatedIngredients;
                recipeToEdit.cooking_time = updatedTime;
                recipeToEdit.watchVideo = updatedVideo;

                // Save the updated recipes array back to local storage
                localStorage.setItem("recipes", JSON.stringify(recipes));

                // Show success message
                Swal.fire({
                    title: "Done!",
                    text: "Recipe updated successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: "swal-ok-btn"
                    },
                }).then(() => {
                    // Navigate to the recipes page
                    window.location.href = "../html/card-recipes.html";
                });
            }
        });
    }
});