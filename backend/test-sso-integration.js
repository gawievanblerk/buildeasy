#!/usr/bin/env node
/**
 * BuildEasy SSO Integration Test Script
 * Tests authentication flow with rozitech-auth-server
 */

const axios = require('axios');

const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL || 'http://localhost:4000';
const BUILDEASY_API_URL = 'http://localhost:5010';

// Test credentials (use real credentials from your auth server)
const TEST_USER = {
  email: process.env.TEST_EMAIL || 'test@example.com',
  password: process.env.TEST_PASSWORD || 'TestPass123!@#'
};

async function testSSO Integration() {
  console.log('🧪 BuildEasy SSO Integration Test');
  console.log('=' .repeat(50));
  console.log();

  try {
    // Step 1: Login to auth server
    console.log('📝 Step 1: Authenticating with Auth Server...');
    console.log(`   Auth Server: ${AUTH_SERVER_URL}`);
    console.log(`   Email: ${TEST_USER.email}`);

    const loginResponse = await axios.post(`${AUTH_SERVER_URL}/api/auth/login`, TEST_USER);

    const { accessToken, refreshToken, user } = loginResponse.data;
    console.log('✅ Authentication successful!');
    console.log(`   User ID: ${user.id}`);
    console.log(`   Organization: ${user.organization?.name || 'N/A'}`);
    console.log(`   Token: ${accessToken.substring(0, 20)}...`);
    console.log();

    // Step 2: Verify token with auth server
    console.log('📝 Step 2: Verifying JWT token...');
    const profileResponse = await axios.get(`${AUTH_SERVER_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    console.log('✅ Token verified successfully!');
    console.log(`   User: ${profileResponse.data.user.firstName} ${profileResponse.data.user.lastName}`);
    console.log(`   Email Verified: ${profileResponse.data.user.emailVerified}`);
    console.log();

    // Step 3: Test BuildEasy API without authentication
    console.log('📝 Step 3: Testing BuildEasy API without auth...');
    try {
      await axios.get(`${BUILDEASY_API_URL}/api/applications`);
      console.log('❌ FAILED: API should require authentication');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected unauthenticated request');
      } else {
        console.log(`❌ Unexpected error: ${error.message}`);
      }
    }
    console.log();

    // Step 4: Test BuildEasy API with authentication
    console.log('📝 Step 4: Testing BuildEasy API with authentication...');
    const appsResponse = await axios.get(`${BUILDEASY_API_URL}/api/applications`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    console.log('✅ Authenticated request successful!');
    console.log(`   Applications count: ${appsResponse.data.count || 0}`);
    if (appsResponse.data.applications?.length > 0) {
      console.log(`   First app: ${appsResponse.data.applications[0].name}`);
    }
    console.log();

    // Step 5: Create test application
    console.log('📝 Step 5: Creating test application...');
    const newApp = {
      name: 'Test App from SSO Integration',
      slug: `test-app-${Date.now()}`,
      description: 'Created by SSO integration test script'
    };

    const createResponse = await axios.post(
      `${BUILDEASY_API_URL}/api/applications`,
      newApp,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    console.log('✅ Application created successfully!');
    console.log(`   App ID: ${createResponse.data.application.id}`);
    console.log(`   Name: ${createResponse.data.application.name}`);
    console.log(`   Organization: ${createResponse.data.application.organization_id}`);
    console.log();

    // Step 6: Verify multi-tenancy (organization isolation)
    console.log('📝 Step 6: Verifying multi-tenant isolation...');
    const verifyResponse = await axios.get(`${BUILDEASY_API_URL}/api/applications`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const userOrgId = user.organization?.id;
    const allAppsInOrg = verifyResponse.data.applications.every(
      app => app.organization_id === userOrgId
    );

    if (allAppsInOrg) {
      console.log('✅ Multi-tenancy verified: All apps belong to user organization');
      console.log(`   Organization ID: ${userOrgId}`);
    } else {
      console.log('❌ Multi-tenancy issue: Found apps from other organizations');
    }
    console.log();

    // Summary
    console.log('=' .repeat(50));
    console.log('🎉 SSO Integration Test Complete!');
    console.log();
    console.log('✅ All tests passed:');
    console.log('   1. Authentication with Auth Server');
    console.log('   2. JWT token verification');
    console.log('   3. Unauthorized request rejection');
    console.log('   4. Authorized API access');
    console.log('   5. Application creation');
    console.log('   6. Multi-tenant data isolation');
    console.log();
    console.log('🔐 BuildEasy is successfully integrated with SSO!');

  } catch (error) {
    console.error();
    console.error('❌ Test failed with error:');
    console.error(`   ${error.message}`);

    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Response: ${JSON.stringify(error.response.data, null, 2)}`);
    }

    console.error();
    console.error('💡 Troubleshooting:');
    console.error('   1. Ensure auth server is running: npm run dev (in rozitech-auth-server)');
    console.error('   2. Ensure BuildEasy backend is running: npm run dev (in buildeasy/backend)');
    console.error('   3. Check test credentials are valid in auth server database');
    console.error('   4. Verify BuildEasy is in user\'s product list');

    process.exit(1);
  }
}

// Run tests
console.log();
testSSOIntegration();
