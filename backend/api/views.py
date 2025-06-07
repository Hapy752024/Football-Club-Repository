from django.shortcuts import render
from rest_framework import viewsets, permissions # type: ignore
from rest_framework.response import Response

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


class FootballClubViewSet(viewsets.ModelViewSet):
    queryset = FootballClub.objects.all()
    serializer_class = FootballClubSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['get','post'] # ['get', 'post', 'put', 'delete']

    

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializers = self.get_serializer(data=request.data)    
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data, status=201) 
        else:
            return Response(serializers.errors, status=400)
        
        return super().create(request)