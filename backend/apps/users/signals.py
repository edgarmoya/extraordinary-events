from django.contrib.auth.models import Group, Permission
from django.db.models.signals import post_migrate
from django.dispatch import receiver

@receiver(post_migrate)
def create_groups_and_permissions(sender, **kwargs):
    """Crea los grupos y asigna permisos dinámicamente al iniciar Django"""

    roles_permissions = {
        "consultor": ["view_event","view_grade","view_measure","view_sector","view_entity","view_attachment","view_type","view_classification","view_additionalfield","view_eventfieldvalue","view_province","view_municipality"],
        "administrador": ["add_customuser","change_customuser","delete_customuser","view_customuser","add_role","change_role","delete_role","view_role","add_customusergroup","change_customusergroup","delete_customusergroup","view_customusergroup","add_province","change_province","delete_province","view_province","add_municipality","change_municipality","delete_municipality","view_municipality","add_grade","change_grade","delete_grade","view_grade","add_sector","change_sector","delete_sector","view_sector","add_entity","change_entity","delete_entity","view_entity","add_type","change_type","delete_type","view_type","add_classification","change_classification","delete_classification","view_classification","add_additionalfield","change_additionalfield","delete_additionalfield","view_additionalfield"],
        "operador": ["add_event","change_event","delete_event","view_event","add_measure","change_measure","delete_measure","view_measure","add_attachment","change_attachment","delete_attachment","view_attachment","view_province","view_municipality","view_grade","view_sector","view_entity","view_type","view_classification","view_additionalfield","add_eventfieldvalue","change_eventfieldvalue","delete_eventfieldvalue","view_eventfieldvalue"],
    }

    for role, perms in roles_permissions.items():
        group, _ = Group.objects.get_or_create(name=role)  # Crea grupo si no existe
        permission_objects = Permission.objects.filter(codename__in=perms)
        group.permissions.set(permission_objects)  # Asigna permisos