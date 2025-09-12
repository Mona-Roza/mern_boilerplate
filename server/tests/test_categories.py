# server/tests/test_categories.py
import pytest
from common import req

ENDPOINT = "/categories"

# ----------------------
# Global variables shared across tests
# ----------------------
electronics_id = None
laptops_id = None
phones_id = None

# ----------------------
# CREATE
# ----------------------
@pytest.mark.dependency()
def test_create_root_category(admin_session):
    global electronics_id
    r = req(admin_session, "POST", f"{ENDPOINT}/", json={"name": "Electronics"})
    assert r.status_code == 201
    data = r.json()
    electronics_id = data["category"]["_id"]
    assert electronics_id is not None
@pytest.mark.dependency(depends=["test_create_root_category"])

def test_create_child_by_name(admin_session):
    global laptops_id
    r = req(admin_session, "POST", f"{ENDPOINT}/", json={"name": "Laptops", "parentName": "Electronics"})
    assert r.status_code == 201
    data = r.json()
    laptops_id = data["category"]["_id"]
    assert laptops_id is not None

@pytest.mark.dependency(depends=["test_create_root_category"])
def test_create_child_by_id(admin_session):
    global phones_id, electronics_id
    r = req(admin_session, "POST", f"{ENDPOINT}/parent/{electronics_id}/children", json={"name": "Phones"})
    assert r.status_code == 201
    data = r.json()
    phones_id = data["category"]["_id"]
    assert phones_id is not None

@pytest.mark.dependency(depends=["test_create_root_category"])
def test_bulk_create(admin_session):
    categories = [
        {"name": "Tablets", "parentName": "Electronics"},
        {"name": "Home Appliances"}
    ]
    r = req(admin_session, "POST", f"{ENDPOINT}/bulk", json={"categories": categories})
    assert r.status_code == 201

# ----------------------
# READ
# ----------------------
@pytest.mark.dependency(depends=["test_create_root_category"])
def test_get_all_tree(session):
    r = req(session, "GET", f"{ENDPOINT}/")
    assert r.status_code == 200
    data = r.json()
    assert "categories" in data
    categories = data["categories"]
    assert isinstance(categories, list)
    assert any(cat["name"] == "Electronics" for cat in categories)

@pytest.mark.dependency(depends=["test_create_root_category"])
def test_search_by_name(session):
    r = req(session, "GET", f"{ENDPOINT}/search/name/lap")
    assert r.status_code == 200
    data = r.json()
    assert "results" in data
    results = data["results"]
    assert isinstance(results, list)
    assert any("Laptop" in cat["name"] or "lap" in cat["name"].lower() for cat in results)

@pytest.mark.dependency(depends=["test_create_root_category"])
def test_get_flat_list(session):
    r = req(session, "GET", f"{ENDPOINT}/flat")
    assert r.status_code == 200
    assert "list" in r.json()

@pytest.mark.dependency(depends=["test_create_root_category"])
def test_get_by_id(session):
    global electronics_id
    r = req(session, "GET", f"{ENDPOINT}/{electronics_id}")
    assert r.status_code == 200
    data = r.json()
    assert data["category"]["_id"] == electronics_id

# ----------------------
# UPDATE
# ----------------------
@pytest.mark.dependency(depends=["test_create_root_category"])
def test_update_name(admin_session):
    global electronics_id
    r = req(admin_session, "PUT", f"{ENDPOINT}/{electronics_id}/name", json={"newName": "Electronic Devices"})
    assert r.status_code == 200

@pytest.mark.dependency(depends=["test_create_root_category"])
def test_update_parent(admin_session):
    global phones_id
    r = req(admin_session, "PUT", f"{ENDPOINT}/{phones_id}/parent", json={"parentId": None})
    assert r.status_code == 200

@pytest.mark.dependency(depends=["test_create_root_category"])
def test_toggle_status(admin_session):
    global electronics_id
    r = req(admin_session, "PUT", f"{ENDPOINT}/{electronics_id}/status")
    assert r.status_code == 200

# ----------------------
# DELETE
# ----------------------
@pytest.mark.dependency(depends=["test_create_root_category"])
def test_bulk_delete(admin_session):
    global laptops_id, phones_id
    r = req(admin_session, "DELETE", f"{ENDPOINT}/bulk", json={"ids": [laptops_id, phones_id]})
    assert r.status_code == 204

@pytest.mark.dependency(depends=["test_create_root_category"])
def test_delete_by_id(admin_session):
    global electronics_id
    r = req(admin_session, "DELETE", f"{ENDPOINT}/{electronics_id}")
    assert r.status_code == 204
