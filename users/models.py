from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.validators import validate_email
from phonenumber_field.validators import validate_international_phonenumber

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
    def create_user(self, email, username, password=None):
        if not username or not password:
            raise ValueError("Users must have an username and password")

        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None):
        if not username or not password:
            raise ValueError("Superusers must have an username and password")

        user = self.create_user(
            email=self.normalize_email(email),
            username=username,
            password=password,
        )

        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    class Types(models.TextChoices):
        admin = "Administrador", "Administrador"
        teacher = "Profesor", "Profesor"
        student = "Estudiante", "Estudiante"

    class Genders(models.TextChoices):
        male = "Masculino", "Masculino"
        female = "Femenino", "Femenino"

    type = models.CharField(
        max_length=13, choices=Types.choices)
    email = models.EmailField(
        max_length=60, unique=True, validators=[validate_email], null=True, blank=True)
    username = models.CharField(
        max_length=150,
        unique=True,
        validators=[UnicodeUsernameValidator()],
    )
    id_document = models.BigIntegerField(
        unique=True, null=True, blank=True)
    profile_image = models.ImageField(
        default="default-profile.png", upload_to="profile_pics")
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    gender = models.CharField(
        max_length=9, choices=Genders.choices)
    birth_date = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=150, null=True, blank=True, validators=[
                                    validate_international_phonenumber])
    last_session = models.DateTimeField(null=True, blank=True)

    # REQUIRED
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    objects = Manager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    class Meta:
        ordering = ["last_name", "first_name"]

    def __str__(self):
        return f"{self.last_name} {self.first_name}"

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class Teacher(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="teacher")
    e_signature = models.ImageField(
        upload_to="signatures", null=True, blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.e_signature:
            img = Image.open(self.e_signature.path)

            if img.height != 80:

                new_height = 80
                new_width = int(new_height * img.width / img.height)

                img = img.resize((new_width, new_height), Image.ANTIALIAS)
                img.save(self.e_signature.path)


class Student(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="student")
    parent_name = models.CharField(max_length=60, null=True, blank=True)
    phone_number_2 = models.CharField(max_length=150, null=True, blank=True, validators=[
        validate_international_phonenumber])
    teacher = models.ForeignKey(
        Teacher, on_delete=models.SET_NULL, related_name="students", null=True, blank=True)


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
