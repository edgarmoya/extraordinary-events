# Generated by Django 4.2 on 2025-01-30 22:05

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        (
            "additional_fields",
            "0003_rename_eventadditionalfieldvalue_eventfieldvalue_and_more",
        ),
    ]

    operations = [
        migrations.AlterField(
            model_name="additionalfield",
            name="field_type",
            field=models.CharField(
                choices=[("text", "Texto"), ("number", "Número"), ("date", "Fecha")],
                max_length=10,
                verbose_name="Tipo de campo",
            ),
        ),
    ]
