# Generated by Django 5.0.7 on 2024-08-07 12:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companypanal', '0002_alter_adsfile_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='adsfile',
            name='priority',
            field=models.PositiveBigIntegerField(blank=True, null=True),
        ),
    ]
