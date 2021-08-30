from django import template
import os
register = template.Library()

BASE_DIR = os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))))
modals = os.path.join(BASE_DIR, "templates", "components")


@register.inclusion_tag(os.path.join(modals, "search_user.html"))
def search_user(): return {}


@register.inclusion_tag(os.path.join(modals, "schedule.html"))
def schedule(user, modal=False): return {
    "user": user,
    "modal": modal,
}


@register.inclusion_tag(os.path.join(modals, "levels.html"))
def levels(current_user, user, modal=False): return {
    "current_user": current_user,
    "user": user,
    "modal": modal,
}


@register.inclusion_tag(os.path.join(modals, "statistics.html"))
def statistics(current_user, user, modal=False): return {
    "current_user": current_user,
    "user": user,
    "modal": modal,
}


@register.inclusion_tag(os.path.join(modals, "notes.html"))
def notes(current_user, user, noteForm): return {
    "current_user": current_user,
    "user": user,
    "noteForm": noteForm,
}


@register.inclusion_tag(os.path.join(modals, "information.html"))
def information(current_user, user, modal=False, userForm=None, signatureForm=None, age=None): return {
    "current_user": current_user,
    "user": user,
    "modal": modal,
    "signatureForm": signatureForm,
    "userForm": userForm,
    "age": age,
}


@register.inclusion_tag(os.path.join(modals, "attendances.html"))
def attendances(current_user, user, modal=False, coursesForm=None): return {
    "user": user,
    "current_user": current_user,
    "modal": modal,
    "coursesForm": coursesForm,
}


@register.inclusion_tag(os.path.join(modals, "checker.html"))
def checker(current_user): return {
    "current_user": current_user,
}
