from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout, get_user_model

from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User, Assignment, Mark, Submission

User = get_user_model()

from django.contrib.auth import authenticate, login, get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

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

        # 🔑 First, fetch the user by email
        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse(
                {"successful": False, "message": "Invalid email or password."},
                status=401
            )

        # 🔑 Now authenticate using the email as username
        user = authenticate(request, username=user_obj.username, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse(
                {
                    "successful": True,
                    "message": "Login successful",
                    "id": user.id,
                    "username": getattr(user, "username", ""),  # safe fetch
                    "role": getattr(user, "role", ""),
                    "staffId": getattr(user, "staffid", ""),
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
        response = JsonResponse({"successful": True, "message": "Logged out successfully"}, status=200)
        response.delete_cookie("sessionid")
        return response

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
        
        # Check unique username
        if User.objects.filter(username=name).exists():
             return JsonResponse(
                {"successful": False, "message": "Username has already been registered."},
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

@csrf_exempt
def login_status_view(request):
    # Check if user is authenticated via Django session
    if request.user.is_authenticated:
        user = request.user
        return JsonResponse(
            {
                "successful": True,
                "message": "User is logged in",
                "id": user.id,
                "name": getattr(user, "name", ""),
                "role": getattr(user, "role", ""),
                "staffId": getattr(user, "staffid", ""),
                "email": user.email,
            },
            status=200
        )
    else:
        return JsonResponse(
            {
                "successful": False,
                "message": "User is not logged in"
            },
            status=401
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