from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Broadcast
from .serializers import BroadcastSerializer

# Create your views here.

class BroadcastListCreateView(generics.ListCreateAPIView):
    queryset = Broadcast.objects.all()
    serializer_class = BroadcastSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
