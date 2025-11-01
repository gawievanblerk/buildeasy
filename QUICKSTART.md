# BuildEasy Quick Start Guide

Get BuildEasy up and running in 5 minutes.

## Prerequisites Check

Before starting, ensure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL 14+ installed and running (`pg_isready`)
- [ ] Git installed
- [ ] Terminal access

## Step 1: Database Setup (2 minutes)

```bash
# Create the database
createdb buildeasy_db

# Navigate to backend
cd /Users/gawie/ROZITECH-PROJECTS/rozitech-central/specialized_cvs/buildeasy/backend

# Run migrations
npm run migrate
```

Expected output:
```
✓ Database migrations completed successfully
✓ Created 8 tables
```

## Step 2: Start Services (1 minute)

You need **three terminal windows**:

### Terminal 1: Auth Server
```bash
cd /Users/gawie/ROZITECH-PROJECTS/rozitech-auth-server
npm run dev
```

Wait for: `✓ Rozitech Auth Server listening on port 4000`

⚠️ **Known Issue**: Auth server may crash on startup due to Resend email service. If this happens, BuildEasy backend and frontend will still run, but login won't work until the auth server is fixed.

### Terminal 2: BuildEasy Backend
```bash
cd /Users/gawie/ROZITECH-PROJECTS/rozitech-central/specialized_cvs/buildeasy/backend
npm run dev
```

Wait for: `✓ BuildEasy Backend listening on port 5010`

### Terminal 3: BuildEasy Frontend
```bash
cd /Users/gawie/ROZITECH-PROJECTS/rozitech-central/specialized_cvs/buildeasy/frontend
npm run dev
```

Wait for: `✓ Local: http://localhost:3002/`

## Step 3: Verify Everything Works (1 minute)

### Check Backend
```bash
curl http://localhost:5010/health
```

Should return:
```json
{
  "success": true,
  "service": "BuildEasy Backend",
  "status": "healthy"
}
```

### Check Frontend
Open your browser to: http://localhost:3002

You should see the BuildEasy login page.

### Check Auth Server (if running)
```bash
curl http://localhost:4000/health
```

Should return health status.

## Step 4: Test the Application (1 minute)

### Option A: If Auth Server is Running

1. Go to http://localhost:3002
2. Login with your Rozitech credentials
3. You should see the Dashboard
4. Click "New Application"
5. Verify the application appears in the list

### Option B: If Auth Server is Down

You can still test the backend API directly:

```bash
# This should return 401 Unauthorized (expected)
curl http://localhost:5010/api/applications
```

Response:
```json
{
  "success": false,
  "error": "No authentication token provided"
}
```

This confirms the backend is running and authentication is required.

## Common Issues & Fixes

### Issue: "Port 5010 already in use"

```bash
# Find and kill the process
lsof -i :5010
kill -9 <PID>

# Or change port in backend/.env
PORT=5011
```

### Issue: "Database connection failed"

```bash
# Check PostgreSQL is running
pg_isready

# Check database exists
psql -l | grep buildeasy_db

# If missing, create it
createdb buildeasy_db
npm run migrate
```

### Issue: "Frontend shows blank page"

1. Check browser console for errors (F12)
2. Verify backend is running: `curl http://localhost:5010/health`
3. Check Vite is running on port 3002
4. Clear browser cache and refresh

### Issue: "Cannot login - auth server error"

The auth server has a known crash issue with Resend email service:

**Temporary Workaround**: Wait for auth server fix
**Status**: See DEVELOPMENT_STATUS.md for latest updates

## What to Do Next

### 1. Explore the Dashboard
- Create new applications
- View application list
- Delete test applications
- Check statistics

### 2. Try the Visual Builder
- Click "Edit" on any application
- View the three-panel builder layout
- See component list, canvas, and properties panel
- Note: Drag-and-drop not yet implemented

### 3. Test the API
See TESTING.md for comprehensive API testing examples.

### 4. Review Documentation
- README.md - Project overview
- DEVELOPMENT_STATUS.md - Current development status
- TESTING.md - Testing procedures
- backend/README.md - API documentation

## Running Integration Tests

Once auth server is working:

```bash
cd /Users/gawie/ROZITECH-PROJECTS/rozitech-central/specialized_cvs/buildeasy
./test-integration.sh
```

This will test:
- Service health
- SSO authentication
- All API endpoints
- Security features
- Database operations

## Stopping Services

In each terminal window, press: `Ctrl + C`

Or kill all at once:

```bash
# Kill backend
pkill -f "buildeasy/backend"

# Kill frontend
pkill -f "buildeasy/frontend"

# Kill auth server
pkill -f "rozitech-auth-server"
```

## Development Workflow

### Making Changes

**Backend Changes**:
- Edit files in `backend/src/`
- Nodemon will auto-restart
- Check terminal for errors

**Frontend Changes**:
- Edit files in `frontend/src/`
- Vite HMR will auto-refresh
- Check browser console for errors

**Database Changes**:
- Edit `backend/src/config/migrate.js`
- Run `npm run migrate`
- Restart backend

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-new-feature

# Make changes
# ...

# Commit
git add .
git commit -m "Add new feature"

# Push
git push origin feature/my-new-feature
```

## Useful Commands

### Backend
```bash
# Install dependencies
npm install

# Run migrations
npm run migrate

# Start dev server
npm run dev

# Start production server
npm start
```

### Frontend
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database
```bash
# Connect to database
psql buildeasy_db

# List tables
\dt

# Describe table
\d applications

# Query data
SELECT * FROM applications;

# Exit
\q
```

## Success Checklist

- [ ] Database created and migrated (8 tables)
- [ ] Backend running on port 5010 (health check passes)
- [ ] Frontend running on port 3002 (page loads)
- [ ] Auth server running on port 4000 (or aware it's crashed)
- [ ] Can see BuildEasy login page
- [ ] Understand the known auth server issue

## Next Steps

1. **If Auth Server Works**: Test full login flow and dashboard
2. **If Auth Server Crashed**: Focus on backend API testing
3. **Review Architecture**: Read DEVELOPMENT_STATUS.md
4. **Plan Next Features**: See roadmap in README.md

## Getting Help

- Check DEVELOPMENT_STATUS.md for known issues
- Review TESTING.md for testing procedures
- See backend/README.md for API details
- Check browser console for frontend errors
- Check terminal logs for backend errors

---

**You're all set!** BuildEasy is now running locally.

**Services Running**:
- Backend: http://localhost:5010
- Frontend: http://localhost:3002
- Auth: http://localhost:4000 (may be down)

Happy building! 🚀
