// Database connection utilities
// Supports both PostgreSQL and MongoDB

import { Pool } from 'pg';
import mongoose from 'mongoose';

// PostgreSQL connection
let pgPool: Pool | null = null;

export async function connectPostgreSQL(connectionString: string): Promise<Pool> {
  if (pgPool) {
    return pgPool;
  }

  pgPool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  return pgPool;
}

export function getPostgreSQLPool(): Pool | null {
  return pgPool;
}

// MongoDB connection
export async function connectMongoDB(uri: string): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  return mongoose.connect(uri);
}

export function getMongoDBConnection() {
  return mongoose.connection;
}

// Initialize database connection based on environment
export async function initializeDatabase() {
  const dbType = process.env.DATABASE_TYPE || 'postgresql';
  
  if (dbType === 'postgresql' && process.env.DATABASE_URL) {
    await connectPostgreSQL(process.env.DATABASE_URL);
    console.log('✅ PostgreSQL connected');
  } else if (dbType === 'mongodb' && process.env.MONGODB_URI) {
    await connectMongoDB(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } else {
    throw new Error('Database configuration not found');
  }
}
