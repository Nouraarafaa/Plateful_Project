from rest_framework.generics import DestroyAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Complaint
from .serializers import ComplaintSerializer

class ComplaintCreateView(APIView):
    def post(self, request):
        serializer = ComplaintSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Complaint submitted successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ComplaintListView(APIView):
    def get(self, request):
        complaints = Complaint.objects.all()
        serializer = ComplaintSerializer(complaints, many=True)
        return Response(serializer.data)

class ComplaintDeleteView(DestroyAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer

INSTALLED_APPS = [
    # ...existing code...
    'corsheaders',
    # ...existing code...
]
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ...existing code...
]
CORS_ALLOW_ALL_ORIGINS = True  # For development only!