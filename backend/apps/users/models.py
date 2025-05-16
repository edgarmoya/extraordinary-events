from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager, Group
from apps.entities.models import Entity

class CustomUserManager(BaseUserManager):
    def create_superuser(self, user_name, first_name, last_name, password, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)

        if other_fields.get('is_staff') is not True:
            raise ValueError('Superuser must be assigned to is_staff=True')
        if other_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must be assigned to is_superuser=True')
        return self.create_user(user_name, first_name, last_name, password, **other_fields)

    def create_user(self, user_name, first_name, last_name, password, **other_fields):
        if not user_name:
            raise ValueError(_('Se debe asignar un nombre de usuario'))

        user = self.model(user_name=user_name, first_name=first_name, last_name=last_name, **other_fields)
        user.set_password(password)
        user.save()
        return user

# Modelo de usuario personalizado
class CustomUser(AbstractBaseUser, PermissionsMixin):
    user_name = models.CharField(max_length=150, unique=True, verbose_name='Usuario')
    first_name = models.CharField(max_length=150, verbose_name='Nombre')
    last_name = models.CharField(max_length=150, verbose_name='Apellidos')
    start_date = models.DateTimeField(default=timezone.now, verbose_name="Fecha de registro")
    is_staff = models.BooleanField(default=False, verbose_name='Acceso al panel de administración')
    is_active = models.BooleanField(default=True, verbose_name='Activo')
    groups = models.ManyToManyField(
        Group,
        through='CustomUserGroup',  # Usa la tabla intermedia personalizada
        related_name="custom_users"
    )
    user_permissions = None

    objects = CustomUserManager()

    USERNAME_FIELD = 'user_name'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        db_table = "user"
        permissions = []  # Evita que se creen permisos individuales
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return self.user_name

class Role(Group):
    class Meta:
        proxy = True
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'

# Modelo intermedio para relación Usuario-Entidad-Rol
class CustomUserGroup(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, verbose_name="Usuario")
    group = models.ForeignKey(Group, on_delete=models.CASCADE, verbose_name="Rol")
    entity = models.ForeignKey(Entity, on_delete=models.CASCADE, verbose_name="Entidad")

    class Meta:
        db_table = 'user_group'
        unique_together = ('user', 'group', 'entity')  # Evita duplicados
        verbose_name = "Rol por entidad"
        verbose_name_plural = "Roles por entidad"

    def __str__(self):
        return f"{self.user.user_name} - {self.group.name} - {self.entity.description}"