from django.urls import path
from .views import ComplaintCreateView, ComplaintListView, ComplaintDeleteView

urlpatterns = [
    path('complaint/', ComplaintCreateView.as_view(), name='complaint-create'),
    path('complaints/', ComplaintListView.as_view(), name='complaint-list'),
    path('complaints/delete/<int:pk>/', ComplaintDeleteView.as_view(), name='complaint-delete'),
]
