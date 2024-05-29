from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=60)

    def __str__(self):
        return f"{self.id} {self.name}"


class Level(models.Model):
    class Categories(models.IntegerChoices):
        beginner = 1, "Principiante"
        intermediate = 2, "Intermedio"
        advanced = 3, "Avanzado"

    name = models.CharField(max_length=60)

    new_category = models.SmallIntegerField(choices=Categories.choices)
    position = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.id} {self.name}"


class Task(models.Model):
    level = models.ForeignKey(
        Level,
        on_delete=models.CASCADE,
        related_name="tasks",
    )
    task = models.CharField(max_length=150)

    def __str__(self):
        return f"{self.task}"
