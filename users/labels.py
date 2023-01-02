from django.db import models


class Id_Type(models.Model):
    id_type = models.CharField(max_length=60)

    def __str__(self):
        return f"{self.id_type}"


class Sex(models.Model):
    sex_name = models.CharField(max_length=60)

    def __str__(self):
        return f"{self.sex_name}"
