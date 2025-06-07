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

    country = CountrySerializer(read_only=True)
    league = LeagueSerializer(read_only=True)
    # characteristics = CharacteristicsSerializer(many=True, read_only=True)
    characteristics_names = serializers.SerializerMethodField()

    def get_characteristics_names(self, obj): # here the function name must be get_<field_name> in our case field_name =characteristics_names
        return [char.name for char in obj.characteristics.all()]
    
    class Meta:
        model = FootballClub
        fields = '__all__'
        read_only_fields = ('id',)