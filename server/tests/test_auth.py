# server/tests/test_auth.py
import pytest
import random
import string
from common import req, EMAIL, PASSWORD

ENDPOINT = "/auth"

# ----------------------
# TESTS
# ----------------------
@pytest.mark.skip(reason="requires manual token from email")
def test_signup(session):
    payload = {
        "name": "Test User",
        "email": EMAIL,
        "phone": "05312345678",
        "password": PASSWORD
    }
    r = req(session, "POST", f"{ENDPOINT}/signup", json=payload)
    assert r.status_code == 201
    data = r.json()
    assert data["success"] is True
    assert "user" in data

@pytest.mark.dependency()
def test_signin(session ):
    payload = {"email": EMAIL, "password": PASSWORD}
    r = req(session, "POST", f"{ENDPOINT}/signin", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    # Session now has cookie

@pytest.mark.skip(reason="other tests depend on being signed in")
def test_signout(session):
    r = req(session, "POST", f"{ENDPOINT}/signout")
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True

@pytest.mark.skip(reason="requires manual token from email")
def test_forgot_password(session):
    r = req(session, "POST", f"{ENDPOINT}/forgot-password", json={"email": EMAIL})
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True

# ----------------------
# Optional: verify email / reset password
# ----------------------
@pytest.mark.skip(reason="requires manual token from email")
def test_verify_email(session, verification_code):
    r = req(session, "POST", f"{ENDPOINT}/verify-email", json={"code": verification_code})
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True

@pytest.mark.skip(reason="requires manual token from email")
def test_reset_password(session, reset_token):
    r = req(session, "POST", f"{ENDPOINT}/reset-password/{reset_token}", json={"password": "NewPass123"})
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
