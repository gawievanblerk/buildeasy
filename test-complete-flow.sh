#!/bin/bash

echo "=========================================="
echo "BuildEasy Complete Flow Test"
echo "=========================================="
echo ""

# 1. Setup test user with BuildEasy access
echo "Step 1: Setting up test user with BuildEasy access..."
PGPASSWORD='postgres' psql -h localhost -p 5432 -U postgres -d rozitech_auth_dev << 'SQL'
UPDATE organizations
SET products = ARRAY['teamspace', 'buildeasy']::varchar[]
WHERE id = (SELECT organization_id FROM users WHERE email = 'testuser@rozitech.com' LIMIT 1);

SELECT
  u.email as "User Email",
  o.name as "Organization",
  o.products as "Products"
FROM users u
JOIN organizations o ON o.id = u.organization_id
WHERE u.email = 'testuser@rozitech.com';
SQL

echo ""
echo "Step 2: Testing SSO login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@rozitech.com","password":"password123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "   ✓ Login successful"
  echo "   Token: ${TOKEN:0:50}..."
else
  echo "   ✗ Login failed"
  echo "   Response: $LOGIN_RESPONSE"
  exit 1
fi

echo ""
echo "Step 3: Testing BuildEasy backend health..."
HEALTH=$(curl -s http://localhost:5010/api/health)
echo "   Backend: $HEALTH"

echo ""
echo "Step 4: Testing BuildEasy API access..."
APPS_RESPONSE=$(curl -s http://localhost:5010/api/applications \
  -H "Authorization: Bearer $TOKEN")

if echo "$APPS_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  APP_COUNT=$(echo "$APPS_RESPONSE" | jq '.applications | length')
  echo "   ✓ BuildEasy API accessible"
  echo "   Existing applications: $APP_COUNT"
else
  echo "   ✗ BuildEasy API not accessible"
  echo "   Response: $APPS_RESPONSE"
  exit 1
fi

echo ""
echo "Step 5: Creating test application..."
CREATE_RESPONSE=$(curl -s -X POST http://localhost:5010/api/applications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer Management System",
    "description": "Test application created via walkthrough",
    "status": "development"
  }')

APP_ID=$(echo "$CREATE_RESPONSE" | jq -r '.application.id')

if [ "$APP_ID" != "null" ] && [ -n "$APP_ID" ]; then
  echo "   ✓ Application created successfully"
  echo "   App ID: $APP_ID"
  echo "   Name: $(echo "$CREATE_RESPONSE" | jq -r '.application.name')"
else
  echo "   ✗ Application creation failed"
  echo "   Response: $CREATE_RESPONSE"
  exit 1
fi

echo ""
echo "Step 6: Retrieving application details..."
APP_DETAILS=$(curl -s http://localhost:5010/api/applications/$APP_ID \
  -H "Authorization: Bearer $TOKEN")

if echo "$APP_DETAILS" | jq -e '.success' > /dev/null 2>&1; then
  echo "   ✓ Application retrieved"
  echo "   Name: $(echo "$APP_DETAILS" | jq -r '.application.name')"
  echo "   Status: $(echo "$APP_DETAILS" | jq -r '.application.status')"
  echo "   Created: $(echo "$APP_DETAILS" | jq -r '.application.created_at')"
else
  echo "   ✗ Failed to retrieve application"
  exit 1
fi

echo ""
echo "=========================================="
echo "✓ All Tests Passed!"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "1. Open BuildEasy: http://localhost:3002"
echo "2. Login with:"
echo "   Email: testuser@rozitech.com"
echo "   Password: password123"
echo "3. Your test application is ready at:"
echo "   http://localhost:3002/builder/$APP_ID"
echo ""
echo "Or click 'Open Builder' on the application card"
echo "in the dashboard to start building!"
echo ""
