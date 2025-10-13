import json
import mimetypes
import os
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
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
from django.views.decorators.http import require_GET, require_POST
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
    if request.method != "GET":
        return JsonResponse(
            {"successful": False, "message": "Method not allowed"},
            status=405
        )

    # --- Check session ---
    sessionid = request.headers.get("X-Session-ID")
    if not sessionid:
        return JsonResponse(
            {"successful": False, "message": "User is not logged in"},
            status=401
        )

    try:
        session = Session.objects.get(session_key=sessionid)
        uid = session.get_decoded().get("_auth_user_id")
        user = User.objects.get(pk=uid)
    except (Session.DoesNotExist, User.DoesNotExist):
        return JsonResponse(
            {"successful": False, "message": "Invalid session"},
            status=401
        )

    # --- Filter assignments based on role ---
    if user.role == "admin":
        assignments = Assignment.objects.filter(administrator=user)
    else:
        marks = Mark.objects.filter(marker=user).select_related("submission__assignment")
        assignment_ids = marks.values_list("submission__assignment__id", flat=True).distinct()
        assignments = Assignment.objects.filter(id__in=assignment_ids)

    assignment_list = []

    for a in assignments:
        # fetch all submissions for this assignment
        submissions = Submission.objects.filter(assignment=a)

        if user.role == "admin":
            # Admin: complete if all marks for all submissions are finalized
            complete = all(
                all(mark.is_finalized for mark in Mark.objects.filter(submission=sub))
                for sub in submissions
            )
        else:
            # Marker: complete if all marks by this marker are finalized
            # Only consider submissions that this marker has a mark for
            complete = all(
                mark.is_finalized
                for sub in submissions
                for mark in Mark.objects.filter(submission=sub, marker=user)
            )

        assignment_list.append(
            {
                "id": a.id,
                "name": a.name,
                "dueDate": a.due_date.strftime("%Y-%m-%d"),
                "completed": complete,
            }
        )

    user_info = {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "username": user.username,
    }

    return JsonResponse(
        {
            "successful": True,
            "user": user_info,
            "assignments": assignment_list,
        },
        status=200
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
    Return a single assignment with submissions, admin marks, and markers info.
    """
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
            all_marks = Mark.objects.filter(submission=submission)
            total = 0
            num_values = 0
            for mark in all_marks:
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
            "admin_marks": submission.admin_marks or {},  # <--- include admin marks
            "markers": markers_count,
            "totalMarkers": markers_count,
            "averageMarkers": average_markers,
        })

    response_data = {
        "assignment": assignment_data,
        "submissions": submissions_data,
    }

    return JsonResponse(response_data, encoder=DjangoJSONEncoder, safe=False)


@require_POST
@csrf_exempt
def edit_assignment_view(request, id):
    """
    Edit an existing assignment and its submissions.
    - If rubric changes, reset all marker marks (wipe marks, keep entries, set is_finalized=False).
    - If a submission file changes, reset only the marks for that submission.
    """
    session_id = request.headers.get("X-Session-ID")
    if not session_id:
        return JsonResponse(
            {"successful": False, "message": "User is not logged in"},
            status=401
        )

    try:
        assignment = Assignment.objects.get(id=id)
    except Assignment.DoesNotExist:
        raise Http404("Assignment not found")

    # ---------------- Parse POST data ----------------
    name = request.POST.get("name")
    due_date = request.POST.get("due_date")
    mark_criteria = request.POST.get("mark_criteria")

    if not name or not due_date or not mark_criteria:
        return JsonResponse({"error": "Missing required fields"}, status=400)

    try:
        due_date_parsed = parse_datetime(due_date)
        rubric_json = json.loads(mark_criteria)
    except Exception as e:
        return JsonResponse({"error": f"Invalid data format: {str(e)}"}, status=400)

    # ---------------- Rubric change check ----------------
    old_rubric = assignment.mark_criteria
    rubric_changed = old_rubric != rubric_json

    assignment.name = name
    assignment.due_date = due_date_parsed
    assignment.mark_criteria = rubric_json

    # ---------------- Handle assignment & rubric files ----------------
    if "assignment_file" in request.FILES:
        assignment.assignment_file = request.FILES["assignment_file"]

    if "rubric" in request.FILES:
        assignment.rubric = request.FILES["rubric"]

    assignment.save()

    # ---------------- Handle submissions ----------------
    for idx in range(2):  # Only two submissions
        prefix = f"submissions[{idx}]"
        sub_name = request.POST.get(f"{prefix}[name]")
        sub_comment = request.POST.get(f"{prefix}[comment]")
        sub_admin_marks = request.POST.get(f"{prefix}[admin_marks]")

        if not sub_name or not sub_admin_marks:
            return JsonResponse({"error": f"Submission {idx+1} data missing"}, status=400)

        try:
            sub_marks_json = json.loads(sub_admin_marks)
        except Exception:
            return JsonResponse({"error": f"Submission {idx+1} marks invalid JSON"}, status=400)

        # Get or create submission
        submission_qs = Submission.objects.filter(assignment=assignment, name=sub_name)
        if submission_qs.exists():
            submission = submission_qs.first()
        else:
            submission = Submission.objects.create(name=sub_name, assignment=assignment)

        # ---------------- Check if submission file changed ----------------
        file_field_name = f"{prefix}[submission_file]"
        submission_file_changed = False
        if file_field_name in request.FILES:
            # If there was an existing file, compare names
            if submission.submission_file:
                old_name = submission.submission_file.name.split("/")[-1]
                new_name = request.FILES[file_field_name].name
                if old_name != new_name:
                    submission_file_changed = True
            else:
                submission_file_changed = True

            submission.submission_file = request.FILES[file_field_name]

        # ---------------- Save submission data ----------------
        submission.comment = sub_comment or ""
        submission.admin_marks = sub_marks_json
        submission.save()

        # ---------------- Reset marker marks ----------------
        if rubric_changed or submission_file_changed:
            marks_qs = Mark.objects.filter(submission=submission)
            for m in marks_qs:
                m.marks = {}  # wipe all marks
                m.is_finalized = False
                m.save()

    return JsonResponse({"success": True, "message": "Assignment updated successfully", "rubric_changed": rubric_changed})


@require_GET
def marker_assignment_detail_view(request, assignment_id):
    """
    Return assignment details, including submissions and related marks.
    """
    assignment = get_object_or_404(Assignment, id=assignment_id)

    submissions_data = []
    submissions = Submission.objects.filter(assignment=assignment)

    for submission in submissions:
        # Get marks for this submission
        marks = Mark.objects.filter(submission=submission).select_related("marker")
        marks_data = [
            {
                "id": mark.id,
                "marks": mark.marks,
                "is_finalized": mark.is_finalized,
                "marker": mark.marker.email
            }
            for mark in marks
        ]

        submissions_data.append({
            "id": submission.id,
            "name": submission.name,
            "submission_file": submission.submission_file.url if submission.submission_file else None,
            "comment": submission.comment,
            "admin_marks": submission.admin_marks,
            "marks": marks_data
        })

    data = {
        "id": assignment.id,
        "name": assignment.name,
        "creation_date": assignment.creation_date,
        "due_date": assignment.due_date,
        "rubric": assignment.rubric.url if assignment.rubric else None,
        "assignment_file": assignment.assignment_file.url if assignment.assignment_file else None,
        "mark_criteria": assignment.mark_criteria,
        "administrator": assignment.administrator.email if assignment.administrator else None,
        "submissions": submissions_data
    }

    return JsonResponse(data, safe=False)

@require_GET
def marks_by_submission_view(request, submission_id):
    try:
        # Ensure submission exists
        submission = Submission.objects.get(pk=submission_id)
    except Submission.DoesNotExist:
        return JsonResponse(
            {"successful": False, "message": "Submission not found"},
            status=404
        )

    # Fetch all marks for this submission
    marks_qs = Mark.objects.filter(submission=submission).select_related('marker')

    marks_list = []
    for mark in marks_qs:
        marks_list.append({
            "id": mark.id,
            "marker": {
                "id": mark.marker.id,
                "email": mark.marker.email,
                "username": mark.marker.username,
            },
            "marks": mark.marks,  # JSON field
            "isFinalized": mark.is_finalized,
        })

    return JsonResponse({"successful": True, "submissionId": submission_id, "marks": marks_list}, status=200)



@csrf_exempt
@require_http_methods(["GET", "POST"])
def submission_mark_view(request, user_id, assignment_id, submission_id):
    """
    GET  -> Retrieve the mark information and rubric (mark_criteria)
    POST -> Save or update the marker's marks (draft or finalized)
    """
    # -----------------------
    # 1. Authenticate user
    # -----------------------
    sessionid = request.headers.get("X-Session-ID")
    if not sessionid:
        return JsonResponse({"successful": False, "message": "User not logged in"}, status=401)

    try:
        session = Session.objects.get(session_key=sessionid)
        uid = session.get_decoded().get("_auth_user_id")
        authenticated_user = User.objects.get(id=uid)
    except (Session.DoesNotExist, User.DoesNotExist):
        return JsonResponse({"successful": False, "message": "Invalid session"}, status=401)

    # -----------------------
    # 2. Authorization
    # -----------------------
    if authenticated_user.role != "marker":
        return JsonResponse({"successful": False, "message": "Only markers allowed"}, status=403)

    # -----------------------
    # 3. Validate resources
    # -----------------------
    assignment = get_object_or_404(Assignment, id=assignment_id)
    submission = get_object_or_404(Submission, id=submission_id, assignment=assignment)

    # -----------------------
    # GET request
    # -----------------------
    if request.method == "GET":
        mark, _ = Mark.objects.get_or_create(
            marker=authenticated_user,
            submission=submission,
            defaults={"marks": {}, "is_finalized": False}
        )
        data = {
            "successful": True,
            "mark": {
                "id": mark.id,
                "marks": mark.marks,
                "is_finalized": mark.is_finalized,
            },
            "submission": {
                "id": submission.id,
                "name": submission.name,
                "file_url": submission.submission_file.url if submission.submission_file else None,
                "comment": submission.comment,
            },
            "assignment": {
                "id": assignment.id,
                "name": assignment.name,
                "creation_date": assignment.creation_date,
                "due_date": assignment.due_date,
                "administrator": assignment.administrator.email if assignment.administrator else None,
                "rubric_file": assignment.rubric.url if assignment.rubric else None,
                "assignment_file": assignment.assignment_file.url if assignment.assignment_file else None,
                "mark_criteria": assignment.mark_criteria,
            },
            "marker": {
                "id": authenticated_user.id,
                "email": authenticated_user.email,
                "role": authenticated_user.role,
            },
        }
        return JsonResponse(data, status=200)

    # -----------------------
    # POST request
    # -----------------------
    elif request.method == "POST":
        try:
            body = json.loads(request.body.decode("utf-8"))
            new_marks = body.get("marks", {})
            is_finalized = body.get("is_finalized", False)
        except json.JSONDecodeError:
            return JsonResponse({"successful": False, "message": "Invalid JSON"}, status=400)

        mark, created = Mark.objects.get_or_create(
            marker=authenticated_user,
            submission=submission,
            defaults={"marks": {}, "is_finalized": False}
        )

        # Always update existing marks
        mark.marks = new_marks
        mark.is_finalized = is_finalized
        mark.save()

        return JsonResponse(
            {"successful": True, "message": "Mark saved successfully", "mark": {"id": mark.id, "marks": mark.marks, "is_finalized": mark.is_finalized}},
            status=200
        )
    

@require_GET
def mark_comparison_view(request, assignment_id, submission_id):
    try:
        submission = Submission.objects.get(pk=submission_id, assignment__id=assignment_id)
    except Submission.DoesNotExist:
        return JsonResponse(
            {"successful": False, "message": "Submission not found"},
            status=404
        )

    # ----------------------------
    # Administrator marks
    # ----------------------------
    admin_marks = submission.admin_marks or {}

    # ----------------------------
    # Markers' marks
    # ----------------------------
    markers_qs = Mark.objects.filter(submission=submission).select_related('marker')
    markers_list = []
    for mark in markers_qs:
        markers_list.append({
            "id": mark.id,
            "marker": {
                "id": mark.marker.id,
                "email": mark.marker.email,
                "username": mark.marker.username,
            },
            "marks": mark.marks,  # JSON field
            "isFinalized": mark.is_finalized,
        })

    # ----------------------------
    # Include assignment rubric
    # ----------------------------
    rubric = submission.assignment.mark_criteria or {}

    return JsonResponse({
        "successful": True,
        "submissionId": submission_id,
        "assignmentId": assignment_id,
        "rubric": rubric,        # full rubric JSON
        "admin_marks": admin_marks,
        "markers": markers_list
    }, status=200)




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