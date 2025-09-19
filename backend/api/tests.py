from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model

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
            staffid = "123",
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
        self.assertEqual(data.get("staffId"), self.user.staffid)
        self.assertEqual(data.get("email"), self.user.email)
        self.assertIn("profilePicture", data)



