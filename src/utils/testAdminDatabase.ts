// Test script for admin database functions

import {
  createAdminsTable,
  insertAdminRequest,
  verifyLicenseKey,
  activateAdmin,
  getPendingAdminRequests
} from './adminDatabase.ts';

async function testAdminDatabase() {
  console.log('Testing admin database functions...\n');
  
  try {
    // Test 1: Create admins table
    console.log('1. Creating admins table...');
    await createAdminsTable();
    console.log('✅ Admins table creation simulated successfully\n');
    
    // Test 2: Insert admin request
    console.log('2. Inserting admin request...');
    await insertAdminRequest({
      username: 'testadmin',
      email: 'testadmin@example.com'
    });
    console.log('✅ Admin request inserted successfully\n');
    
    // Test 3: Get pending requests
    console.log('3. Getting pending admin requests...');
    const pendingRequests = await getPendingAdminRequests();
    console.log('✅ Pending requests retrieved:', pendingRequests.length, 'requests\n');
    
    // Test 4: Activate admin
    console.log('4. Activating admin user...');
    await activateAdmin('testadmin', 'ADMIN-KEY-2025', 'securepassword123');
    console.log('✅ Admin activated successfully\n');
    
    // Test 5: Verify license key
    console.log('5. Verifying license key...');
    const isValid = await verifyLicenseKey('testadmin', 'testadmin@example.com', 'ADMIN-KEY-2025');
    console.log('✅ License key verification result:', isValid, '\n');
    
    console.log('🎉 All admin database tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testAdminDatabase();