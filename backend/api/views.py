import json
import mimetypes
import os
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, Http404, FileResponse
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.sessions.models import Session
from django.utils.dateparse import parse_datetime
from .forms import AssignmentCreateForm
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from .models import User, Assignment, Mark, Submission
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET
from django.core.serializers.json import DjangoJSONEncoder


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
            "email": "user@example.com",
            "password": "password123",
            "role": "admin"   # or "marker"
        }

    Behavior:
        - Validates required fields (username, email, password, role).
        - Checks uniqueness of username, and email.
        - Ensures only one user with role 'admin' can exist.
        - Creates a new user with hashed password if all checks pass.

    Returns:
        - 200 OK with success message if user is created.
        - 400 Bad Request for missing fields or duplicate username/email.
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
        email = signup_info.get("email")
        password = signup_info.get("password")

        # Validate input
        if not (email and password):
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

        # Check unique email
        if User.objects.filter(email=email).exists():
            return JsonResponse(
                {"successful": False, "message": "Email has already been registered."},
                status=400
            )

        # Create new user
        new_user = User(
            email=email,
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

@csrf_exempt
def edit_account_view(request, id):
    """
    Edit the account information of the currently logged-in user.

    This view allows a user to update their profile details such as username,
    staff ID, role, email, password, and profile picture. It verifies the session
    ID from the request headers to ensure the user is authenticated. It also
    checks that the email and staff ID are not already used by other users.

    Method:
        POST: Updates the user's account information with provided data.

    Request Headers:
        X-Session-ID: string
            The session key of the logged-in user (required for authentication).

    Request POST Parameters (optional):
        - username: string
            New username for the user.
        - role: string
            New role for the user.
        - email: string
            New email address for the user.
        - password: string
            New password for the user.
        - profilePicture: file
            New profile picture for the user (optional, multipart/form-data required).

    Response JSON:
        On success (status 200):
            {
                "success": True,
                "message": "Account edited successfully",
                "username": <updated username>,
                "staffId": <updated staff ID>,
                "role": <updated role>,
                "email": <updated email>,
                "profilePicture": <URL of profile picture or None>
            }

        On failure:
            401 Unauthorized - User not logged in:
            {
                "successful": False,
                "message": "User is not logged in"
            }

            400 Bad Request - Email or Staff ID already in use:
            {
                "success": False,
                "message": "Email is already used by another user"
            }
            OR
            {
                "success": False,
                "message": "Staff ID is already used by another user"
            }

            404 Not Found / Other errors:
            {
                "successful": False,
                "message": "Error"
            }

    Notes:
        - The view is CSRF exempt (`@csrf_exempt`) because it relies on session headers.
        - Password updates are handled securely using `set_password()`.
        - Profile pictures are saved as uploaded files and URL is returned in response.
        - The function prints the received input values for debugging purposes.
    """
    if request.method == "POST":
        sessionid = request.headers.get("X-Session-ID")
        if not sessionid:
            return JsonResponse(
                {"successful": False, "message": "User is not logged in"},
                status=401
            )
        try:
            session = Session.objects.get(session_key=sessionid)
            uid = session.get_decoded().get("_auth_user_id")
            user = User.objects.get(id=uid)

            # Handle text fields
            username = request.POST.get("username")
            email = request.POST.get("email")
            password = request.POST.get("password")

            # Check if email is used by another user
            if email and User.objects.filter(email=email.strip()).exclude(id=user.id).exists():
                return JsonResponse({
                    "success": False,
                    "message": "Email is already used by another user"
                }, status=400)

            # Update fields if provided
            if username is not None:
                user.username = username.strip()
            if email is not None:
                user.email = email.strip()
            if password:
                user.set_password(password)

            # Handle profile picture file
            if "profilePicture" in request.FILES:
                user.profile_picture = request.FILES["profilePicture"]

            user.save()
            return JsonResponse({
                "success": True,
                "message": "Account edited successfully",
                "username": user.username,
                "role": user.role,
                "email": user.email,
                "profilePicture": user.profile_picture.url if user.profile_picture else None
            })

        except :
            return JsonResponse(
                {"successful": False, "message": "Error"},
                status=404
            )
        

def show_assignments_view(request, id):
    if request.method == "GET":
        sessionid = request.headers.get("X-Session-ID")
        if not sessionid:
            return JsonResponse(
                {"successful": False, "message": "User is not logged in"},
                status=401
            )

        # try:
        #     # Decode session
        #     session = Session.objects.get(session_key=sessionid)
        #     uid = session.get_decoded().get("_auth_user_id")
        #     user = User.objects.get(pk=uid)
        # except (Session.DoesNotExist, User.DoesNotExist):
        #     return JsonResponse(
        #         {"successful": False, "message": "Invalid session"},
        #         status=401
        #     )

        # ✅ Fetch all assignments
        assignments = Assignment.objects.all().values("id", "name", "due_date")

        # Convert datetime → string (ISO or formatted)
        assignment_list = [
            {
                "id": a["id"],
                "name": a["name"],
                "dueDate": a["due_date"].strftime("%Y-%m-%d"),
            }
            for a in assignments
        ]

        return JsonResponse(
            {"successful": True, "assignments": assignment_list},
            status=200
        )

    return JsonResponse(
        {"successful": False, "message": "Method not allowed"},
        status=405
    )


@csrf_exempt
def delete_assignment_view(request, id):
    if request.method == "DELETE":
        assignment = get_object_or_404(Assignment, id=id)
        assignment.delete()
        return JsonResponse({"message": "Assignment and related submissions deleted successfully."})
    return JsonResponse({"error": "Invalid request method."}, status=400)




@csrf_exempt
def create_assignment_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)
    
    sessionid = request.headers.get("X-Session-ID")
    if not sessionid:
        return JsonResponse(
            {"successful": False, "message": "User is not logged in"},
            status=401
        )

    administrator = request.user
    if not administrator.is_authenticated or administrator.role != "admin":
        return JsonResponse({"error": "Only administrators can create assignments"}, status=403)

    # Parse submissions
    submissions_data = []
    i = 0
    while f"submissions[{i}][name]" in request.POST:
        submissions_data.append({
            "name": request.POST.get(f"submissions[{i}][name]"),
            "submission_file": request.FILES.get(f"submissions[{i}][submission_file]"),
            "comment": request.POST.get(f"submissions[{i}][comment]", ""),
            "admin_marks": request.POST.get(f"submissions[{i}][admin_marks]", "{}"),
        })
        i += 1

    # Fill form data
    form = AssignmentCreateForm(
        {
            "name": request.POST.get("name"),
            "creation_date": request.POST.get("creation_date"),
            "due_date": request.POST.get("due_date"),
            "mark_criteria": request.POST.get("mark_criteria"),
        },
        {
            "rubric": request.FILES.get("rubric"),
            "assignment_file": request.FILES.get("assignment_file"),
        },
    )

    if form.is_valid():
        assignment = form.save(administrator=administrator, submissions_data=submissions_data)
        return JsonResponse({"success": True, "assignment_id": assignment.id}, status=201)
    else:
        return JsonResponse({"errors": form.errors}, status=400)





@require_GET
@csrf_exempt
def assignment_detail_view(request, id):
    """
    Return a single assignment with submissions and marks info.
    """
    print("Get single assignment")
    
    try:
        assignment = Assignment.objects.get(id=id)
    except Assignment.DoesNotExist:
        raise Http404("Assignment not found")
    
    # Serialize assignment
    assignment_data = {
        "id": assignment.id,
        "name": assignment.name,
        "creation_date": assignment.creation_date.isoformat(),
        "due_date": assignment.due_date.isoformat(),
        "file": assignment.assignment_file.url if assignment.assignment_file else None,
        "rubric": assignment.rubric.url if assignment.rubric else None,
        "mark_criteria": assignment.mark_criteria,
        "administrator": {
            "id": assignment.administrator.id,
            "email": assignment.administrator.email,
        } if assignment.administrator else None
    }

    # Serialize submissions
    submissions_qs = Submission.objects.filter(assignment=assignment)
    submissions_data = []
    for submission in submissions_qs:
        # Count markers who marked this submission
        markers_count = Mark.objects.filter(submission=submission).count()
        average_markers = 0
        if markers_count > 0:
            # Calculate average from all marks
            all_marks = Mark.objects.filter(submission=submission)
            total = 0
            num_values = 0
            for mark in all_marks:
                # sum up all numeric values in marks JSON
                for v in mark.marks.values():
                    if isinstance(v, (int, float)):
                        total += v
                        num_values += 1
            average_markers = total / num_values if num_values > 0 else 0

        submissions_data.append({
            "id": submission.id,
            "name": submission.name,
            "file": submission.submission_file.url if submission.submission_file else None,
            "comment": submission.comment,
            "markers": markers_count,
            "totalMarkers": Mark.objects.filter(submission=submission).count(),  # same as markers_count
            "averageMarkers": average_markers,
        })

    response_data = {
        "assignment": assignment_data,
        "submissions": submissions_data,
    }

    return JsonResponse(response_data, encoder=DjangoJSONEncoder, safe=False)



# Download files



# -------------------------------
# Helper function to serve a file
# -------------------------------
def _serve_file(file_field):
    if not file_field or not file_field.path or not os.path.exists(file_field.path):
        raise Http404("File not found")
    
    mime_type, _ = mimetypes.guess_type(file_field.path)
    response = FileResponse(open(file_field.path, 'rb'), content_type=mime_type)
    response['Content-Disposition'] = f'attachment; filename="{os.path.basename(file_field.path)}"'
    return response

# -------------------------------
# Assignment file
# -------------------------------
def download_assignment_file(request, assignment_id):
    assignment = get_object_or_404(Assignment, pk=assignment_id)
    return _serve_file(assignment.assignment_file)

# -------------------------------
# Rubric file
# -------------------------------
def download_rubric_file(request, assignment_id):
    assignment = get_object_or_404(Assignment, pk=assignment_id)
    return _serve_file(assignment.rubric)

# -------------------------------
# Submission file
# -------------------------------
def download_submission_file(request, submission_id):
    submission = get_object_or_404(Submission, pk=submission_id)
    return _serve_file(submission.submission_file)