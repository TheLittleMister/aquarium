# Generated by Django 3.1.3 on 2021-02-23 15:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0002_auto_20210112_2250'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='course',
            options={'ordering': ['date']},
        ),
    ]
