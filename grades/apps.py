from django.apps import AppConfig

class GradesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'grades'
    verbose_name = 'Administrar Grados'

    def ready(self) -> None:
        import grades.signals
