This approach uses a "One-Click Setup" script. Instead of a complex migration system (like Prisma Migrate), we will create a robust TypeScript script that reads a raw SQL file and executes it against your database.

This is idempotent—meaning you can run it 100 times, and it won't break anything (because we use IF NOT EXISTS).

### **1\. The Setup**

You need to install dotenv to ensure the script can read your .env file when running outside of Next.js.

Bash

npm install dotenv  
npm install \-D ts-node

### **2\. The Raw SQL Schema**

Create a folder named database and add a file named schema.sql. This is where your developer will define the tables.

**File:** database/schema.sql

SQL

\-- 1\. Users Table  
CREATE TABLE IF NOT EXISTS users (  
    id INT AUTO\_INCREMENT PRIMARY KEY,  
    name VARCHAR(255) NOT NULL,  
    email VARCHAR(255) NOT NULL UNIQUE,  
    password\_hash VARCHAR(255),  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
    updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP ON UPDATE CURRENT\_TIMESTAMP  
) ENGINE\=InnoDB;

\-- 2\. Posts Table (Example relation)  
CREATE TABLE IF NOT EXISTS posts (  
    id INT AUTO\_INCREMENT PRIMARY KEY,  
    user\_id INT NOT NULL,  
    title VARCHAR(255) NOT NULL,  
    content TEXT,  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
    FOREIGN KEY (user\_id) REFERENCES users(id) ON DELETE CASCADE  
) ENGINE\=InnoDB;

\-- 3\. Indexes (Crucial for performance on low RAM)  
CREATE INDEX idx\_users\_email ON users(email);

### **3\. The TypeScript Migration Runner**

Create a file in your scripts folder (create the folder if it doesn't exist) named migrate.ts.

**File:** scripts/migrate.ts

TypeScript

import mysql from 'mysql2/promise';  
import fs from 'fs';  
import path from 'path';  
import dotenv from 'dotenv';

// 1\. Load environment variables  
dotenv.config({ path: '.env.local' });

async function runMigration() {  
  console.log('🔄 Starting Database Migration...');

  // 2\. Create a specific connection for migration  
  // We enable 'multipleStatements' to run the entire SQL file at once  
  const connection \= await mysql.createConnection({  
    host: process.env.DB\_HOST,  
    user: process.env.DB\_USER,  
    password: process.env.DB\_PASSWORD,  
    database: process.env.DB\_NAME,  
    port: parseInt(process.env.DB\_PORT || '3306'),  
    multipleStatements: true, // \<--- CRITICAL for running SQL scripts  
  });

  try {  
    // 3\. Read the SQL file  
    const sqlPath \= path.join(process.cwd(), 'database', 'schema.sql');  
    const sql \= fs.readFileSync(sqlPath, 'utf8');

    // 4\. Execute the SQL  
    console.log('📂 Reading schema.sql...');  
    await connection.query(sql);

    console.log('✅ Migration completed successfully\!');  
    console.log('   All tables created (if they missed).');

  } catch (error) {  
    console.error('❌ Migration Failed:', error);  
    process.exit(1);  
  } finally {  
    // 5\. Close connection  
    await connection.end();  
  }  
}

runMigration();

### **4\. How to Run It**

Add a command to your package.json so your developer can run it easily.

**File:** package.json

JSON

"scripts": {  
  "dev": "next dev",  
  "build": "next build",  
  "start": "next start",  
  "db:setup": "ts-node scripts/migrate.ts"  
}

### **5\. Deployment / Usage Instructions**

Here is the workflow for your developer:

Option A: Running Locally (Recommended)

If your shared hosting allows remote MySQL connections (you usually need to whitelist your IP in cPanel → Remote MySQL):

1. Update .env.local on your laptop with the **Live Shared Hosting** database credentials.  
2. Run npm run db:setup.  
3. The script connects to the remote server and creates the tables instantly.

Option B: Running on the Server (If remote access is blocked)

If you can't connect remotely, you will run this as part of your build or manually via SSH.

1. Upload your project files to the server.  
2. SSH into the server (or use the cPanel Terminal).  
3. Run node\_modules/.bin/ts-node scripts/migrate.ts.

### **Why this is safe for 1GB RAM**

* **Zero Overhead:** The script runs once, does its job, and quits. It doesn't stay in memory.  
* **Raw Speed:** It uses raw SQL commands, which is much faster and uses less memory than an ORM migration engine.