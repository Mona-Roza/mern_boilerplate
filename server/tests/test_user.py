# server/tests/test_user.py
import pytest
from common import req, PASSWORD

ENDPOINT = "/user"

# ----------------------
# Client tests
# ----------------------
@pytest.mark.dependency()
def test_get_me(session):
    user_id = session.user_id 
    r = req(session, "GET", f"{ENDPOINT}/me/{user_id}")
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert "user" in data

@pytest.mark.dependency(depends=["test_get_me"])
def test_update_me(session):
    user_id = session.user_id
    payload = {"name": "Updated Client"}
    r = req(session, "PUT", f"{ENDPOINT}/me/{user_id}", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert data["user"]["name"] == "Updated Client"

@pytest.mark.skip(reason="requires manual token from email")
def test_update_my_email(session):
    user_id = session.user_id
    r = req(session, "PUT", f"{ENDPOINT}/me/{user_id}/email", json={"email": "newmail@test.com"})
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert "user" in data

@pytest.mark.skip(reason="requires manual token from email")
def test_update_my_password(session):
    user_id = session.user_id
    r = req(session, "PUT", f"{ENDPOINT}/me/{user_id}/password", json={"currentPassword":PASSWORD, "newPassword": "NewPassword123"})
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True

    r = req(session, "PUT", f"{ENDPOINT}/me/{user_id}/password", json={"currentPassword":"NewPassword123", "newPassword": PASSWORD})
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True

@pytest.mark.dependency()
def test_update_my_account_status(session):
    user_id = session.user_id
    r = req(session, "PUT", f"{ENDPOINT}/me/{user_id}/account-status", json={"accountStatus": False})
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True

# ----------------------
# Admin tests
# ----------------------
@pytest.mark.dependency()
def test_get_all_users(admin_session):
    r = req(admin_session, "GET", ENDPOINT + "/")
    assert r.status_code == 200
    data = r.json()
    assert "users" in data

@pytest.mark.dependency()
def test_get_user_by_id(admin_session):
    # Burada önceden signup olmuş bir kullanıcının ID'si lazım
    # Örn: session.user_id
    user_id = admin_session.user_id
    r = req(admin_session, "GET", f"{ENDPOINT}/{user_id}")
    assert r.status_code == 200
    data = r.json()
    assert "user" in data

@pytest.mark.dependency()
def test_update_user_as_admin(admin_session):
    user_id = admin_session.user_id
    payload = {"name": "Admin Updated"}
    r = req(admin_session, "PUT", f"{ENDPOINT}/{user_id}", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["user"]["name"] == "Admin Updated"

@pytest.mark.skip(reason="Just skip that!")
def test_delete_user_as_admin(admin_session):
    # Burada test için yeni bir user signup yapılmalı, sonra admin silecek
    # signup → user_id → delete
    # Örn: conftest.py’de create_temp_user fixture eklenebilir
    temp_user_id = admin_session.temp_user_id
    r = req(admin_session, "DELETE", f"{ENDPOINT}/{temp_user_id}")
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
