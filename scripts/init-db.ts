// Database initialization script
// Run this to set up your database schema

import { getPostgreSQLPool, connectPostgreSQL } from '../lib/database/connection';
import { sqlSchema } from '../lib/database/models';
import * as dotenv from 'dotenv';

dotenv.config();

async function initDatabase() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not found in environment variables');
      process.exit(1);
    }

    console.log('Connecting to database...');
    await connectPostgreSQL(process.env.DATABASE_URL);

    const pool = getPostgreSQLPool();
    if (!pool) {
      throw new Error('Failed to get database pool');
    }

    console.log('Creating tables...');
    // Split SQL schema by semicolons and execute each statement
    const statements = sqlSchema
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
        } catch (error: any) {
          // Ignore "already exists" errors
          if (!error.message.includes('already exists')) {
            console.error('Error executing statement:', error.message);
            console.error('Statement:', statement.substring(0, 100));
          }
        }
      }
    }

    console.log('✅ Database initialized successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  }
}

initDatabase();
