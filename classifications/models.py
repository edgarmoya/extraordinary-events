from django.db import models
from grades.models import Grade 

# Create your models here.
class Classification(models.Model):
    description = models.TextField(max_length=255, verbose_name='Descripción')
    grade = models.ForeignKey(Grade, on_delete=models.PROTECT, verbose_name='Grado')
    is_active = models.BooleanField(default=True, verbose_name='Activo')

    class Meta:
        verbose_name = 'Clasificación'
        verbose_name_plural = 'Clasificaciones'

    def __str__(self):
        return self.description