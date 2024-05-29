from django import forms
from .models import *
from django.contrib.auth.validators import UnicodeUsernameValidator


class ProfileForm(forms.ModelForm):

    class Meta:
        model = Account
        fields = (
            'username',
            'email',
            'first_name',
            'last_name',
            'id_type',
            'id_document',
            'sex',
            'birth_date',
            'parent',
            'phone_1',
            'phone_2',
        )

    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get("username")

        user_valid = UnicodeUsernameValidator()
        user_valid(username)

        if not username or not username.islower():
            raise forms.ValidationError("Usuarios deben estar en minúscula")
