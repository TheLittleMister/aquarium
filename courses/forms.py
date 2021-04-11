from django import forms
from .models import *
from users.models import *
from django.contrib.admin.widgets import FilteredSelectMultiple

class Search(forms.Form):

    def __init__(self, *args, **kwargs):
        search = kwargs.pop("search")

        super(Search, self).__init__(*args, **kwargs)

        self.fields["search"].initial = search
    
    search = forms.CharField(label="", required=True, widget=forms.TextInput(attrs={
        'class': 'form-control', 
        'placeholder': 'Busca Estudiante...',
        'style': 'display: inline; width: 300px; margin-right: 10px;',
        }))

class CourseForm(forms.Form):

    def __init__(self, *args, **kwargs):
        students = kwargs.pop("students")

        super(CourseForm, self).__init__(*args, **kwargs)

        self.fields["students"].initial = students

    students = forms.ModelMultipleChoiceField(queryset=Account.objects.filter(is_admin=False), label="", widget=FilteredSelectMultiple("Estudiantes", is_stacked=False), required=True)

    class Media:
        css = {'all': ('/static/admin/css/widgets.css',),}
        js = ('/admin/jsi18n',)

class StudentForm(forms.Form):

    def __init__(self, *args, **kwargs):
        image = kwargs.pop("image")

        super(StudentForm, self).__init__(*args, **kwargs)

        self.fields["image"].initial = image
    
    image = forms.ImageField(label="", required=False)

class Student_CourseForm(forms.Form):

    def __init__(self, *args, **kwargs):
        courses = kwargs.pop("courses")

        super(Student_CourseForm, self).__init__(*args, **kwargs)

        self.fields["courses"].initial = courses

    courses = forms.ModelMultipleChoiceField(queryset=Course.objects.filter(date__gte=datetime.datetime.now()).order_by('date','start_time'), label="", widget=FilteredSelectMultiple("Cursos", is_stacked=False, attrs={'style': 'overflow-x: auto;'}), required=True)

    class Media:
        css = {'all': ('/static/admin/css/widgets.css',),}
        js = ('/admin/jsi18n',)


