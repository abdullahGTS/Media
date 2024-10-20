from django.contrib import admin
from .models import *
# Register your models here.


@admin.register(AdsFile)
class AdsFileAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'file',
        'name',
        'duration',
        'priority',
        'station',
        'timestamp',
    ]
