from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("login", views.login_view, name="login"),
    path("signup", views.signup_view, name="signup"),
    path("logout", views.logout_view, name="logout"),
    path("login_status", views.login_status_view, name="login_status"),
    path("<int:id>/account", views.account_view, name="account_view"),
    path("<int:id>/account/edit", views.edit_account_view, name="edit_account_view"),
    path("<int:id>/assignments", views.show_assignments_view, name="assignments"),
    path("assignment/create", views.create_assignment_view, name="create_assignment"),
    path("assignment/delete", views.delete_assignment_view, name="delete_assignment"),
    path("assignment/<int:id>", views.assignment_detail_view, name="assignment_detail_view"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)