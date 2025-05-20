from django.urls import path
from . import views

urlpatterns = [
    path('', views.BroadcastListCreateView.as_view(), name='broadcast_list_create'),
] 