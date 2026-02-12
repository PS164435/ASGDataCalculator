from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from .models import SavedCalculator
from .serializers import RegisterSerializer, SavedCalculatorSerializer, LoginSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User

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

class LoginViewSet(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response (serializer.errors, status=400)
        return Response (serializer.validated_data, status=200)

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

class UsersViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all().order_by('email')
    serializer_class = UsersSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

class SavedCalculatorsViewSet(viewsets.ModelViewSet):
    queryset = SavedCalculators.objects.all().order_by('id')
    serializer_class = SavedCalculatorsSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]










