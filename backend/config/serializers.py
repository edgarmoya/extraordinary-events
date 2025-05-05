from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Actualizar el campo last_login
        user.last_login = timezone.now()
        user.save()

        token = super().get_token(user)

        # Añadir claims personalizados
        token['username'] = user.user_name
        return token