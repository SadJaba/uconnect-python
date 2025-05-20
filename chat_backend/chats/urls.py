from django.urls import path
from . import views

urlpatterns = [
    path('rooms/', views.ChatRoomListCreateView.as_view(), name='chat_room_list_create'),
    path('rooms/<int:room_id>/messages/', views.MessageListCreateView.as_view(), name='message_list_create'),
] 