import requests
from .models import Recipe, Ingredient, Step

def import_external_recipes():
    response = requests.get("https://www.themealdb.com/api/json/v1/1/search.php?s=koshari")
    data = response.json()

    for item in data['meals']:
        title = item['strMeal']
        image = item['strMealThumb']
        description = item['strInstructions']
        category = [item['strCategory']]
        cuisine = item['strArea']
        video = item['strYoutube']

        # Ingredients
        ingredients = []
        for i in range(1, 21):
            name = item.get(f"strIngredient{i}")
            qty = item.get(f"strMeasure{i}")
            if name and name.strip():
                ing = Ingredient.objects.create(name=name, quantity=qty or "")
                ingredients.append(ing)

        # Steps
        steps = []
        for line in description.split("\n"):
            if line.strip():
                st = Step.objects.create(description=line.strip())
                steps.append(st)

        # Create recipe
        recipe = Recipe.objects.create(
            title=title,
            description=description[:100],
            image=image,
            rating=4.5,
            difficulty="Easy",
            category=category,
            cuisine=cuisine,
            preparation_time="15 mins",
            cooking_time="30 mins",
            total_time="45 mins",
            nutritional_info={"calories": "N/A"},
            watch_video=video,
            description_cooking=description
        )

        recipe.ingredients.add(*ingredients)
        recipe.steps.add(*steps)

    print("✅ Recipes imported successfully")