const db = require('./database');
const logger = require('./logger');

/**
 * Database migration script for BuildEasy
 * Creates all necessary tables for the application
 */

const migrations = [
  {
    name: '001_create_applications_table',
    sql: `
      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID NOT NULL,
        user_id UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        slug VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'draft',
        config JSONB DEFAULT '{}',
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(organization_id, slug)
      );
      CREATE INDEX IF NOT EXISTS idx_applications_org ON applications(organization_id);
      CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
    `
  },
  {
    name: '002_create_app_pages_table',
    sql: `
      CREATE TABLE IF NOT EXISTS app_pages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        route VARCHAR(255) NOT NULL,
        config JSONB DEFAULT '{}',
        components JSONB DEFAULT '[]',
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(application_id, slug)
      );
      CREATE INDEX IF NOT EXISTS idx_app_pages_app ON app_pages(application_id);
    `
  },
  {
    name: '003_create_app_databases_table',
    sql: `
      CREATE TABLE IF NOT EXISTS app_databases (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        schema JSONB DEFAULT '{}',
        tables JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(application_id, name)
      );
      CREATE INDEX IF NOT EXISTS idx_app_databases_app ON app_databases(application_id);
    `
  },
  {
    name: '004_create_app_forms_table',
    sql: `
      CREATE TABLE IF NOT EXISTS app_forms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        fields JSONB DEFAULT '[]',
        validation_rules JSONB DEFAULT '{}',
        settings JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(application_id, slug)
      );
      CREATE INDEX IF NOT EXISTS idx_app_forms_app ON app_forms(application_id);
    `
  },
  {
    name: '005_create_app_workflows_table',
    sql: `
      CREATE TABLE IF NOT EXISTS app_workflows (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        trigger_type VARCHAR(100) NOT NULL,
        trigger_config JSONB DEFAULT '{}',
        actions JSONB DEFAULT '[]',
        enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_app_workflows_app ON app_workflows(application_id);
    `
  },
  {
    name: '006_create_app_components_table',
    sql: `
      CREATE TABLE IF NOT EXISTS app_components (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        config JSONB DEFAULT '{}',
        is_custom BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_app_components_app ON app_components(application_id);
    `
  },
  {
    name: '007_create_app_deployments_table',
    sql: `
      CREATE TABLE IF NOT EXISTS app_deployments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
        version VARCHAR(50) NOT NULL,
        environment VARCHAR(50) NOT NULL,
        url TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        deployed_by UUID NOT NULL,
        deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        config_snapshot JSONB DEFAULT '{}'
      );
      CREATE INDEX IF NOT EXISTS idx_app_deployments_app ON app_deployments(application_id);
    `
  },
  {
    name: '008_create_templates_table',
    sql: `
      CREATE TABLE IF NOT EXISTS templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        thumbnail_url TEXT,
        config JSONB DEFAULT '{}',
        is_public BOOLEAN DEFAULT false,
        created_by UUID,
        usage_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
    `
  }
];

async function runMigrations() {
  try {
    logger.info('Starting database migrations...');

    for (const migration of migrations) {
      logger.info(`Running migration: ${migration.name}`);
      await db.query(migration.sql);
      logger.info(`✅ Migration completed: ${migration.name}`);
    }

    logger.info('✅ All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
