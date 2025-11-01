#!/bin/bash

# BuildEasy Integration Test Script
# This script tests the full stack integration including SSO, API, and database

set -e

echo "================================================"
echo "BuildEasy Integration Test Suite"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
AUTH_SERVER_URL="http://localhost:4000"
BACKEND_URL="http://localhost:5010"
FRONTEND_URL="http://localhost:3002"

# Test credentials (should exist in auth server)
TEST_EMAIL="testuser@rozitech.com"
TEST_PASSWORD="testpassword123"

# Counter for tests
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
function print_success() {
    echo -e "${GREEN}✓ $1${NC}"
    ((TESTS_PASSED++))
}

function print_error() {
    echo -e "${RED}✗ $1${NC}"
    ((TESTS_FAILED++))
}

function print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Test 1: Check if services are running
echo "Test Suite 1: Service Health Checks"
echo "-----------------------------------"

# Check Auth Server
if curl -s -f "$AUTH_SERVER_URL/health" > /dev/null 2>&1; then
    print_success "Auth Server is running on port 4000"
else
    print_error "Auth Server is NOT running on port 4000"
    echo "Please start the auth server before running this test"
    exit 1
fi

# Check Backend API
BACKEND_HEALTH=$(curl -s "$BACKEND_URL/health")
if echo "$BACKEND_HEALTH" | grep -q "healthy"; then
    print_success "BuildEasy Backend is running on port 5010"
else
    print_error "BuildEasy Backend is NOT running correctly"
    exit 1
fi

# Check Frontend
if curl -s -f "$FRONTEND_URL" > /dev/null 2>&1; then
    print_success "BuildEasy Frontend is accessible on port 3002"
else
    print_error "BuildEasy Frontend is NOT accessible on port 3002"
fi

echo ""

# Test 2: Authentication Flow
echo "Test Suite 2: SSO Authentication"
echo "--------------------------------"

# Login and get tokens
print_info "Attempting login with test user..."
LOGIN_RESPONSE=$(curl -s -X POST "$AUTH_SERVER_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

# Extract access token
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')

if [ -n "$ACCESS_TOKEN" ]; then
    print_success "Successfully logged in and received access token"
    print_info "Token: ${ACCESS_TOKEN:0:50}..."
else
    print_error "Failed to login or receive access token"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

# Verify token with auth server
print_info "Verifying token with auth server..."
ME_RESPONSE=$(curl -s "$AUTH_SERVER_URL/api/auth/me" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$ME_RESPONSE" | grep -q "email"; then
    print_success "Token verification successful"

    # Check BuildEasy access
    if echo "$ME_RESPONSE" | grep -q "buildeasy\|\"all\""; then
        print_success "User has BuildEasy product access"
    else
        print_error "User does NOT have BuildEasy access"
        echo "User needs 'buildeasy' in organization.products array"
    fi
else
    print_error "Token verification failed"
    echo "Response: $ME_RESPONSE"
fi

echo ""

# Test 3: API Endpoint Tests
echo "Test Suite 3: BuildEasy API Endpoints"
echo "-------------------------------------"

# Test applications list endpoint
print_info "Testing GET /api/applications..."
APPS_RESPONSE=$(curl -s "$BACKEND_URL/api/applications" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$APPS_RESPONSE" | grep -q "applications"; then
    print_success "Successfully fetched applications list"
    APP_COUNT=$(echo "$APPS_RESPONSE" | grep -o '"applications":\[' | wc -l)
    print_info "Found applications in response"
else
    print_error "Failed to fetch applications"
    echo "Response: $APPS_RESPONSE"
fi

# Test create application
print_info "Testing POST /api/applications..."
CREATE_APP_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/applications" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Integration Test App",
        "slug": "integration-test-'$(date +%s)'",
        "description": "Created by integration test script"
    }')

if echo "$CREATE_APP_RESPONSE" | grep -q "Integration Test App"; then
    print_success "Successfully created test application"

    # Extract app ID for further tests
    APP_ID=$(echo "$CREATE_APP_RESPONSE" | grep -o '"id":"[^"]*' | sed 's/"id":"//' | head -1)
    print_info "Created app ID: $APP_ID"
else
    print_error "Failed to create application"
    echo "Response: $CREATE_APP_RESPONSE"
fi

# Test get single application
if [ -n "$APP_ID" ]; then
    print_info "Testing GET /api/applications/:id..."
    GET_APP_RESPONSE=$(curl -s "$BACKEND_URL/api/applications/$APP_ID" \
        -H "Authorization: Bearer $ACCESS_TOKEN")

    if echo "$GET_APP_RESPONSE" | grep -q "$APP_ID"; then
        print_success "Successfully fetched single application"
    else
        print_error "Failed to fetch single application"
    fi

    # Test update application
    print_info "Testing PATCH /api/applications/:id..."
    UPDATE_APP_RESPONSE=$(curl -s -X PATCH "$BACKEND_URL/api/applications/$APP_ID" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "Updated Integration Test App",
            "description": "Updated by integration test"
        }')

    if echo "$UPDATE_APP_RESPONSE" | grep -q "Updated Integration Test App"; then
        print_success "Successfully updated application"
    else
        print_error "Failed to update application"
    fi

    # Test delete application
    print_info "Testing DELETE /api/applications/:id..."
    DELETE_APP_RESPONSE=$(curl -s -X DELETE "$BACKEND_URL/api/applications/$APP_ID" \
        -H "Authorization: Bearer $ACCESS_TOKEN")

    if echo "$DELETE_APP_RESPONSE" | grep -q "success"; then
        print_success "Successfully deleted test application"
    else
        print_error "Failed to delete application"
    fi
fi

echo ""

# Test 4: Other API Endpoints
echo "Test Suite 4: Additional API Endpoints"
echo "---------------------------------------"

# Test pages endpoint
print_info "Testing GET /api/pages..."
PAGES_RESPONSE=$(curl -s "$BACKEND_URL/api/pages" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$PAGES_RESPONSE" | grep -q "pages"; then
    print_success "Pages endpoint is accessible"
else
    print_error "Pages endpoint failed"
fi

# Test databases endpoint
print_info "Testing GET /api/databases..."
DATABASES_RESPONSE=$(curl -s "$BACKEND_URL/api/databases" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$DATABASES_RESPONSE" | grep -q "databases"; then
    print_success "Databases endpoint is accessible"
else
    print_error "Databases endpoint failed"
fi

# Test forms endpoint
print_info "Testing GET /api/forms..."
FORMS_RESPONSE=$(curl -s "$BACKEND_URL/api/forms" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$FORMS_RESPONSE" | grep -q "forms"; then
    print_success "Forms endpoint is accessible"
else
    print_error "Forms endpoint failed"
fi

# Test workflows endpoint
print_info "Testing GET /api/workflows..."
WORKFLOWS_RESPONSE=$(curl -s "$BACKEND_URL/api/workflows" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$WORKFLOWS_RESPONSE" | grep -q "workflows"; then
    print_success "Workflows endpoint is accessible"
else
    print_error "Workflows endpoint failed"
fi

# Test components endpoint
print_info "Testing GET /api/components..."
COMPONENTS_RESPONSE=$(curl -s "$BACKEND_URL/api/components" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$COMPONENTS_RESPONSE" | grep -q "components"; then
    print_success "Components endpoint is accessible"
else
    print_error "Components endpoint failed"
fi

# Test deployments endpoint
print_info "Testing GET /api/deployments..."
DEPLOYMENTS_RESPONSE=$(curl -s "$BACKEND_URL/api/deployments" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$DEPLOYMENTS_RESPONSE" | grep -q "deployments"; then
    print_success "Deployments endpoint is accessible"
else
    print_error "Deployments endpoint failed"
fi

echo ""

# Test 5: Security Tests
echo "Test Suite 5: Security Checks"
echo "-----------------------------"

# Test unauthorized access
print_info "Testing unauthorized access rejection..."
UNAUTH_RESPONSE=$(curl -s "$BACKEND_URL/api/applications")

if echo "$UNAUTH_RESPONSE" | grep -q "No authentication token"; then
    print_success "Unauthorized requests are properly rejected"
else
    print_error "Unauthorized access check failed"
fi

# Test invalid token
print_info "Testing invalid token rejection..."
INVALID_TOKEN_RESPONSE=$(curl -s "$BACKEND_URL/api/applications" \
    -H "Authorization: Bearer invalid_token_12345")

if echo "$INVALID_TOKEN_RESPONSE" | grep -q "error"; then
    print_success "Invalid tokens are properly rejected"
else
    print_error "Invalid token check failed"
fi

echo ""

# Test 6: Database Tests
echo "Test Suite 6: Database Verification"
echo "-----------------------------------"

print_info "Verifying database tables exist..."

# Check if we can query the database through the API
# This is indirect - we're checking if the API responses indicate proper DB access
if echo "$APPS_RESPONSE" | grep -q "applications"; then
    print_success "Database connection is working (verified via API)"
else
    print_error "Database connection issues detected"
fi

echo ""

# Summary
echo "================================================"
echo "Test Results Summary"
echo "================================================"
echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! BuildEasy is ready.${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please review the output above.${NC}"
    exit 1
fi
