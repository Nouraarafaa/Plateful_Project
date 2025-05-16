from django.db import models

# Create your models here.
class Ingredient(models.Model):
    name = models.CharField(max_length=100)
    quantity = models.CharField(max_length=50)

class Step(models.Model):
    description = models.TextField()

class Recipe(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='recipes/images/')
    rating = models.FloatField()
    difficulty = models.CharField(max_length=50)
    category = models.JSONField()
    cuisine = models.CharField(max_length=50)
    preparation_time = models.CharField(max_length=50)
    cooking_time = models.CharField(max_length=50)
    total_time = models.CharField(max_length=50)
    nutritional_info = models.JSONField()
    watch_video = models.URLField(blank=True, null=True)
    description_cooking = models.TextField()

    ingredients = models.ManyToManyField(Ingredient)
    steps = models.ManyToManyField(Step)
