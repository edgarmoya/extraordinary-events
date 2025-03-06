from django.db.models.signals import post_migrate
from django.core.management import call_command
from django.dispatch import receiver
from django.apps import apps

@receiver(post_migrate)
def load_initial_data(sender, **kwargs):
    if sender.name == "grades":
        if apps.get_model('grades', 'Grade').objects.count() == 0:  # Evita duplicados
            print("Cargando grados desde fixtures...")
            call_command('loaddata', 'grades.json')