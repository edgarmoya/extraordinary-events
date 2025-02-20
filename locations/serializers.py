from rest_framework import serializers
from .models import Province, Municipality


class ProvinceSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Province
        fields = '__all__'

class MunicipalitySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Municipality
        fields = '__all__'