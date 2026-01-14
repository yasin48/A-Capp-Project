// Database initialization script (JavaScript version for MongoDB)
// Run this to set up your MongoDB collections

const mongoose = require('mongoose');
require('dotenv').config();

const {
  UserSchema,
  ProductSchema,
  VerificationSchema,
  CertificateSchema,
  BlockchainRecordSchema,
} = require('../lib/database/models');

async function initMongoDB() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ MongoDB connected successfully!');
    console.log('Note: MongoDB collections are created automatically when first document is inserted.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

initMongoDB();
