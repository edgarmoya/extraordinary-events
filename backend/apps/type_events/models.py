from django.db import models

# Create your models here.
class Type(models.Model):
    description = models.CharField(max_length=255, verbose_name='Descripción')
    is_catastrophic = models.BooleanField(default=False, verbose_name='Catastrófico')
    is_active = models.BooleanField(default=True, verbose_name='Activo')

    class Meta:
        verbose_name = 'Tipo'
        verbose_name_plural = 'Tipos'

    def __str__(self):
        return self.description    
