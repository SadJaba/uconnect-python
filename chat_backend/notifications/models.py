from django.db import models
from users.models import User

class Broadcast(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Трансляция'
        verbose_name_plural = 'Трансляции'
        ordering = ['-created_at']

    def __str__(self):
        return self.title
