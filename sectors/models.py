from django.db import models


# Create your models here.
class Sector(models.Model):
    description = models.CharField(max_length=255, verbose_name='Descripción')
    is_active = models.BooleanField(default=True, verbose_name='Activo')

    class Meta:
        verbose_name = 'Sector'
        verbose_name_plural = 'Sectores'

    def __str__(self):
        return self.description

