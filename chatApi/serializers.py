from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Room, Profile


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'name')


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id', 'nik', 'avatar')
