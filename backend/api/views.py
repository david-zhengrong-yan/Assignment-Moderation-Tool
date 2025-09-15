from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.sessions.models import Session

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
    """
    Handles user login via email and password.

    Method: POST

    Expected JSON payload:
        {
            "email": "user@example.com",
            "password": "password123"
        }

    Behavior:
        - Validates that both email and password are provided.
        - Fetches the user by email.
        - Authenticates the user using Django's authentication system.
        - Logs in the user and returns session information if successful.

    Returns:
        - 200 OK with JSON containing user details and session ID if login succeeds.
        - 400 Bad Request if email or password is missing.
        - 401 Unauthorized if authentication fails.
        - 405 Method Not Allowed if the request method is not POST.

    JSON Response Example (Success):
        {
            "successful": True,
            "message": "Login successful",
            "id": 1,
            "username": "john_doe",
            "role": "admin",
            "staffId": "S001",
            "email": "john@example.com",
            "sessionId": "xyz123"
        }
    """
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
            session_id = request.session.session_key
            return JsonResponse(
                {
                    "successful": True,
                    "message": "Login successful",
                    "id": user.id,
                    "username": getattr(user, "username", ""),  # safe fetch
                    "role": getattr(user, "role", ""),
                    "staffId": getattr(user, "staffid", ""),
                    "email": user.email,
                    "sessionId" : session_id
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
    """
    Handles user logout.

    Method: POST

    Behavior:
        - Logs out the current authenticated user using Django's logout.
        - Deletes the session cookie from the client.
    
    Returns:
        - 200 OK with JSON confirming logout.
        - 405 Method Not Allowed if request method is not POST.

    JSON Response Example (Success):
        {
            "successful": True,
            "message": "Logged out successfully"
        }
    """
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
    """
    Handles user registration/sign-up.

    Method: POST

    Expected JSON payload:
        {
            "username": "john_doe",
            "staffId": "S001",
            "email": "user@example.com",
            "password": "password123",
            "role": "admin"   # or "marker"
        }

    Behavior:
        - Validates required fields (username, staffId, email, password, role).
        - Checks uniqueness of username, staffId, and email.
        - Ensures only one user with role 'admin' can exist.
        - Creates a new user with hashed password if all checks pass.

    Returns:
        - 200 OK with success message if user is created.
        - 400 Bad Request for missing fields or duplicate username/email/staffId.
        - 405 Method Not Allowed if request method is not POST.

    JSON Response Example (Success):
        {
            "successful": True,
            "message": "Sign-up successful"
        }
    """
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
    """
    Checks whether a user is logged in using session ID.

    Method: GET

    Expected Headers:
        - X-Session-ID: the session key from the client

    Behavior:
        - Validates that session ID is provided.
        - Retrieves session and decodes it to get authenticated user ID.
        - Returns user information if session is valid.

    Returns:
        - 200 OK with user information if session is valid.
        - 401 Unauthorized if session is missing or invalid.

    JSON Response Example (Success):
        {
            "successful": True,
            "message": "User is logged in",
            "id": 1,
            "username": "john_doe",
            "role": "admin",
            "staffId": "S001",
            "email": "john@example.com"
        }
    """
    # Check if user is authenticated via Django session
    if request.method == "GET":
        sessionid = request.headers.get("X-Session-ID")
        if not sessionid:
            return JsonResponse(
                {
                    "successful": False,
                    "message": "User is not logged in"
                },
                status=401
            )
        try:
            session = Session.objects.get(session_key=sessionid)
            uid = session.get_decoded().get("_auth_user_id")
            user = User.objects.get(id=uid)
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
        except:
            return JsonResponse(
                {
                    "successful": False,
                    "message": "User is not logged in"
                },
                status=401
            )

@csrf_exempt
def account_view(request, id):
    """
    Retrieves detailed account information for the logged-in user.

    Method: GET

    URL Parameter:
        - id: The user ID to fetch (usually the current logged-in user)

    Expected Headers:
        - X-Session-ID: the session key from the client

    Behavior:
        - Validates that session ID is provided.
        - Retrieves session and decodes it to get authenticated user.
        - Returns detailed account information including profile picture if available.

    Returns:
        - 200 OK with user details if session is valid.
        - 401 Unauthorized if session is missing or invalid.

    JSON Response Example (Success):
        {
            "successful": True,
            "message": "User is logged in",
            "id": 1,
            "username": "john_doe",
            "role": "admin",
            "staffId": "S001",
            "email": "john@example.com",
            "profilePicture": "https://example.com/media/profile_pics/john.jpg"
        }
    """
    if request.method == "GET":
        sessionid = request.headers.get("X-Session-ID")
        print(sessionid)
        if not sessionid:
            return JsonResponse(
                {
                    "successful": False,
                    "message": "User is not logged in"
                },
                status=401
            )
        try:
            session = Session.objects.get(session_key=sessionid)
            uid = session.get_decoded().get("_auth_user_id")
            user = User.objects.get(id=uid)
            return JsonResponse(
                {
                    "successful": True,
                    "message": "User is logged in",
                    "id": user.id,
                    "username": getattr(user, "username", ""),
                    "role": getattr(user, "role", ""),
                    "staffId": getattr(user, "staffid", ""),
                    "email": user.email,
                    "profilePicture" : request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None
                },
                status=200
            )
        except:
            return JsonResponse(
                {
                    "successful": False,
                    "message": "User is not logged in"
                },
                status=401
            )

def edit_account_view(request):
    if request.method == "PATCH":
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