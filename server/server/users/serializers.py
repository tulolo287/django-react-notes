from .models import User
from rest_framework.serializers import ModelSerializer

class UserSerializer(ModelSerializer):
    class Mete:
        model = User
        fields = '__all__'