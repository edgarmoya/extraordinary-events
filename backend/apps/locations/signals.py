from django.db.models.signals import post_migrate
from django.core.management import call_command
from django.dispatch import receiver
from django.apps import apps

@receiver(post_migrate)
def load_initial_data(sender, **kwargs):
    if sender.name == "locations":  # Solo se ejecuta para la app 'locations'
        if apps.get_model('locations', 'Province').objects.count() == 0:  # Evita duplicados
            print("Cargando provincias desde fixtures...")
            call_command('loaddata', 'provinces.json')

        if apps.get_model('locations', 'Municipality').objects.count() == 0:  # Evita duplicados
            print("Cargando municipios desde fixtures...")
            call_command('loaddata', 'municipality.json')