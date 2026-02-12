from rest_framework.routers import DefaultRouter
from .views import ReplicaViewSet, AttachmentViewSet, AmmunitionViewSet, UserViewSet
from django.urls import path,include

router = DefaultRouter()
router.register('replicas', ReplicaViewSet, basename='replica')
router.register('attachments', AttachmentViewSet, basename='attachment')
router.register('ammunition', AmmunitionViewSet, basename='ammunition')
router.register('users', UserViewSet, basename='user')

urlpatterns = [
    path('',include(router.urls)),

]
