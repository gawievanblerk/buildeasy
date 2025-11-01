const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const db = require('../config/database');
const logger = require('../config/logger');
const { v4: uuidv4 } = require('uuid');

/**
 * GET /api/applications
 * Get all applications for the authenticated user's organization
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { organizationId } = req;

    const result = await db.query(
      'SELECT * FROM applications WHERE organization_id = $1 ORDER BY created_at DESC',
      [organizationId]
    );

    res.json({
      success: true,
      applications: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    logger.error('Error fetching applications:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch applications' });
  }
});

/**
 * GET /api/applications/:id
 * Get a specific application by ID
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req;

    const result = await db.query(
      'SELECT * FROM applications WHERE id = $1 AND organization_id = $2',
      [id, organizationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    res.json({
      success: true,
      application: result.rows[0]
    });
  } catch (error) {
    logger.error('Error fetching application:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch application' });
  }
});

/**
 * POST /api/applications
 * Create a new application
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, slug } = req.body;
    const { organizationId, userId } = req;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        error: 'Name and slug are required'
      });
    }

    const id = uuidv4();

    const result = await db.query(
      `INSERT INTO applications (id, organization_id, user_id, name, description, slug, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, organizationId, userId, name, description, slug, 'draft']
    );

    logger.info(`Application created: ${name} (${id}) by user ${userId}`);

    res.status(201).json({
      success: true,
      application: result.rows[0],
      message: 'Application created successfully'
    });
  } catch (error) {
    logger.error('Error creating application:', error);

    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({
        success: false,
        error: 'Application with this slug already exists'
      });
    }

    res.status(500).json({ success: false, error: 'Failed to create application' });
  }
});

/**
 * PATCH /api/applications/:id
 * Update an application
 */
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req;
    const { name, description, status, config, metadata } = req.body;

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
    }
    if (config !== undefined) {
      updates.push(`config = $${paramIndex++}`);
      values.push(JSON.stringify(config));
    }
    if (metadata !== undefined) {
      updates.push(`metadata = $${paramIndex++}`);
      values.push(JSON.stringify(metadata));
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id, organizationId);

    const result = await db.query(
      `UPDATE applications SET ${updates.join(', ')}
       WHERE id = $${paramIndex++} AND organization_id = $${paramIndex++}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    logger.info(`Application updated: ${id}`);

    res.json({
      success: true,
      application: result.rows[0],
      message: 'Application updated successfully'
    });
  } catch (error) {
    logger.error('Error updating application:', error);
    res.status(500).json({ success: false, error: 'Failed to update application' });
  }
});

/**
 * DELETE /api/applications/:id
 * Delete an application
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req;

    const result = await db.query(
      'DELETE FROM applications WHERE id = $1 AND organization_id = $2 RETURNING *',
      [id, organizationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    logger.info(`Application deleted: ${id}`);

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting application:', error);
    res.status(500).json({ success: false, error: 'Failed to delete application' });
  }
});

module.exports = router;
