const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DB_URL,  
    ssl: { rejectUnauthorized: false },   
});


const query = async (text, params) => {
    try {
        const client = await pool.connect();  
        const res = await client.query(text, params);  
        client.release(); 
        return res; 
    } catch (err) {
        console.error('Error executing query:', err.stack);
        throw err;
    }
};

const testConnection = async () => {
    try {
        const client = await pool.connect(); 
        const res = await client.query('SELECT NOW()'); 
        console.log('Database connection successful, server time:', res.rows[0].now); 
        client.release(); 
    } catch (err) {
        console.error('Error connecting to the database:', err.stack); 
    }
};

module.exports = {
    pool,
    testConnection,
    query,
};
