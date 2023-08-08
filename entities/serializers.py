from rest_framework import serializers
from .models import Entity


class EntitySerializer(serializers.ModelSerializer):
    municipality_description = serializers.CharField(source='municipality.description', read_only=True)
    province = serializers.IntegerField(source='municipality.province.id', read_only=True)
    sector_description = serializers.CharField(source='sector.description', read_only=True)


    class Meta:
        model = Entity
        fields = fields = ('id_entity', 'municipality', 'municipality_description', 'province',
                        'sector_description', 'description', 'sector', 'email', 'address', 'is_active')