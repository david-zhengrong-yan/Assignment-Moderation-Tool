from django.urls import path
from . import views

urlpatterns = [
    path("login", views.login_view, name="login"),
    path("signup", views.signup_view, name="signup"),
    path("logout", views.logout_view, name="logout"),
    path("login_status", views.login_status_view, name="login_status"),
    path("assignments", views.show_assignments, name="assignments"),
]