from rest_framework import serializers
from .models import AdditionalField, EventFieldValue

class AdditionalFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdditionalField
        fields = '__all__'

class EventFieldValueSerializer(serializers.ModelSerializer):
    add_field_description = serializers.CharField(source='add_field.description', read_only=True)

    class Meta:
        model = EventFieldValue
        fields = '__all__'