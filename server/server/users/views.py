from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from .models import User
from ..users.serializers import UserSerializer


@api_view()
def user(request: Request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
