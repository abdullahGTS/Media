# Generated by Django 5.0.7 on 2024-08-07 12:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companypanal', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='adsfile',
            name='name',
            field=models.CharField(max_length=256),
        ),
    ]
