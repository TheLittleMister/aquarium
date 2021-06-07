from django.db import models


class Id_Type(models.Model):
    id_type = models.CharField(max_length=60)

    def __str__(self):
        return f"{self.id_type}"


class Sex(models.Model):
    sex_name = models.CharField(max_length=60)

    def __str__(self):
        return f"{self.sex_name}"


class Nationality(models.Model):
    nationality_name = models.CharField(max_length=60)  # identity_document

    def __str__(self):
        return f"{self.nationality_name}"


class Color(models.Model):
    hex_code = models.CharField(max_length=30)
