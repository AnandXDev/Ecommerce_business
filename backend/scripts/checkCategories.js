const mongoose = require('mongoose');
const Category = require('../src/models/Category');
require('dotenv').config();

async function checkCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dropship_ecommerce');
    console.log('Connected to MongoDB');

    const categories = await Category.find({});
    console.log('Available categories:');
    categories.forEach(cat => {
      console.log(`- ${cat.name} (slug: ${cat.slug})`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCategories();
