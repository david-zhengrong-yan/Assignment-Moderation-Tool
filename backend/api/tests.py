from django.test import TestCase, Client, override_settings
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils import timezone
import json
from django.core.files.uploadedfile import SimpleUploadedFile
import json
from .models import Assignment


User = get_user_model()

class AccountViewTests(TestCase):

    # create a test client
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username = "dongbeiyujie",
            email = "yujie@example.com",
            password = "daipai",
            role = "admin",
        )

    def test_account_view_requires_session_header(self):
        
        # Verify that is no X-Session-ID header, account view should reject the request
        # with 401 unauthorized
        
        url = reverse("account_view", kwargs={"id": self.user.id})
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 401)
        self.assertFalse(resp.json().get("successful"))

    def test_account_returns_userinfo(self):

        # Verify that with a valid session ID, account view returns user info
        self.client.force_login(self.user)
        session_key = self.client.session.session_key

        # Call the account view with the session ID passed in headers
        url = reverse("account_view", kwargs={"id": self.user.id})
        resp = self.client.get(url, HTTP_X_SESSION_ID = session_key)
        self.assertEqual(resp.status_code, 200)

        # Check data matching 
        data = resp.json()
        self.assertTrue(data.get("successful"))
        self.assertEqual(data.get("id"), self.user.id)
        self.assertEqual(data.get("username"), self.user.username)
        self.assertEqual(data.get("role"), self.user.role)
        self.assertEqual(data.get("email"), self.user.email)
        self.assertIn("profilePicture", data)

class viewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='yujie',
            email='yujie@dongbei.com',
            password='12345678',
            role='marker',
        )

    def test_login_requires_post(self):
        url = reverse("login_view")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 405)

    def test_login_missing_fields(self):
        url = reverse("login_view")
        resp = self.client.post(url, data=json.dumps({"email": "yujie@dongbei.com"}),
                                content_type="application/json")
        self.assertEqual(resp.status_code, 400)
        self.assertFalse(resp.json()["successful"])

    def test_login_invalid_credentials(self):
        url = reverse("login_view")
        payload = {"email": "yujie@dongbei.com", "password": "dawei"}
        resp = self.client.post(url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(resp.status_code, 401)
        self.assertFalse(resp.json()["successful"])

    def test_login_success(self):
        url = reverse("login_view")
        payload = {"email": "yujie@dongbei.com", "password": "12345678"}
        resp = self.client.post(url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["successful"])
        self.assertEqual(data["email"], "yujie@dongbei.com")
        self.assertIn("sessionId", data)
        self.assertIsInstance(data["sessionId"], str)

    def test_logout_requires_post(self):
        url = reverse("logout_view")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 405)

    def test_logout_success(self):
        self.client.login(username="yujie", password="12345678")
        url = reverse("logout_view")
        resp = self.client.post(url)
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.json()["successful"])
    
    def test_login_status_valid(self):
        self.client.force_login(self.user)
        session_key = self.client.session.session_key
        url = reverse("login_status_view")
        resp = self.client.get(url, HTTP_X_SESSION_ID=session_key)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["successful"])
        self.assertEqual(data["email"], self.user.email)
        self.assertEqual(data["username"], self.user.username)
        self.assertEqual(data["role"], self.user.role)

    def test_signup_requires_post(self):
        url = reverse("signup_view")
        resp = self.client.get(url)
        self.assertFalse(resp.status_code, 405)
    
    def test_signup_missing_fields(self):
        url = reverse("signup_view")
        payload = {
            "username": "newuser",
            "email": "alice@example.com",  # duplicate
            "password": "p",
            "role": "marker",
        }
        resp = self.client.post(url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(resp.status_code, 400)
        self.assertIn("Email has already been registered", resp.json()["message"])
    
    def test_signup_success_marker(self):
        url = reverse("signup_view")
        payload = {
            "username": "bob",
            "email": "bob@example.com",
            "password": "strongpass",
            "role": "marker",
        }
        resp = self.client.post(url, data=json.dumps(payload), content_type="application/json")
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.json()["successful"])
        self.assertTrue(User.objects.filter(email="bob@example.com").exists())

@override_settings(MEDIA_ROOT="/tmp/test-media")
class EditAccountAndAssignmentsTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.admin = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="adminpass",
            role="admin",
        )
        self.marker = User.objects.create_user(
            username="mark",
            email="mark@example.com",
            password="markpass",
            role="marker",
        )

    # helpers
    def _login_and_get_session(self, user):
        self.client.force_login(user)
        return self.client.session.session_key

    # ---------- edit_account_view ----------
    def test_edit_account_requires_session_header(self):
        url = reverse("edit_account_view", kwargs={"id": self.admin.id})
        resp = self.client.post(url, data={})
        self.assertEqual(resp.status_code, 401)
        self.assertFalse(resp.json()["successful"])

    def test_edit_account_updates_basic_fields(self):
        session_key = self._login_and_get_session(self.admin)
        url = reverse("edit_account_view", kwargs={"id": self.admin.id})
        data = {
            "username": "admin_new",
            "role": "admin",
            "email": "admin_new@example.com",
        }
        resp = self.client.post(url, data, HTTP_X_SESSION_ID=session_key)
        self.assertEqual(resp.status_code, 200)
        payload = resp.json()
        self.assertTrue(payload["success"])
        self.admin.refresh_from_db()
        self.assertEqual(self.admin.username, "admin_new")
        self.assertEqual(self.admin.email, "admin_new@example.com")

    def test_edit_account_rejects_duplicate_email(self):
        other = User.objects.create_user(
            username="other",
            email="other@example.com",
            password="x",
            role="marker",
        )
        session_key = self._login_and_get_session(self.admin)
        url = reverse("edit_account_view", kwargs={"id": self.admin.id})
        data = {"email": other.email}
        resp = self.client.post(url, data, HTTP_X_SESSION_ID=session_key)
        self.assertEqual(resp.status_code, 400)
        self.assertFalse(resp.json()["success"])

    def test_edit_account_updates_password_and_profile_picture(self):
        session_key = self._login_and_get_session(self.marker)
        url = reverse("edit_account_view", kwargs={"id": self.marker.id})

        # tiny PNG
        png_bytes = (
            b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR"
            b"\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89"
            b"\x00\x00\x00\nIDATx\x9cc`\x00\x00\x00\x02\x00\x01\x0b\xe7\x02\x9d"
            b"\x00\x00\x00\x00IEND\xaeB`\x82"
        )
        image = SimpleUploadedFile("avatar.png", png_bytes, content_type="image/png")

        data = {"password": "newpass123"}
        resp = self.client.post(
            url,
            data=data | {"profilePicture": image},
            HTTP_X_SESSION_ID=session_key,
        )
        self.assertEqual(resp.status_code, 200)
        self.marker.refresh_from_db()
        self.assertTrue(self.marker.check_password("newpass123"))
        self.assertIsNotNone(self.marker.profile_picture)

    # ---------- show_assignments_view ----------
    def test_show_assignments_requires_session_header(self):
        url = reverse("show_assignments_view", kwargs={"id": self.admin.id})
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 401)

    def test_show_assignments_lists_all(self):
        Assignment.objects.create(
            name="A1",
            creation_date=timezone.now(),
            rubric=SimpleUploadedFile("r1.txt", b"rubric1"),
            assignment_file=SimpleUploadedFile("a1.pdf", b"pdfdata"),
            mark_criteria={"Q1": 5, "Q2": 10},
            due_date=timezone.now() + timezone.timedelta(days=7),
            administrator=self.admin,
        )
        Assignment.objects.create(
            name="A2",
            creation_date=timezone.now(),
            rubric=SimpleUploadedFile("r2.txt", b"rubric2"),
            assignment_file=SimpleUploadedFile("a2.pdf", b"pdfdata"),
            mark_criteria={"Q1": 10},
            due_date=timezone.now() + timezone.timedelta(days=14),
            administrator=self.admin,
        )

        self.client.force_login(self.admin)
        session_key = self.client.session.session_key

        url = reverse("show_assignments_view", kwargs={"id": self.admin.id})
        resp = self.client.get(url, HTTP_X_SESSION_ID=session_key)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["successful"])
        self.assertEqual(len(data["assignments"]), 2)
        names = {a["name"] for a in data["assignments"]}
        self.assertSetEqual(names, {"A1", "A2"})
        for a in data["assignments"]:
            self.assertRegex(a["dueDate"], r"^\d{4}-\d{2}-\d{2}$")


class EdgeCasesAndErrorPathsTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username="u1",
            email="u1@example.com",
            password="p1",
            role="marker",
        )

    def test_login_status_invalid_session(self):
        url = reverse("login_status_view")
        resp = self.client.get(url, HTTP_X_SESSION_ID="does-not-exist")
        self.assertEqual(resp.status_code, 401)
        self.assertFalse(resp.json()["successful"])

    def test_account_view_invalid_session(self):
        url = reverse("account_view", kwargs={"id": self.user.id})
        resp = self.client.get(url, HTTP_X_SESSION_ID="nope")
        self.assertEqual(resp.status_code, 401)
        self.assertFalse(resp.json()["successful"])

    def test_edit_account_invalid_session(self):
        url = reverse("edit_account_view", kwargs={"id": self.user.id})
        resp = self.client.post(url, data={"username": "x"}, HTTP_X_SESSION_ID="nope")
        self.assertEqual(resp.status_code, 401)
        self.assertFalse(resp.json()["successful"])

