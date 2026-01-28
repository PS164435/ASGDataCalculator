from django.apps import AppConfig
from django.conf import settings
from django.contrib.auth.models import User

class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = 'accounts'

    def ready(self):
        username = settings.ADMIN_USERNAME
        email = settings.ADMIN_EMAIL
        password = settings.ADMIN_PASSWORD
    
        if not username or not password:
            return
        
        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )

