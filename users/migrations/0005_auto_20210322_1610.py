# Generated by Django 3.1.3 on 2021-03-22 21:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_auto_20210316_1035'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='account',
            options={'ordering': ['first_name']},
        ),
    ]
