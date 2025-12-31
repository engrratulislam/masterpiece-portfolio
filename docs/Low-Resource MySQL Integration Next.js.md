# **Developer Documentation: Low-Resource MySQL Integration**

Context: We are deploying a Next.js application to a shared hosting environment with strict resource limits (1GB RAM).

Goal: Prevent memory leaks and "Too Many Connections" errors.

Strategy:

1. **No Heavy ORMs:** We are skipping Prisma/TypeORM to save \~100MB+ RAM.  
2. **Singleton Pattern:** We must ensure only **one** database connection pool exists, even during Next.js Hot Reloads.  
3. **Output Standalone:** We must build the app in standalone mode to minimize file IO and memory usage.

---

### **1\. Dependencies**

Install the mysql2 driver. It is currently the fastest and most stable driver for Node.js.

Bash

npm install mysql2

### **2\. Next.js Configuration**

Update next.config.mjs to enable **Standalone Output**. This is non-negotiable for 1GB RAM servers; it creates a minimal build without the heavy node\_modules overhead.

TypeScript

/\*\* @type {import('next').NextConfig} \*/  
const nextConfig \= {  
  output: "standalone",  
  // ... other configs  
};

export default nextConfig;

---

### **3\. The Singleton Database Module**

Create this file at lib/db.ts.

This code handles the TypeScript global scope augmentation (to prevent type errors) and enforces the connection limits.

TypeScript

import mysql from 'mysql2/promise';

// 1\. Types for your Query Results (optional but recommended for raw SQL)  
// You can extend this for specific tables later.  
export type SQLResult \= mysql.RowDataPacket\[\] | mysql.ResultSetHeader;

// 2\. Global Type Augmentation  
// This ensures TypeScript knows about the global variable we are creating  
declare global {  
  // eslint-disable-next-line no-var  
  var mysqlPool: mysql.Pool | undefined;  
}

// 3\. Configuration  
const dbConfig \= {  
  host: process.env.DB\_HOST,  
  user: process.env.DB\_USER,  
  password: process.env.DB\_PASSWORD,  
  database: process.env.DB\_NAME,  
  waitForConnections: true,  
  // CRITICAL: Keep this low for shared hosting (Max 5-10)  
  connectionLimit: 5,  
  queueLimit: 0,  
  enableKeepAlive: true,  
  keepAliveInitialDelay: 0,  
  // Add specific port if not standard 3306  
  port: parseInt(process.env.DB\_PORT || '3306'),  
};

// 4\. Singleton Pattern Logic  
let pool: mysql.Pool;

if (process.env.NODE\_ENV \=== 'production') {  
  pool \= mysql.createPool(dbConfig);  
} else {  
  // In development, use a global variable so hot-reloads don't kill the DB  
  if (\!global.mysqlPool) {  
    global.mysqlPool \= mysql.createPool(dbConfig);  
  }  
  pool \= global.mysqlPool;  
}

// 5\. Helper Function for cleaner code in your API routes  
export async function executeQuery\<T extends SQLResult\>(  
  query: string,  
  values: any\[\] \= \[\]  
): Promise\<T\> {  
  try {  
    const \[results\] \= await pool.execute\<T\>(query, values);  
    return results;  
  } catch (error) {  
    console.error('Database Error:', error);  
    throw new Error('Failed to execute database query.');  
  }  
}

export default pool;

---

### **4\. How to Use in Code (API Routes / Server Actions)**

You should use the executeQuery helper we created above. It handles the connection acquisition and release automatically.

**Example: Fetching Users (app/api/users/route.ts)**

TypeScript

import { NextResponse } from 'next/server';  
import { executeQuery } from '@/lib/db';  
import { RowDataPacket } from 'mysql2';

// Define the shape of your data for TypeScript safety  
interface User extends RowDataPacket {  
  id: number;  
  name: string;  
  email: string;  
  created\_at: Date;  
}

export async function GET() {  
  try {  
    // Usage: executeQuery\<Type\>(SQL, \[params\])  
    const users \= await executeQuery\<User\[\]\>(  
      'SELECT id, name, email FROM users ORDER BY id DESC LIMIT 10'  
    );

    return NextResponse.json({ success: true, data: users });  
  } catch (error) {  
    // The helper logs the real error to the server console  
    return NextResponse.json(  
      { success: false, error: 'Internal Server Error' },  
      { status: 500 }  
    );  
  }  
}

**Example: Inserting Data (Server Action)**

TypeScript

'use server'

import { executeQuery } from '@/lib/db';  
import { ResultSetHeader } from 'mysql2';

export async function createUser(formData: FormData) {  
  const name \= formData.get('name') as string;  
  const email \= formData.get('email') as string;

  const result \= await executeQuery\<ResultSetHeader\>(  
    'INSERT INTO users (name, email) VALUES (?, ?)',  
    \[name, email\]  
  );

  console.log(\`Created user with ID: ${result.insertId}\`);  
  return { success: true, userId: result.insertId };  
}

---

### **5\. Environment Variables (.env.local)**

Ensure these are set in your local environment and in the cPanel/Hosting environment variables UI.

Code snippet

DB\_HOST=127.0.0.1  
DB\_USER=your\_db\_user  
DB\_PASSWORD=your\_db\_password  
DB\_NAME=your\_db\_name  
DB\_PORT=3306

### **6\. Deployment Note**

When deploying to the shared host:

1. Run npm run build locally.  
2. Locate the .next/standalone folder.  
3. Upload the **contents** of that folder to your server.  
4. Copy your public folder and .next/static folder to the server as well (ensure .next/static is placed inside .next/standalone/.next/static).

---

**Would you like me to create a "Database Schema Migration" script (using raw SQL) so your developer can easily set up the tables on the shared hosting without needing a GUI?**

