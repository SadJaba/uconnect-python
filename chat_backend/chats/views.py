from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer

# Create your views here.

class ChatRoomListCreateView(generics.ListCreateAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        chat_room = serializer.save()
        chat_room.participants.add(self.request.user)

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        room_id = self.kwargs.get('room_id')
        return Message.objects.filter(chat_room_id=room_id)

    def perform_create(self, serializer):
        room_id = self.kwargs.get('room_id')
        serializer.save(
            chat_room_id=room_id,
            sender=self.request.user
        )
