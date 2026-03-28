const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const Category = require('../src/models/Category');
require('dotenv').config();

async function checkProductCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dropship_ecommerce');
    console.log('Connected to MongoDB');

    const products = await Product.find({}).populate('category', 'name slug');
    console.log('Products and their categories:');
    products.forEach(product => {
      console.log(`- ${product.name} -> ${product.category ? product.category.name + ' (' + product.category.slug + ')' : 'No category'}`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkProductCategories();
