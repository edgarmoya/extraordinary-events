from rest_framework import serializers
from .models import Classification


class ClassificationSerializer(serializers.ModelSerializer):
    grade_description = serializers.CharField(source='grade.description', read_only=True)

    class Meta:
        model = Classification
        fields = fields = ('id', 'description', 'grade', 'grade_description', 'is_active')