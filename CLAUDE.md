# CLAUDE.md - BuildEasy Project

This file provides guidance for working with the BuildEasy project - a no-code business application builder that enables users to create custom applications, databases, forms, and mobile apps through an intuitive drag-and-drop interface.

## Project Overview

BuildEasy democratizes application development by providing visual tools for building database-driven applications. Users can create everything from simple forms to complex business applications with workflows, user management, and mobile app generation capabilities.

**Market Position**: Targeting the growing no-code market where 70% of new SaaS apps will have no-code capabilities by 2025.

**Pricing**: $29/month for individual product, included in $79/month Complete Suite.

## Project Structure

```
buildeasy/
├── backend/                 # Node.js/Express API backend
│   ├── src/
│   │   ├── controllers/     # API route controllers
│   │   ├── models/          # Database models (PostgreSQL)
│   │   ├── services/        # Business logic services
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── generators/      # Code generation services
│   ├── tests/               # Backend tests
│   └── config/              # Configuration files
├── frontend/                # React.js visual builder
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── builder/         # Visual builder components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service calls
│   │   ├── store/           # Redux store and slices
│   │   └── utils/           # Frontend utilities
│   ├── public/              # Static assets
│   └── tests/               # Frontend tests
├── app-runtime/             # Generated app runtime engine
│   ├── src/
│   │   ├── core/            # Core runtime functionality
│   │   ├── components/      # Runtime UI components
│   │   ├── database/        # Dynamic database layer
│   │   └── auth/            # App user authentication
│   ├── templates/           # App generation templates
│   └── tests/               # Runtime tests
├── mobile-generator/        # React Native code generator
│   ├── src/
│   │   ├── generators/      # Mobile code generation
│   │   ├── templates/       # React Native templates
│   │   ├── components/      # Mobile component library
│   │   └── utils/           # Generation utilities
│   ├── build/               # Build scripts and configs
│   └── tests/               # Mobile generator tests
├── shared/                  # Shared components and utilities
│   ├── types/               # TypeScript type definitions
│   ├── constants/           # Shared constants
│   ├── components/          # Shared UI components
│   └── utils/               # Cross-platform utilities
├── docs/                    # Project documentation
│   ├── api/                 # API documentation
│   ├── builder-guide/       # Visual builder documentation
│   ├── runtime-guide/       # App runtime documentation
│   └── user-guides/         # User documentation
├── deployment/              # Deployment configurations
│   ├── docker/              # Docker configurations
│   ├── kubernetes/          # K8s manifests
│   └── scripts/             # Deployment scripts
└── tests/                   # Integration and E2E tests
```

## Core Features

### 1. Visual Application Builder
- **Drag-and-Drop Designer**: Intuitive interface for building applications
- **Component Library**: Rich set of pre-built UI components
- **Layout System**: Flexible grid and container-based layouts
- **Real-time Preview**: Live preview of applications during building
- **Responsive Design**: Automatic mobile and tablet optimization

### 2. Database Designer
- **Visual Schema Creation**: Point-and-click database design
- **Field Types**: Text, number, date, boolean, file, relationship fields
- **Relationship Management**: Visual foreign key and reference management
- **Data Validation**: Built-in validation rules and constraints
- **Import/Export**: CSV/Excel data import and export capabilities

### 3. Form Builder
- **Advanced Forms**: Multi-step forms with conditional logic
- **Field Validation**: Real-time validation and error handling
- **File Uploads**: Secure file upload and management
- **Form Analytics**: Submission tracking and performance metrics
- **Custom Styling**: Theme-based form styling and branding

### 4. Workflow Engine
- **Business Logic**: Visual workflow creation for app behavior
- **Event Triggers**: Data changes, form submissions, scheduled tasks
- **Action Types**: Email notifications, data updates, API calls
- **Integration Support**: Connect with AutoFlow AI workflows
- **Conditional Processing**: Advanced decision trees and branching

### 5. Mobile App Generation
- **Native Apps**: Generate React Native applications
- **Offline Support**: Local data storage and synchronization
- **Push Notifications**: Real-time notifications for mobile users
- **App Store Deployment**: Automated app store submission process
- **Progressive Web Apps**: PWA support for cross-platform compatibility

## Technology Stack

### Backend Services
- **Runtime**: Node.js 18+ with Express.js framework
- **Database**: PostgreSQL for app definitions and user data
- **Multi-tenancy**: Isolated databases per application
- **File Storage**: AWS S3 for user uploads and generated assets
- **Authentication**: JWT tokens with OAuth 2.0 integration

### Frontend Builder
- **Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **UI Framework**: Custom design system with Material-UI base
- **Drag & Drop**: React DnD for builder interface
- **Code Editor**: Monaco Editor for custom code editing

### App Runtime Engine
- **Dynamic Rendering**: React-based runtime for generated apps
- **Database Layer**: Prisma ORM for dynamic schema management
- **Authentication**: Built-in user management for generated apps
- **API Layer**: Automatic REST API generation for app data
- **Performance**: Optimized rendering and caching strategies

### Mobile Generation
- **Framework**: React Native for cross-platform mobile apps
- **Code Generation**: Template-based native code generation
- **Build Pipeline**: Automated building and signing process
- **Distribution**: Integration with App Store Connect and Google Play
- **Analytics**: Built-in analytics and crash reporting

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes for production deployment
- **CDN**: Global content delivery for generated applications
- **Monitoring**: Application performance monitoring for generated apps

## Development Guidelines

### Code Standards
- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Custom configuration for no-code platform
- **Prettier**: Consistent code formatting across all services
- **Husky**: Pre-commit hooks for quality and security checks

### Testing Strategy
- **Unit Tests**: Jest for all service components
- **Integration Tests**: API and database integration testing
- **E2E Tests**: Playwright for end-to-end application building
- **Visual Testing**: Screenshot testing for builder components
- **Performance Tests**: Load testing for generated applications

### API Design
- **Builder APIs**: RESTful endpoints for application management
- **Runtime APIs**: Dynamic API generation for user applications
- **GraphQL**: Complex queries for application data relationships
- **Webhooks**: Real-time notifications for application events

## Integration with Rozitech Platform

### Shared Services
- **Authentication**: Unified SSO across all Rozitech products
- **Billing**: Integrated subscription and usage-based billing
- **File Storage**: Shared file storage and CDN infrastructure
- **Analytics**: Unified analytics dashboard across applications

### Cross-Platform Integration
- **AutoFlow AI**: Trigger workflows from app events and data changes
- **TeamSpace**: Share applications with team members and collaborate
- **Unified APIs**: RESTful APIs for cross-platform data sharing
- **Single Dashboard**: Manage all platform services from one interface

### Data Sharing and Export
- **Application Export**: Export applications as standalone packages
- **Data Portability**: Export user data in standard formats
- **API Access**: Programmatic access to all application data
- **Backup and Sync**: Automated backup and version control

## Security and Compliance

### Application Security
- **Input Validation**: Comprehensive validation for all user inputs
- **SQL Injection Prevention**: Parameterized queries and ORM protection
- **XSS Protection**: Content Security Policy and input sanitization
- **Access Control**: Role-based permissions for application users

### Data Protection
- **Encryption**: AES-256 encryption at rest and TLS 1.3 in transit
- **Data Isolation**: Complete separation between user applications
- **Audit Logging**: Comprehensive logging of all user actions
- **Compliance**: GDPR, CCPA, and SOC 2 compliance requirements

### Generated App Security
- **Secure Code Generation**: Security-first code generation templates
- **Authentication**: Built-in secure authentication for generated apps
- **Rate Limiting**: Automatic rate limiting for generated APIs
- **Security Scanning**: Automated vulnerability scanning of generated code

## Development Commands

```bash
# Backend development
cd backend
npm install
npm run dev              # Start development server
npm run test             # Run backend tests
npm run migrate          # Run database migrations

# Frontend builder development
cd frontend
npm install
npm start                # Start builder interface
npm run test             # Run frontend tests
npm run storybook        # Component development

# App runtime development
cd app-runtime
npm install
npm run dev              # Start runtime engine
npm run test             # Run runtime tests

# Mobile generator development
cd mobile-generator
npm install
npm run dev              # Start generator service
npm run test             # Run generator tests

# Full stack development
docker-compose up        # Start all services
npm run test:e2e         # Run end-to-end tests
npm run build:all        # Build all services
```

## Component Library

### UI Components
- **Form Elements**: Input fields, dropdowns, checkboxes, radio buttons
- **Data Display**: Tables, lists, cards, charts, grids
- **Navigation**: Menus, breadcrumbs, pagination, tabs
- **Layout**: Containers, columns, rows, sections
- **Media**: Images, videos, galleries, file uploads
- **Interactive**: Buttons, modals, tooltips, accordions

### Business Components
- **User Management**: Login, registration, profile management
- **Data Entry**: Forms, wizards, bulk import/export
- **Reporting**: Charts, dashboards, data visualization
- **Communication**: Comments, messaging, notifications
- **Commerce**: Shopping carts, payment forms, order tracking

### Advanced Components
- **Calendar**: Event scheduling and date management
- **Maps**: Location services and geographic data
- **Document**: PDF generation and document management
- **Integration**: API connectors and webhook handlers
- **Workflow**: Process management and automation triggers

## Template Marketplace

### Business Templates
- **CRM System**: Customer relationship management
- **Inventory Manager**: Stock tracking and management
- **Project Tracker**: Task and project management
- **HR Portal**: Employee management and resources
- **Help Desk**: Support ticket management

### Personal Templates
- **Event Planner**: Event organization and management
- **Expense Tracker**: Personal finance management
- **Habit Tracker**: Goal setting and progress tracking
- **Recipe Manager**: Personal recipe collection
- **Workout Logger**: Fitness tracking and planning

### Industry-Specific Templates
- **Healthcare**: Patient records and appointment scheduling
- **Education**: Student management and course catalogs
- **Real Estate**: Property listings and client management
- **Restaurant**: Menu management and order processing
- **Retail**: Product catalogs and sales tracking

## Performance Requirements

### Builder Performance
- **Page Load**: <3 seconds for builder interface
- **Component Rendering**: <100ms for drag-and-drop operations
- **Save Operations**: <2 seconds for application saves
- **Preview Generation**: <5 seconds for application preview

### Generated App Performance
- **App Generation**: <60 seconds for simple applications
- **Database Operations**: <500ms for CRUD operations
- **Mobile App Build**: <10 minutes for complete mobile app
- **API Response**: <200ms for generated API endpoints

### Scalability Targets
- **Concurrent Builders**: Support 1,000+ simultaneous builders
- **Generated Apps**: Host 100,000+ live applications
- **Database Scaling**: Auto-scaling for application databases
- **Mobile Builds**: Parallel mobile app compilation

## Mobile App Generation

### Supported Platforms
- **iOS**: Native iOS apps for iPhone and iPad
- **Android**: Native Android apps for phones and tablets
- **Progressive Web App**: Cross-platform web-based applications
- **Desktop**: Electron-based desktop applications

### Mobile Features
- **Offline Support**: Local data storage and synchronization
- **Push Notifications**: Real-time notifications and alerts
- **Camera Integration**: Photo capture and image processing
- **Location Services**: GPS and location-based features
- **Device APIs**: Access to contacts, calendar, and device features

### App Store Deployment
- **Automated Building**: Continuous integration for mobile apps
- **Code Signing**: Automated certificate management
- **Store Submission**: Assisted App Store and Play Store submission
- **Update Management**: Over-the-air updates for deployed apps
- **Analytics**: App usage and performance analytics

## Success Metrics

### Product Metrics
- **Apps Created**: Average applications built per user
- **Template Usage**: Most popular templates and customizations
- **Feature Adoption**: Usage rates for different builder features
- **Mobile Generation**: Percentage of apps generating mobile versions

### Performance Metrics
- **Builder Performance**: Response times and user experience metrics
- **Generated App Performance**: Performance of user-created applications
- **Build Success Rate**: Percentage of successful app generations
- **Uptime**: Availability of builder and generated applications

### Business Metrics
- **User Engagement**: Time spent in builder and feature usage
- **Conversion Rate**: Trial to paid subscription conversion
- **Customer Success**: User achievement of application goals
- **Revenue per User**: Average revenue per BuildEasy user

## Integration Ecosystem

### Design Tools
- **Figma**: Import designs and assets from Figma
- **Sketch**: Design import and asset management
- **Adobe XD**: Prototype import and conversion
- **Canva**: Integrated design asset creation

### Data Sources
- **Google Sheets**: Live data synchronization
- **Airtable**: Database import and synchronization
- **Excel**: Spreadsheet import and data mapping
- **CSV**: Bulk data import and export

### External Services
- **Stripe**: Payment processing integration
- **SendGrid**: Email service integration
- **Twilio**: SMS and communication services
- **AWS S3**: File storage and content delivery

## Future Roadmap

### Short-term (3-6 months)
- Core visual builder with component library
- Database designer and form builder
- Basic mobile app generation
- Template marketplace with 20+ templates

### Medium-term (6-12 months)
- Advanced workflow engine integration
- Real-time collaboration features
- Advanced mobile features and offline support
- White-labeling and custom branding options

### Long-term (12+ months)
- AI-powered application suggestions
- Natural language application building
- Advanced analytics and business intelligence
- Enterprise security and compliance features

---

## Important Notes for Development

- **User Experience First**: Focus on intuitive visual building experience
- **Performance Critical**: Generated applications must perform well
- **Mobile Priority**: Mobile-first approach for generated applications
- **Integration Ready**: Design for seamless integration with platform suite
- **Template Quality**: High-quality templates drive user adoption
- **Security Focus**: Security considerations for both builder and generated apps

This project represents the democratization of application development, making it possible for anyone to build sophisticated business applications without coding knowledge. Success here will drive significant user adoption and platform stickiness.