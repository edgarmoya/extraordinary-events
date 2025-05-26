from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from django.utils.timezone import now, timedelta
from apps.users.models import CustomUser
from rest_framework import status
from rest_framework.response import Response

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer