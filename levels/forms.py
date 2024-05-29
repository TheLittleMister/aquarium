from django import forms
from .models import *
from .labels import *


class StudentLevelForm(forms.ModelForm):

    class Meta:
        model = Student_Level
        fields = (
            'new_student',
            'level',
            'date',
            'attendances',
        )

    def clean(self):
        cleaned_data = super().clean()

        if cleaned_data.get("attendances") < 1:
            raise forms.ValidationError("Al menos 1 asistencia requerida!")


class LevelForm(forms.ModelForm):
    class Meta:
        model = Level
        fields = "__all__"

    def clean(self):
        cleaned_data = super().clean()

        position = int(cleaned_data.get("position"))

        if position < 1:
            raise forms.ValidationError(
                "Posición no puede ser menor a 1")
