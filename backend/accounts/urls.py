from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RegisterViewSet, LoginViewSet, SavedCalculatorViewSet, NameView

router = DefaultRouter()
router.register('calculators', SavedCalculatorViewSet, basename='calculator')

urlpatterns = [
    path('register/', RegisterViewSet.as_view(), name='register'),
    path('login/', LoginViewSet.as_view(), name='login'),
    path('name/', NameView.as_view(), name='name'),
]

urlpatterns += router.urls