from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from .models import SavedCalculator
from .serializers import RegisterSerializer, SavedCalculatorSerializer, LoginSerializer

class RegisterViewSet(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({
                "message": "Użytkownik utworzony",
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginViewSet(TokenObtainPairView):
    serializer_class = LoginSerializer

class SavedCalculatorViewSet(ModelViewSet):
    serializer_class = SavedCalculatorSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return SavedCalculator.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class NameView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "first_name": request.user.first_name,
        })

