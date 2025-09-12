# server/tests/fixtures.py
import pytest
import requests
from common import req, EMAIL, PASSWORD 

AUTH_ENDPOINT = "/auth"
@pytest.fixture(scope="session")
def session():
    """Provides a logged-in session with cookie. If user does not exist, create first."""
    s = requests.Session()

    # Try login
    payload = {"email": EMAIL, "password": PASSWORD}
    r = req(s, "POST", f"{AUTH_ENDPOINT}/signin", json=payload)

    if r.status_code == 401:  # user not found or wrong credentials
        # Try signup
        signup_payload = {
            "name": "Pytest User",
            "email": EMAIL,
            "phone": "05312345678",
            "password": PASSWORD,
        }
        r2 = req(s, "POST", f"{AUTH_ENDPOINT}/signup", json=signup_payload)
        assert r2.status_code in (200, 201), f"Signup failed: {r2.text}"

        # Try login again
        r = req(s, "POST", f"{AUTH_ENDPOINT}/signin", json=payload)

    assert r.status_code == 200, f"Login failed: {r.text}"

    user = r.json().get("user")
    s.user_id = user["_id"]

    return s

@pytest.fixture(scope="session")
def admin_session(session):
    """
    Make the session admin if needed. Adjust endpoint if you have a make-me-admin route.
    """
    # Optional: uncomment if you have /user/make-me-admin endpoint
    r = req(session, "POST", "/user/make-me-admin")
    assert r.status_code == 200, "Failed to make user admin"
    return session
