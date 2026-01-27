from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import SavedCalculator
from .serializers import RegisterSerializer, LoginSerializer, SavedCalculatorSerializer


class RegisterViewSet(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            token = Token.objects.create(user=user)

            return Response({
                "message": "Użytkownik utworzony",
                "token": token.key
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginViewSet(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"error": next(iter(serializer.errors.values()))[0]},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "Użytkownik nie istnieje"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=user.username, password=password)
        if not user:
            return Response(
                {"error": "Błędne hasło"},
                status=status.HTTP_400_BAD_REQUEST
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "message": "Zalogowano",
            "token": token.key,
        },
        status=status.HTTP_200_OK
    )

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
            "first_name": request.user.first_name,
        })

