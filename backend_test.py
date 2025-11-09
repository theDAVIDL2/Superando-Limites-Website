#!/usr/bin/env python3
"""
Backend API Testing Script
Tests FastAPI endpoints for leads and order intents
"""

import requests
import json
import sys
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from frontend env
FRONTEND_BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL')
if not FRONTEND_BACKEND_URL:
    print("❌ REACT_APP_BACKEND_URL not found in frontend/.env")
    sys.exit(1)

BASE_URL = f"{FRONTEND_BACKEND_URL}/api"
print(f"🔗 Testing backend at: {BASE_URL}")

def test_cors_options():
    """Test CORS preflight request"""
    print("\n🔍 Testing CORS OPTIONS request...")
    try:
        response = requests.options(f"{BASE_URL}/leads", headers={
            'Origin': 'https://example.com',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        })
        print(f"   Status: {response.status_code}")
        print(f"   Headers: {dict(response.headers)}")
        
        if response.status_code in [200, 204]:
            print("✅ CORS OPTIONS request successful")
            return True
        else:
            print(f"❌ CORS OPTIONS failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ CORS OPTIONS request failed: {e}")
        return False

def test_post_lead():
    """Test POST /api/leads endpoint"""
    print("\n🔍 Testing POST /api/leads...")
    
    lead_data = {
        "email": "teste@example.com",
        "source": "landing_form"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/leads", json=lead_data)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
        
        if response.status_code == 201:
            data = response.json()
            required_fields = ['id', 'email', 'created_at']
            
            if all(field in data for field in required_fields):
                print("✅ POST /api/leads successful - all required fields present")
                print(f"   Lead ID: {data['id']}")
                print(f"   Email: {data['email']}")
                print(f"   Created at: {data['created_at']}")
                print(f"   Source: {data.get('source', 'N/A')}")
                return True, data
            else:
                missing = [f for f in required_fields if f not in data]
                print(f"❌ POST /api/leads missing fields: {missing}")
                return False, None
        else:
            print(f"❌ POST /api/leads failed with status {response.status_code}")
            return False, None
            
    except Exception as e:
        print(f"❌ POST /api/leads request failed: {e}")
        return False, None

def test_get_leads():
    """Test GET /api/leads endpoint"""
    print("\n🔍 Testing GET /api/leads...")
    
    try:
        response = requests.get(f"{BASE_URL}/leads")
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Found {len(data)} leads")
            
            if len(data) >= 1:
                print("✅ GET /api/leads successful - contains at least 1 lead")
                # Show first lead structure
                if data:
                    first_lead = data[0]
                    print(f"   First lead structure: {list(first_lead.keys())}")
                    print(f"   Sample lead: {first_lead}")
                return True, data
            else:
                print("❌ GET /api/leads returned empty array")
                return False, None
        else:
            print(f"❌ GET /api/leads failed with status {response.status_code}")
            return False, None
            
    except Exception as e:
        print(f"❌ GET /api/leads request failed: {e}")
        return False, None

def test_post_order_intent():
    """Test POST /api/orders-intent endpoint"""
    print("\n🔍 Testing POST /api/orders-intent...")
    
    order_data = {
        "price": 59.9,
        "currency": "BRL",
        "note": "landing_cta_hero"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/orders-intent", json=order_data)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
        
        if response.status_code == 201:
            data = response.json()
            required_fields = ['id', 'created_at', 'price', 'currency']
            
            if all(field in data for field in required_fields):
                print("✅ POST /api/orders-intent successful - all required fields present")
                print(f"   Order Intent ID: {data['id']}")
                print(f"   Price: {data['price']} {data['currency']}")
                print(f"   Created at: {data['created_at']}")
                print(f"   Note: {data.get('note', 'N/A')}")
                return True, data
            else:
                missing = [f for f in required_fields if f not in data]
                print(f"❌ POST /api/orders-intent missing fields: {missing}")
                return False, None
        else:
            print(f"❌ POST /api/orders-intent failed with status {response.status_code}")
            return False, None
            
    except Exception as e:
        print(f"❌ POST /api/orders-intent request failed: {e}")
        return False, None

def test_get_order_intents():
    """Test GET /api/orders-intent endpoint"""
    print("\n🔍 Testing GET /api/orders-intent...")
    
    try:
        response = requests.get(f"{BASE_URL}/orders-intent")
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Found {len(data)} order intents")
            
            if len(data) >= 1:
                print("✅ GET /api/orders-intent successful - contains recently created item")
                # Show first order intent structure
                if data:
                    first_order = data[0]
                    print(f"   First order intent structure: {list(first_order.keys())}")
                    print(f"   Sample order intent: {first_order}")
                return True, data
            else:
                print("❌ GET /api/orders-intent returned empty array")
                return False, None
        else:
            print(f"❌ GET /api/orders-intent failed with status {response.status_code}")
            return False, None
            
    except Exception as e:
        print(f"❌ GET /api/orders-intent request failed: {e}")
        return False, None

def test_backend_health():
    """Test basic backend connectivity"""
    print("\n🔍 Testing backend health...")
    
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Backend is responding")
            return True
        else:
            print(f"❌ Backend health check failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Backend health check failed: {e}")
        return False

def main():
    """Run all backend tests"""
    print("🚀 Starting Backend API Tests")
    print("=" * 50)
    
    results = {}
    
    # Test backend health first
    results['health'] = test_backend_health()
    
    # Test CORS
    results['cors'] = test_cors_options()
    
    # Test leads endpoints
    results['post_lead'], lead_data = test_post_lead()
    results['get_leads'], leads_data = test_get_leads()
    
    # Test order intents endpoints
    results['post_order'], order_data = test_post_order_intent()
    results['get_orders'], orders_data = test_get_order_intents()
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 50)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name.upper()}: {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All backend tests PASSED!")
        return True
    else:
        print("⚠️  Some backend tests FAILED!")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)