# server/tests/common.py
import requests
import json

BASE_URL = "http://localhost:8081/api"

HEADERS = {"Content-Type": "application/json"}

EMAIL = "basaknisani@gmail.com"
PASSWORD = "12345678"

def pretty_print(response):
    print(f"\n[{response.status_code}] {response.request.method} {response.url}")
    try:
        print(json.dumps(response.json(), indent=2))
    except Exception:
        print(response.text)

def req(session, method, endpoint, **kwargs):
    """
    Common request wrapper. session: requests.Session()
    """
    url = BASE_URL + endpoint
    headers = kwargs.pop("headers", HEADERS)
    r = session.request(method, url, headers=headers, **kwargs)
    pretty_print(r)
    return r
