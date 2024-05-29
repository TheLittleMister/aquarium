from django import forms
from .models import *
from .labels import *

import datetime


class ScheduleForm(forms.ModelForm):
    class Meta:
        model = Schedule
        fields = "__all__"

    def clean(self):
        cleaned_data = super().clean()

        startTime = cleaned_data.get("start_time")
        endTime = cleaned_data.get("end_time")

        if startTime and endTime and startTime >= endTime:
            raise forms.ValidationError(
                "Hora Inicio debe ser menor a Hora Termina")


class CourseForm(forms.ModelForm):

    class Meta:
        model = Course
        fields = "__all__"

    def clean(self):
        cleaned_data = super().clean()

        startTime = cleaned_data.get("start_time")
        endTime = cleaned_data.get("end_time")

        if startTime and endTime and startTime >= endTime:
            raise forms.ValidationError(
                "Hora Inicio debe ser menor a Hora Termina")


class CoursesForm(forms.Form):

    courses = forms.ModelMultipleChoiceField(
        queryset=Course.objects.filter(date__gte=datetime.datetime.now()), required=False)
