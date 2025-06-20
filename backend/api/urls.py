from django.contrib import admin
from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register('country', CountryViewSet, basename='country')
router.register('league', LeagueViewSet, basename='league')
router.register('characteristics', CharacteristicsViewSet, basename='characteristics')
router.register('club-images', ClubImageViewSet, basename='club-images')
router.register('football-club', FootballClubViewSet, basename='football-club')
urlpatterns = router.urls
