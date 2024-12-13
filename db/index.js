const { Pool } = require('pg');
require('dotenv').config();

// Set up PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DB_URL,  // Your DB connection URL from .env
    ssl: { rejectUnauthorized: false },    // Adjust SSL settings based on your server
});

// Function to run queries (e.g., SELECT, INSERT, UPDATE, DELETE)
const query = async (text, params) => {
    try {
        const client = await pool.connect();  // Get a client from the pool
        const res = await client.query(text, params);  // Run the query
        client.release();  // Release the client back to the pool
        return res;  // Return the result of the query
    } catch (err) {
        console.error('Error executing query:', err.stack);
        throw err;  // Rethrow the error after logging
    }
};

const testConnection = async () => {
    try {
        const client = await pool.connect();  // Get a client from the pool
        const res = await client.query('SELECT NOW()');  // Run a simple query to test the connection
        console.log('Database connection successful, server time:', res.rows[0].now);  // Print the server time
        client.release();  // Release the client back to the pool
    } catch (err) {
        console.error('Error connecting to the database:', err.stack);  // Log any connection errors
    }
};

// Export query function and pool for other modules to use
module.exports = {
    pool,
    testConnection,
    query,
};