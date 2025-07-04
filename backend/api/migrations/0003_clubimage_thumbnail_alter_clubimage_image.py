# Generated by Django 5.2.1 on 2025-06-20 13:55

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_clubimage'),
    ]

    operations = [
        migrations.AddField(
            model_name='clubimage',
            name='thumbnail',
            field=models.ImageField(blank=True, null=True, upload_to=api.models.club_image_path),
        ),
        migrations.AlterField(
            model_name='clubimage',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=api.models.club_image_path),
        ),
    ]
