from django.db import models

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


#     from django.db import connection
# with connection.cursor() as cursor:
#     cursor.execute("DELETE FROM django_migrations WHERE app IN ('auth', 'admin', 'users')")
#     cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
#     print(cursor.fetchall())  # This shows all your tables to confirm we're working with the right DB
# exit()


# # with connection.cursor() as cursor:
#     cursor.execute("DROP TABLE IF EXISTS auth_user;")
#     cursor.execute("DROP TABLE IF EXISTS auth_group;")
#     cursor.execute("DROP TABLE IF EXISTS auth_permission;")
#     cursor.execute("DROP TABLE IF EXISTS auth_group_permissions;")
#     cursor.execute("DROP TABLE IF EXISTS auth_user_groups;")
#     cursor.execute("DROP TABLE IF EXISTS auth_user_user_permissions;")
#     cursor.execute("DROP TABLE IF EXISTS django_admin_log;")
#     cursor.execute("DROP TABLE IF EXISTS token_blacklist_blacklistedtoken;")


# with connection.cursor() as cursor:

#     cursor.execute("DROP TABLE IF EXISTS token_blacklist_outstandingtoken;")
#     cursor.execute("DROP TABLE IF EXISTS token_blacklist_blacklistedtoken;")