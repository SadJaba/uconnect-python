from rest_framework import serializers
from .models import Broadcast
from users.serializers import UserSerializer

class BroadcastSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Broadcast
        fields = ('id', 'title', 'content', 'author', 'created_at', 'updated_at')
        read_only_fields = ('author',) 