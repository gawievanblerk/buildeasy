# BuildEasy User Walkthrough Guide

Complete step-by-step guide to subscribe to Small Business Bundle, login, and create your first app with BuildEasy.

## Prerequisites

Make sure these services are running:
- Auth Server: `http://localhost:4000`
- BuildEasy Backend: `http://localhost:5010`
- BuildEasy Frontend: `http://localhost:3002`

## Part 1: Subscribe to Small Business Bundle

### Method 1: Using Existing Test Account (Quickest)

**Test Credentials:**
- Email: `testuser@rozitech.com`
- Password: `password123`

Run this SQL to add BuildEasy access to your test account:

```bash
# Connect to auth database and update organization products
PGPASSWORD='postgres' psql -h localhost -p 5432 -U postgres -d rozitech_auth_dev << 'EOF'

-- Update organization to include BuildEasy product
UPDATE organizations
SET products = ARRAY['teamspace', 'buildeasy']::varchar[]
WHERE id = (SELECT organization_id FROM users WHERE email = 'testuser@rozitech.com' LIMIT 1);

-- Verify the update
SELECT o.id, o.name, o.products, u.email
FROM organizations o
JOIN users u ON u.organization_id = o.id
WHERE u.email = 'testuser@rozitech.com';

EOF
```

### Method 2: Create New Account with Small Business Bundle

1. **Sign Up**
   - Go to: `http://localhost:4000/register` (or your main platform registration)
   - Fill in:
     - Email: your-email@example.com
     - Password: your-password
     - Organization Name: Your Company Name
   - Click "Sign Up"

2. **Subscribe to Small Business Bundle**
   - Navigate to billing/subscription page
   - Select: **Small Business Bundle** ($39/month)
   - This includes: TeamSpace + BuildEasy + 1 custom product
   - Complete payment (or in test mode, just confirm)

3. **Verify Access**
   - Your organization's `products` array should now include: `['teamspace', 'buildeasy']`

## Part 2: Login to BuildEasy

1. **Open BuildEasy**
   - Navigate to: `http://localhost:3002`
   - You should see the BuildEasy login page

2. **Login with SSO**
   - Enter your credentials:
     - Email: `testuser@rozitech.com`
     - Password: `password123`
   - Click "Sign In"

3. **Access Verification**
   - The system checks if your organization has 'buildeasy' in the products array
   - If not, you'll see: "You do not have access to BuildEasy"
   - If yes, you'll be redirected to the BuildEasy Dashboard

## Part 3: BuildEasy Dashboard

After successful login, you'll see:

### Dashboard Features

1. **Navigation Bar**
   - BuildEasy logo
   - User menu (top right)
   - "Create New Application" button

2. **Your Applications Section**
   - Grid of your existing applications
   - Each card shows:
     - Application name
     - Description
     - Created date
     - Last modified date
     - Action buttons (Open Builder, Edit, Delete)

3. **Quick Actions**
   - Create New Application
   - Import Application
   - Browse Templates

## Part 4: Create Your First Application

### Step 1: Create Application

1. Click **"Create New Application"** button
2. Fill in the modal form:
   - **Name**: "Customer Management System"
   - **Description**: "Track and manage customer information"
   - **Template**: None (start from scratch) or choose a template
3. Click **"Create Application"**

### Step 2: Open Visual Builder

1. Click **"Open Builder"** on your new application card
2. You'll be taken to: `http://localhost:3002/builder/:appId`

### Step 3: Understand Builder Interface

The builder has 3 main panels:

**Left Panel - Component Library**
- Organized by categories:
  - **Basic**: Button, Text
  - **Form**: Input, Form
  - **Layout**: Container, Card
  - **Data**: Table
  - **Media**: Image

**Center Panel - Canvas**
- This is where you build your application
- Drag components here or click to add
- Click components to select them
- Delete button appears when component is selected

**Right Panel - Properties Panel**
- Shows properties of selected component
- Edit component properties here
- Advanced section for CSS classes and IDs

**Top Toolbar**
- Application name
- Undo/Redo buttons
- Preview button
- Save button
- Publish button

## Part 5: Build a Simple Contact Form

Let's create a simple contact form to demonstrate the builder:

### Step 1: Add a Container

1. In the **Components Panel** (left), click on **Layout** category
2. Click **Container** component
3. It will be added to the canvas
4. Click on it to select it

### Step 2: Configure Container

With the container selected, in the **Properties Panel** (right):
1. **Layout**: Select "column" (vertical layout)
2. **Gap**: Select "medium"
3. **Padding**: Select "medium"
4. **Background Color**: Click color picker, choose light gray (#f5f5f5)

### Step 3: Add a Text Component (Heading)

1. Click **Basic** category
2. Click **Text** component
3. In Properties Panel:
   - **Content**: "Contact Us"
   - **Font Size**: "2xl"
   - **Font Weight**: "bold"
   - **Text Color**: #1a1a1a

### Step 4: Add Input Fields

1. Click **Form** category
2. Click **Input** component (do this 3 times)

**First Input (Name):**
- **Label**: "Full Name"
- **Placeholder**: "Enter your name"
- **Type**: "text"
- **Required**: Check the box

**Second Input (Email):**
- **Label**: "Email Address"
- **Placeholder**: "your.email@example.com"
- **Type**: "email"
- **Required**: Check the box

**Third Input (Message):**
- **Label**: "Message"
- **Placeholder**: "Enter your message"
- **Type**: "text"
- **Required**: Check the box

### Step 5: Add a Button

1. Click **Basic** category
2. Click **Button** component
3. In Properties Panel:
   - **Button Text**: "Submit"
   - **Style**: "primary"
   - **Size**: "medium"

### Step 6: Save Your Application

1. Click the **Save** button in the top toolbar
2. You'll see: "Application saved!" message
3. Your application is now saved to the database

### Step 7: Preview Your Application

1. Click the **Preview** button
2. See how your application looks
3. (Note: In current version, preview opens in new tab or modal)

## Part 6: Explore More Components

### Add a Table

1. Click **Data** category
2. Click **Table** component
3. In Properties Panel:
   - **Columns**: "Name, Email, Phone, Status" (comma-separated)
   - **Data Source**: "manual"
   - **Striped Rows**: Check
   - **Show Borders**: Check

### Add a Card

1. Click **Layout** category
2. Click **Card** component
3. In Properties Panel:
   - **Title**: "Welcome Card"
   - **Show Header**: Check
   - **Show Footer**: Check
   - **Shadow**: "medium"

### Add an Image

1. Click **Media** category
2. Click **Image** component
3. In Properties Panel:
   - **Image URL**: "https://via.placeholder.com/600x400"
   - **Alt Text**: "Sample Image"
   - **Width**: "full"
   - **Object Fit**: "cover"

## Part 7: Advanced Features

### Undo/Redo

- **Undo**: Click "↶ Undo" or press Ctrl+Z
- **Redo**: Click "↷ Redo" or press Ctrl+Y
- History maintains 50 operations

### Component Selection and Deletion

1. **Select**: Click any component on canvas
2. **Delete**:
   - Click trash icon (🗑️) on selected component
   - Or use delete button in Properties Panel
   - Confirms before deleting

### Component Categories

Organize your workspace using category tabs:
- **Basic**: Core UI elements
- **Form**: Input fields and forms
- **Layout**: Containers and structure
- **Data**: Tables and data display
- **Media**: Images and media elements

## Part 8: Save and Export

### Save Application

1. Click **Save** in toolbar
2. Application state is stored in:
   - Database: `applications` table
   - Includes all components and their properties

### Export Application (Future Feature)

- Export as JSON
- Export as standalone React app
- Export to mobile app

### Publish Application (Future Feature)

1. Click **Publish** button
2. Choose deployment target
3. Get shareable URL
4. Application goes live

## Troubleshooting

### Issue: "You do not have access to BuildEasy"

**Solution**: Your organization doesn't have BuildEasy product access.

Run this SQL to fix:
```bash
PGPASSWORD='postgres' psql -h localhost -p 5432 -U postgres -d rozitech_auth_dev -c "
UPDATE organizations
SET products = ARRAY['teamspace', 'buildeasy']::varchar[]
WHERE id = (SELECT organization_id FROM users WHERE email = 'YOUR_EMAIL@example.com' LIMIT 1);
"
```

### Issue: Login page redirects to error

**Solution**: Make sure auth server is running:
```bash
cd /Users/gawie/ROZITECH-PROJECTS/rozitech-auth-server
npm run dev
```

### Issue: Components not appearing on canvas

**Solution**:
1. Check browser console for errors (F12)
2. Verify backend is running: `curl http://localhost:5010/api/health`
3. Check component registry is loaded

### Issue: Save doesn't work

**Solution**:
1. Verify BuildEasy database exists and is migrated
2. Check backend logs for errors
3. Verify authentication token is valid

### Issue: Properties Panel not updating

**Solution**:
1. Ensure component is selected (should have blue ring)
2. Click component again to refresh selection
3. Check browser console for errors

## Testing the Complete Flow

Here's a script to test everything:

```bash
#!/bin/bash

echo "Testing BuildEasy Complete Flow"
echo "================================"

# 1. Setup test user
echo "1. Setting up test user with BuildEasy access..."
PGPASSWORD='postgres' psql -h localhost -p 5432 -U postgres -d rozitech_auth_dev -c "
UPDATE organizations
SET products = ARRAY['teamspace', 'buildeasy']::varchar[]
WHERE id = (SELECT organization_id FROM users WHERE email = 'testuser@rozitech.com' LIMIT 1);
"

# 2. Test login
echo "2. Testing login..."
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@rozitech.com","password":"password123"}' \
  | jq -r '.accessToken')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "   ✓ Login successful"
else
  echo "   ✗ Login failed"
  exit 1
fi

# 3. Test BuildEasy API access
echo "3. Testing BuildEasy API access..."
APPS=$(curl -s http://localhost:5010/api/applications \
  -H "Authorization: Bearer $TOKEN")

if echo "$APPS" | jq -e '.success' > /dev/null 2>&1; then
  echo "   ✓ BuildEasy API accessible"
else
  echo "   ✗ BuildEasy API not accessible"
  exit 1
fi

# 4. Create test application
echo "4. Creating test application..."
APP=$(curl -s -X POST http://localhost:5010/api/applications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test App",
    "description": "Created via test script",
    "status": "development"
  }')

APP_ID=$(echo "$APP" | jq -r '.application.id')

if [ "$APP_ID" != "null" ] && [ -n "$APP_ID" ]; then
  echo "   ✓ Application created: $APP_ID"
else
  echo "   ✗ Application creation failed"
  exit 1
fi

echo ""
echo "✓ All tests passed!"
echo ""
echo "You can now:"
echo "1. Open BuildEasy: http://localhost:3002"
echo "2. Login with: testuser@rozitech.com / password123"
echo "3. Start building your application!"
```

## Next Steps

1. **Build More Complex Apps**
   - Try creating a CRM system
   - Build an inventory tracker
   - Create a project management tool

2. **Learn Component Combinations**
   - Nest containers for complex layouts
   - Combine form components for workflows
   - Use tables with filters and sorting

3. **Explore Templates (Coming Soon)**
   - Pre-built application templates
   - Industry-specific designs
   - Customizable starting points

4. **Mobile App Generation (Coming Soon)**
   - Generate React Native apps
   - iOS and Android deployment
   - Offline-first mobile apps

5. **Workflow Integration (Future)**
   - Connect with AutoFlow AI
   - Add business logic
   - Trigger automated workflows

## Support

- Documentation: Check DEVELOPMENT_STATUS.md, TESTING.md
- Issues: Report in project issue tracker
- Community: Join Rozitech developer community

## Congratulations!

You've successfully:
- ✓ Subscribed to Small Business Bundle
- ✓ Logged into BuildEasy
- ✓ Created your first application
- ✓ Used the visual builder
- ✓ Added and configured components
- ✓ Saved your application

You're now ready to build production-ready applications with BuildEasy!
