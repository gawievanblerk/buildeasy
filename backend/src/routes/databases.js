const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// TODO: Implement databases routes

router.get('/', authenticate, (req, res) => {
  res.json({ success: true, message: 'databases endpoint - Coming soon' });
});

module.exports = router;
