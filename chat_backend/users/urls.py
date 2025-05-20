from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', obtain_auth_token, name='login'),
    path('user/', views.get_current_user, name='current_user'),
    path('user/update/', views.update_profile, name='update_profile'),
    path('change-password/', views.change_password, name='change_password'),
] 