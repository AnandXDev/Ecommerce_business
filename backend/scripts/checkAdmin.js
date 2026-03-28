const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

async function checkAdmin() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dropship_ecommerce');
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@luxeCart.com' }).select('+password');
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('isActive:', admin.isActive);
    console.log('isEmailVerified:', admin.isEmailVerified);
    console.log('Password exists:', !!admin.password);

    // Test password comparison
    try {
      const isMatch = await admin.correctPassword('admin123', admin.password);
      console.log('Password match:', isMatch);
    } catch (error) {
      console.log('❌ Password comparison error:', error.message);
    }
    
    // Close connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the function
checkAdmin();
