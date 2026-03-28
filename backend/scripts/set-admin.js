const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dropship_ecommerce');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Set user as admin
const setUserAsAdmin = async (email) => {
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      return;
    }
    
    console.log(`Current user role: ${user.role}`);
    
    // Update user role to admin
    user.role = 'admin';
    await user.save();
    
    console.log(`✅ User ${email} is now an admin!`);
    console.log(`Updated user role: ${user.role}`);
    console.log(`User ID: ${user._id}`);
    console.log(`User Name: ${user.firstName} ${user.lastName}`);
    
  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
const email = process.argv[2]; // Get email from command line argument

if (!email) {
  console.log('Usage: node set-admin.js <user-email>');
  console.log('Example: node set-admin.js admin@example.com');
  process.exit(1);
}

connectDB().then(() => {
  setUserAsAdmin(email);
});
