from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
@csrf_exempt
def index(request):
    return JsonResponse({ "message" : "hello, world!"})


def login_view(request):
    pass

def logout_view(request):
    pass

@csrf_exempt
def signup_view(request):
    return JsonResponse({"message" : "signup"})

def show_assignments(request):
    return JsonResponse({ "message" : "hello, world!"})

def delete_assignment(request):
    return JsonResponse({"message" : "Assignment is deleted"})

def create_assignment(request):
    print("Assignment is created")
    return JsonResponse({"message" : "Assignment is created"})

def assignment_details(request):
    pass