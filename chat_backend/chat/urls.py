from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'chatrooms', views.ChatRoomViewSet)
router.register(r'messages', views.MessageViewSet, basename='message')
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 