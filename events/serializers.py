from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    entity_description = serializers.CharField(source='entity.description', read_only=True)
    event_type_description = serializers.CharField(source='event_type.description', read_only=True)
    created_by_username = serializers.CharField(source='created_by.user_name', read_only=True)
    closed_by_username = serializers.CharField(source='closed_by.user_name', read_only=True)
    occurrence_date_f = serializers.DateField(source='occurrence_date', format="%d-%m-%Y", read_only=True)
    created_date_f = serializers.DateTimeField(source='created_date', format="%d-%m-%Y (%I:%M %p)", read_only=True)

    class Meta:
        model = Event
        fields = fields = '__all__'