from django.apps import AppConfig

class LocationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.locations'
    verbose_name = 'Administrar Ubicaciones'

    def ready(self) -> None:
        import apps.locations.signals
