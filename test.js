require('dotenv').config();
const express = require("express");
const { Pool } = require('pg');
const fs = require('fs');

const app = express();
const port = 3000;


const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false, // Allows connections with self-signed certificates
    },
});



const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log("Connected to the database!");
        const res = await client.query('SELECT NOW()');
        console.log('Server Time:', res.rows[0].now);
        client.release();
    } catch (err) {
        console.error('Database Connection Error:', err.message);
        console.error(err.stack);
    } finally {
        await pool.end(); // Ensure the connection pool is closed after testing
    }
};

const runSQLFile = async (filePath) => {
    try {
        console.log("Trying to create database tables.")
        // Read the SQL file
        const sql = fs.readFileSync(filePath, 'utf-8');

        // Get a client from the pool
        const client = await pool.connect();

        // Execute the SQL
        await client.query(sql);

        console.log('SQL file executed successfully!');

        // Release the client back to the pool
        client.release();
    } catch (err) {
        console.error('Error executing SQL file:', err.message);
    }
};
// Run the SQL file
const sqlFilePath = './create_tables.sql'; // Change this to your actual SQL file path
runSQLFile(sqlFilePath);   

testConnection();

app.get("/", (req, res) =>{
    res.send("Hello World");
    
}, (err, res) => {
    if (err) {
        console.log(err.message);
    }
})

app.listen(port, () => {
    console.log(`Example app listening at  http://localhost:${port}\n`);
});
