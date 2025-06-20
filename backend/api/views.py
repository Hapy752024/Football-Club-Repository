from django.shortcuts import render
from rest_framework import viewsets, permissions # type: ignore
from rest_framework.response import Response
from django.db.models import Prefetch
from .models import *    
from .serializers import *  

# Create your views here.

class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['get', 'post', 'put', 'delete']

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
class LeagueViewSet(viewsets.ModelViewSet):
    queryset = League.objects.all()
    serializer_class = LeagueSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['get', 'post', 'put', 'delete']

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    
class CharacteristicsViewSet(viewsets.ModelViewSet):
    queryset = Characteristics.objects.all()
    serializer_class = CharacteristicsSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['get', 'post', 'put', 'delete']

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)



class ClubImageViewSet(viewsets.ModelViewSet):
    queryset = ClubImage.objects.all()
    serializer_class = ClubImageSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['delete']

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    
    def destroy(self, request, pk=None):
        try:
            print(f'DEBUG: Attempting to delete club image with ID: {pk}')
            club_image = self.get_object()
            print(f'DEBUG: Club image found: {club_image}')
            if club_image.image:
                print(f'DEBUG: Deleting image file: {club_image.image.path}')
                club_image.delete()
            return Response(status=204)
        except club_image.DoesNotExist:
            return Response({"error": "Club image not found"}, status=404)

class FootballClubViewSet(viewsets.ModelViewSet):
    # This following queryset is equivalent to queryset = FootballClub.objects.all() however it optimizes how the objects are fetched
    queryset = FootballClub.objects.select_related('country', 'league').prefetch_related(
    'images', Prefetch('characteristics', queryset=Characteristics.objects.only('name')))
    permission_classes = [permissions.AllowAny]
    http_method_names = ['get','post','put', 'patch', 'delete'] 

    def get_serializer_class(self):
        """Return different serializers for read vs write operations"""
        if self.action in ['list']:
            return FootballClubListSerializer
        elif self.action in ['retrieve']:
            return FootballClubReadSerializer
        #else for create, update, partial_update, destroy
        print("DEBUG: Using FootballClubWriteSerializer will be returned")
        return FootballClubWriteSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        print("DEBUG: Creating a new Football Club ....")
        serializers = self.get_serializer(data=request.data)    
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data, status=201) 
        else:
            return Response(serializers.errors, status=400)
        
        return super().create(request)
    
    def retrieve(self, request, pk=None):
        try:
            football_club = self.get_object()
            serializer = self.get_serializer(football_club)
            return Response(serializer.data)
        except FootballClub.DoesNotExist:
            return Response({"error": "Football Club not found"}, status=404)
        

    def update(self, request, pk=None):
        """Handle PUT requests (full update)"""
        try:
            football_club = self.get_object()
            serializer = self.get_serializer(football_club, data=request.data, partial=False)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            else:
                return Response(serializer.errors, status=400)
        except FootballClub.DoesNotExist:
            return Response({"error": "Football Club not found"}, status=404)

    def partial_update(self, request, pk=None):
        """Handle PATCH requests (partial update)"""
        try:
            football_club = self.get_object()
            serializer = self.get_serializer(football_club, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            else:
                return Response(serializer.errors, status=400)
        except FootballClub.DoesNotExist:
            return Response({"error": "Football Club not found"}, status=404)

    def destroy(self, request, pk=None):
        try:
            football_club = self.get_object()
            football_club.delete()
            return Response(status=204)
        except FootballClub.DoesNotExist:
            return Response({"error": "Football Club not found"}, status=404)