const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// TODO: Implement forms routes

router.get('/', authenticate, (req, res) => {
  res.json({ success: true, message: 'forms endpoint - Coming soon' });
});

module.exports = router;
