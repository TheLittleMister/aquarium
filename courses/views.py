from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.conf import settings
from django.db.models import Q
from PIL import Image, ImageFont, ImageDraw
import datetime
from io import BytesIO
from django.core.files import File
from numerize import numerize
#import locale

# MODELS
from .models import *
from users.models import *

# FORMS
from .forms import *
from .utils import *
from .labels import *

# Create your views here.

mysite = "https://aquariumschool.co/"
# mysite = "http://172.0.0.1:8000/"

# USERS FUNCTIONS


@staff_member_required(login_url=mysite)
def students(request):
    return render(request, 'courses/students.html', {
        'studentForm': RegistrationForm(),
        'adminBar': True,
        'changeCount': numerize.numerize(Account.objects.filter(newrequest=True).count()),
        'countStudents': numerize.numerize(Account.objects.all().count()),
        'countActiveStudents': numerize.numerize(Account.objects.filter(courses__date__gte=datetime.datetime.now()).distinct().count()),
    })


@staff_member_required(login_url=mysite)
def load_students(request):

    response = {
        'students': list(),
        'all_loaded': False,
    }

    # Get start and end points
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or (start + 20))

    # Generate list of students
    response['students'] += list(Account.objects.filter(is_admin=False, is_teacher=False).values(
        'id', 'identity_document', 'first_name', 'last_name', 'phone_1', 'phone_2', 'last_login').order_by('-last_login')[start:end])

    # Check if all is already loaded
    if end >= Account.objects.filter(is_admin=False, is_teacher=False).count():
        response['all_loaded'] = True

    # Return serialized student's data
    return JsonResponse(response, status=200)


@staff_member_required(login_url=mysite)
def load_active_students(request):

    response = {
        'students': list(),
        'all_loaded': False,
    }

    start = int(request.GET.get("start"))
    end = int(request.GET.get("end"))

    response["students"] += list(Account.objects.filter(courses__date__gte=datetime.datetime.now()).values(
        'id', 'identity_document', 'first_name', 'last_name', 'phone_1', 'phone_2', 'last_login').distinct()[start:end])

    if end >= Account.objects.filter(courses__date__gte=datetime.datetime.now()).distinct().count():
        response["all_loaded"] = True

    return JsonResponse(response, status=200)


@staff_member_required(login_url=mysite)
def search_active_students(request):

    response = {
        'students': list(),
    }

    search = request.GET.get("student").strip()

    if len(search) > 1:
        response["students"] += list(Account.objects.filter(Q(username__icontains=search) | Q(email__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(identity_document__icontains=search) | Q(phone_1__icontains=search) | Q(phone_2__icontains=search), courses__date__gte=datetime.datetime.now()).values(
            'id', 'identity_document', 'first_name', 'last_name', 'phone_1', 'phone_2').distinct())

    return JsonResponse(response, status=200)


@staff_member_required(login_url=mysite)
def search_students(request):

    response = {
        'students': list()
    }

    search = request.GET.get("student").strip()

    if len(search) > 1:
        response["students"] += list(Account.objects.filter(Q(username__icontains=search) | Q(email__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(identity_document__icontains=search) | Q(phone_1__icontains=search) | Q(phone_2__icontains=search), is_admin=False, is_teacher=False).values(
            'id', 'identity_document', 'first_name', 'last_name', 'phone_1', 'phone_2', 'last_login').order_by('-last_login'))

    return JsonResponse(response, status=200)


@staff_member_required(login_url=mysite)
def create_student(request):

    response = {
        'userID': None,
        'messages': list(),
    }

    form = RegistrationForm(request.POST)

    if form.is_valid():
        user = form.save()
        if not user.email:
            user.email = None
            user.save()

        response["userID"] = user.id

    else:
        for key in form.errors.as_data():
            response["messages"].append(
                str(form.errors.as_data()[key][0])[2:-2].replace('Account', 'cuenta'))

    return JsonResponse(response, status=200)


@staff_member_required(login_url=mysite)
def student(request, student_id):

    student = Account.objects.get(pk=student_id)

    age = round((datetime.date.today() - student.date_birth).days //
                365.25) if student.date_birth else None

    return render(request, 'courses/student.html', {
        'user': student,
        'age': age,
        'studentForm': StudentForm(instance=student),
        'coursesForm': CoursesForm(initial={
            'courses': student.courses.filter(
                date__gte=datetime.datetime.now()).order_by('date', 'start_time'),
        }),
        'adminBar': True,
    })


def create_schedule(request):

    courses = Account.objects.get(pk=request.GET.get("userID")).courses.filter(
        date__gte=datetime.datetime.now()).values('start_time', 'end_time', 'date').order_by('date', 'start_time')

    return JsonResponse({'schedule': get_schedule(courses)}, status=200)


def student_statistics(request):
    return JsonResponse(get_student_statistics(Account.objects.get(pk=request.GET.get("userID"))), status=200)


@staff_member_required(login_url=mysite)
def inconsistencies(request):

    response = {
        'students': list()
    }

    for student in Account.objects.filter(courses__date__gte=datetime.datetime.now()).distinct():
        if student.attendances.filter(quota="PAGO", recover=False, onlyday=False).count() % 4 != 0:
            response["students"].append({
                'id': student.id,
                'document': student.identity_document,
                'first_name': student.first_name,
                'last_name': student.last_name,
                'phone_1': student.phone_1,
                'phone_2': student.phone_2,
                'exception': student.ignore,
            })

    return JsonResponse(response, status=200)


@staff_member_required(login_url=mysite)
def change_exception(request, student_id):

    student = Account.objects.get(pk=student_id)
    student.ignore = False if student.ignore else True
    student.save()

    return JsonResponse({'exception': student.ignore}, status=200)


@staff_member_required(login_url=mysite)
def plus(request):

    response = {
        'students': list()
    }

    for student in Account.objects.filter(courses__date__gte=datetime.datetime.now()).distinct():

        week = set()
        courses = student.courses.filter(date__gte=datetime.datetime.now(
        ) - datetime.timedelta(30)).order_by('date', 'start_time')

        for course in courses:

            week.add(course.date.weekday())

            if len(week) > 1:
                response["students"].append({
                    'id': student.id,
                    'document': student.identity_document,
                    'first_name': student.first_name,
                    'last_name': student.last_name,
                    'phone_1': student.phone_1,
                    'phone_2': student.phone_2,

                })
                break

    return JsonResponse(response, status=200)


@staff_member_required(login_url=mysite)
def change(request):

    response = {
        'students': list()
    }

    response["students"] += list(Account.objects.filter(newrequest=True).values(
        'id', 'identity_document', 'first_name', 'last_name', 'phone_1', 'phone_2'))

    return JsonResponse(response, status=200)


@staff_member_required(login_url=mysite)
def teachers(request):

    response = {
        'students': list()
    }

    response["students"] += list(Account.objects.filter(is_teacher=True).values(
        'id', 'identity_document', 'first_name', 'last_name', 'phone_1', 'phone_2', 'last_login'))

    return JsonResponse(response, status=200)


def levels(request, student_id):

    response = dict()
    student = Account.objects.get(pk=student_id)

    if request.user.is_admin or request.user.is_teacher or request.user == student:

        for level in Level.objects.all():

            student_level, created = Student_Level.objects.get_or_create(
                student=student, level=level)

            response[level.name] = {
                'studentLevelID': student_level.id,
                'levelID': student_level.level.id,
                'date': student_level.date,
                'attendances': student_level.attendances,
                'is_active': student_level.is_active,
            }

    else:
        response["Privilege"] = "Restricted"

    return JsonResponse(response, status=200)


def level_info(request, student_level_id):

    if request.user.is_admin or request.user.is_teacher:
        student_level = Student_Level.objects.filter(
            pk=student_level_id).values("level__name")

        form = StudentLevelForm(
            instance=Student_Level.objects.get(pk=student_level_id))

        return JsonResponse({
            'form': form.as_p(),
            'name': student_level[0]["level__name"],
        }, status=200)
    else:
        return JsonResponse({"Privilege": "Restricted"}, status=200)


def edit_level(request, student_level_id):

    response = {
        'edited': False,
        'messages': list(),
    }

    if request.user.is_admin or request.user.is_teacher:
        student_level = Student_Level.objects.get(pk=student_level_id)
        form = StudentLevelForm(request.POST, instance=student_level)

        if form.is_valid():
            student_level = form.save()
            student_level.is_active = True
            student_level.save()
            response["edited"] = True
            response["userID"] = student_level.student.id

        else:
            for key in form.errors.as_data():
                response["messages"].append(
                    str(form.errors.as_data()[key][0])[2:-2])
    else:
        response["Privilege"] = "Restricted"

    return JsonResponse(response, status=200)


def deactivate_level(request, student_level_id):

    response = {
        'userID': None,
    }

    if request.user.is_admin or request.user.is_teacher:
        student_level = Student_Level.objects.get(pk=student_level_id)
        student_level.is_active = False
        response["userID"] = student_level.student.id
        student_level.save()

    else:
        response["Privilege"] = "Restricted"

    return JsonResponse(response, status=200)


# END USERS FUNCTIONS

# ATTENDANCES FUNCTIONS

def load_future_attendances(request):

    response = {
        'attendances': list(),
        'all_loaded': False,
    }

    # Get start and end points / and user id
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or (start + 20))
    user_id = int(request.GET.get("userID"))

    # Generate list of future attendances

    response['attendances'] += list(Attendance.objects.filter(student=user_id, course__date__gte=datetime.datetime.now(
    )).values('id', 'course__id', 'cycle', 'end_cycle', 'recover', 'onlyday', 'attendance', 'quota', 'note').order_by('course__date')[start:end])

    # Check if all is already loaded
    if end >= Attendance.objects.filter(student=user_id, course__date__gte=datetime.datetime.now()).count():
        response['all_loaded'] = True

    # Return serialized student attendances data
    return JsonResponse(response, status=200)


def load_past_attendances(request):

    response = {
        'attendances': list(),
        'all_loaded': False,
    }

    # Get start and end points / and user id
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or (start + 20))
    user_id = int(request.GET.get("userID"))

    # Generate list of past attendances

    response['attendances'] += list(Attendance.objects.filter(student=user_id, course__date__lt=datetime.datetime.now(
    )).values('id', 'course__id', 'cycle', 'end_cycle', 'recover', 'onlyday', 'attendance', 'quota', 'note').order_by('-course__date')[start:end])

    # Check if all is already loaded
    if end >= Attendance.objects.filter(student=user_id, course__date__gte=datetime.datetime.now()).count():
        response['all_loaded'] = True

    # Return serialized student attendances data
    return JsonResponse(response, status=200)


@staff_member_required(login_url=mysite)
def change_attendance(request, attendance_id):

    response = {
        'attendance': None,
        'past': False,
    }

    attendance = Attendance.objects.get(pk=int(attendance_id))
    attendance.attendance = False if attendance.attendance else True
    attendance.save()
    response["attendance"] = attendance.attendance

    if attendance.course.date < datetime.date.today():
        response["past"] = True

    return JsonResponse(response, status=200)


@staff_member_required(login_url=mysite)
def change_quota(request, attendance_id):

    attendance = Attendance.objects.get(pk=int(attendance_id))
    attendance.quota = 'PAGO' if attendance.quota == 'SEPARADO' else 'SEPARADO'
    attendance.save()

    return JsonResponse({'quota': attendance.quota}, status=200)


@staff_member_required(login_url=mysite)
def attendance_info(request, attendance_id):

    form = AttendanceForm(
        instance=Attendance.objects.get(pk=int(attendance_id)))

    return JsonResponse(
        {
            'attendance': list(Attendance.objects.filter(pk=int(attendance_id)).values('cycle', 'end_cycle', 'recover', 'onlyday', 'note', 'image')),
            'form': form.as_p(),
        },
        status=200
    )


@staff_member_required(login_url=mysite)
def change_cycle(request, attendance_id):

    attendance = Attendance.objects.get(pk=int(attendance_id))

    if not attendance.cycle and not attendance.end_cycle:
        attendance.cycle = True
        attendance.end_cycle = False

    elif attendance.cycle and not attendance.end_cycle:
        attendance.end_cycle = True
        attendance.cycle = False

    else:
        attendance.cycle = attendance.end_cycle = False

    attendance.save()

    return JsonResponse({'cycle': attendance.cycle, 'end_cycle': attendance.end_cycle}, status=200)


@staff_member_required(login_url=mysite)
def change_day(request, attendance_id):

    attendance = Attendance.objects.get(pk=int(attendance_id))

    if not attendance.onlyday and not attendance.recover:
        attendance.onlyday = False
        attendance.recover = True

    elif attendance.recover and not attendance.onlyday:
        attendance.recover = False
        attendance.onlyday = True

    else:
        attendance.onlyday = attendance.recover = False

    attendance.save()

    return JsonResponse({'onlyday': attendance.onlyday, 'recover': attendance.recover}, status=200)


@staff_member_required(login_url=mysite)
def edit_attendance(request, attendance_id):

    response = {
        'note': None,
        'attendanceID': attendance_id,
        'edited': False,
        'form': None,
        'messages': list(),
    }

    attendance = Attendance.objects.get(pk=attendance_id)

    form = AttendanceForm(request.POST, request.FILES,  instance=attendance)

    if form.is_valid():
        attendance = form.save()
        response["edited"] = True
        response["note"] = attendance.note

        form = AttendanceForm(instance=attendance)
        response["form"] = form.as_p()

    else:
        for key in form.errors.as_data():
            response["messages"].append(
                str(form.errors.as_data()[key][0])[2:-2])

    return JsonResponse(response, status=200)


def search_attendance(request):

    response = {
        'attendances': list(),
        'past': False,
    }

    date = request.GET.get("date", "")
    userID = request.GET.get("userID")

    if date:
        response["attendances"] += list(Attendance.objects.filter(course__date=date, student=userID).values(
            'id', 'course__id', 'cycle', 'end_cycle', 'recover', 'onlyday', 'attendance', 'quota', 'note').order_by('course__date'))

    if datetime.datetime.strptime(date, "%Y-%m-%d").date() < datetime.date.today():
        response['past'] = True

    return JsonResponse(response, status=200)


def date_attendances(request):

    response = {
        'attendances_count': 0,
        'percentage': None,
        'studentLevelID': request.GET.get("studentLevelID"),
        'levelID': request.GET.get("levelID"),
        'date': request.GET.get('date'),
        'levelAttendances': request.GET.get('levelAttendances'),
        'certificate_img': None,
        'certificate_pdf': None,
    }

    student_level = Student_Level.objects.get(
        pk=int(response["studentLevelID"]))

    if student_level.certificate_img and student_level.certificate_pdf:
        response["certificate_img"] = student_level.certificate_img.url
        response["certificate_pdf"] = student_level.certificate_pdf.url

    try:

        response["attendances_count"] = Attendance.objects.filter(course__date__gte=request.GET.get(
            'date'), student=request.GET.get("userID"), attendance=True).count()

        percentage = round(Attendance.objects.filter(course__date__gte=request.GET.get('date'), student=request.GET.get("userID"), attendance=True).count(
        ) * 100 / int(request.GET.get("levelAttendances")), 1)

        response['percentage'] = percentage if percentage < 101 else 100

    except:
        response['percentage'] = 0

    return JsonResponse(response, status=200)

# COURSES FUNCTION


def course_info(request, course_id):

    response = {
        'course_id': course_id,
        'courseStr': None,
        'courseCount': None,
        'today': False,
    }

    course = Course.objects.get(pk=course_id)

    response["courseStr"] = course.__str__()
    response["courseCount"] = course.students.count()

    if course.date == datetime.date.today():
        response["today"] = True

    return JsonResponse(response, status=200)


@staff_member_required(login_url=mysite)
def edit_courses(request, user_id):

    student = Account.objects.get(pk=user_id)
    form = CoursesForm(request.POST)

    if form.is_valid():

        query = student.courses.filter(date__gte=datetime.datetime.now())

        remove_courses = set(query) - set(form.cleaned_data["courses"])
        add_courses = set(form.cleaned_data["courses"]) - set(query)

        for course in remove_courses:
            Attendance.objects.get(student=student, course=course).delete()
            student.courses.remove(course)

        for course in add_courses:
            Attendance.objects.create(student=student, course=course)
            student.courses.add(course)

    return HttpResponseRedirect(reverse('courses:student', args=(user_id,)))


@staff_member_required(login_url=mysite)
def courses(request):
    return render(request, 'courses/courses.html', {
        'createCoursesForm': CreateCoursesForm(),
        'adminBar': True,
    })


@staff_member_required(login_url=mysite)
def load_past_courses(request):

    response = {
        'courses': list(),
        'all_loaded': False,
    }

    # Get start and end points
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or (start + 20))

    # Generate list of old courses

    response["courses"] += list(Course.objects.filter(
        date__lt=datetime.datetime.now()).values('id').order_by("-date")[start:end])

    # Check if all is already loaded
    if end >= Course.objects.filter(date__lt=datetime.datetime.now()).count():
        response["all_loaded"] = True

    return JsonResponse(response, status=200)


@staff_member_required(login_url=mysite)
def load_future_courses(request):

    response = {
        'courses': list(),
        'all_loaded': False,
    }

    # Get start and end points
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or (start + 20))

    # Generate list of future courses

    response["courses"] += list(Course.objects.filter(
        date__gte=datetime.datetime.now()).values('id').order_by("date", "start_time")[start:end])

    # Check if all is already loaded
    if end >= Course.objects.filter(date__gte=datetime.datetime.now()).count():
        response["all_loaded"] = True

    return JsonResponse(response, status=200)


@staff_member_required(login_url=mysite)
def search_course(request):

    response = {
        "courses": list(),
    }

    date = request.GET.get("date", "")

    if date:
        response["courses"] += list(
            Course.objects.filter(date=date).values("id"))

    return JsonResponse(response, status=200)


@staff_member_required(login_url=mysite)
def create_courses(request):

    response = {
        'courses': list(),
        'messages': list(),
    }

    form = CreateCoursesForm(request.POST)
    dates = set(request.POST.getlist("dates"))

    if form.is_valid() and dates:

        start_time = form.cleaned_data["start_time"]
        end_time = form.cleaned_data["end_time"]

        for date in dates:

            course, created = Course.objects.get_or_create(
                start_time=start_time, end_time=end_time, date=date)

            for student in form.cleaned_data["students"]:

                if not Attendance.objects.filter(student=student, course=course).exists():
                    Attendance.objects.create(student=student, course=course)

                course.students.add(student)

            for teacher in form.cleaned_data["teachers"]:
                course.teachers.add(teacher)

            response["courses"] += [
                {
                    "id": course.id,
                    "str": Course.objects.get(start_time=start_time, end_time=end_time, date=date).__str__(),
                    "count": course.students.count(),
                }
            ]

    else:
        for key in form.errors.as_data():
            response["messages"].append(
                str(form.errors.as_data()[key][0])[2:-2])

    return JsonResponse(response, status=200)


@staff_member_required(login_url=mysite)
def course(request, course_id):

    course = Course.objects.get(pk=course_id)

    return render(request, 'courses/course.html', {
        'course': course,
        'past':  course.date < datetime.date.today(),
        'editCourseForm': EditCourseForm(instance=course),
        'adminBar': True,
    })


@staff_member_required(login_url=mysite)
def edit_course(request, course_id):

    response = {
        'edited': False,
        'messages': list()
    }

    course = Course.objects.get(pk=course_id)

    form = EditCourseForm(request.POST, instance=course)

    if form.is_valid():

        start_time = form.cleaned_data["start_time"]
        end_time = form.cleaned_data["end_time"]
        date = form.cleaned_data["date"]

        courses = Course.objects.filter(
            start_time=start_time, end_time=end_time, date=date)

        if not courses or courses[0] == course:

            query = course.students.all()

            remove_students = set(query) - set(form.cleaned_data["students"])
            add_students = set(form.cleaned_data["students"]) - set(query)

            for student in remove_students:
                Attendance.objects.get(student=student, course=course).delete()

            for student in add_students:
                Attendance.objects.create(student=student, course=course)

            form.save()
            response["edited"] = True

        else:
            response["messages"] += ["Este curso ya existe!"]

    else:
        for key in form.errors.as_data():
            response["messages"].append(
                str(form.errors.as_data()[key][0])[2:-2])

    return JsonResponse(response, status=200)


@staff_member_required(login_url=mysite)
def delete_course(request, course_id):
    Course.objects.get(pk=course_id).delete()
    return HttpResponseRedirect(reverse("courses:courses"))


@staff_member_required(login_url=mysite)
def print_courses(request):

    date = request.GET.get('date')
    courses = Course.objects.filter(date=date)
    schedules = get_schedules(courses)

    return render(request, 'courses/print.html', {
        'todayDate': datetime.datetime.strptime(date, "%Y-%m-%d").date(),
        'date': date,
        'schedules': schedules,
        'adminBar': True,
    })


@staff_member_required(login_url=mysite)
def print_course(request, course_id):

    courses = Course.objects.filter(pk=course_id)
    schedules = get_schedules(courses)

    return render(request, 'courses/print.html', {
        'date': courses[0].date,
        'schedules': schedules,
        'adminBar': True,
    })


def generate_certificate(request, student_level_id):

    response = {
        'generated': False,
        'userID': None
    }

    student_level = Student_Level.objects.get(pk=student_level_id)

    response["userID"] = student_level.student.id

    if request.user.is_admin or request.user.is_teacher:

        #locale.setlocale(locale.LC_TIME, 'es')
        media_url = settings.MEDIA_URL

        # img_src = media_url + "certificate.png"
        img_src = 'media/certificate.png' if student_level.student.date_birth and round(
            (datetime.date.today() - student_level.student.date_birth).days // 365.25) > 10 else 'media/certificate_kids.png'

        img = Image.open(img_src)
        draw = ImageDraw.Draw(img)

        # STUDENT NAME
        # font_src = static("fonts/algerian.ttf")
        font_src = "templates/static/fonts/algerian.ttf"

        # font = ImageFont.truetype(<font-file>, <font-size>)
        font = ImageFont.truetype(font_src, 28)

        text = f"{student_level.student.first_name} {student_level.student.last_name}".upper()

        x, y = font.getsize(text)

        # draw.text((x, y),"Sample Text",(r,g,b))
        draw.text(((img.width // 2) - (x // 2), 370),
                  text, (24, 57, 100), font=font)

        # LEVEL NAME

        # font_src = static("fonts/tcm.ttf")
        font_src = "templates/static/fonts/tcm.ttf"

        # font = ImageFont.truetype(<font-file>, <font-size>)
        font = ImageFont.truetype(font_src, 23)

        text = f"POR HABER COMPLETADO {student_level.level.name}".upper(
        )

        x, y = font.getsize(text)

        # draw.text((x, y),"Sample Text",(r,g,b))
        draw.text(((img.width // 2) - (x // 2), 450),
                  text, (83, 83, 83), font=font)

        # TEACHER AND ADMIN NAMES

        # font = ImageFont.truetype(<font-file>, <font-size>)
        font = ImageFont.truetype(font_src, 17)

        text = f"{request.user.first_name} {request.user.last_name}".upper()

        # draw.text((x, y),"Sample Text",(r,g,b))
        draw.text((185, 610), text, (83, 83, 83), font=font)

        text = "ADRIANA PÉREZ"

        # draw.text((x, y),"Sample Text",(r,g,b))
        draw.text((545, 610), text, (83, 83, 83), font=font)

        # DATE
        # font = ImageFont.truetype(font_src, 15)

        day = str(datetime.date.today().strftime('%d')).upper()
        month = get_month(str(datetime.date.today().strftime('%B').upper()))
        year = str(datetime.date.today().strftime('%Y')).upper()

        text = day + " DE " + month + " DEL " + year

        x, y = font.getsize(text)

        # draw.text((x, y),"Sample Text",(r,g,b))
        draw.text(((img.width // 2) - (x // 2), 695),
                  text, (83, 83, 83), font=font)

        blob = BytesIO()
        img.save(blob, 'PNG')
        student_level.certificate_img.save("certificate.png", File(blob))

        blob = BytesIO()
        img.save(blob, 'PDF')
        student_level.certificate_pdf.save("certificate.pdf", File(blob))

        response["generated"] = True

    else:
        response["Privilege"] = "Restricted"

    return JsonResponse(response, status=200)


def delete_certificate(request, student_level_id):

    response = {
        'deleted': False,
        'userID': None
    }

    student_level = Student_Level.objects.get(pk=student_level_id)
    response["userID"] = student_level.student.id

    if request.user.is_admin or request.user.is_teacher:
        student_level.certificate_img.delete()
        student_level.certificate_pdf.delete()
        student_level.save()

        response["deleted"] = True

    else:
        response["Privilege"] = "Restricted"

    return JsonResponse(response, status=200)
