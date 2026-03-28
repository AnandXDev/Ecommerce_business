const mongoose = require('mongoose');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dropship_ecommerce');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@luxeCart.com' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      
      // Update password if missing
      if (!existingAdmin.password) {
        const hashedPassword = await bcrypt.hash('admin123', 12);
        await User.findByIdAndUpdate(existingAdmin._id, { password: hashedPassword });
        console.log('✅ Password updated for existing admin user');
      }
      
      console.log('Login credentials:');
      console.log('Email: admin@luxeCart.com');
      console.log('Password: admin123');
      await mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@luxeCart.com',
      password: hashedPassword,
      role: 'admin',
      isEmailVerified: true,
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('Login credentials:');
    console.log('Email: admin@luxeCart.com');
    console.log('Password: admin123');
    
    // Close connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the function
createAdmin();
