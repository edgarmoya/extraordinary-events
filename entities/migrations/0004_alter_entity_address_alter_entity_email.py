# Generated by Django 4.2.3 on 2023-08-06 19:57

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('entities', '0003_alter_entity_address_alter_entity_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entity',
            name='address',
            field=models.TextField(blank=True, default=django.utils.timezone.now, verbose_name='Dirección'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='entity',
            name='email',
            field=models.EmailField(blank=True, max_length=254, verbose_name='Correo electrónico'),
        ),
    ]