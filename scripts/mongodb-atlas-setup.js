/**
 * MongoDB Atlas Setup Guide
 * 
 * This script provides instructions for setting up MongoDB Atlas for ThriftX.
 * It also includes helper functions to create indexes for optimal performance.
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

// Replace with your MongoDB Atlas connection string
const uri = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@<cluster>.mongodb.net/thriftx?retryWrites=true&w=majority';

async function setupMongoDBAtlas() {
  console.log('Setting up MongoDB Atlas for ThriftX...');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('thriftx');
    
    // Create collections if they don't exist
    const collections = [
      'users', 'products', 'orders', 'categories', 
      'reviews', 'carts', 'wishlist', 'transactions',
      'shipping', 'notifications', 'analytics'
    ];
    
    for (const collectionName of collections) {
      const collectionExists = await db.listCollections({ name: collectionName }).hasNext();
      if (!collectionExists) {
        await db.createCollection(collectionName);
        console.log(`Created collection: ${collectionName}`);
      } else {
        console.log(`Collection already exists: ${collectionName}`);
      }
    }
    
    // Create indexes for better performance
    console.log('Creating indexes...');
    
    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    
    // Products collection indexes
    await db.collection('products').createIndex({ name: 'text', description: 'text' });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ seller: 1 });
    await db.collection('products').createIndex({ price: 1 });
    await db.collection('products').createIndex({ createdAt: -1 });
    
    // Orders collection indexes
    await db.collection('orders').createIndex({ user: 1 });
    await db.collection('orders').createIndex({ status: 1 });
    await db.collection('orders').createIndex({ createdAt: -1 });
    
    // Reviews collection indexes
    await db.collection('reviews').createIndex({ product: 1 });
    await db.collection('reviews').createIndex({ user: 1 });
    await db.collection('reviews').createIndex({ rating: 1 });
    
    console.log('MongoDB Atlas setup completed successfully!');
    
    console.log('\nMongoDB Atlas Best Practices:');
    console.log('1. Enable network access only from your application servers');
    console.log('2. Use strong, unique passwords for database users');
    console.log('3. Enable database auditing for security monitoring');
    console.log('4. Set up regular backups with appropriate retention policies');
    console.log('5. Configure alerts for unusual database activity');
    console.log('6. Consider using MongoDB Atlas Data Lake for analytics');
    
  } catch (error) {
    console.error('Error setting up MongoDB Atlas:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB Atlas');
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupMongoDBAtlas().catch(console.error);
}

module.exports = { setupMongoDBAtlas }; 