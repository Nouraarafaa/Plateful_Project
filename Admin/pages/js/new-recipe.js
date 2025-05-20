document.addEventListener("DOMContentLoaded", () => {
    const editCont = document.querySelector(".edit-container");

    displayRecipeContent();

    function displayRecipeContent() {
        const availableCategories = [
            "Egyptian",
            "Oriental",
            "Western",
            "Fast Food",
            "Grilled",
            "Seafood",
            "Pasta & Rice",
            "Soups",
            "Salads",
            "Desserts",
            "Drinks",
        ];

        editCont.innerHTML = `
            <h1>Add New Recipe</h1>
            <form class="edit-form" method="POST" id="edit-recipe-form" enctype="multipart/form-data">

                <label for="recipe-name">Recipe Name:</label>
                <input type="text" id="recipe-name" name="recipe-name" placeholder="It may be called..." required>

                <div class="image-edit-container">
                    <div class="image-edit">
                        <label for="recipe-image">Recipe Image:</label>
                        <input type="file" id="recipe-image" name="recipe-image">
                    </div>
                </div>

                <label for="recipe-desc">Recipe Description:</label>
                <input type="text" id="recipe-desc" name="recipe-desc" placeholder="How would you describe it?" required>

                <label for="category-select">Category:</label>
                <select id="category-select" name="category-select" required>
                    ${availableCategories.map(cat =>
                        `<option value="${cat}">${cat}</option>`
                    ).join("")}
                </select>

                <label for="How to prepare the recipe">How to prepare:</label>
                <textarea id="How to prepare the recipe" name="How to prepare the recipe" placeholder="step 1\nstep2\nstep3\netc..."></textarea>

                <label for="recipe-ingredients">Ingredients:</label>
                <textarea id="recipe-ingredients" name="recipe-ingredients" placeholder="ingredient1: this much\ningredient2: that much\netc..."></textarea>

                <label for="recipe-time">Cooking time (mins):</label>
                <input type="text" id="recipe-time" name="recipe-time" placeholder="10 minutes" required>

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
                <input type="url" id="recipe-video" name="recipe-video" placeholder="https://www.website.com (don’t forget the &quot;https://&quot;)">

                <button type="submit" class="save">Add Recipe</button>
            </form>
        `;

        const form = document.getElementById("edit-recipe-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Gather form values
            const setTitle = document.getElementById("recipe-name").value;
            const setDesc = document.getElementById("recipe-desc").value;
            const setSteps = document.getElementById("How to prepare the recipe").value
                .split('\n')
                .map((description, idx) => ({
                    id: idx + 1,
                    description: description.trim()
                }));
            const setIngredients = document.getElementById("recipe-ingredients").value
                .split('\n')
                .map((line, idx) => {
                    const [name, quantity] = line.split(':').map(part => part.trim());
                    return {
                        id: idx + 1,
                        name: name || "",
                        quantity: quantity || "1"
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
            const setCategory = [document.getElementById("category-select").value];

            const formData = new FormData();
            formData.append("title", setTitle);
            formData.append("description", setDesc);
            formData.append("nutritional_info", JSON.stringify(setNutritionalInfo));
            formData.append("steps", JSON.stringify(setSteps));
            formData.append("ingredients", JSON.stringify(setIngredients));
            formData.append("watch_video", setVideo);
            formData.append("cooking_time", setTime);
            formData.append("rating", 4.6);
            formData.append("difficulty", "Easy");
            formData.append("category", JSON.stringify(setCategory));
            formData.append("cuisine", "American");
            formData.append("preparation_time", "10 minutes");
            formData.append("total_time", "30 minutes");
            formData.append("description_cooking", "Default");

            // Only append image if a file is selected
            if (imageInput.files && imageInput.files[0]) {
                formData.append("image", imageInput.files[0]);
            }

            fetch("http://127.0.0.1:8000/api/recipes/", {
                method: "POST",
                body: formData
            })
            .then(res => {
                if (!res.ok) throw new Error("Failed to add recipe");
                return res.json();
            })
            .then(data => {
                Swal.fire({
                    title: "Success!",
                    text: "New recipe added successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: "swal-ok-btn"
                    },
                });
                form.reset();
            })
            .catch(err => {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to add recipe: " + err.message,
                    icon: "error",
                    confirmButtonText: "OK"
                });
            });
        });
    }
});