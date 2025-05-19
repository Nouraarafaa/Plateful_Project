from rest_framework import serializers
from .models import Recipe, Ingredient, Step, Favorite
import json

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'quantity']

class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ['id', 'description']

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True, required=False)
    steps = StepSerializer(many=True, required=False)

    class Meta:
        model = Recipe
        fields = '__all__'

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients', [])
        steps_data = validated_data.pop('steps', [])
        recipe = Recipe.objects.create(**validated_data)
        for ingredient in ingredients_data:
            ing_obj, _ = Ingredient.objects.get_or_create(**ingredient)
            recipe.ingredients.add(ing_obj)
        for step in steps_data:
            step_obj, _ = Step.objects.get_or_create(**step)
            recipe.steps.add(step_obj)
        return recipe

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('ingredients', None)
        steps_data = validated_data.pop('steps', None)

        # Only update the image if it's in validated_data
        image = validated_data.pop('image', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if image is not None:
            instance.image = image
        instance.save()

        # Update ingredients if provided
        if ingredients_data is not None:
            instance.ingredients.clear()
            for ingredient in ingredients_data:
                ing_obj, _ = Ingredient.objects.get_or_create(**ingredient)
                instance.ingredients.add(ing_obj)

        # Update steps if provided
        if steps_data is not None:
            instance.steps.clear()
            for step in steps_data:
                step_obj, _ = Step.objects.get_or_create(**step)
                instance.steps.add(step_obj)

        return instance
    def to_internal_value(self, data):
        data = data.copy()
        print("to_internal_value BEFORE:", data)
        parsed = {}
        for field in self.fields:
            value = data.get(field)
            if isinstance(value, list):
                value = value[0]
            if field in ['ingredients', 'steps', 'nutritional_info', 'category'] and isinstance(value, str):
                try:
                    loaded = json.loads(value)
                    if field in ['ingredients', 'steps', 'category']:
                        parsed[field] = loaded if isinstance(loaded, list) else []
                    else:
                        parsed[field] = loaded if isinstance(loaded, dict) else {}
                except Exception:
                    parsed[field] = [] if field in ['ingredients', 'steps', 'category'] else {}
            else:
                parsed[field] = value
        print("to_internal_value AFTER:", parsed)
        return super().to_internal_value(parsed)


class FavoriteSerializer(serializers.ModelSerializer):
    recipe_details = RecipeSerializer(source='recipe', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'recipe', 'recipe_details']
