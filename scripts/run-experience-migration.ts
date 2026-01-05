import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),
  });

  console.log('Connected to database. Running migration...\n');

  try {
    // Check current table structure
    console.log('Checking current table structure...');
    const [columns] = await connection.execute('DESCRIBE work_experience');
    const existingColumns = (columns as any[]).map(col => col.Field);
    console.log('Existing columns:', existingColumns.join(', '));

    // Add location column if not exists
    if (!existingColumns.includes('location')) {
      console.log('\nAdding location column...');
      await connection.execute(
        "ALTER TABLE work_experience ADD COLUMN location VARCHAR(100) DEFAULT 'Remote' AFTER duration"
      );
      console.log('✓ location column added');
    } else {
      console.log('✓ location column already exists');
    }

    // Add responsibilities column if not exists
    if (!existingColumns.includes('responsibilities')) {
      console.log('\nAdding responsibilities column...');
      await connection.execute(
        'ALTER TABLE work_experience ADD COLUMN responsibilities JSON AFTER description'
      );
      console.log('✓ responsibilities column added');
    } else {
      console.log('✓ responsibilities column already exists');
    }

    // Add achievements column if not exists
    if (!existingColumns.includes('achievements')) {
      console.log('\nAdding achievements column...');
      await connection.execute(
        'ALTER TABLE work_experience ADD COLUMN achievements JSON AFTER responsibilities'
      );
      console.log('✓ achievements column added');
    } else {
      console.log('✓ achievements column already exists');
    }

    // Add companyUrl column if not exists
    if (!existingColumns.includes('companyUrl')) {
      console.log('\nAdding companyUrl column...');
      await connection.execute(
        'ALTER TABLE work_experience ADD COLUMN companyUrl VARCHAR(500) AFTER logo'
      );
      console.log('✓ companyUrl column added');
    } else {
      console.log('✓ companyUrl column already exists');
    }

    // Update existing records with default values
    console.log('\nUpdating existing records with default values...');
    await connection.execute("UPDATE work_experience SET location = 'Remote' WHERE location IS NULL");
    await connection.execute("UPDATE work_experience SET responsibilities = '[]' WHERE responsibilities IS NULL");
    await connection.execute("UPDATE work_experience SET achievements = '[]' WHERE achievements IS NULL");
    console.log('✓ Default values applied');

    // Show final table structure
    console.log('\n--- Final Table Structure ---');
    const [finalColumns] = await connection.execute('DESCRIBE work_experience');
    (finalColumns as any[]).forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });

    console.log('\n✓ Migration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

runMigration().catch(console.error);
