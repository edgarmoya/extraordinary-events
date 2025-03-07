from django.db import models

class Grade(models.Model):
    description = models.CharField(max_length=100, unique=True, verbose_name='Nombre')
    is_active = models.BooleanField(default=True, verbose_name='Activo')

    class Meta:
        verbose_name = 'Grado'
        verbose_name_plural = 'Grados'

    def __str__(self):
        return self.description
