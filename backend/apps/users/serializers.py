from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    password = serializers.CharField(min_length=8, write_only=True)
    last_login = serializers.DateTimeField(format="%d-%m-%Y (%I:%M %p)", read_only=True)
    start_date = serializers.DateTimeField(format="%d-%m-%Y (%I:%M %p)", read_only=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'user_name', 'first_name', 'last_name', 'password', 'last_login', 'start_date', 'is_staff', 'is_active')
        extra_kwargs = {'password': {'write_only': True}} # Para que la contraseña no se lea

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=False, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    confirm_new_password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        """
        Valida que la nueva contraseña y la confirmación de la nueva contraseña sean iguales.
        """
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError({"detail": "Las contraseñas no coinciden"})
        
        # Si no es administrador, la contraseña actual es obligatoria
        is_admin = self.context.get('is_admin', False)
        if not is_admin and 'old_password' not in data:
            raise serializers.ValidationError("Debe proporcionar la contraseña actual para cambiarla.")

        return data