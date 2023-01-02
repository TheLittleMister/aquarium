from django import forms
from .models import *
from .labels import *
from users.models import *
from django.contrib.admin.widgets import FilteredSelectMultiple
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.validators import UnicodeUsernameValidator


class StudentLevelForm(forms.ModelForm):

    class Meta:
        model = Student_Level
        fields = (
            'student',
            'level',
            'date',
            'attendances',
        )

    def clean(self):
        cleaned_data = super().clean()

        if cleaned_data.get("attendances") < 1:
            raise forms.ValidationError("Al menos 1 asistencia requerida!")


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


# class StudentForm(forms.ModelForm):

#     class Meta:
#         model = Account
#         fields = (
#             'note',
#             'username',
#             'first_name',
#             'last_name',
#             'id_type',
#             'identity_document',
#             'sex',
#             'date_birth',
#             'email',
#             'parent',
#             'phone_1',
#             'phone_2',
#             'is_teacher',
#         )
#         widgets = {
#             'date_birth': forms.DateInput(format=('%Y-%m-%d'), attrs={'type': 'date'}),
#         }

#     def clean(self):
#         cleaned_data = super().clean()
#         username = cleaned_data.get("username")

#         user_valid = UnicodeUsernameValidator()
#         user_valid(username)

#         if username.isalpha() and not username.islower():
#             raise forms.ValidationError("Usuarios deben estar en minúscula")


# class RegistrationForm(UserCreationForm):
#     email = forms.EmailField(
#         max_length=60, label="Correo electrónico", required=False)

#     class Meta:
#         model = Account
#         fields = (
#             'username',
#             'first_name',
#             'last_name',
#             'id_type',
#             'identity_document',
#             'sex',
#             'date_birth',
#             'email',
#             'parent',
#             'phone_1',
#             'phone_2',
#             'is_teacher',
#         )
#         widgets = {
#             'date_birth': forms.DateInput(format=('%Y-%m-%d'), attrs={'type': 'date'}),
#         }

#     def clean(self):
#         cleaned_data = super().clean()
#         username = cleaned_data.get("username")

#         user_valid = UnicodeUsernameValidator()
#         user_valid(username)

#         if username.isalpha() and not username.islower():
#             raise forms.ValidationError("Usuarios deben estar en minúscula")


# class AttendanceForm(forms.ModelForm):

#     class Meta:
#         model = Attendance
#         fields = ('note', 'image')


# class CreateCoursesForm(forms.ModelForm):

#     students = forms.ModelMultipleChoiceField(queryset=Account.objects.filter(
#         is_admin=False, is_teacher=False), label="", widget=FilteredSelectMultiple("Estudiantes", is_stacked=False), required=False)

#     teachers = forms.ModelMultipleChoiceField(queryset=Account.objects.filter(
#         is_admin=False, is_teacher=True), label="", widget=FilteredSelectMultiple("Profesores", is_stacked=False), required=False)

#     class Meta:
#         model = Course
#         fields = (
#             'start_time',
#             'end_time',
#             'students',
#             'teachers',
#         )
#         widgets = {
#             'start_time': forms.TimeInput(format=('%H:%M'), attrs={'type': 'time'}),
#             'end_time': forms.TimeInput(format=('%H:%M'), attrs={'type': 'time'}),
#         }

#     class Media:
#         css = {'all': ('/static/admin/css/widgets.css',), }
#         js = ('/admin/jsi18n',)

#     def clean(self):
#         cleaned_data = super().clean()

#         if cleaned_data.get("start_time") >= cleaned_data.get("end_time"):
#             raise forms.ValidationError(
#                 "Hora Inicio debe ser menor a Hora Termina")


# class NoteForm(forms.ModelForm):

#     class Meta:
#         model = Note
#         fields = ("note",)

#         widgets = {
#             'note': forms.Textarea(attrs={'cols': 30, 'rows': 15}),
#         }
