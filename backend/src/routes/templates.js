const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// TODO: Implement templates routes

router.get('/', authenticate, (req, res) => {
  res.json({ success: true, message: 'templates endpoint - Coming soon' });
});

module.exports = router;
