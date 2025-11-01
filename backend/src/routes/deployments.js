const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// TODO: Implement deployments routes

router.get('/', authenticate, (req, res) => {
  res.json({ success: true, message: 'deployments endpoint - Coming soon' });
});

module.exports = router;
