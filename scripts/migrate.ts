import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// 1. Load environment variables
dotenv.config({ path: '.env.local' });

async function runMigration() {
  console.log('🔄 Starting Database Migration...');

  // 2. First, connect without database to create it if needed
  const connectionWithoutDb = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '3306'),
  });

  try {
    // Create database if it doesn't exist
    console.log(`📦 Creating database '${process.env.DB_NAME}' if not exists...`);
    await connectionWithoutDb.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log('✅ Database ready');
  } finally {
    await connectionWithoutDb.end();
  }

  // 3. Now connect to the specific database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),
    multipleStatements: true, // <--- CRITICAL for running SQL scripts
  });

  try {
    // 4. Read the SQL file
    const sqlPath = path.join(process.cwd(), 'database', 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // 5. Execute the SQL
    console.log('📂 Reading schema.sql...');
    await connection.query(sql);

    console.log('✅ Migration completed successfully!');
    console.log('   All tables created (if they were missing).');
    console.log('');
    console.log('📝 Default Admin Credentials:');
    console.log('   Email: admin@portfolio.com');
    console.log('   Password: admin123');
    console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('   1. Start dev server: npm run dev');
    console.log('   2. Visit: http://localhost:3000/admin/login');
    console.log('   3. Login with the credentials above');

  } catch (error) {
    console.error('❌ Migration Failed:', error);
    console.error('');
    console.error('💡 Troubleshooting:');
    console.error('   - Ensure MySQL is running');
    console.error('   - Check credentials in .env.local');
    console.error('   - Verify DB_USER has CREATE DATABASE permission');
    process.exit(1);
  } finally {
    // 6. Close connection
    await connection.end();
  }
}

runMigration();
