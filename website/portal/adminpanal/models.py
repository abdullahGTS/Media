import os
from django.db import models
from django.core.files.storage import default_storage
from django.dispatch import receiver
from django.db.models.signals import post_save, pre_delete, post_delete
from django.utils.text import slugify

# Create your models here.
    
class CentralArea(models.Model):
    name = models.CharField(max_length=256)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    
class Governorate(models.Model):
    name = models.CharField(max_length=256)
    centralArea = models.ForeignKey(CentralArea, on_delete=models.DO_NOTHING, related_name='centralAreaGov')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

class Product(models.Model):
    number = models.PositiveBigIntegerField()
    name = models.CharField(max_length=256)
    price = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# Custom upload path function
def upload_to_station(instance, filename):
    # Generate a folder name using the station's name (slugified)
    station_name_slug = slugify(instance.station.name)
    # Construct the upload path
    upload_path = os.path.join('files', 'Stations', station_name_slug, filename)
    return upload_path


class Station(models.Model):
    number = models.PositiveBigIntegerField()
    name = models.CharField(max_length=256)
    long = models.CharField(max_length=256)
    lat = models.CharField(max_length=256)
    fusion_ip = models.CharField(max_length=256)
    fusion_port = models.CharField(max_length=256)
    last_connection = models.DateTimeField()
    governorate = models.ForeignKey(Governorate, on_delete=models.DO_NOTHING, related_name='stationGov')
    central_area = models.ForeignKey(CentralArea, on_delete=models.DO_NOTHING, related_name='stationCenArea')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class StationFileHandler(models.Model):
    file = models.FileField(upload_to=upload_to_station)
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='Stationfiles')
    timestamp = models.DateTimeField(auto_now_add=True)


@receiver(pre_delete, sender=Station)
def Station_delete_related_files(sender, instance, **kwargs):
    """
    Signal handler to delete all related FileHandler objects and their associated files.
    """
    file_handlers = instance.Stationfiles.all()
    for file_handler in file_handlers:
        file_path = file_handler.file.path
        if default_storage.exists(file_path):
            default_storage.delete(file_path)
        file_handler.delete()



class Pump(models.Model):
    number = models.PositiveBigIntegerField()
    station = models.ForeignKey(Station, on_delete= models.DO_NOTHING, related_name='stationPump')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Pump {self.number}'


class Nozzle(models.Model):
    number = models.PositiveBigIntegerField()
    product = models.ForeignKey(
        Product, on_delete=models.DO_NOTHING, related_name='NozzleProduct')
    pump = models.ForeignKey(
        Pump, on_delete=models.DO_NOTHING, related_name='pumpNozzle')
    station = models.ForeignKey(
        Station, on_delete=models.DO_NOTHING, related_name='stationNozzle')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Nozzle {self.number}'



class Fusion(models.Model):
    station = models.CharField(max_length=254)
    ip = models.CharField(max_length=254)
    port = models.CharField(max_length=254)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.station} - {self.ip}:{self.port}"


class FusionFileHandler(models.Model):
    file = models.FileField(upload_to='files/Fusions/')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name


@receiver(post_delete, sender=FusionFileHandler)
def Fusion_delete_related_files(sender, instance, **kwargs):
    file_path = instance.file.path
    if default_storage.exists(file_path):
        default_storage.delete(file_path)


screen_status = [
    ('c', 'Created'),
    ('off', 'Offline'),
    ('on', 'Online')
]


class Screen(models.Model):
    android_id = models.CharField(max_length=256)
    pump = models.ForeignKey(
        Pump, on_delete=models.CASCADE, related_name='ScreenPump')
    station = models.ForeignKey(
        Station, on_delete=models.CASCADE, related_name='ScreenStation')
    status = models.CharField(max_length=50, choices=screen_status)
    last_connection = models.DateTimeField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.android_id




# class AdsFile(models.Model):
#     file = models.FileField(upload_to='files')
#     station = models.ForeignKey(
#         Station, on_delete=models.CASCADE, related_name='StationFile')
#     timestamp = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.file.name

#     def save(self, *args, **kwargs):
#         if self.file:
#             self.file.name = self.station.name + '_' + self.file.name
#         super().save(*args, **kwargs)




# @receiver(pre_delete, sender=AdsFile)
# def RFQ_delete_related_files(sender, instance, **kwargs):
#     file_path = instance.file.path
#     if default_storage.exists(file_path):
#         default_storage.delete(file_path)





