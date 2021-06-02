from django import forms
from .models import *
from django.contrib.auth.validators import UnicodeUsernameValidator


class ProfileForm(forms.ModelForm):

    class Meta:
        model = Account
        fields = (
            'username',
            'first_name_1',
            'last_name_1',
            'id_type',
            'identity_document_1',
            'sex',
            'date_birth',
            'email',
            'parent',
            'phone_1_1',
            'phone_2_1',
        )
        widgets = {
            'date_birth': forms.DateInput(format=('%Y-%m-%d'), attrs={'type': 'date'}),
        }

    def clean(self):
        cleaned_data = super().clean()

        user_valid = UnicodeUsernameValidator()
        user_valid(cleaned_data.get("username"))
