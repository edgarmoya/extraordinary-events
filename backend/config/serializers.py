from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone
from rest_framework import exceptions
from django.contrib.auth import authenticate
from apps.users.models import UserSession
from datetime import timedelta

def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0]
    return request.META.get("REMOTE_ADDR")

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    SESSION_TIMEOUT_HOURS = 1

    @classmethod
    def get_token(cls, user):
        # Actualizar el campo last_login
        user.last_login = timezone.now()
        user.save()

        token = super().get_token(user)

        # Añadir claims personalizados
        token['username'] = user.user_name
        return token

    def validate(self, attrs):
        """Validar login, bloquear si first_login=True y personalizar errores"""
        credentials = {"user_name": attrs["user_name"], "password": attrs["password"]}
        request = self.context["request"]
        ip = get_client_ip(request)

        # Buscar usuario antes de autenticar
        from django.contrib.auth import get_user_model
        User = get_user_model()
        user_instance  = User.objects.filter(user_name=credentials["user_name"]).first()

        if not user_instance:
            raise exceptions.AuthenticationFailed({"detail": "Usuario o contraseña incorrectos"})

        # Si el usuario está bloqueado, verificar si el tiempo ya pasó
        if user_instance.lock_until and user_instance.lock_until > timezone.now():
            lock_time_local = timezone.localtime(user_instance.lock_until)  # Convierte a la hora local
            raise exceptions.AuthenticationFailed(
                {"detail": f"Cuenta bloqueada. Inténtelo nuevamente después de las {lock_time_local.strftime('%H:%M:%S')}"}
            )

        # Autenticar usuario
        user_authenticated = authenticate(**credentials)

        if not user_authenticated:
            # Incrementar intentos fallidos
            user_instance.failed_attempts += 1
            if user_instance.failed_attempts >= 3:
                user_instance.lock_until = timezone.now() + timezone.timedelta(minutes=5)  # Bloquea por 5 minutos
            user_instance.save()
            raise exceptions.AuthenticationFailed({"detail": "Usuario o contraseña incorrectos"})

        if not user_authenticated.is_active:
            raise exceptions.AuthenticationFailed("Cuenta inactiva. Contacte al administrador")

        existing_session = UserSession.objects.filter(user=user_authenticated).first()
        if existing_session:
            session_expired = existing_session.created_at + timedelta(hours=self.SESSION_TIMEOUT_HOURS) < timezone.now()
            print(f"{existing_session.created_at + timedelta(hours=self.SESSION_TIMEOUT_HOURS)} < {timezone.now()}")

            if session_expired:
                existing_session.delete()
            elif existing_session.ip_address != ip:
                raise exceptions.AuthenticationFailed(
                    {"detail": "Ya existe una sesión activa desde otra estación de trabajo"}
                )

        # Si todo está bien, guardar o actualizar la IP
        UserSession.objects.update_or_create(
            user=user_authenticated,
            defaults={"ip_address": ip}
        )

        # Si inicia sesión correctamente, resetear intentos fallidos
        user_authenticated.failed_attempts = 0
        user_authenticated.lock_until = None
        user_authenticated.save()

        # Generar respuesta con el token
        data = super().validate(attrs)

        # Agregar información a la respuesta
        data["first_login"] = user_authenticated.first_login
        data["user_id"] = user_authenticated.id
        return data