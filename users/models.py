from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from .labels import *
from PIL import Image

# RESET PASSWORD IMPORTS
from django.core.mail import send_mail
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse

from django_rest_passwordreset.signals import reset_password_token_created

# Create your models here.


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

    username = models.CharField("Usuario", max_length=60, unique=True)
    email = models.EmailField(
        "Correo Electrónico", max_length=60, unique=True, null=True, blank=True
    )
    image = models.ImageField(
        default="default-profile.png", upload_to="profile_pics", blank=True
    )
    first_name = models.CharField("Nombres", max_length=30)
    last_name = models.CharField("Apellidos", max_length=30)
    id_type = models.ForeignKey(
        Id_Type,
        on_delete=models.SET_NULL,
        related_name="users",
        null=True,
        blank=True,
        verbose_name="Tipo de Documento",
    )  # Make tests
    identity_document = models.BigIntegerField(
        "Número de Documento", unique=True, null=True, blank=True
    )  # ID

    parent = models.CharField(
        "Acudiente", max_length=60, null=True, blank=True)
    phone_1 = models.BigIntegerField("Tel/Cel (1)", null=True, blank=True)
    phone_2 = models.BigIntegerField("Tel/Cel (2)", null=True, blank=True)
    sex = models.ForeignKey(
        Sex,
        on_delete=models.SET_NULL,
        related_name="users",
        null=True,
        blank=True,
        verbose_name="Sexo Biológico",
    )
    date_birth = models.DateField("Fecha de Nacimiento", null=True, blank=True)

    teacher = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        related_name="my_teacher",
        null=True,
        blank=True,
    )

    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    real_last_login = models.DateTimeField(null=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_teacher = models.BooleanField("Profesor", default=False)

    signature = models.ImageField(
        "Firma", upload_to="signatures", null=True, blank=True
    )

    objects = Manager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []

    class Meta:
        ordering = ["last_name"]

    def __str__(self):
        return f"{self.last_name} {self.first_name}"

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.signature:
            img = Image.open(self.signature.path)

            if img.height != 80:

                new_height = 80
                new_width = int(new_height * img.width / img.height)

                img = img.resize((new_width, new_height), Image.ANTIALIAS)
                img.save(self.signature.path)


# RESET PASSWORD EMAIL


@receiver(reset_password_token_created)
def password_reset_token_created(
    sender, instance, reset_password_token, *args, **kwargs
):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """
    # send an e-mail to the user
    context = {
        # "current_user": reset_password_token.user,
        # "email": reset_password_token.user.email,
        "username": reset_password_token.user.username,
        "reset_password_url": "{}{}".format(
            instance.request.build_absolute_uri(
                reverse("password_reset:reset-password-confirm")
            ),
            reset_password_token.key,
        ).replace("api/", ""),
    }

    # render email text
    email_html_message = render_to_string("email.html", context)
    email_plaintext_message = render_to_string("email.txt", context)

    send_mail(
        # title:
        "Recuperar Contraseña para {title}".format(title="Aquarium School"),
        # message:
        email_plaintext_message,
        # from:
        "aquariumschool@gmail.com",
        # to:
        [reset_password_token.user.email],
        # html message:
        html_message=email_html_message,
    )
