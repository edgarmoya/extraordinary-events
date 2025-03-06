from django.db import models

# Create your models here.
class Province(models.Model):
    description = models.CharField(max_length=100, unique=True, verbose_name='Nombre')
    is_active = models.BooleanField(default=True, verbose_name='Activo')

    class Meta:
        verbose_name = 'Provincia'
        verbose_name_plural = 'Provincias'

    def __str__(self):
        return self.description

class Municipality(models.Model):
    description = models.CharField(max_length=100, verbose_name='Nombre')
    province = models.ForeignKey(Province, on_delete=models.CASCADE, verbose_name='Provincia')
    is_active = models.BooleanField(default=True, verbose_name='Activo')

    class Meta:
        verbose_name = 'Muncipio'
        verbose_name_plural = 'Municipios'

    def __str__(self):
        return self.description
