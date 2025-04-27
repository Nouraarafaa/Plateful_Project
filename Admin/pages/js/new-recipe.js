document.addEventListener("DOMContentLoaded", () => {
    const editCont = document.querySelector(".edit-container");
    const storedRecipes = localStorage.getItem("recipes");

    if (storedRecipes) {
        const recipes = JSON.parse(storedRecipes) || []; //The || is added in case the stored recipes array is empty
        console.log("Loaded recipes from local storage:", recipes);

        displayRecipeContent(recipes);
    } else {
        // Fetch recipes from JSON file and save to local storage
        fetch("../../../User/data/recipes.json")
            .then(res => res.json())
            .then(recipes => {
                console.log("Fetched recipes from JSON file:", recipes);

                // Save recipes to local storage
                localStorage.setItem("recipes", JSON.stringify(recipes));

                displayRecipeContent(recipes);
            })
            .catch(err => {
                console.error("Error loading recipes:", err);
                editCont.innerHTML = `<p class="error">Failed to load the recipes to add to. Please try again later.</p>`;
            });
    }

    function displayRecipeContent(recipes) {
        editCont.innerHTML = ""; 


        editCont.innerHTML = `
            <h1>Add New Recipe</h1>
            <form class="edit-form" method="POST" id="edit-recipe-form">

                <label for="recipe-name">Recipe Name:</label>
                <input type="text" id="recipe-name" name="recipe-name" placeholder="It may be called..." required>

                <div class="image-edit-container">
                    <div class="image-edit">
                        <label for="recipe-image">Recipe Image:</label>
                        <input type="file" id="recipe-image" name="recipe-image">
                    </div>
                </div>

                <label for="recipe-name">Recipe Description:</label>
                <input type="text" id="recipe-desc" name="recipe-desc" placeholder="How would you describe it?" required>

                <label for="How to prepare the recipe">How to prepare:</label>
                <textarea id="How to prepare the recipe" name="How to prepare the recipe" placeholder="step 1\nstep2\nstep3\netc..."></textarea>

                <label for="recipe-ingredients">Ingredients:</label>
                <textarea id="recipe-ingredients" name="recipe-ingredients" placeholder="ingredient1: this much\ningredient2: that much\netc..."></textarea>

                <label for="recipe-time">Cooking time (mins):</label>
                <input type="text" id="recipe-time" name="recipe-time" placeholder="10 minutes" required>

                                <label for="recipe-name">Recipe Description:</label>
                <input type="text" id="recipe-desc" name="recipe-desc" placeholder="How would you describe it?" required>

                <label for="recipe-nut">Nutritional information:</label>
                <div class="nutritional-info-container">
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-calories">Calories (kcal):</label>
                        <input type="number" id="recipe-nut-calories" name="recipe-nut-calories" placeholder="10" required>
                    </div>
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-carbohydrates">Carbohydrates (g):</label>
                        <input type="number" id="recipe-nut-carbohydrates" name="recipe-nut-carbohydrates" placeholder="10" required>
                    </div>
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-protein">Protein (g):</label>
                        <input type="number" id="recipe-nut-protein" name="recipe-nut-protein" placeholder="10" required>
                    </div>
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-fat">Fat (g):</label>
                        <input type="number" id="recipe-nut-fat" name="recipe-nut-fat" placeholder="10" required>
                    </div>
                    <div class="nutritional-info-box">
                        <label for="recipe-nut-fiber">Fiber (g):</label>
                        <input type="number" id="recipe-nut-fiber" name="recipe-nut-fiber" placeholder="10" required>
                    </div>
                </div>

                <label for="recipe-video">Recipe Video URL:</label>
                <input type="url" id="recipe-video" name="recipe-video" placeholder="https://www.website.com (don’t forget the &quot;https://&quot;)"">

                <button type="submit" class="save">Add Recipe</button>
            </form>
        `;


        const form = document.getElementById("edit-recipe-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // Prevent the default form submission behavior

            // Get values from the form
            const setTitle = document.getElementById("recipe-name").value;
            const setDesc = document.getElementById("recipe-desc").value;
            const setSteps = document.getElementById("How to prepare the recipe").value.split('\n').map((description, index) => ({
                id: index + 1,
                description: description.trim()
            }));
            const setIngredients = document.getElementById("recipe-ingredients").value.split('\n').map(line => {
                const [name, quantity] = line.split(':').map(part => part.trim());
                return { 
                    name: name || "", 
                    quantity: quantity || "" 
                };
            });
            const setNutritionalInfo = {
                calories: parseInt(document.getElementById("recipe-nut-calories").value, 10),
                carbohydrates: parseInt(document.getElementById("recipe-nut-carbohydrates").value, 10),
                protein: parseInt(document.getElementById("recipe-nut-protein").value, 10),
                fat: parseInt(document.getElementById("recipe-nut-fat").value, 10),
                fiber: parseInt(document.getElementById("recipe-nut-fiber").value, 10)
            };
            
            const setTime = document.getElementById("recipe-time").value;
            const setVideo = document.getElementById("recipe-video").value;
            const imageInput = document.getElementById("recipe-image");

            if (imageInput.files && imageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const setImage = e.target.result; // Base64 string of the image
            
                    // Create a new recipe object (with image)
                    const newRecipe = {
                        id: recipes.length > 0 ? Math.max(...recipes.map(recipe => recipe.id)) + 1 : 1, // Set ID to previous max ID + 1
                        title: setTitle,
                        description: setDesc,
                        nutritional_info: setNutritionalInfo,
                        steps: setSteps,
                        ingrediants: setIngredients,
                        watchVideo: setVideo,
                        image: setImage,
                        cooking_time: setTime,
                        rating: 4.6
                    };
            
                    // Update recipes array
                    recipes.push(newRecipe);
            
                    // Update local storage
                    localStorage.setItem("recipes", JSON.stringify(recipes));
            
                    // Show success message
                    Swal.fire({
                        title: "Success!",
                        text: "New recipe added successfully!",
                        icon: "success",
                        confirmButtonText: "OK",
                    customClass: {
                        confirmButton: "swal-ok-btn"
                    },
                    });
            
                    // Reset the form
                    form.reset();
                };
                reader.readAsDataURL(imageInput.files[0]); // Convert the file to a Base64 string
            } else {
                // Create a new recipe object (no image)
                const newRecipe = {
                    id: recipes.length > 0 ? Math.max(...recipes.map(recipe => recipe.id)) + 1 : 1, // Set ID to previous max ID + 1
                    title: setTitle,
                    description: setDesc,
                    steps: setSteps,
                    ingrediants: setIngredients,
                    nutritional_info: setNutritionalInfo,
                    cooking_time: setTime,
                    watchVideo: setVideo,
                    image: "",
                    rating: 4.6
                };
            
                // Update recipes array
                recipes.push(newRecipe);
            
                // Update local storage
                localStorage.setItem("recipes", JSON.stringify(recipes));
            
                // Show success message
                Swal.fire({
                    title: "Success!",
                    text: "New recipe is added successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: "swal-ok-btn"
                    },
                });
                // Reset the form
                form.reset();
            }
        });
    }
});