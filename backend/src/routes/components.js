const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// TODO: Implement components routes

router.get('/', authenticate, (req, res) => {
  res.json({ success: true, message: 'components endpoint - Coming soon' });
});

module.exports = router;
