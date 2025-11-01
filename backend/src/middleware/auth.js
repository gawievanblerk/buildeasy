const authClient = require('../services/authClient');
const logger = require('../config/logger');

/**
 * Authentication middleware for BuildEasy API routes
 * Validates JWT tokens with Rozitech Auth Server
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token with auth server and get user profile
    const user = await authClient.verifyToken(token);

    // Debug logging
    logger.info('User object from token verification:', JSON.stringify(user, null, 2));
    logger.info('Has BuildEasy access?', authClient.hasBuildeasyAccess(user));

    // Check if user has BuildEasy access
    if (!authClient.hasBuildeasyAccess(user)) {
      logger.error('BuildEasy access denied for user:', user);
      return res.status(403).json({
        success: false,
        error: 'BuildEasy product access required'
      });
    }

    // Attach user and organization to request object
    req.user = user;
    req.organizationId = authClient.getOrganizationId(user);
    req.userId = user.sub || user.id; // JWT payload uses 'sub' for user ID

    logger.info(`Authenticated user: ${user.email} (${req.userId})`);

    next();
  } catch (error) {
    logger.error('Authentication error:', error);

    return res.status(401).json({
      success: false,
      error: error.message || 'Authentication failed'
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token is present, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = await authClient.verifyToken(token);

      req.user = user;
      req.organizationId = authClient.getOrganizationId(user);
      req.userId = user.sub || user.id; // JWT payload uses 'sub' for user ID
    }

    next();
  } catch (error) {
    // Don't fail if optional auth fails, just log it
    logger.warn('Optional auth failed:', error.message);
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth
};
