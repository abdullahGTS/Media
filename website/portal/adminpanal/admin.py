from django.contrib import admin
from .models import *
# Register your models here.


@admin.register(CentralArea)
class CentralAreaAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'name',
        'timestamp',
    ]


@admin.register(Governorate)
class GovernorateAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'name',
        'centralArea',
        'timestamp',
    ]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'number',
        'name',
        'price',
        'timestamp',
    ]



@admin.register(Station)
class StationAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'number',
        'name',
        'long',
        'lat',
        'fusion_ip',
        'fusion_port',
        'last_connection',
        'governorate',
        'central_area',
        'timestamp',
    ]


@admin.register(StationFileHandler)
class StationFileHandlerAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'file',
        'station',
        'timestamp',
    ]


@admin.register(Pump)
class PumpAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'number',
        'station',
        'timestamp',
    ]
    
    
@admin.register(Nozzle)
class NozzleAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'number',
        'product',
        'pump',
        'station',
        'timestamp',
    ]
    
    
@admin.register(Fusion)
class FusionAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'station',
        'ip',
        'port',
        'timestamp',
    ]
    
    
@admin.register(FusionFileHandler)
class FusionFileHandlerAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'file',
        'timestamp',
    ]


@admin.register(Screen)
class ScreenAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'android_id',
        'pump',
        'station',
        'get_full_status',
        'last_connection',
        'timestamp',
    ]

    def get_full_status(self, obj):
        for tup in screen_status:
            if obj.status == tup[0]:
                return tup[1]
    get_full_status.short_description = 'Status'
        

# @admin.register(AdsFile)
# class AdsFileAdmin(admin.ModelAdmin):
#     list_display = [
#         'id',
#         'file',
#         'station',
#         'timestamp',
#     ]
