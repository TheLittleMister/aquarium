from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.admin.widgets import FilteredSelectMultiple
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.db import IntegrityError
from django.shortcuts import render
from django.urls import reverse
from django.conf import settings
import requests
from django.db.models import Q
from django import forms
from PIL import Image
import unidecode
import datetime
import operator

# MODELS
from .models import Course, Attendance
from users.models import Account, Id_Type, Nationality, Sex

# FORMS
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



# Create your views here.
def index(request):

    if request.user.is_authenticated and request.user.is_admin:

        if request.method == "POST":
            search = request.POST["search"]

            return render(request, "courses/index.html", {
                "students": Account.objects.filter(Q(username__icontains=search) | Q(email__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(identity_document__icontains=search) | Q(phone_1__icontains=search) | Q(phone_2__icontains=search)).order_by("first_name", "last_name"),
                "form": Search(search=""),
            })

        else:

            accounts = Account.objects.filter(is_admin=False).order_by("first_name", "last_name")
            account_paginator = Paginator(accounts, 13)
            page_num = request.GET.get("page")
            page = account_paginator.get_page(page_num)

            return render(request, "courses/index.html", {
                "page": page,
                "form": Search(search="")
            })
    
    else:
        return HttpResponseRedirect(reverse("login"))

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def courses(request):

    results = "Hi"

    if request.method == "POST":
        
        search = request.POST["date"]
        results = Course.objects.filter(date=search).order_by('date','start_time')


    old_courses = Course.objects.filter(date__lt=datetime.datetime.now()).order_by('-date','-start_time')
    next_courses = Course.objects.filter(date__gt=datetime.datetime.now()).order_by('date','start_time')
    today_courses = Course.objects.filter(date=datetime.datetime.now()).order_by('date','start_time')

    old_course_paginator = Paginator(old_courses, 10)
    old_page_num = request.GET.get("old_page")
    old_page = old_course_paginator.get_page(old_page_num)

    next_course_paginator = Paginator(next_courses, 10)
    next_page_num = request.GET.get("next_page")
    next_page = next_course_paginator.get_page(next_page_num)

    today_course_paginator = Paginator(today_courses, 10)
    today_page_num = request.GET.get("today_page")
    today_page = today_course_paginator.get_page(today_page_num)
    
    return render(request, "courses/courses.html", {
        "results": results,
        "student": student,
        "old_page": old_page,
        "next_page": next_page,
        "today_page": today_page,

    })

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def create_student(request):

    if request.method == "POST":

        valid = False
        i = 0

        while valid == False: # DANGER - CAREFUL

            try:
                username = unidecode.unidecode(request.POST["first_name"]).upper() + " " + unidecode.unidecode(request.POST["last_name"]).upper() + " " + str(i)
                student = Account.objects.create_user(username=username, password="AquariumSchool")
                valid = True

            except:
                i += 1
        
        student.first_name = unidecode.unidecode(request.POST["first_name"]).upper().strip()
        student.last_name = unidecode.unidecode(request.POST["last_name"]).upper().strip()
        student.id_type = Id_Type.objects.get(pk=int(request.POST["id_type"]))

        if request.POST["email"]:

            try:
                already = Account.objects.get(email=request.POST["email"].lower())
                student.delete()
                message = "Correo ya está en uso por:"

                return render(request, 'courses/create_student.html', {
                    "student": already,
                    "message": message,
                    "ids": Id_Type.objects.all(),
                    "nationalities": Nationality.objects.all(),
                    "sex": Sex.objects.all(),
                    "courses_form": Student_CourseForm(
                        courses = None,
                    ),
                    "form": StudentForm(
                        image = None,
                    )
                })

            except:
                student.email = request.POST["email"].lower()
            
        else:
            student.email = None

        
        if request.POST["identity_document"].isdigit():

            check = 0

            try:
                already = Account.objects.get(identity_document=request.POST["identity_document"])
                check += 1

            except:
                pass

            try:
                already = Account.objects.get(identity_document_1=request.POST["identity_document"])
                check += 1
            
            except:
                pass
            
            
            if check > 0:
                student.delete()
                message = " No. de Documento ya está en uso por:"

                return render(request, 'courses/create_student.html', {
                    "student": already,
                    "message": message,
                    "ids": Id_Type.objects.all(),
                    "nationalities": Nationality.objects.all(),
                    "sex": Sex.objects.all(),
                    "courses_form": Student_CourseForm(
                        courses = None,
                    ),
                    "form": StudentForm(
                        image = None,
                    )
                })
            
            else:
                student.identity_document = request.POST["identity_document"]
                
        else:
            student.identity_document = None
        
        student.nationality = Nationality.objects.get(pk=int(request.POST["nationality"]))
        student.sex = Sex.objects.get(pk=int(request.POST["sex"]))

        courses = request.POST.getlist("courses")

        for course_id in courses:
            course = Course.objects.get(pk=int(course_id))
            attendance = Attendance(course=course, student=student)
            attendance.save()

            student.courses.add(course)

        if request.POST["date_birth"]:
            student.date_birth = request.POST["date_birth"]

        elif request.POST["age"]:
            student.date_birth = datetime.datetime.today() - datetime.timedelta(days=int(request.POST["age"])*365)

        else:
            student.date_birth = datetime.datetime.today()
        
        student.address = unidecode.unidecode(request.POST["address"]).upper()

        if request.POST["phone_1"].isdigit():
            student.phone_1 = request.POST["phone_1"]
        
        else:
            student.phone_1 = None
        
        if request.POST["phone_2"].isdigit():
            student.phone_2 = request.POST["phone_2"]
        
        else:
            student.phone_2 = None

        if request.FILES.get("image", False) != False and 'image' in request.FILES["image"].content_type:
            student.image = request.FILES["image"]

        student.save()

        return HttpResponseRedirect(reverse('courses:student', args=(student.id,)))

    else:
        
        return render(request, 'courses/create_student.html', {
            "ids": Id_Type.objects.all(),
            "nationalities": Nationality.objects.all(),
            "sex": Sex.objects.all(),
            "courses_form": Student_CourseForm(
                courses = None,
            ),
            "form": StudentForm(
                image = None,
            )
        })


@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def student(request, account_id):

    student = Account.objects.get(pk=account_id)
    message = ""
    message1 = ""
    already = None
    already1 = None
    
    #Edit Student
    if request.method == "POST":

        student.first_name = unidecode.unidecode(request.POST["first_name"]).upper().strip()
        student.last_name = unidecode.unidecode(request.POST["last_name"]).upper().strip()
        student.id_type = Id_Type.objects.get(pk=int(request.POST["id_type"]))

        if request.POST["identity_document"].isdigit():

            check = 0

            # First Check
            try:
                if int(request.POST["identity_document"]) != student.identity_document:

                    try:
                        already = Account.objects.get(identity_document=request.POST["identity_document"])
                        check += 1

                    except:
                        pass
            except:
                pass

            # Second Check (Try)
            try:
                if int(request.POST["identity_document"]) != student.identity_document_1:

                    try:
                        already = Account.objects.get(identity_document_1=request.POST["identity_document"])
                        check += 1
                    
                    except:
                        pass
            
            except:
                pass         
 
            if check > 0:
                message = "No. de Documento ya está en uso por: "
            
            else:
                student.identity_document = request.POST["identity_document"]
                

        else:
            student.identity_document = None
            
  
        student.nationality = Nationality.objects.get(pk=int(request.POST["nationality"]))
        student.sex = Sex.objects.get(pk=int(request.POST["sex"]))

        courses = request.POST.getlist("courses") # returns course.id(s)

        for course in student.courses.filter(date__gte=datetime.datetime.now()):

            if str(course.id) not in courses:
                Attendance.objects.get(student=student, course=course).delete()
                student.courses.remove(course)

        for course_id in courses:
            course = Course.objects.get(pk=int(course_id))

            if course not in student.courses.all():
                attendance = Attendance(course=course, student=student)
                attendance.save()
                student.courses.add(course)

        if request.POST["date_birth"]:
            student.date_birth = request.POST["date_birth"]

        elif request.POST["age"]:
            student.date_birth = datetime.datetime.today() - datetime.timedelta(days=int(request.POST["age"])*365)

        else:
            student.date_birth = datetime.datetime.today()

        if request.POST["email"]:

            if student.email != request.POST["email"].lower():

                try:
                    already1 = Account.objects.get(email=request.POST["email"].lower())
                    message1 = "Correo ya está en uso por: "

                except:
                    student.email = request.POST["email"].lower()
                
        else:
            student.email = None

        student.address = unidecode.unidecode(request.POST["address"]).upper()

        if request.POST["phone_1"].isdigit():
            student.phone_1 = request.POST["phone_1"]
        
        else:
            student.phone_1 = None
        
        if request.POST["phone_2"].isdigit():
            student.phone_2 = request.POST["phone_2"]
        
        else:
            student.phone_2 = None
        
        if request.POST.get("image-clear", False) == "on":

            if student.image != 'default-profile.png':
                student.image.delete()

            student.image = 'default-profile.png'

        elif request.FILES.get("image", False) != False and 'image' in request.FILES["image"].content_type:

            if student.image != 'default-profile.png':
                student.image.delete()

            student.image = request.FILES["image"]

        student.save()

    courses = student.courses.filter(date__gte=datetime.datetime.now()).order_by('date','start_time')
    
    course_paginator = Paginator(courses, 8)
    page_num = request.GET.get("page")
    page = course_paginator.get_page(page_num)
    
    schedule = []
    try:
        age = int(str((datetime.date.today() - student.date_birth) / 365)[:2])

    except:

        try:
            crage = ""
            year = str(student.date_birth)[0:4]
            month = str(student.date_birth)[5:7]
            day = str(student.date_birth)[8:10]

            for i in str(datetime.datetime.today() - datetime.datetime(int(year), int(month), int(day))):
                if i.isdigit():
                    crage += i
                else:
                    break

            age = int(crage) // 365

        except:
            age = 0

    for course in courses:
        
        week = {0: ["-"], 1: ["-"], 2: ["-"], 3: ["-"], 4: ["-"], 5: ["-"], 6: ["-"]}
        weekday = course.date.weekday()
        the_course = []

        start_time = datetime.datetime.strptime(f'{str(course.start_time)[:-3]}','%H:%M')
        end_time = datetime.datetime.strptime(f'{str(course.end_time)[:-3]}','%H:%M')

        check = False

        for row_course in schedule:
            if row_course[0] == start_time and row_course[1] == end_time:
                row_course[2 + weekday] = "✔"
                check = True
        
        if check == False:
            the_course.append(start_time)
            the_course.append(end_time)
            week[weekday] = "✔"

            for i in range(7): # 7 - Sunday
                the_course.append(week[i][0]) # Week days
            
            if the_course not in schedule:
                schedule.append(the_course)

    schedule.sort(key=lambda course:course[0])

    if student.email == None:
        email = ""

    else:
        email = student.email

    try:
        year = str(student.date_birth)[0:4]
        month = str(student.date_birth)[5:7]
        day = str(student.date_birth)[8:10]

        date_birth = datetime.date(int(year), int(month), int(day))
    
    except:
        date_birth = str(student.date_birth)
    
    date_birth_form = str(student.date_birth)

    # Number of paid courses
    paid_courses = student.attendance.filter(quota="PAGO").count()

    # Number of attended courses
    attended = student.attendance.filter(course__date__lte=datetime.datetime.now(), attendance=True).count()

    # Number of failed courses
    failed = student.attendance.filter(course__date__lt=datetime.datetime.now(), attendance=False, quota="PAGO").count()

    # Number of recovered courses
    recovered = student.attendance.filter(course__date__lt=datetime.datetime.now(), attendance=True, recover=True).count()

    # Get the Number of courses that can be recovered
    
    N = 4 # N represents the number of courses required to recover 1 course.

    available = ((paid_courses // N) - recovered) # This equation gets the available courses to be recovered

    # If by any chance the available courses to be recovered are less or equal to 0 then 0 can be recovered.
    if available <= 0:
        can_recover = 0

    # If the available courses to be recovered are more or equal to the courses failed 
    # then the number of courses failed can be recovered.
    elif available >= failed:
        can_recover = failed
    
    # If the available courses to be recovered are less than the failed
    # then the available courses to be recovered can be recovered.
    else:
        can_recover = available

    # ----------

    # Get number of quotas that were not paid:
    n_paid = student.attendance.filter(quota="NO PAGO").count()

    # Get number of reserved quotas:
    sep = student.attendance.filter(quota="SEPARADO").count()

    # Get TOTAL number of student's courses
    total = paid_courses + n_paid + sep


    return render(request, 'courses/account.html', {

        "datetoday": datetime.date.today(),
        "attended": attended,
        "failed": failed,
        "recovered": recovered,
        "can_recover": can_recover,
        "paid": paid_courses,
        "n_paid": n_paid,
        "sep": sep,
        "total": total,

        "already": already,
        "already1": already1,
        "message": message,
        "message1": message1,
        "email": email,
        "date_birth": date_birth,
        "date_birth_form": date_birth_form,
        "ids": Id_Type.objects.all(),
        "nationalities": Nationality.objects.all(),
        "sex": Sex.objects.all(),
        "user": student,
        "page": page,
        "courses": courses,
        "schedule": schedule,
        "age": int(age),
        "courses_form": Student_CourseForm(
            courses = student.courses.filter(date__gte=datetime.datetime.now()).order_by('date','start_time'),
        ),
        "form": StudentForm(
            image = student.image,
        ),
    })

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def student_history(request, account_id):

    student = Account.objects.get(pk=account_id)

    results = "Hi"

    if request.method == "POST":
        date_search = request.POST["date"]
        results = student.courses.filter(date=date_search).order_by('date','start_time')

    try: 
        past = datetime.date.today() > results.first().date 
    
    except: 
        past = False

    old_courses = student.courses.filter(date__lt=datetime.datetime.now()).order_by('-date','-start_time')
    next_courses = student.courses.filter(date__gt=datetime.datetime.now()).order_by('date','start_time')
    today_courses = student.courses.filter(date=datetime.datetime.now()).order_by('date','start_time')

    old_course_paginator = Paginator(old_courses, 10)
    old_page_num = request.GET.get("old_page")
    old_page = old_course_paginator.get_page(old_page_num)

    next_course_paginator = Paginator(next_courses, 10)
    next_page_num = request.GET.get("next_page")
    next_page = next_course_paginator.get_page(next_page_num)

    today_course_paginator = Paginator(today_courses, 10)
    today_page_num = request.GET.get("today_page")
    today_page = today_course_paginator.get_page(today_page_num)
    
    return render(request, "courses/history.html", {
        "past": past,
        "results": results,
        "student": student,
        "old_page": old_page,
        "next_page": next_page,
        "today_page": today_page,

    })

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def course(request, course_id):

    if request.method == "POST":

        date = request.POST["date"]
        start_time = request.POST["start_time"]
        end_time = request.POST["end_time"]
        students = request.POST.getlist("students")  # returns student.id(s)

        try:
            course = Course.objects.get(start_time=start_time, end_time=end_time, date=date)
        
        except:
            course = Course.objects.get(pk=course_id)

        if start_time < end_time:

            if course.id != course_id:
                Course.objects.get(pk=course_id).delete()

            else:
                course.date = request.POST["date"]
                course.start_time = request.POST["start_time"]
                course.end_time = request.POST["end_time"]           

                for student in course.students.all():
                    if str(student.id) not in students:
                        Attendance.objects.get(student=student, course=course).delete()
                        course.students.remove(student)

            for student_id in students:
                student = Account.objects.get(pk=int(student_id))

                if student not in course.students.all():
                    attendance = Attendance(course=course, student=student)
                    attendance.save()
                    course.students.add(student)

            course.save()
            return HttpResponseRedirect(reverse("courses:course", args=(course.id,)))

        else:

            date = str(course.date)
            start_time = str(course.start_time)
            end_time = str(course.end_time)

            return render(request, 'courses/course.html', {
            "past": datetime.date.today() > course.date,
            "attendances": Attendance.objects.filter(course=course).order_by('student'),
            "course": course,
            "date": date,
            "start_time": start_time,
            "end_time": end_time,
            "form": CourseForm(
                students=request.POST.getlist("students"),
            ),
            "message": "Hora Inicial debe ser menor a la Final",
        })

    else:

        course = Course.objects.get(pk=course_id)

        date = str(course.date)
        start_time = str(course.start_time)
        end_time = str(course.end_time)

        return render(request, 'courses/course.html', {
            "date": date,
            "past": datetime.date.today() > course.date,
            "course": course,
            "attendances": Attendance.objects.filter(course=course).order_by('student'),
            "start_time": start_time,
            "end_time": end_time,
            "form": CourseForm(
                students=course.students.all(),
            )
        })

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def print_course(request, course_id):

    courses = [Course.objects.get(pk=course_id)]

    return render(request, 'courses/print_course.html', {
        "courses": courses,
    })

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def print_courses(request):

    today_courses = Course.objects.filter(date=datetime.datetime.now()).order_by('date','start_time')

    return render(request, 'courses/print_course.html', {
        "courses": today_courses,
    })

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def print_search(request, course_id):

    courses = Course.objects.filter(date=Course.objects.get(pk=course_id).date).order_by('date','start_time')

    return render(request, 'courses/print_course.html', {
        "courses": courses,
    })

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def create_course(request):

    if request.method == "POST":

        if request.POST["start_time"] < request.POST["end_time"]:

            dates = request.POST.getlist("dates")
            start_time = request.POST["start_time"]
            end_time = request.POST["end_time"]
            students = request.POST.getlist("students")
            new_courses_list = list()
            assign_only_list = list()

            for date in dates:
                try:
                    course = Course.objects.get(start_time=start_time, end_time=end_time, date=date)

                    for student_id in students:
                        student = Account.objects.get(pk=int(student_id))

                        if student not in course.students.all():
                            attendance = Attendance(course=course, student=student)
                            attendance.save()
                            course.students.add(student)
                        
                    course.save()
                    assign_only_list.append(course)
                    
                except:

                    new_course = Course(start_time=start_time, end_time=end_time, date=date)
                    new_course.save()

                    for student_id in students:
                        student = Account.objects.get(pk=int(student_id))
                        attendance = Attendance(course=new_course, student=student)
                        attendance.save()
                        new_course.students.add(student)
                    
                    new_course.save()
                    new_courses_list.append(Course.objects.get(start_time=start_time, end_time=end_time, date=date))

            return render(request, 'courses/create_course.html', {
                "form": CourseForm(
                    students=None,
                ),
                "new_courses_list": new_courses_list,
                "assign_only_list": assign_only_list,
            })

        else:

            return render(request, 'courses/create_course.html', {
                "form": CourseForm(
                    students=request.POST.getlist("students"),
                ),
                "message": "Hora Inicial debe ser menor a la Final",
            })

    else:

        return render(request, 'courses/create_course.html', {
            "form": CourseForm(
                students=None,
            )
        })

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def delete_student(request, account_id):

    student = Account.objects.get(pk=account_id)
    student.delete()
    return HttpResponseRedirect(reverse("courses:index",))

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def delete_course(request, course_id):

    course = Course.objects.get(pk=course_id)
    course.delete()
    return HttpResponseRedirect(reverse("courses:courses",))

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def attendance_course(request, course_id):

    course = Course.objects.get(pk=course_id)
    students_attendance = Attendance.objects.filter(course=course, attendance=True)

    if request.method == "POST":
        attendances = request.POST.getlist("attendances")

        for attendance in Attendance.objects.filter(course=course):
            attendance.attendance = False
            attendance.save()

        for attendance_id in attendances:
            attendance = Attendance.objects.get(pk=int(attendance_id))
            attendance.attendance = True
            attendance.save()
        
        return HttpResponseRedirect(reverse("courses:course", args=(course.id,)))

    else:
        
        class AttendanceForm(forms.Form):

            def __init__(self, *args, **kwargs):
                attendances = kwargs.pop("attendances")

                super(AttendanceForm, self).__init__(*args, **kwargs)

                self.fields["attendances"].initial = attendances
            
            attendances = forms.ModelMultipleChoiceField(queryset=Attendance.objects.filter(course=course), label="", widget=forms.CheckboxSelectMultiple()) 


        return render(request, 'courses/course.html', {
            "attendance_form": AttendanceForm(attendances=students_attendance),
            "course": course,
        })

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def attendance(request, attendance_id): # FETCH

    the_attendance = Attendance.objects.get(pk=attendance_id)
    today = datetime.date.today()

    if the_attendance.attendance == False:
        the_attendance.attendance = True
        attendance = "ASISTIO"

    elif today > the_attendance.course.date and the_attendance.attendance == True:
        the_attendance.attendance = False
        attendance = "NO ASISTIO"
    
    elif today <= the_attendance.course.date and the_attendance.attendance == True:
        the_attendance.attendance = False
        attendance = "PENDIENTE"

    the_attendance.save()
    return JsonResponse(attendance, safe=False)

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def pay(request, attendance_id): # FETCH

    the_attendance = Attendance.objects.get(pk=attendance_id)

    if the_attendance.quota == "PAGO":
        the_attendance.quota = "SEPARADO"
    
    elif the_attendance.quota == "SEPARADO":
        the_attendance.quota = "NO PAGO"

    else:
        the_attendance.quota = "PAGO"
    
    the_attendance.save()

    return JsonResponse(the_attendance.quota, safe=False)


@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def notifications(request): # FETCH

    count = Account.objects.filter(newrequest=True).count()
    return JsonResponse(count, safe=False)

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def getnotifications(request):

    accounts = Account.objects.filter(newrequest=True).order_by("first_name", "last_name")
    account_paginator = Paginator(accounts, 13)
    page_num = request.GET.get("page")
    page = account_paginator.get_page(page_num)

    return render(request, "courses/notifications.html", {
        "page": page,
    })

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def ignore(request, account_id):

    student = Account.objects.get(pk=account_id)

    student.newrequest = False
    student.save()

    return HttpResponseRedirect(reverse("courses:student", args=(student.id,)))

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def payment(request, attendance_id):

    attendance = Attendance.objects.get(pk=attendance_id)

    if request.method == "POST":
        
        if request.POST.get("cycle", False) == "on":
            attendance.cycle = True
        
        else:
            attendance.cycle = False
        
        if request.POST.get("recover", False) == "on":
            attendance.recover = True
        
        else:
            attendance.recover = False
        
        attendance.quota = request.POST["payment"]

        if request.POST["note"]:
            attendance.note = request.POST["note"].strip()
        else:
            attendance.note = ""

        attendance.save()

        return HttpResponseRedirect(reverse("courses:course", args=(attendance.course.id,)))

    else:
        return render(request, 'courses/course.html', {
            "payment": True,
            "attendance": attendance,
            "course": attendance.course,
        })

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def past_student_courses(request, account_id):

    student = Account.objects.get(pk=account_id)
    old_courses = student.courses.filter(date__lt=datetime.datetime.now()).order_by('date','start_time')
    old_course_paginator = Paginator(old_courses, 10)
    page_num = request.GET.get("page")
    old_page = old_course_paginator.get_page(page_num)

    return render(request, 'courses/history.html', {
        "old_page": old_page,
        "student": student,
        "message": "Anteriores",
    })

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def next_student_courses(request, account_id):

    student = Account.objects.get(pk=account_id)
    next_courses = student.courses.filter(date__gt=datetime.datetime.now()).order_by('date','start_time')
    next_course_paginator = Paginator(next_courses, 10)
    page_num = request.GET.get("page")
    next_page = next_course_paginator.get_page(page_num)

    return render(request, 'courses/history.html', {
        "next_page": next_page,
        "student": student,
        "message": "Proximos",
    })

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def past_courses(request):

    old_courses = Course.objects.filter(date__lt=datetime.datetime.now()).order_by('date','start_time')
    old_course_paginator = Paginator(old_courses, 10)
    page_num = request.GET.get("page")
    old_page = old_course_paginator.get_page(page_num)

    return render(request, 'courses/courses.html', {
        "old_page": old_page,
        "message": "Anteriores",
    })

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def next_courses(request):

    next_courses = Course.objects.filter(date__gt=datetime.datetime.now()).order_by('date','start_time')
    next_course_paginator = Paginator(next_courses, 10)
    page_num = request.GET.get("page")
    next_page = next_course_paginator.get_page(page_num)

    return render(request, 'courses/courses.html', {
        "next_page": next_page,
        "message": "Proximos",
    })

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def assign(request):

    if request.method == "POST":
        courses = request.POST.getlist("courses")
        students = request.POST.getlist("students")

        for course_id in courses:

            for student_id in students:
                student = Account.objects.get(pk=student_id)
                course = Course.objects.get(pk=course_id)

                if student not in course.students.all():
                    attendance = Attendance(course=course, student=student)
                    attendance.save()
                    course.students.add(student)
            
            course.save()
        
        return HttpResponseRedirect(reverse("courses:courses"))

    else:

        return render(request, 'courses/assign.html', {
            "form": CourseForm(
                students=None,
            ),

            "courses_form": Student_CourseForm(
                courses = None,
            ),
            
        })

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def quota(request, student_id):

    student = Account.objects.get(pk=student_id)

    if request.POST["quota"]:
        student.note = request.POST["quota"].strip()
    
    else:
        student.note = ""
    
    student.save()
    return HttpResponseRedirect(reverse("courses:student", args=(student_id,)))

def check(student):

    if student.first_name_1 != None and student.first_name_1 != student.first_name:
        return True

    if student.last_name_1 != None and student.last_name_1 != student.last_name:
        return True

    if student.identity_document_1 != None and student.identity_document != None:
        if student.identity_document_1 != None:
            if int(student.identity_document_1) != int(student.identity_document):
                return True
    
    if student.phone_1_1 != None and student.phone_1 != None:
        if student.phone_1_1 != None:
            if int(student.phone_1_1) != int(student.phone_1):
                return True
    
    if student.phone_2_1 != None and student.phone_2 != None:
        if student.phone_2_1 != None:
            if int(student.phone_2_1) != int(student.phone_2):
                return True
    
    return False

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def update_first_name(request, account_id):
    
    student = Account.objects.get(pk=account_id)
    student.first_name = student.first_name_1
    student.newrequest = check(student)
    student.save()
    return HttpResponseRedirect(reverse("courses:student", args=(student.id,)))

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def reject_first_name(request, account_id):
    
    student = Account.objects.get(pk=account_id)
    student.first_name_1 = None
    student.newrequest = check(student)
    student.save()
    return HttpResponseRedirect(reverse("courses:student", args=(student.id,)))

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def update_last_name(request, account_id):
    
    student = Account.objects.get(pk=account_id)
    student.last_name = student.last_name_1
    student.newrequest = check(student)
    student.save()
    return HttpResponseRedirect(reverse("courses:student", args=(student.id,)))

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def reject_last_name(request, account_id):
    
    student = Account.objects.get(pk=account_id)
    student.last_name_1 = None
    student.newrequest = check(student)
    student.save()
    return HttpResponseRedirect(reverse("courses:student", args=(student.id,)))

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def update_id(request, account_id):
    
    student = Account.objects.get(pk=account_id)
    student.identity_document = student.identity_document_1
    student.newrequest = check(student)
    student.save()
    return HttpResponseRedirect(reverse("courses:student", args=(student.id,)))

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def reject_id(request, account_id):
    
    student = Account.objects.get(pk=account_id)
    student.identity_document_1 = None
    student.newrequest = check(student)
    student.save()
    return HttpResponseRedirect(reverse("courses:student", args=(student.id,)))

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def update_phone_1(request, account_id):
    
    student = Account.objects.get(pk=account_id)
    student.phone_1 = student.phone_1_1
    student.newrequest = check(student)
    student.save()
    return HttpResponseRedirect(reverse("courses:student", args=(student.id,)))

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def reject_phone_1(request, account_id):
    
    student = Account.objects.get(pk=account_id)
    student.phone_1_1 = None
    student.newrequest = check(student)
    student.save()
    return HttpResponseRedirect(reverse("courses:student", args=(student.id,)))

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def update_phone_2(request, account_id):
    
    student = Account.objects.get(pk=account_id)
    student.phone_2 = student.phone_2_1
    student.newrequest = check(student)
    student.save()
    return HttpResponseRedirect(reverse("courses:student", args=(student.id,)))

@staff_member_required(login_url=HttpResponseRedirect(reverse("login")))
def reject_phone_2(request, account_id):
    
    student = Account.objects.get(pk=account_id)
    student.phone_2_1 = None
    student.newrequest = check(student)
    student.save()
    return HttpResponseRedirect(reverse("courses:student", args=(student.id,)))

def login_view(request):

    if request.method == "POST":

        secret_key = settings.RECAPTCHA_SECRET_KEY

        # captcha verification
        data = {
            'response': request.POST.get('g-recaptcha-response'),
            'secret': secret_key
        }
        resp = requests.post('https://www.google.com/recaptcha/api/siteverify', data=data)
        result_json = resp.json()

        # print(result_json)

        if not result_json.get('success'):
            return render(request, "courses/login.html", {
                "message": "Tranquila/o!, ¿Qué haces? Tenemos tu IP, te contactamos pronto.",
                'site_key': settings.RECAPTCHA_SITE_KEY
            })
        # end captcha verification
        
        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(request, username=username, password=password)

        if user is not None and user.is_admin:
            login(request, user)
            return HttpResponseRedirect(reverse("courses:index"))
        
        else:
            return render(request, "courses/login.html", {
                "message": "Usuario y/o Contraseña de Administrador invalidas.",
                'site_key': settings.RECAPTCHA_SITE_KEY
            })
    else:
        return render(request, "courses/login.html", {
            'site_key': settings.RECAPTCHA_SITE_KEY
        })

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))
