from django.apps import AppConfig

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'
    verbose_name = 'Administrar usuarios'

    def ready(self):
        # Importar señales para crear grupos y permisos
        import apps.users.signals