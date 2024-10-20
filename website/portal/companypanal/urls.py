from django.urls import path
from .views import *

urlpatterns = [
    path('', InitView, name='InitView'),
    path('dashboard/', DashboardView, name='DashboardView'),
    path('ads/upload/', AdsUploadView, name='AdsUploadView'),
    path('ads/edit/', AdsEditView, name='AdsEditView'),
    path('ads/delete/', AdsDeleteView, name='AdsDeleteView'),
    path('ads/live/', AdsLiveView, name='AdsLiveView'),
]