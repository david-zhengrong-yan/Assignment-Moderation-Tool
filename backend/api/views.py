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

        username = signup_info.get("username")
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
        if User.objects.filter(username=username).exists():
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
            username=username  # Optional: using built-in Django field
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
                "username": getattr(user, "username", ""),
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

@csrf_exempt
def account_view(request, id):
    if request.method == "GET":
        if request.user.is_authenticated:
            user = request.user
            return JsonResponse({
                "id" : user.id,
                "username": user.username,
                "email": user.email,
                "role": getattr(user, "role", None),
                "profile_picture": user.profile_picture.url if user.profile_picture else None,
            })
        else:
            return JsonResponse({"successful" : False, "message" : "You need to login first"}, status=401)

def edit_account_view(request):
    pass

def show_assignments_view(request):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({"successful" : False, "message" : "You need to login first"}, status=401)
    return JsonResponse({ "message" : "hello, world!"})

def delete_assignment_view(request):
    return JsonResponse({"message" : "Assignment is deleted"})

def create_assignment_view(request):
    print("Assignment is created")
    return JsonResponse({"message" : "Assignment is created"})

def assignment_detail_view(request):
    print("Get single assignment")
    pass