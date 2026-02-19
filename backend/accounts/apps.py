from django.apps import AppConfig
from django.conf import settings
from django.contrib.auth import get_user_model

class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = 'accounts'

    def ready(self):
        User = get_user_model()
        username = settings.ADMIN_USERNAME
        email = settings.ADMIN_EMAIL
        password = settings.ADMIN_PASSWORD
        first_name = getattr(settings, "ADMIN_FIRST_NAME", "")
    
        if not username or not password:
            return
        
        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
            )




