from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Account, Id_Type, Sex, Nationality

# Register your models here.
class AccountAdmin(UserAdmin):
    list_display = ("username", "identity_document", "first_name", "last_name", "is_admin",)
    search_fields = ("username", "identity_document", "phone_1", "phone_2", "first_name", "last_name",)
    readonly_fields = ("date_joined", "last_login",)
    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()

admin.site.register(Account, AccountAdmin)
admin.site.register(Id_Type)
admin.site.register(Sex)
admin.site.register(Nationality)
