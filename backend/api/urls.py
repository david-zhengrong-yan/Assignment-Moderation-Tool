from django.urls import path
from . import views


urlpatterns = [
    path("login", views.login_view, name="login"),
    path("signup", views.signup_view, name="signup"),
    path("logout", views.logout_view, name="logout"),
    path("login_status", views.login_status_view, name="login_status"),
    path("<int:id>/account", views.account_view, name="account_view"),
    path("<int:id>/account/edit", views.edit_account_view, name="edit_account_view"),
    path("<int:id>/assignments", views.show_assignments_view, name="assignments"),
    path("assignment/create", views.create_assignment_view, name="create_assignment"),
    path("assignment/<int:id>/delete", views.delete_assignment_view, name="delete_assignment"),
    path("assignment/<int:id>/edit", views.edit_assignment_view, name="edit_assignment_view"),
    path("assignment/<int:id>", views.assignment_detail_view, name="assignment_detail_view"),
    path("<int:user_id>/assignment/<assignment_id>/submission/<int:submission_id>/mark", views.submission_mark_view, name="submission_mark_view"),
    path("marker/assignment/<int:assignment_id>/", views.marker_assignment_detail_view, name="marker_assignment_detail_view"),
    path("submission/<int:submission_id>/marks", views.marks_by_submission_view, name="marks_by_submission_view"),
    path('assignment/<int:assignment_id>/download/', views.download_assignment_file, name='download_assignment'),
    path('assignment/<int:assignment_id>/rubric/download/', views.download_rubric_file, name='download_rubric'),
    path('submission/<int:submission_id>/download/', views.download_submission_file, name='download_submission'),
] 