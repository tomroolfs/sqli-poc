import mysql from 'mysql2/promise';

let connection;

export async function createConnection() {
  const connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
  };

  // 🐛 DEBUG LOG: Log the credentials being used before attempting connection
  console.log("--- DEBUG: Attempting DB Connection With ---");
  console.log(`Host: ${connectionConfig.host}`);
  console.log(`User: ${connectionConfig.user}`);
  // IMPORTANT: Never log the password in a real app, but doing it here for debugging
  console.log(`Database: ${connectionConfig.database}`);
  console.log("-------------------------------------------");

  if (!connection) {
    try {
      connection = await mysql.createConnection(connectionConfig);
      console.log("Database connection successful!");
    } catch (error) {
      // Log the specific error details
      console.error(`Login error: ${error.message}`);
      throw error; // Re-throw the error so the app knows connection failed
    }
  }
  return connection;
}