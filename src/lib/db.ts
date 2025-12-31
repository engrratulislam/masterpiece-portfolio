import mysql from 'mysql2/promise';

// 1. Types for your Query Results (optional but recommended for raw SQL)
// You can extend this for specific tables later.
export type SQLResult = mysql.RowDataPacket[] | mysql.ResultSetHeader;

// 2. Global Type Augmentation
// This ensures TypeScript knows about the global variable we are creating
declare global {
  // eslint-disable-next-line no-var
  var mysqlPool: mysql.Pool | undefined;
}

// 3. Configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  // CRITICAL: Keep this low for shared hosting (Max 5-10)
  connectionLimit: 5,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Add specific port if not standard 3306
  port: parseInt(process.env.DB_PORT || '3306'),
};

// 4. Singleton Pattern Logic
let pool: mysql.Pool;

if (process.env.NODE_ENV === 'production') {
  pool = mysql.createPool(dbConfig);
} else {
  // In development, use a global variable so hot-reloads don't kill the DB
  if (!global.mysqlPool) {
    global.mysqlPool = mysql.createPool(dbConfig);
  }
  pool = global.mysqlPool;
}

// 5. Helper Function for cleaner code in your API routes
export async function executeQuery<T extends SQLResult>(
  query: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any[] = []
): Promise<T> {
  try {
    const [results] = await pool.execute<T>(query, values);
    return results;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to execute database query.');
  }
}

export default pool;
