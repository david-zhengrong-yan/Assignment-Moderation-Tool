from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout, get_user_model

from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User, Assignment, Mark, Submission

User = get_user_model()

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        login_info = json.loads(request.body)
        email = login_info.get("email")
        password = login_info.get("password")

        if not (email and password):
            return JsonResponse(
                {"successful": False, "message": "Email and password are required."},
                status=400
            )

        # Authenticate user
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)  # Django handles session
            return JsonResponse(
                {
                    "successful": True,
                    "message": "Login successful",
                    "role": user.role,
                    "staffId": user.staffid,
                    "email": user.email
                },
                status=200
            )
        else:
            return JsonResponse(
                {"successful": False, "message": "Invalid email or password."},
                status=401
            )

    return JsonResponse(
        {"successful": False, "message": "Invalid request method."},
        status=405
    )


@csrf_exempt
def logout_view(request):
    if request.method == "POST":
        logout(request)
        return JsonResponse({"successful": True, "message": "Logged out successfully."}, status=200)

    return JsonResponse(
        {"successful": False, "message": "Invalid request method."},
        status=405
    )


@csrf_exempt
def signup_view(request):
    if request.method == "POST":
        signup_info = json.loads(request.body)

        name = signup_info.get("name")
        staff_id = signup_info.get("staffId")
        email = signup_info.get("email")
        password = signup_info.get("password")
        role = signup_info.get("role")  # should be either "admin" or "marker"

        # Validate input
        if not (email and password and staff_id and role):
            return JsonResponse(
                {"successful": False, "message": "Missing required fields."},
                status=400
            )

        # Check unique staff ID
        if User.objects.filter(staffid=staff_id).exists():
            return JsonResponse(
                {"successful": False, "message": "Staff ID has already been registered."},
                status=400
            )

        # Check unique email
        if User.objects.filter(email=email).exists():
            return JsonResponse(
                {"successful": False, "message": "Email has already been registered."},
                status=400
            )

        # Ensure only one administrator can exist
        if role == "admin" and User.objects.filter(role="admin").exists():
            return JsonResponse(
                {"successful": False, "message": "Administrator has already been registered."},
                status=400
            )

        # Create new user
        new_user = User(
            email=email,
            staffid=staff_id,
            role=role,
            username=name  # Optional: using built-in Django field
        )
        new_user.set_password(password)  # hash the password!
        new_user.save()

        return JsonResponse(
            {"successful": True, "message": "Sign-up successful"},
            status=200
        )

    return JsonResponse(
        {"successful": False, "message": "Invalid request method."},
        status=405
    )


def show_assignments(request):
    return JsonResponse({ "message" : "hello, world!"})

def delete_assignment(request):
    return JsonResponse({"message" : "Assignment is deleted"})

def create_assignment(request):
    print("Assignment is created")
    return JsonResponse({"message" : "Assignment is created"})

def assignment_details(request):
    pass