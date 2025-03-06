from django.apps import AppConfig


class AdditionalFieldConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "additional_fields"
    verbose_name = "Campos adicionales"