const axios = require('axios');
const logger = require('../config/logger');

const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL || 'http://localhost:4000';

/**
 * Authentication client for Rozitech Auth Server integration
 * Handles SSO authentication, token validation, and user profile management
 */
class AuthClient {
  /**
   * Verify JWT token with auth server
   * @param {string} token - JWT access token
   * @returns {Promise<Object>} User profile data
   */
  async verifyToken(token) {
    try {
      const response = await axios.get(`${AUTH_SERVER_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Response structure: { success, data: { user: {...} } }
      return response.data.data?.user || response.data.user;
    } catch (error) {
      logger.error('Token verification failed:', error.message);
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Get user profile from auth server
   * @param {string} token - JWT access token
   * @returns {Promise<Object>} Complete user profile with organization
   */
  async getUserProfile(token) {
    try {
      const response = await axios.get(`${AUTH_SERVER_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data.user;
    } catch (error) {
      logger.error('Failed to get user profile:', error.message);
      throw new Error('Failed to retrieve user profile');
    }
  }

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<string>} New access token
   */
  async refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post(`${AUTH_SERVER_URL}/api/auth/refresh`, {
        refreshToken
      });

      return response.data.accessToken;
    } catch (error) {
      logger.error('Token refresh failed:', error.message);
      throw new Error('Failed to refresh token');
    }
  }

  /**
   * Check if user has access to BuildEasy product
   * @param {Object} user - User object from auth server
   * @returns {boolean} True if user has BuildEasy access
   */
  hasBuildeasyAccess(user) {
    if (!user) {
      return false;
    }

    // Check for products in JWT token payload (top-level products array)
    if (user.products && Array.isArray(user.products)) {
      return user.products.includes('buildeasy') || user.products.includes('all');
    }

    // Fallback: Check for products in organization object
    if (user.organization && user.organization.products) {
      const products = user.organization.products || [];
      return products.includes('buildeasy') || products.includes('all');
    }

    return false;
  }

  /**
   * Get organization ID for multi-tenant data isolation
   * @param {Object} user - User object from auth server
   * @returns {string} Organization ID
   */
  getOrganizationId(user) {
    // JWT payload has 'org' field for organization ID
    return user?.org || user?.organization?.id || null;
  }
}

module.exports = new AuthClient();
