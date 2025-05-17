from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecipeViewSet, FavoriteViewSet

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet)
router.register(r'favourites', FavoriteViewSet, basename='favorite')

urlpatterns = [
    path('', include(router.urls)),
    
]