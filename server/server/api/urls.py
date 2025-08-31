from django.urls import path, include
from . import views

urlpatterns = [
    path('tasks/', include('server.tasks.urls')),
    path('users/', include('server.users.urls')),
]
