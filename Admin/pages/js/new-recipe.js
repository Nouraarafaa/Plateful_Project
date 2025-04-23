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
                <input type="text" id="recipe-name" name="recipe-name" required>

                <label for="recipe-name">Recipe Description:</label>
                <input type="text" id="recipe-desc" name="recipe-desc" required>

                <div class="image-edit-container">
                    <div class="image-edit">
                        <label for="recipe-image">Recipe Image:</label>
                        <input type="file" id="recipe-image" name="recipe-image">
                    </div>
                </div>
                <label for="How to prepare the recipe">How to prepare:</label>
                <textarea id="How to prepare the recipe" name="How to prepare the recipe"></textarea>

                <label for="recipe-ingredients">Ingredients:</label>
                <textarea id="recipe-ingredients" name="recipe-ingredients"></textarea>

                <label for="recipe-video">Recipe Video URL:</label>
                <input type="url" id="recipe-video" name="recipe-video">

                <button type="submit" class="save">Add Recipe</button>
            </form>
        `;


        const form = document.getElementById("edit-recipe-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // Prevent the default form submission behavior

            // Get values from the form
            const newTitle = document.getElementById("recipe-name").value;
            const newDesc = document.getElementById("recipe-desc").value;
            const newSteps = document.getElementById("How to prepare the recipe").value.split('\n').map((description, index) => ({
                id: index + 1,
                description: description.trim()
            }));
            const newIngredients = document.getElementById("recipe-ingredients").value.split('\n').map(line => {
                const [name, quantity] = line.split(':').map(part => part.trim());
                return { 
                    name: name || "", 
                    quantity: quantity || "" 
                };
            });
            const newVideo = document.getElementById("recipe-video").value;
            const imageInput = document.getElementById("recipe-image");

            if (imageInput.files && imageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const newImage = e.target.result; // Base64 string of the image
            
                    // Create a new recipe object (with image)
                    const newRecipe = {
                        id: recipes.length > 0 ? Math.max(...recipes.map(recipe => recipe.id)) + 1 : 1, // Set ID to previous max ID + 1
                        title: newTitle,
                        description: newDesc,
                        steps: newSteps,
                        ingrediants: newIngredients,
                        watchVideo: newVideo,
                        image: newImage
                    };
            
                    // Update recipes array
                    recipes.push(newRecipe);
            
                    // Update local storage
                    localStorage.setItem("recipes", JSON.stringify(recipes));
            
                    alert("New recipe added successfully!");
            
                    // Reset the form
                    form.reset();
                };
                reader.readAsDataURL(imageInput.files[0]); // Convert the file to a Base64 string
            } else {
                // Create a new recipe object (no image)
                const newRecipe = {
                    id: recipes.length > 0 ? Math.max(...recipes.map(recipe => recipe.id)) + 1 : 1, // Set ID to previous max ID + 1
                    title: newTitle,
                    description: newDesc,
                    steps: newSteps,
                    ingrediants: newIngredients,
                    watchVideo: newVideo,
                    image: "" // No image provided
                };
            
                // Update recipes array
                recipes.push(newRecipe);
            
                // Update local storage
                localStorage.setItem("recipes", JSON.stringify(recipes));
            
                alert("New recipe added successfully!");
            
                // Reset the form
                form.reset();
            }
        });
    }
});