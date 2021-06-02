from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from PIL import Image

# Create your models here.


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


class Manager(BaseUserManager):
    def create_user(self, username, password=None):  # self.normalize_email(email)
        if not username:
            raise ValueError("Users must have an username")

        user = self.model(username=username)  # username.lower() with no spaces
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None):
        user = self.create_user(username=username, password=password)

        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class Account(AbstractBaseUser):
    # verbose_name="username"
    username = models.CharField("Usuario", max_length=60, unique=True)
    email = models.EmailField("Correo Electrónico",
                              max_length=60, unique=True, null=True, blank=True)
    image = models.ImageField(
        default="default-profile.png", upload_to="profile_pics", blank=True)
    first_name = models.CharField("Nombres", max_length=30)
    last_name = models.CharField("Apellidos", max_length=30)
    id_type = models.ForeignKey(
        Id_Type, on_delete=models.SET_NULL, related_name="users", null=True, blank=True, verbose_name="Tipo de Documento")  # Make tests
    identity_document = models.BigIntegerField(
        "Número de Documento", unique=True, null=True, blank=True)  # ID
    nationality = models.ForeignKey(
        Nationality, on_delete=models.SET_NULL, related_name="users", null=True, blank=True, verbose_name="Nacionalidad")
    parent = models.CharField(
        "Acudiente", max_length=60, null=True, blank=True)
    phone_1 = models.BigIntegerField("Tel/Cel (1)", null=True, blank=True)
    phone_2 = models.BigIntegerField("Tel/Cel (2)", null=True, blank=True)
    sex = models.ForeignKey(Sex, on_delete=models.SET_NULL,
                            related_name="users", null=True, blank=True, verbose_name="Sexo Biológico")
    date_birth = models.DateField("Fecha de Nacimiento", null=True, blank=True)
    note = models.CharField("Nota", max_length=280, blank=True, null=True)

    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_teacher = models.BooleanField("Profesor", default=False)

    # User's request to change information
    newrequest = models.BooleanField(default=False)
    ignore = models.BooleanField(default=False)

    first_name_1 = models.CharField(
        "Nombres", max_length=30, default="", null=True)
    last_name_1 = models.CharField(
        "Apellidos", max_length=30, default="", null=True)
    identity_document_1 = models.BigIntegerField(
        "Número de Documento", unique=True, null=True)  # ID
    phone_1_1 = models.BigIntegerField("Tel/Cel (1)", null=True)
    phone_2_1 = models.BigIntegerField("Tel/Cel (2)", null=True, blank=True)

    objects = Manager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []

    class Meta:
        ordering = ['last_name']

    def __str__(self):
        return f"{self.last_name} {self.first_name}"

    def has_perm(self, perm,  obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True
