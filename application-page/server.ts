// server.ts - Create this as a new backend service
import express from 'express';
import cors from 'cors';
import { Client } from 'pg';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'vena-api'
  });
});

// Database connection test endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    console.log('🔍 Testing database connection...');
    
    const ca = process.env.PGSSLROOTCERT;
    console.log('CA certificate loaded:', ca ? 'Yes' : 'No');
    
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: ca ? {
        ca,
        rejectUnauthorized: true,
      } : {
        rejectUnauthorized: false,
      },
      application_name: 'vena-api',
    });

    await client.connect();
    console.log('✅ Connected to database');
    
    const { rows } = await client.query(`
      SELECT 
        NOW() as timestamp,
        version() as version,
        current_user as user,
        current_database() as database
    `);
    
    await client.end();
    console.log('🔌 Database connection closed');

    const result = {
      success: true,
      message: 'Database connection successful!',
      data: {
        timestamp: rows[0].timestamp,
        version: rows[0].version.split(' ').slice(0, 2).join(' '),
        user: rows[0].user,
        database: rows[0].database,
        ssl_ca_loaded: ca ? 'Yes' : 'No'
      },
      environment: {
        node_env: process.env.NODE_ENV || 'development',
        port: PORT
      }
    };

    console.log('📊 Result:', result);
    res.json(result);

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    const errorResult = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code || 'UNKNOWN',
      details: {
        ca_loaded: process.env.PGSSLROOTCERT ? 'Yes' : 'No',
        database_url_set: process.env.DATABASE_URL ? 'Yes' : 'No',
        environment: process.env.NODE_ENV || 'development'
      }
    };
    
    res.status(500).json(errorResult);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Vena API server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🗄️ DB Test: http://localhost:${PORT}/api/test-db`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;