from django.contrib.auth.models import User
from rest_framework import serializers
from .models import SavedCalculator

class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True, error_messages={
        "blank": "Nazwa nie może być pusta",
        "required": "Błąd przesłania danych [username]",
    })
    email = serializers.EmailField(required=True, error_messages={
        "blank": "Email nie może być pusty",
        "required": "Błąd przesłania danych [email]",
        "invalid": "Email jest błędny",
    })
    password = serializers.CharField(write_only=True, required=True, error_messages={
        "blank": "Hasło nie może być puste",
        "required": "Błąd przesłania danych [password]",
    })
    repeatPassword = serializers.CharField(write_only=True,required=True, error_messages={
        "blank": "Należy powtórzyć hasło",
        "required": "Błąd przesłania danych [repeatPassword]",
    })

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'repeatPassword']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Ten email jest już zajęty")
        return value

    def validate(self, data):
        if data['password'] != data['repeatPassword']:
            raise serializers.ValidationError("Hasła nie są takie same")
        return data

    def create(self, validated_data):
        password = validated_data['password']
        validated_data.pop('repeatPassword')

        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=password,
            first_name=validated_data['username'],
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, error_messages={
        "blank": "Email nie może być pusty",
        "required": "Błąd przesłania danych [email]",
        "invalid": "Email jest błędny",
    })
    password = serializers.CharField(required=True, error_messages={
        "blank": "Hasło nie może być puste",
        "required": "Błąd przesłania danych [password]",
    })

class SavedCalculatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedCalculator
        fields = ['id', 'name', 'data', 'created_at']
