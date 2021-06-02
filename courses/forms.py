from django import forms
from .models import *
from users.models import *
from django.contrib.admin.widgets import FilteredSelectMultiple
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.validators import UnicodeUsernameValidator


class StudentForm(forms.ModelForm):

    class Meta:
        model = Account
        fields = (
            'note',
            'username',
            'first_name',
            'last_name',
            'id_type',
            'identity_document',
            'sex',
            'date_birth',
            'email',
            'parent',
            'phone_1',
            'phone_2',
            'is_teacher',
        )
        widgets = {
            'date_birth': forms.DateInput(format=('%Y-%m-%d'), attrs={'type': 'date'}),
        }

    def clean(self):
        cleaned_data = super().clean()

        user_valid = UnicodeUsernameValidator()
        user_valid(cleaned_data.get("username"))


class RegistrationForm(UserCreationForm):
    email = forms.EmailField(
        max_length=60, label="Correo electrónico", required=False)

    class Meta:
        model = Account
        fields = (
            'username',
            'first_name',
            'last_name',
            'id_type',
            'identity_document',
            'sex',
            'date_birth',
            'email',
            'parent',
            'phone_1',
            'phone_2',
            'is_teacher',
        )
        widgets = {
            'date_birth': forms.DateInput(format=('%Y-%m-%d'), attrs={'type': 'date'}),
        }

    def clean(self):
        cleaned_data = super().clean()

        user_valid = UnicodeUsernameValidator()
        user_valid(cleaned_data.get("username"))


class AttendanceForm(forms.ModelForm):

    class Meta:
        model = Attendance
        fields = ('note', 'image')


class CoursesForm(forms.Form):

    courses = forms.ModelMultipleChoiceField(queryset=Course.objects.filter(date__gte=datetime.datetime.now()).order_by(
        'date', 'start_time'), label="", widget=FilteredSelectMultiple("Cursos", is_stacked=False, attrs={'style': 'overflow-x: auto;'}), required=False)

    class Media:
        css = {'all': ('/static/admin/css/widgets.css',), }
        js = ('/admin/jsi18n',)


class CreateCoursesForm(forms.ModelForm):

    students = forms.ModelMultipleChoiceField(queryset=Account.objects.filter(
        is_admin=False, is_teacher=False), label="", widget=FilteredSelectMultiple("Estudiantes", is_stacked=False), required=False)

    teachers = forms.ModelMultipleChoiceField(queryset=Account.objects.filter(
        is_admin=False, is_teacher=True), label="", widget=FilteredSelectMultiple("Profesores", is_stacked=False), required=False)

    class Meta:
        model = Course
        fields = (
            'start_time',
            'end_time',
            'students',
            'teachers',
        )
        widgets = {
            'start_time': forms.TimeInput(format=('%H:%M'), attrs={'type': 'time'}),
            'end_time': forms.TimeInput(format=('%H:%M'), attrs={'type': 'time'}),
        }

    class Media:
        css = {'all': ('/static/admin/css/widgets.css',), }
        js = ('/admin/jsi18n',)

    def clean(self):
        cleaned_data = super().clean()

        if cleaned_data.get("start_time") >= cleaned_data.get("end_time"):
            raise forms.ValidationError(
                "Hora Inicio debe ser menor a Hora Termina")


class EditCourseForm(forms.ModelForm):

    students = forms.ModelMultipleChoiceField(queryset=Account.objects.filter(
        is_admin=False, is_teacher=False), label="", widget=FilteredSelectMultiple("Estudiantes", is_stacked=False), required=False)

    teachers = forms.ModelMultipleChoiceField(queryset=Account.objects.filter(
        is_admin=False, is_teacher=True), label="", widget=FilteredSelectMultiple("Profesores", is_stacked=False), required=False)

    class Meta:
        model = Course
        fields = "__all__"

        widgets = {
            'start_time': forms.TimeInput(format=('%H:%M'), attrs={'type': 'time'}),
            'end_time': forms.TimeInput(format=('%H:%M'), attrs={'type': 'time'}),
            'date': forms.DateInput(format=('%Y-%m-%d'), attrs={'type': 'date'}),
        }

    class Media:
        css = {'all': ('/static/admin/css/widgets.css',), }
        js = ('/admin/jsi18n',)

    def clean(self):
        cleaned_data = super().clean()

        if cleaned_data.get("start_time") >= cleaned_data.get("end_time"):
            raise forms.ValidationError(
                "Hora Inicio debe ser menor a Hora Termina")


class StudentLevelForm(forms.ModelForm):

    class Meta:
        model = Student_Level
        fields = (
            'date',
            'attendances',
        )
        widgets = {
            'date': forms.DateInput(format=('%Y-%m-%d'), attrs={'type': 'date'}),
        }

    def clean(self):
        cleaned_data = super().clean()

        if cleaned_data.get("attendances") < 1:
            raise forms.ValidationError("Al menos 1 asistencia requerida!")
