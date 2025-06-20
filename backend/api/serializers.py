from operator import ne
from rest_framework import serializers  # type: ignore
from .models import *


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ("id", "name")
        read_only_fields = ("id",)


class LeagueSerializer(serializers.ModelSerializer):
    class Meta:
        model = League
        fields = ("id", "name")
        read_only_fields = ("id",)


class CharacteristicsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Characteristics
        fields = ("id", "name")
        read_only_fields = ("id",)

# Serializer for club images
class ClubImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClubImage
        fields = ("id", "image", "thumbnail", "created", "modified")
        read_only_fields = ("id", "created", "modified")

    def create(self, validated_data):
        return ClubImage.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.image = validated_data.get('image', instance.image)
        instance.save()
        return instance
    

class FootballClubListSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    league = LeagueSerializer(read_only=True)
    characteristics_names = serializers.SerializerMethodField()

    def get_characteristics_names(self, obj):
        return [char.name for char in obj.characteristics.all()]

    class Meta:
        model = FootballClub
        fields = ['id', 'name', 'description', 'attendance', 'city', 'country', 'league', 'characteristics', 'characteristics_names', 'created', 'modified']



# For reading (GET requests) - with nested objects
class FootballClubReadSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    league = LeagueSerializer(read_only=True)
    characteristics_names = serializers.SerializerMethodField()
    images= ClubImageSerializer(many=True, read_only=True)

    def get_characteristics_names(self, obj):
        return [char.name for char in obj.characteristics.all()]
    
    def get_has_images(self, obj):
        return obj.has_images()  # Use the method we added to the model

    class Meta:
        model = FootballClub
        fields = "__all__"
        read_only_fields = ("id",)


# For writing (POST/PUT requests) - with ID fields
class FootballClubWriteSerializer(serializers.ModelSerializer):
    country = serializers.PrimaryKeyRelatedField(queryset=Country.objects.all())
    league = serializers.PrimaryKeyRelatedField(queryset=League.objects.all())
    characteristics = serializers.PrimaryKeyRelatedField(
        queryset=Characteristics.objects.all(), many=True
    )
    # We have to set of images existing ones (images) and newly uploaded images (newly uploaded images)
    images = ClubImageSerializer(many=True, required=False)
    newly_uploaded_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False)

    class Meta:
        model = FootballClub
        fields = "__all__"
        read_only_fields = ("id",)

    def create(self, validated_data):
        characteristics_data = validated_data.pop("characteristics", [])
        newly_uploaded_images_list = validated_data.pop("newly_uploaded_images", [])
        print("DEBUG: Newly uploaded images list:", [img.name for img in newly_uploaded_images_list])
        club = FootballClub.objects.create(**validated_data)
        club.characteristics.set(characteristics_data)
        for images in newly_uploaded_images_list:
            print("DEBUG: Creating club image with:", images.name)
            ClubImage.objects.create(image=images, club=club)
        return club

    def update(self, instance, validated_data):
        characteristics_data = validated_data.pop("characteristics", None)
        newly_uploaded_images_list = validated_data.pop("newly_uploaded_images", [])
        # Update regular fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update characteristics if provided
        if characteristics_data is not None:
            instance.characteristics.set(characteristics_data)
        #Save any newly uploaded images
        for images in newly_uploaded_images_list:
            ClubImage.objects.create(image=images, club=instance)

        return instance
