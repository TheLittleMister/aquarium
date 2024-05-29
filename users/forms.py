from django import forms
from .models import *

# User Creation Form?


class UserAdminForm(forms.ModelForm):

    class Meta:
        model = Account
        fields = (
            'type',
            'email',
            'username',
            'id_document',
            'first_name',
            'last_name',
            'gender',
            'birth_date',
            'phone_number',
        )

    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get("username")

        if not username or not username.islower():
            raise forms.ValidationError("Usuarios deben estar en minúscula")


class StudentAdminForm(forms.ModelForm):

    class Meta:
        model = Student
        fields = (
            'parent_name',
            'phone_number_2',
            'teacher'
        )


class UserForm(forms.ModelForm):

    class Meta:
        model = Account
        fields = (
            'email',
            'username',
            'id_document',
            'first_name',
            'last_name',
            'gender',
            'birth_date',
            'phone_number',
        )

    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get("username")

        if not username or not username.islower():
            raise forms.ValidationError("Usuarios deben estar en minúscula")


class StudentForm(forms.ModelForm):

    class Meta:
        model = Student
        fields = (
            'parent_name',
            'phone_number_2',
        )
