from rest_framework import serializers # type: ignore
from .models import *

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ('id', 'name')
        read_only_fields = ('id',)

class LeagueSerializer(serializers.ModelSerializer):
    class Meta:
        model = League
        fields = ('id', 'name')
        read_only_fields = ('id',)

class CharacteristicsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Characteristics
        fields = ('id', 'name')
        read_only_fields = ('id',)


class FootballClubSerializer(serializers.ModelSerializer):

    class Meta:
        model = FootballClub
        fields = '__all__'
        read_only_fields = ('id',)