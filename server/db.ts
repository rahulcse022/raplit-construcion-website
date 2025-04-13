
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env file');
}

const client = new MongoClient(process.env.MONGODB_URI);

export const collections: any = {};

export async function connectDB() {
  try {
    await client.connect();
    const db = client.db('home_construction');
    
    // Initialize collections
    collections.packages = db.collection('packages');
    collections.materials = db.collection('materials');
    collections.projects = db.collection('projects');
    collections.savedPlans = db.collection('saved_plans');
    
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function disconnect() {
  await client.close();
}
