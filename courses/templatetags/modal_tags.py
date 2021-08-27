from django import template
import os
register = template.Library()

BASE_DIR = os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))))
modals = os.path.join(BASE_DIR, "templates", "modals")


@register.inclusion_tag(os.path.join(modals, "modal_level.html"))
def modal_level(): return {}


@register.inclusion_tag(os.path.join(modals, "modal_profile.html"))
def modal_profile(current_user, user=None, userForm=None, noteForm=None): return {
    "current_user": current_user,
    "user": user,
    "userForm": userForm,
    "noteForm": noteForm,
}


@register.inclusion_tag(os.path.join(modals, "modal_edit_level.html"))
def modal_edit_level(): return {}


@register.inclusion_tag(os.path.join(modals, "modal_edit_profile.html"))
def modal_edit_profile(current_user, user, userForm=None): return {
    "user": user,
    "current_user": current_user,
    "userForm": userForm,
}


@register.inclusion_tag(os.path.join(modals, "modal_crop_image.html"))
def modal_crop_image(): return {}


@register.inclusion_tag(os.path.join(modals, "modal_edit_attendance.html"))
def modal_edit_attendance(): return {}


@register.inclusion_tag(os.path.join(modals, "modal_search_attendance.html"))
def modal_search_attendance(current_user, user): return {
    "user": user,
    "current_user": current_user,
}
