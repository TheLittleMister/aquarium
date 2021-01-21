from .models import Account
from django.db.models import Q


class AuthBackend(object):
    supports_object_permissions = True
    supports_anonymous_user = False
    supports_inactive_user = False


    def authenticate(self, request, username=None, password=None):
        
        try:
            
            if username.isdigit():
                user = Account.objects.get(
                    Q(identity_document=username) | Q(identity_document_1=username)
                )
            
            else:
                user = Account.objects.get(
                    Q(username=username) | Q(email=username)
                )

        except Account.DoesNotExist:
            return None

        
        return user if user.check_password(password) else None

    def get_user(self, user_id):
        try:
            return Account.objects.get(pk=user_id)
        except Account.DoesNotExist:
            return None