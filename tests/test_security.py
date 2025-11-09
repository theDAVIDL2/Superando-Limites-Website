import os
os.environ['TESTING'] = 'true'

import pytest
from fastapi.testclient import TestClient
from backend.server import app

client = TestClient(app)

def test_security_create_lead_injection():
    """
    Attempts to inject a script tag into the lead creation endpoint.
    The request should be accepted, but the data stored should be properly sanitized
    or the output encoded to prevent XSS.
    """
    malicious_email = "test<script>alert('XSS')</script>@example.com"
    response = client.post("/api/leads", json={"email": malicious_email, "source": "security-test"})
    
    # The API should not crash or return a 500 error
    assert response.status_code != 500
    
    # Pydantic's EmailStr should reject this email
    assert response.status_code == 422

def test_security_create_order_intent_fuzzing():
    """
    Sends various unexpected data types to the order intent endpoint
    to check for unexpected crashes or information disclosure.
    """
    # Test with a string for price instead of a float
    response = client.post("/api/orders-intent", json={"price": "not-a-float", "currency": "USD"})
    assert response.status_code == 422  # Expect a validation error

    # Test with a very large number
    response = client.post("/api/orders-intent", json={"price": 999999999999999999999, "currency": "USD"})
    assert response.status_code == 201  # Should handle large numbers gracefully

    # Test with a negative price
    response = client.post("/api/orders-intent", json={"price": -100, "currency": "USD"})
    assert response.status_code == 201  # Application might allow negative prices for credits, but good to test

def test_security_information_disclosure_in_errors():
    """
    Checks that error messages do not contain sensitive information like file paths or framework details.
    """
    # Request a non-existent endpoint
    response = client.get("/api/this-endpoint-does-not-exist")
    assert response.status_code == 404
    
    # Check that the error message is generic
    error_json = response.json()
    assert "detail" in error_json
    assert "Not Found" in error_json["detail"]
    
    # Ensure no sensitive info is present
    response_text = response.text.lower()
    assert "fastapi" not in response_text
    assert "starlette" not in response_text
    assert "python" not in response_text