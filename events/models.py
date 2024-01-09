from django.db import models
from classifications.models import Classification
from entities.models import Entity
from type_events.models import Type
from users.models import CustomUser


class Event(models.Model):
    OPEN = 'open'
    CLOSED = 'closed'
    STATUS_CHOICES = [
        (OPEN, 'Abierto'),
        (CLOSED, 'Cerrado'),
    ]
    RELEVANT = 'relevant'
    CORRUPTION = 'corruption'
    SCOPE_CHOICES = [
        (RELEVANT, 'Relevante'),
        (CORRUPTION, 'Corrupción'),
    ]

    synthesis = models.TextField(verbose_name='Síntesis', blank=False)
    cause = models.TextField(verbose_name='Causa',blank=True)
    scope = models.CharField(verbose_name='Alcance', max_length=10, choices=SCOPE_CHOICES, default=RELEVANT)
    occurrence_date = models.DateField(verbose_name='Fecha de ocurrencia', blank=False)
    classification = models.ForeignKey(Classification, on_delete=models.PROTECT, verbose_name='Clasificación')
    entity = models.ForeignKey(Entity, on_delete=models.PROTECT, blank=False, verbose_name='Entidad')
    event_type = models.ForeignKey(Type, on_delete=models.PROTECT, blank=False, verbose_name='Tipo de Hecho')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=OPEN, verbose_name='Estado')
    created_by = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name='opened_events', blank=False, null=False, verbose_name='Creado por')
    created_date = models.DateTimeField(auto_now_add=True, verbose_name='Fecha creado')
    closed_by = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name='closed_events', blank=True, null=True, verbose_name='Cerrado por')
    closed_date = models.DateTimeField(null=True, blank=True, verbose_name='Fecha cerrado')

    class Meta:
        verbose_name = 'Hecho extraordinario'
        verbose_name_plural = 'Hechos extraordinarios'

    def __str__(self):
        return self.synthesis


class Measure(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, verbose_name='Hecho')
    description = models.TextField(blank=False, verbose_name='Medida')

    class Meta:
        verbose_name = 'Medida'
        verbose_name_plural = 'Medidas'

    def __str__(self):
        return self.description


class Attachment(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, verbose_name='Hecho')
    image = models.ImageField(upload_to='attachments/', verbose_name='Imagen')

    class Meta:
        verbose_name = 'Adjunto'
        verbose_name_plural = 'Adjuntos'

    def __str__(self):
        return f"Adjunto del hecho {self.event.id}"


class EventLog(models.Model):
    event = models.ForeignKey(Event, on_delete=models.PROTECT, verbose_name='Evento')
    user = models.ForeignKey(CustomUser, on_delete=models.PROTECT, verbose_name='Usuario')
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Fecha')

    class Meta:
        verbose_name = 'Registro Hecho'
        verbose_name_plural = 'Registro Hechos'
        unique_together = (('event', 'user', 'timestamp'),)

    def __str__(self):
        return f"Modificación del hecho {self.event.id} por {self.user.user_name}"