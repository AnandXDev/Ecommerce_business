const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

// Set admin role for sachinkumar38703@gmail.com (your current account)
async function setAdminRole() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Update user role to admin
    const result = await User.updateOne(
      { email: 'sachinkumar38703@gmail.com' }, // Your current email
      { $set: { role: 'admin' } }
    );

    if (result.matchedCount > 0) {
      console.log('✅ Admin role set successfully for sachinkumar38703@gmail.com');
      console.log(`Modified ${result.modifiedCount} document(s)`);
    } else {
      console.log('❌ User not found. Make sure the email exists in the database.');
    }

    // Verify the update
    const user = await User.findOne({ email: 'sachinkumar38703@gmail.com' });
    if (user) {
      console.log(`\n📋 User Details:`);
      console.log(`Name: ${user.firstName} ${user.lastName}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
    }

  } catch (error) {
    console.error('❌ Error setting admin role:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
setAdminRole();
