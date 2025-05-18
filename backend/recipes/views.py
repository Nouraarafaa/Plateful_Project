from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Recipe, Favorite
from .serializers import RecipeSerializer, FavoriteSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.db import models
import json

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = [
        'title', 'cuisine', 'difficulty',
        'ingredients__name', 'ingredients__quantity',
        'steps__description'
    ]

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            # فلترة recipes التي تحتوي category فيها على القيمة المطلوبة
            queryset = queryset.filter(category__icontains=category)
        cuisine = self.request.query_params.get('cuisine')
        if cuisine:
            queryset = queryset.filter(cuisine__icontains=cuisine)
        difficulty = self.request.query_params.get('difficulty')
        if difficulty:
            queryset = queryset.filter(difficulty__icontains=difficulty)
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) |
                models.Q(cuisine__icontains=search) |
                models.Q(difficulty__icontains=search) |
                models.Q(ingredients__name__icontains=search) |
                models.Q(ingredients__quantity__icontains=search) |
                models.Q(steps__description__icontains=search) |
                models.Q(category__icontains=search)
            ).distinct()
        return queryset
    def update(self, request, **kwargs):
        # PUT or PATCH?
        partial = kwargs.pop('partial', False)
        # what id was passed in the request? return its current data
        currentData = self.get_object()
        # load new data from request
        serializer = self.get_serializer(currentData, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        # update old data in the database
        self.perform_update(serializer)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        print(request.data)
        return super().create(request, *args, **kwargs)

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)