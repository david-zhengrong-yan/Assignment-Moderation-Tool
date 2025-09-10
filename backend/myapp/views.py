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

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            login_info = json.loads(request.body)
            email = login_info.get("email")
            password = login_info.get("password")

            isAdmin = Administrator.objects.filter(email=email, password=password).first() is not None
            isMarker = Marker.objects.filter(email=email, password=password).first() is not None

            if (isAdmin):
                return JsonResponse({
                    "successful" : True, 
                    "message" : "Login as Administrator"
                    }, status=200)
            elif (isMarker):
                return JsonResponse({
                    "successful" : True, 
                    "message" : "Login as Marker"
                    }, status=200)
            else:
                return JsonResponse({
                    "successful" : False,
                    "message" : "Invalid credentials"
                    },status=401)
        except Exception as e:
            return JsonResponse({
                "successful" : False, 
                "message" : {"successful": False, "message": f"Server error: {str(e)}"}
                }, status=500)
    return None

def logout_view(request):
    pass

@csrf_exempt
def signup_view(request):
    if request.method == "POST":
        signup_info = json.loads(request.body)
        name = signup_info.get("name")
        staff_id = signup_info.get("staffId")
        email = signup_info.get("email")
        password = signup_info.get("password")
        role = signup_info.get("role")

        admin = Administrator.objects.first()
        
        admin_by_staff_id = Administrator.objects.filter(staffid=staff_id).first()
        admin_by_email = Administrator.objects.filter(email=email).first()

        marker_by_staff_id = Marker.objects.filter(staffid=staff_id).first()
        marker_by_email = Marker.objects.filter(email=email).first()
        
        # check wether the user has already been registered by staff id
        if (admin_by_staff_id is not None or marker_by_staff_id is not None):
            return JsonResponse({"successful" : False, "message" : "Staff ID has already been registered."}, status=400)

        # check whether the user has already been registered by email
        if (admin_by_email is not None or marker_by_email is not None):
            return JsonResponse({"successful" : False, "message" : "Email has already been registered."}, status=400)
        
        # check only one admin can be registered
        if (role == "administrator" and admin is not None):
            return JsonResponse({"successful" : False, "message" : "Administrator has already been registered"}, status=400)
        
        print(role)
        if (role == "administrator"):
            new_admin = Administrator.objects.create(
                name=name,
                email=email,
                password=password,
                staffid=staff_id
            )
            return JsonResponse({"successful" : True, "message" : "Sign-up successful"}, status=200)
        elif (role == "marker"):
            new_marker = Marker.objects.create(
                name=name,
                email=email,
                password=password,
                staffid=staff_id
            )
            return JsonResponse({"successful" : True, "message" : "Sign-up successful"}, status=200)
        else:
            return JsonResponse({"successful" : False, "message" : "Something went wrong"}, status=400)

    return None

def show_assignments(request):
    return JsonResponse({ "message" : "hello, world!"})

def delete_assignment(request):
    return JsonResponse({"message" : "Assignment is deleted"})

def create_assignment(request):
    print("Assignment is created")
    return JsonResponse({"message" : "Assignment is created"})

def assignment_details(request):
    pass