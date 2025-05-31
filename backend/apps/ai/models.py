from django.db import models

class ModelKey(models.Model):
    api_key = models.CharField(max_length=255, verbose_name="Llave")
    model_name = models.CharField(max_length=255, verbose_name="Modelo")

    class Meta:
        db_table = 'model_key'
        verbose_name = 'Llave de modelo'
        verbose_name_plural = 'Llaves de modelos'

    def __str__(self):
        return self.model_name
