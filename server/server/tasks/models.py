
from django.db import models
from ..users.models import User

class Task(models.Model):
    name = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)