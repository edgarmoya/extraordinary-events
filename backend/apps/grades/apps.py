from django.apps import AppConfig

class GradesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.grades'
    verbose_name = 'Administrar Grados'

    def ready(self) -> None:
        import apps.grades.signals
