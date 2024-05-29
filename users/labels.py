# from django.db import models


# class Id_Type(models.Model):
#     id_type = models.CharField(max_length=60)

#     def __str__(self):
#         return f"{self.id_type}"


# class Gender(models.Model):
#     class Genders(models.TextChoices):
#         male = "Masculino", "Masculino"
#         female = "Femenino", "Femenino"

#     gender = models.CharField(
#         max_length=9, choices=Genders.choices, default=Genders.female)

#     def __str__(self):
#         return f"{self.gender}"
