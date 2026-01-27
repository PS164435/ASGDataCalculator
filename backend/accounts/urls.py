from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterViewSet, SavedCalculatorViewSet, NameView
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

router = DefaultRouter()
router.register('calculators', SavedCalculatorViewSet, basename='calculator')

urlpatterns = [
    path('register/', RegisterViewSet.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('name/', NameView.as_view(), name='name'),
    path('', include(router.urls)),
]

urlpatterns += router.urls