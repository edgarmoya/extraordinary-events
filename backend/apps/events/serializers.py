import base64
from rest_framework import serializers
from .models import Event, Measure, Attachment
from apps.additional_fields.models import EventFieldValue
from apps.additional_fields.serializers import EventFieldValueSerializer
from django.db import transaction

class MeasureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Measure
        exclude = ['event']

class AttachmentSerializer(serializers.ModelSerializer):
    data = serializers.SerializerMethodField(read_only=True)  # Para enviar base64 al cliente
    data_base64 = serializers.CharField(write_only=True, required=False)  # Para recibir base64 del cliente

    class Meta:
        model = Attachment
        exclude = ['event']

    def get_data(self, obj):
        if obj.data:
            return base64.b64encode(obj.data).decode('utf-8')
        return None

    def validate(self, attrs):
        # Si se envía base64 para data, decodificarla y asignar al campo binary
        base64_data = attrs.pop('data_base64', None)
        if base64_data:
            attrs['data'] = base64.b64decode(base64_data)
        return attrs

class EventSerializer(serializers.ModelSerializer):
    entity_description = serializers.CharField(source='entity.description', read_only=True)
    event_type_description = serializers.CharField(source='event_type.description', read_only=True)
    created_by_username = serializers.CharField(source='created_by.user_name', read_only=True)
    closed_by_username = serializers.CharField(source='closed_by.user_name', read_only=True)
    occurrence_date_f = serializers.DateField(source='occurrence_date', format="%d-%m-%Y", read_only=True)
    created_date_f = serializers.DateTimeField(source='created_date', format="%d-%m-%Y (%H:%M)", read_only=True)
    closed_date_f = serializers.DateTimeField(source='closed_date', format="%d-%m-%Y (%H:%M)", read_only=True)

    measures = MeasureSerializer(many=True, required=False)
    attachments = AttachmentSerializer(many=True, required=False)
    fields = EventFieldValueSerializer(many=True, required=False)

    class Meta:
        model = Event
        fields = '__all__'

    def create(self, validated_data):
        measures_data = validated_data.pop('measures', [])
        attachments_data = validated_data.pop('attachments', [])
        fields_data = validated_data.pop('fields', [])

        with transaction.atomic():
            event = Event.objects.create(**validated_data)

            for measure_data in measures_data:
                Measure.objects.create(event=event, **measure_data)

            for attachment_data in attachments_data:
                Attachment.objects.create(event=event, **attachment_data)

            for field_data in fields_data:
                EventFieldValue.objects.create(event=event, **field_data)
        return event

    def update(self, instance, validated_data):
        measures_data = validated_data.pop('measures', [])
        attachments_data = validated_data.pop('attachments', [])
        fields_data = validated_data.pop('fields', [])

        with transaction.atomic():
            # Actualizar campos simples del evento
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            # Actualizar medidas
            new_measure_ids = [m.get('id') for m in measures_data if m.get('id')]

            # Eliminar medidas que no están en la nueva data
            for measure in instance.measures.all():
                if measure.id not in new_measure_ids:
                    measure.delete()

            # Crear o actualizar medidas
            for measure_data in measures_data:
                measure_id = measure_data.get('id')
                if measure_id:
                    measure = Measure.objects.get(id=measure_id, event=instance)
                    for attr, value in measure_data.items():
                        setattr(measure, attr, value)
                    measure.save()
                else:
                    Measure.objects.create(event=instance, **measure_data)

            # Actualizar anexos
            new_attach_ids = [a.get('id') for a in attachments_data if a.get('id')]

            for attachment in instance.attachments.all():
                if attachment.id not in new_attach_ids:
                    attachment.delete()

            for attachment_data in attachments_data:
                attachment_id = attachment_data.get('id')
                if attachment_id:
                    attachment = Attachment.objects.get(id=attachment_id, event=instance)
                    for attr, value in attachment_data.items():
                        setattr(attachment, attr, value)
                    attachment.save()
                else:
                    Attachment.objects.create(event=instance, **attachment_data)

            # Actualizar campos adicionales
            new_field_ids = [f.get('id') for f in fields_data if f.get('id')]

            for field in instance.fields.all():
                if field.id not in new_field_ids:
                    field.delete()

            for field_data in fields_data:
                field_id = field_data.get('id')
                if field_id:
                    field = EventFieldValue.objects.get(id=field_id, event=instance)
                    for attr, value in field_data.items():
                        setattr(field, attr, value)
                    field.save()
                else:
                    EventFieldValue.objects.create(event=instance, **field_data)

        return instance