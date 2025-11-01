# BuildEasy Testing Guide

This document provides instructions for testing the BuildEasy application at various levels.

## Quick Start Testing

### Prerequisites

Before running any tests, ensure all services are running:

```bash
# Terminal 1: Auth Server
cd /Users/gawie/ROZITECH-PROJECTS/rozitech-auth-server
npm run dev

# Terminal 2: BuildEasy Backend
cd /Users/gawie/ROZITECH-PROJECTS/rozitech-central/specialized_cvs/buildeasy/backend
npm run dev

# Terminal 3: BuildEasy Frontend
cd /Users/gawie/ROZITECH-PROJECTS/rozitech-central/specialized_cvs/buildeasy/frontend
npm run dev
```

### Service Health Checks

```bash
# Check Auth Server (should return health status)
curl http://localhost:4000/health

# Check BuildEasy Backend (should return healthy status)
curl http://localhost:5010/health

# Check BuildEasy Frontend (should return HTML)
curl http://localhost:3002
```

## Integration Testing

### Automated Integration Test Suite

Run the comprehensive integration test script:

```bash
cd /Users/gawie/ROZITECH-PROJECTS/rozitech-central/specialized_cvs/buildeasy
./test-integration.sh
```

This script tests:
- Service availability (auth server, backend, frontend)
- SSO authentication flow
- All CRUD operations on applications
- All 7 API endpoints
- Security (unauthorized access rejection)
- Database connectivity

### Manual Integration Testing

#### 1. Test SSO Authentication

```bash
# Login and get tokens
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@rozitech.com",
    "password": "testpassword123"
  }'

# Save the accessToken from response
TOKEN="<paste_access_token_here>"

# Verify token
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

#### 2. Test Application CRUD

```bash
# List applications
curl http://localhost:5010/api/applications \
  -H "Authorization: Bearer $TOKEN"

# Create application
curl -X POST http://localhost:5010/api/applications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test App",
    "slug": "test-app",
    "description": "Testing application creation"
  }'

# Get single application (replace APP_ID with actual ID)
curl http://localhost:5010/api/applications/APP_ID \
  -H "Authorization: Bearer $TOKEN"

# Update application
curl -X PATCH http://localhost:5010/api/applications/APP_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Test App",
    "description": "Updated description"
  }'

# Delete application
curl -X DELETE http://localhost:5010/api/applications/APP_ID \
  -H "Authorization: Bearer $TOKEN"
```

#### 3. Test Other Endpoints

```bash
# Test pages endpoint
curl http://localhost:5010/api/pages \
  -H "Authorization: Bearer $TOKEN"

# Test databases endpoint
curl http://localhost:5010/api/databases \
  -H "Authorization: Bearer $TOKEN"

# Test forms endpoint
curl http://localhost:5010/api/forms \
  -H "Authorization: Bearer $TOKEN"

# Test workflows endpoint
curl http://localhost:5010/api/workflows \
  -H "Authorization: Bearer $TOKEN"

# Test components endpoint
curl http://localhost:5010/api/components \
  -H "Authorization: Bearer $TOKEN"

# Test deployments endpoint
curl http://localhost:5010/api/deployments \
  -H "Authorization: Bearer $TOKEN"
```

## Frontend Testing

### Manual UI Testing

1. **Login Flow**
   - Open http://localhost:3002 in browser
   - Should redirect to /login
   - Enter valid credentials
   - Should redirect to /dashboard on success
   - Should show error message on failure

2. **Dashboard**
   - Verify applications list loads
   - Test "New Application" button
   - Verify new application appears in list
   - Test delete button with confirmation
   - Verify statistics update correctly

3. **Builder**
   - Click "Edit" on any application
   - Should navigate to /builder/:appId
   - Verify three-panel layout appears
   - Verify components list is visible
   - Verify canvas and properties panels appear

4. **Navigation**
   - Test navigation between Dashboard and Builder
   - Verify user info appears in header
   - Test logout button

5. **Authentication**
   - After logout, verify redirect to login
   - Try accessing /dashboard while logged out (should redirect to login)
   - Try accessing /builder while logged out (should redirect to login)

### Browser Console Testing

Open browser console (F12) and check for:
- No JavaScript errors on page load
- No 404s or failed network requests
- Axios interceptor working (check Network tab)
- State persistence (refresh page while logged in)

## Backend Testing

### API Endpoint Testing

#### Applications API

```bash
# Set token variable
TOKEN="your_access_token_here"

# List all applications
curl -v http://localhost:5010/api/applications \
  -H "Authorization: Bearer $TOKEN"

# Create application
curl -v -X POST http://localhost:5010/api/applications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Business App",
    "slug": "my-business-app",
    "description": "A comprehensive business application"
  }'

# Get single application
APP_ID="uuid-from-create-response"
curl -v http://localhost:5010/api/applications/$APP_ID \
  -H "Authorization: Bearer $TOKEN"

# Update application
curl -v -X PATCH http://localhost:5010/api/applications/$APP_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "published",
    "description": "Updated description"
  }'

# Delete application
curl -v -X DELETE http://localhost:5010/api/applications/$APP_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Security Testing

```bash
# Test unauthorized access (should return 401)
curl -v http://localhost:5010/api/applications

# Test invalid token (should return error)
curl -v http://localhost:5010/api/applications \
  -H "Authorization: Bearer invalid_token"

# Test missing bearer prefix (should return 401)
curl -v http://localhost:5010/api/applications \
  -H "Authorization: token_without_bearer"
```

### Multi-tenant Testing

To test multi-tenant isolation:

1. Login as User A (org 1)
2. Create applications as User A
3. Login as User B (org 2)
4. Verify User B cannot see User A's applications
5. Create applications as User B
6. Login as User A again
7. Verify User A still sees only their applications

## Database Testing

### Verify Tables

```bash
# Connect to PostgreSQL
psql -U postgres -d buildeasy_db

# List all tables
\dt

# Expected tables:
# - applications
# - app_pages
# - app_databases
# - app_forms
# - app_workflows
# - app_components
# - app_deployments
# - templates

# Check applications table structure
\d applications

# Query applications
SELECT id, name, slug, status, organization_id FROM applications;

# Exit psql
\q
```

### Verify Data Isolation

```sql
-- Check that all applications have organization_id
SELECT COUNT(*) FROM applications WHERE organization_id IS NULL;
-- Should return 0

-- Check applications by organization
SELECT organization_id, COUNT(*) FROM applications GROUP BY organization_id;
```

## Performance Testing

### Load Testing

Simple load test with curl:

```bash
# Run 100 requests to test rate limiting
for i in {1..100}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    http://localhost:5010/api/applications \
    -H "Authorization: Bearer $TOKEN"
done
```

### Response Time Testing

```bash
# Test API response time
time curl http://localhost:5010/api/applications \
  -H "Authorization: Bearer $TOKEN"

# Should complete in < 500ms
```

## Error Testing

### Test Error Handling

```bash
# Invalid JSON payload
curl -X POST http://localhost:5010/api/applications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d 'invalid json'

# Missing required fields
curl -X POST http://localhost:5010/api/applications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'

# Invalid UUID
curl http://localhost:5010/api/applications/not-a-uuid \
  -H "Authorization: Bearer $TOKEN"
```

## Debugging

### Check Backend Logs

```bash
# Backend logs are in console where npm run dev is running
# Look for error messages, SQL queries, etc.
```

### Check Database Queries

```bash
# Connect to database
psql -U postgres -d buildeasy_db

# Enable query logging
SET log_statement = 'all';

# Run your API calls, then check logs in postgres log file
```

### Check Network Requests

In browser DevTools:
1. Open Network tab (F12)
2. Filter by "XHR" to see API calls
3. Check request/response for each API call
4. Verify Authorization headers are present
5. Check for CORS errors

## Common Issues

### Auth Server Not Running

**Symptom**: Frontend login fails, shows connection error
**Solution**:
```bash
cd /Users/gawie/ROZITECH-PROJECTS/rozitech-auth-server
npm run dev
```

### Backend Not Connected to Database

**Symptom**: 500 errors on API calls
**Solution**:
```bash
# Check PostgreSQL is running
pg_isready

# Check connection string in backend/.env
cat backend/.env | grep DATABASE_URL

# Test connection manually
psql -U postgres -d buildeasy_db
```

### Frontend Can't Connect to Backend

**Symptom**: Network errors in browser console
**Solution**:
- Check backend is running on port 5010
- Check Vite proxy configuration in frontend/vite.config.js
- Verify CORS settings in backend allow localhost:3002

### CORS Errors

**Symptom**: CORS policy errors in browser
**Solution**:
- Check backend .env ALLOWED_ORIGINS includes http://localhost:3002
- Restart backend after changing .env

## Test Data Setup

### Create Test User

If you need a test user in the auth server:

```bash
# This should be done in the auth server database
# Contact auth server admin or check auth server documentation
```

### Create Sample Applications

```bash
# Use the test-integration.sh script or create manually via API
# Sample data will be automatically created during tests
```

## Continuous Testing

### Watch Mode (for future unit tests)

```bash
# Backend (when tests are added)
cd backend
npm test -- --watch

# Frontend (when tests are added)
cd frontend
npm test -- --watch
```

## Test Coverage (Future)

Once unit tests are implemented:

```bash
# Backend coverage
cd backend
npm run test:coverage

# Frontend coverage
cd frontend
npm run test:coverage
```

## Checklist Before Deployment

- [ ] All integration tests pass
- [ ] Manual UI testing completed
- [ ] Security tests pass
- [ ] Multi-tenant isolation verified
- [ ] Performance acceptable (< 500ms API responses)
- [ ] No console errors in browser
- [ ] Database migrations run successfully
- [ ] All environment variables configured
- [ ] CORS settings correct for production
- [ ] Rate limiting tested
- [ ] Error handling verified

---

## Running the Full Test Suite

To run all tests in sequence:

```bash
# 1. Start all services (in separate terminals)
cd /Users/gawie/ROZITECH-PROJECTS/rozitech-auth-server && npm run dev
cd /Users/gawie/ROZITECH-PROJECTS/rozitech-central/specialized_cvs/buildeasy/backend && npm run dev
cd /Users/gawie/ROZITECH-PROJECTS/rozitech-central/specialized_cvs/buildeasy/frontend && npm run dev

# 2. Run integration tests
cd /Users/gawie/ROZITECH-PROJECTS/rozitech-central/specialized_cvs/buildeasy
./test-integration.sh

# 3. Open browser for manual UI testing
open http://localhost:3002
```

## Getting Help

If tests fail:
1. Check service logs for error messages
2. Verify all environment variables are set
3. Ensure PostgreSQL is running
4. Check the DEVELOPMENT_STATUS.md for known issues
5. Review error messages in test output

---

**Last Updated**: 2025-11-01
**Test Suite Version**: 1.0.0
