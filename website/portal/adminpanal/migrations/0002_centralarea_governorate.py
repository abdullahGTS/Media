# Generated by Django 5.0.7 on 2024-07-28 02:37

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adminpanal', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CentralArea',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Governorate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('centralArea', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='centralAreaGov', to='adminpanal.centralarea')),
            ],
        ),
    ]
