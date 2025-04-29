from django.db import models
from apps.sectors.models import Sector
from apps.locations.models import Municipality
from django.core.validators import RegexValidator

# Create your models here.
class Entity(models.Model):
    digits_only = RegexValidator(r'^\d+$', 'El código debe contener solo dígitos.')

    id_entity = models.CharField(primary_key=True,  max_length=6,
                                validators=[digits_only], verbose_name='Código')
    description = models.CharField(max_length=255, verbose_name='Descripción')
    municipality = models.ForeignKey(Municipality, on_delete=models.PROTECT, verbose_name='Municipio')
    sector = models.ForeignKey(Sector, on_delete=models.PROTECT, verbose_name='Sector')
    email = models.EmailField(blank=True, null=True, verbose_name="Correo electrónico")
    address = models.TextField(blank=True, null=True, verbose_name='Dirección')
    is_active = models.BooleanField(default=True, verbose_name='Activo')

    class Meta:
        verbose_name = 'Entidad'
        verbose_name_plural = 'Entidades'

    def __str__(self):
        return self.description
