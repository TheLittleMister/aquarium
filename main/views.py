from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect

# Create your views here.
def index(request):
    return render(request, 'main/soon.html')
    # return HttpResponse("Hello, World!")