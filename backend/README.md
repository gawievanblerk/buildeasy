# BuildEasy Backend

Backend API for BuildEasy - No-Code Application Builder Platform

## Features

- **SSO Authentication**: Integrated with Rozitech Auth Server
- **Multi-tenant Architecture**: Complete data isolation by organization
- **RESTful API**: CRUD operations for applications, pages, databases, forms, etc.
- **PostgreSQL Database**: 8 core tables for application management
- **JWT Security**: Token-based authentication
- **Rate Limiting**: Protection against abuse
- **Comprehensive Logging**: Winston logger with file rotation

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database running
- Rozitech Auth Server running on port 4000

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key environment variables:
- `PORT` - Server port (default: 5010)
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SERVER_URL` - Rozitech Auth Server URL (default: http://localhost:4000)

### Database Setup

Create database and run migrations:

```bash
createdb buildeasy_db
npm run migrate
```

### Development

```bash
npm run dev
```

Server will start on `http://localhost:5010`

### Production

```bash
npm start
```

## API Endpoints

### Health Check
```
GET /health
```

### Applications (Requires Authentication)
```
GET    /api/applications       # List all applications
POST   /api/applications       # Create new application
GET    /api/applications/:id   # Get application by ID
PATCH  /api/applications/:id   # Update application
DELETE /api/applications/:id   # Delete application
```

### Authentication

All API requests require JWT token from Rozitech Auth Server:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5010/api/applications
```

## Testing SSO Integration

Run the included test script to verify SSO integration:

```bash
# Set test credentials
export TEST_EMAIL="your-test-email@example.com"
export TEST_PASSWORD="YourTestPassword123"

# Run test
node test-sso-integration.js
```

The script tests:
1. Authentication with Auth Server
2. JWT token verification
3. Unauthorized request rejection
4. Authorized API access
5. Application creation
6. Multi-tenant data isolation

## Architecture

```
BuildEasy Backend (Port 5010)
│
├── SSO Authentication
│   └── rozitech-auth-server:4000
│       ├── JWT token validation
│       ├── User profile management
│       └── Product access control
│
├── PostgreSQL Database
│   └── buildeasy_db
│       ├── applications (multi-tenant by org_id)
│       ├── app_pages
│       ├── app_databases
│       ├── app_forms
│       ├── app_workflows
│       ├── app_components
│       ├── app_deployments
│       └── templates
│
└── API Routes
    ├── /api/applications (CRUD complete)
    ├── /api/pages (placeholder)
    ├── /api/databases (placeholder)
    ├── /api/forms (placeholder)
    ├── /api/components (placeholder)
    ├── /api/workflows (placeholder)
    ├── /api/deployments (placeholder)
    └── /api/templates (placeholder)
```

## Security Features

1. **JWT Authentication**: All API routes require valid JWT tokens from auth server
2. **Product Access Control**: Verifies user has BuildEasy access in their subscription
3. **Multi-tenancy**: Complete data isolation by organization_id
4. **Rate Limiting**: 100 requests per 15 minutes per IP
5. **Helmet.js**: Security headers
6. **CORS**: Configured for specific origins only

## Development

### Project Structure

```
backend/
├── src/
│   ├── config/           # Database, logger, migrations
│   │   ├── database.js
│   │   ├── logger.js
│   │   └── migrate.js
│   ├── middleware/       # Authentication middleware
│   │   └── auth.js
│   ├── services/         # Business logic
│   │   └── authClient.js # SSO integration
│   ├── routes/           # API endpoints
│   │   ├── applications.js
│   │   ├── pages.js
│   │   ├── databases.js
│   │   ├── forms.js
│   │   ├── components.js
│   │   ├── templates.js
│   │   └── deployments.js
│   └── server.js         # Express app
├── logs/                 # Application logs
├── tests/                # Unit and integration tests
├── package.json
└── .env                  # Environment variables
```

### Adding New Routes

1. Create route file in `src/routes/`
2. Import authentication middleware
3. Add route to `src/server.js`

Example:
```javascript
// src/routes/myroute.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  const { organizationId } = req;
  // Your logic here
  res.json({ success: true, data: [] });
});

module.exports = router;
```

```javascript
// src/server.js
app.use('/api/myroute', require('./routes/myroute'));
```

## Database Schema

### applications
- `id` - UUID primary key
- `organization_id` - UUID (multi-tenant isolation)
- `user_id` - UUID (creator)
- `name` - Application name
- `slug` - URL-friendly identifier
- `status` - draft|published|archived
- `config` - JSONB application configuration
- `metadata` - JSONB additional data

### Other Tables
- **app_pages** - Pages within applications
- **app_databases** - Database schemas for apps
- **app_forms** - Form definitions
- **app_workflows** - Automation workflows
- **app_components** - UI components
- **app_deployments** - Deployment history
- **templates** - Application templates

## Troubleshooting

### Auth Server Connection Failed
Ensure auth server is running:
```bash
cd /path/to/rozitech-auth-server
npm run dev
```

### Database Connection Error
Check DATABASE_URL in `.env` and ensure PostgreSQL is running:
```bash
psql $DATABASE_URL
```

### Port Already in Use
Change PORT in `.env` file or kill existing process:
```bash
lsof -i :5010
kill -9 <PID>
```

## Support

For issues or questions, check:
- CLAUDE.md for project context
- SRS.md for requirements specification
- Integration guide in rozitech-auth-server/INTEGRATION-GUIDE.md
