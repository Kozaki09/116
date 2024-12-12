const db = require('db.js');

const getUserByEmail = async (email) => {
    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, email);
        return results.row;
    } catch (error) {
        console.error('Error: ', error);
        throw error;
    }
};

const createUser = async (username, email, passwordHash) => {
    try {
        const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id';
        const result = await db.query(query, username, email,passwordHash);
        return result.rows[0].id;
    } catch (error) {
        console.error('Error: ', error);
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
        const query = 'DELETE FROM users WHERE id = $1';
        await db.query(query, id);
        return true;
    } catch (error) {
        console.error('Error: ', error);
        throw error;
    }
}; 

module.export = {
    createUser,
};