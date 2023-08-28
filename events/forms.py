from django import forms
from classifications.models import Classification
from entities.models import Entity
from type_events.models import Type
from .models import Event


class EventAdminForm(forms.ModelForm):
    class Meta:
        model = Event
        fields = ('occurrence_date', 'synthesis', 'cause', 'scope', 'status', 
                    'entity', 'classification', 'event_type')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        active_classifications = Classification.objects.filter(is_active=True)
        active_entities = Entity.objects.filter(is_active=True)
        active_types = Type.objects.filter(is_active=True)
        self.fields['classification'].queryset = active_classifications
        self.fields['entity'].queryset = active_entities
        self.fields['event_type'].queryset = active_types