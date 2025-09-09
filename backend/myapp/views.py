from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Administrator, Assignment, Mark, Marker, Submission

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
    if request.method == "POST":
        signup_info = json.loads(request.body)
        print(signup_info)
        name = signup_info["name"]
        staff_id = signup_info["staffId"]
        email = signup_info["email"]
        password = signup_info["password"]
        role = signup_info["role"]
        
        admin_by_staff_id = Administrator.objects.filter(staffid=staff_id).first()
        admin_by_email = Administrator.objects.filter(email=email).first()

        marker_by_staff_id = Marker.objects.filter(staffid=staff_id).first()
        marker_by_email = Marker.objects.filter(email=email).first()
        
        # check wether the user has already been registered by staff id
        if (admin_by_staff_id is not None or marker_by_staff_id is not None):
            return JsonResponse({"error" : "User has already been registered"})

        # check whether the user has already been registered by email
        if (admin_by_email is not None or marker_by_email is not None):
            return JsonResponse({"error" : "User has already been registered"})

        return JsonResponse({"message" : "signup"})


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