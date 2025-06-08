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


class FootballClubSerializer_old(serializers.ModelSerializer):

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

# For reading (GET requests) - with nested objects
class FootballClubReadSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    league = LeagueSerializer(read_only=True)
    characteristics_names = serializers.SerializerMethodField()

    def get_characteristics_names(self, obj):
        return [char.name for char in obj.characteristics.all()]
    
    class Meta:
        model = FootballClub
        fields = '__all__'
        read_only_fields = ('id',)

# For writing (POST/PUT requests) - with ID fields
class FootballClubWriteSerializer(serializers.ModelSerializer):
    country = serializers.PrimaryKeyRelatedField(queryset=Country.objects.all())
    league = serializers.PrimaryKeyRelatedField(queryset=League.objects.all())
    characteristics = serializers.PrimaryKeyRelatedField(
        queryset=Characteristics.objects.all(),
        many=True
    )
    
    class Meta:
        model = FootballClub
        fields = '__all__'
        read_only_fields = ('id',)

    def create(self, validated_data):
        characteristics_data = validated_data.pop('characteristics', [])
        club = FootballClub.objects.create(**validated_data)
        club.characteristics.set(characteristics_data)
        return club

    def update(self, instance, validated_data):
        characteristics_data = validated_data.pop('characteristics', None)
        
        # Update regular fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update characteristics if provided
        if characteristics_data is not None:
            instance.characteristics.set(characteristics_data)
        
        return instance