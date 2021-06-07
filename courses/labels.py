from django.db import models


class Level(models.Model):
    name = models.CharField(max_length=60)

    def __str__(self):
        return f"{self.id} {self.name}"
