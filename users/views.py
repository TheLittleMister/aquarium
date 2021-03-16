from django.shortcuts import render
import unidecode
import datetime
from django import forms
from django.urls import reverse
from django.core.paginator import Paginator
from django.http import HttpResponse, HttpResponseRedirect
from users.models import Account, Id_Type, Nationality, Sex

class StudentForm(forms.Form):

    def __init__(self, *args, **kwargs):
        image = kwargs.pop("image")

        super(StudentForm, self).__init__(*args, **kwargs)

        self.fields["image"].initial = image
    
    image = forms.ImageField(label="", required=False)


# Create your views here.

def index(request, account_id):

    try:
        student = Account.objects.get(pk=account_id)
    
    except:
        return HttpResponseRedirect(reverse("index"))

    if request.user == student:

        message = ""

        if request.method == "POST":
            student.first_name_1 = unidecode.unidecode(request.POST["first_name"]).upper().strip()

            if student.first_name_1 != student.first_name:
                student.newrequest = True
            
            student.last_name_1 = unidecode.unidecode(request.POST["last_name"]).upper().strip()

            if student.last_name_1 != student.last_name:
                student.newrequest = True
            
            student.id_type = Id_Type.objects.get(pk=int(request.POST["id_type"]))

            if request.POST["identity_document"].isdigit():

                check = 0

                # First Check
                try:
                    if int(request.POST["identity_document"]) != student.identity_document:

                        try:
                            Account.objects.get(identity_document=request.POST["identity_document"])
                            check += 1

                        except:
                            pass
                except:
                    pass
                    # try:
                    #     Account.objects.get(identity_document=request.POST["identity_document"])
                    #     check += 1

                    # except:
                    #     pass
                
                # Second Check (Try)
                try:
                    if int(request.POST["identity_document"]) != student.identity_document_1:

                        try:
                            Account.objects.get(identity_document_1=request.POST["identity_document"])
                            check += 1
                        
                        except:
                            pass
                except:
                    pass
                    # try:
                    #     already = Account.objects.get(identity_document_1=request.POST["identity_document"])
                    #     check += 1
                    
                    # except:
                    #     pass
                
                if check > 0:
                    message += " No. de Documento ya está en uso."
                
                else:
                    if not student.identity_document:
                        student.identity_document = request.POST["identity_document"]
                        student.identity_document_1 = request.POST["identity_document"]
                    
                    if request.POST["identity_document"] != "":
                        if int(student.identity_document) != int(request.POST["identity_document"]):
                            student.newrequest = True
                            student.identity_document_1 = request.POST["identity_document"]
                    
                    else:
                        student.identity_document_1 = request.POST["identity_document"]

                    

            else:
                student.identity_document_1 = None
            
            student.nationality = Nationality.objects.get(pk=int(request.POST["nationality"]))
            student.sex = Sex.objects.get(pk=int(request.POST["sex"]))

            if request.POST["date_birth"]:
                student.date_birth = request.POST["date_birth"]
            else:
                student.date_birth = None

            if request.POST["email"]:

                if student.email != request.POST["email"].lower():

                    try:
                        Account.objects.get(email=request.POST["email"].lower())
                        message += " Correo ya está en uso."

                    except:
                        student.email = request.POST["email"].lower()
                    
            else:
                student.email = None

            student.parent = unidecode.unidecode(request.POST["parent"]).upper()

            if request.POST["phone_1"].isdigit():
                if not student.phone_1:
                    student.phone_1 = request.POST["phone_1"]
                    student.phone_1_1 = request.POST["phone_1"]
                
                if request.POST["phone_1"] != "":
                    if int(student.phone_1) != int(request.POST["phone_1"]):
                        student.newrequest = True
                        student.phone_1_1 = request.POST["phone_1"]
                
                else:
                    student.phone_1_1 = request.POST["phone_1"]

            
            else:
                student.phone_1_1 = None
            
            if request.POST["phone_2"].isdigit():
                if not student.phone_2:
                    student.phone_2 = request.POST["phone_2"]
                    student.phone_2_1 = request.POST["phone_2"]
                
                if request.POST["phone_2"] != "":
                    if int(student.phone_2) != int(request.POST["phone_2"]):
                        student.newrequest = True
                        student.phone_2_1 = request.POST["phone_2"]
                
                else:
                    student.phone_2_1 = request.POST["phone_2"]

            else:
                student.phone_2_1 = None

            if request.POST.get("image-clear", False) == "on":

                if student.image != 'default-profile.png':
                    student.image.delete()

                student.image = 'default-profile.png'
            
            elif request.FILES.get("image", False) != False and 'image' in request.FILES["image"].content_type:

                if student.image != 'default-profile.png':
                    student.image.delete()

                student.image = request.FILES["image"]

            student.save()
            # return HttpResponseRedirect(reverse('users:index', args=(student.id,)))

        courses = student.courses.filter(date__gte=datetime.datetime.now()).order_by('date','start_time')

        course_paginator = Paginator(courses, 10)
        page_num = request.GET.get("page")
        page = course_paginator.get_page(page_num)
    
        schedule = []
        for course in courses:
            
            week = {0: [""], 1: [""], 2: [""], 3: [""], 4: [""], 5: [""], 6: [""]}
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

        try:
            year = str(student.date_birth)[0:4]
            month = str(student.date_birth)[5:7]
            day = str(student.date_birth)[8:10]

            date_birth = datetime.date(int(year), int(month), int(day))
    
        except:
            date_birth = str(student.date_birth)
        
        date_birth_form = str(student.date_birth)

        return render(request, "users/profile.html", {
            "message": message,
            "user": student,
            "schedule": schedule,
            "page": page,
            "date_birth": date_birth,
            "date_birth_form": date_birth_form,
            "nationalities": Nationality.objects.all(),
            "ids": Id_Type.objects.all(),
            "sex": Sex.objects.all(),
            "form": StudentForm(
                image = student.image,
            ),
        })
    
    else:
        return HttpResponseRedirect(reverse("index"))

def courses(request, account_id):

    try:
        student = Account.objects.get(pk=account_id)
    
    except:
        return HttpResponseRedirect(reverse("index"))

    if request.user == student:

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
        
        return render(request, "users/courses.html", {
            "past": past,
            "results": results,
            "student": student,
            "old_page": old_page,
            "next_page": next_page,
            "today_page": today_page,

        })
    
    else:
        return HttpResponseRedirect(reverse("index"))  
