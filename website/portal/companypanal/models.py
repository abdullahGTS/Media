from datetime import datetime
from django.db import models
from adminpanal.models import *
# Create your models here.


class AdsFile(models.Model):
    file = models.FileField(upload_to=upload_to_station)
    name = models.CharField(max_length=256)
    duration = models.FloatField()
    priority = models.PositiveBigIntegerField(null=True, blank=True)
    station = models.ForeignKey(
        Station, on_delete=models.CASCADE, related_name='StationFile')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name

    def save(self, *args, **kwargs):
        if self.file:
            self.file.name = f"{self.station.name}_{self.file.name}_{datetime.now().strftime('%Y%m%d%H%M%S')}"

        if not self.pk:  # If the object is being created (not updated)
            max_priority = AdsFile.objects.filter(station=self.station).aggregate(
                models.Max('priority')
            )['priority__max']
            self.priority = (max_priority + 1) if max_priority is not None else 1
        super().save(*args, **kwargs)



@receiver(pre_delete, sender=Station)
def AdsFile_delete_related_files(sender, instance, **kwargs):
    """
    Signal handler to delete all related FileHandler objects and their associated files.
    """
    file_handlers = instance.StationFile.all()
    for file_handler in file_handlers:
        file_path = file_handler.file.path
        if default_storage.exists(file_path):
            default_storage.delete(file_path)
        file_handler.delete()
