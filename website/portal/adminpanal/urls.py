from django.urls import path
from .views import *

urlpatterns = [
    path('', InitView, name='InitView'),
    path('dashboard/', DashboardView, name='DashboardView'),
    
    path('product/', ProductView, name='ProductView'),
    path('product/add/api/', ProductAddApi, name='ProductAddApi'),
    path('product/delete/api/', ProductDeleteApi, name='ProductDeleteApi'),
    
    path('station/add/', StationAddView, name='StationAddView'),
    path('station/add/fusion/api/', StationAddFusionApi, name='StationAddFusionApi'),
    path('station/view/', StationViewView, name='StationViewView'),
    path('station/view/api/', StationViewApi, name='StationViewApi'),
    
    path('pump/add/', PumpAddView, name='PumpAddView'),
    path('pump/add/api/', PumpAddApi, name='PumpAddApi'),
    path('pump/view/', PumpViewView, name='PumpViewView'),
    path('pump/view/api/', PumpViewApi, name='PumpViewApi'),
    
    path('nozzle/add/', NozzleAddView, name='NozzleAddView'),
    path('nozzle/add/pump/api/', NozzleAddPumpView, name='NozzleAddPumpView'),
    path('nozzle/add/nozzles/api/', NozzleAddNozzlesView, name='NozzleAddNozzlesView'),
    path('nozzle/add/api/', NozzleAddApi, name='NozzleAddApi'),
    path('nozzle/view/', NozzleViewView, name='NozzleViewView'),
    path('nozzle/view/api/', NozzleViewApi, name='NozzleViewApi'),
    
    path('fusion/add/', FusionAddView, name='FusionAddView'),
    path('fusion/view/', FusionViewView, name='FusionViewView'),
    path('fusion/view/api/', FusionViewApi, name='FusionViewApi'),
    
    path('screen/add/', ScreenAddView, name='ScreenAddView'),
    path('screen/add/api/', ScreenAddApi, name='ScreenAddApi'),
    path('screen/add/pump/api/', ScreenAddPumpView, name='ScreenAddPumpView'),
    path('screen/add/nozzles/api/', ScreenAddNozzlesView, name='ScreenAddNozzlesView'),
    path('screen/view/', ScreenViewView, name='ScreenViewView'),
    path('screen/view/api/', ScreenViewApi, name='ScreenViewApi'),
]