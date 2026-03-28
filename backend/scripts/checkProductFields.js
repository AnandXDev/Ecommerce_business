const mongoose = require('mongoose');
const Product = require('../src/models/Product');
require('dotenv').config();

async function checkProductFields() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dropship_ecommerce');
    console.log('Connected to MongoDB');

    const product = await Product.findOne({});
    if (product) {
      console.log('Product fields:');
      console.log('featured:', product.featured);
      console.log('isFeatured (virtual):', product.isFeatured);
      console.log('status:', product.status);
      console.log('All fields:', Object.keys(product.toObject()));
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkProductFields();
