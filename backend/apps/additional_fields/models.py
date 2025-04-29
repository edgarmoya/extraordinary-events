from django.db import models
from apps.events.models import Event

class AdditionalField(models.Model):
    TYPE_CHOICES = [
        ('text', 'Texto'),
        ('number', 'Número'),
        ('date', 'Fecha'),
    ]

    description = models.CharField(max_length=255, unique=True, verbose_name="Descripción")
    field_type = models.CharField(max_length=10, choices=TYPE_CHOICES, verbose_name="Tipo de campo")
    is_active = models.BooleanField(default=True, verbose_name="Activo")

    class Meta:
        verbose_name = 'Campo adicional'
        verbose_name_plural = 'Campos adicionales'

    def __str__(self):
        return self.description

class EventFieldValue(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, verbose_name="Hecho")
    add_field = models.ForeignKey(AdditionalField, on_delete=models.PROTECT, verbose_name="Campo adicional")
    value = models.TextField(verbose_name="Valor")

    class Meta:
        verbose_name = 'Valor de campo adicional'
        verbose_name_plural = 'Valores de campos adicionales'
        constraints = [
            models.UniqueConstraint(fields=['event', 'add_field'], name='unique_event_field')
        ]

    def __str__(self):
        return f"{self.add_field.description}: {self.value}"
