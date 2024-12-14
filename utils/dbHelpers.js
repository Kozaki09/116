const { where } = require('sequelize');
const db = require('../db/index');

async function buildBookQuery(filters = {}) {
    // base query
    let query = `
    SELECT books.*, authors.auth_name 
    FROM books 
    LEFT JOIN book_authors ON books.id = book_authors.book_id 
    LEFT JOIN authors ON authors.id = book_authors.auth_id
    `;  

    let whereClause = " WHERE 1=1";
    const parameters = [];

    if (filters.user_id) {
        query += `
        LEFT JOIN book_copies ON books.id = book_copies.book_id
        LEFT JOIN users ON users.id = book_copies.user_id`;
        whereClause += ' AND book_copies.user_id = $' + (parameters.length + 1);
        parameters.push(filters.user_id);
    } else {
        whereClause += ` AND books.availability = 'PUBLIC'`;
    }

    if (filters.title) {
        whereClause += ' AND title ILIKE = $' + (parameters.length + 1);
        parameters.push(filters.title);
    } 
    
    if (filters.isbn) {
        whereClause += ` AND isbn = $` + (parameters.length + 1);
        parameters.push(filters.isbn);
    }

    if (filters.book_id) {
        whereClause += ' AND books.id = $' + (parameters.length + 1);
        parameters.push(filters.book_id);
    }

    if (filters.sort) {
        const sortOrder = filters.sort === 'desc' ? 'DESC' : 'ASC';
        query += ` ORDER BY books.title ${sortOrder}`;
    }

    query += whereClause;

    try {
        if (filters.email) {
            return await db.query('SELECT * FROM users where email = $1', [filters.email]);
        }    
        if (parameters.length > 0) {
            return await db.query(query, parameters);
        } else {
            return await db.query(query);
        }
    } catch (error) {
        console.error('Error processing query: ');
        throw error;
    }
}

async function buildSearchQuery(tablename, get = [], filters = {}) {
    if (!tablename || typeof tablename !== "string") {
        throw new Error("table name must be a valid string.");
    }

    let query = `SELECT `;
    const values = [];
    const conditions = [];

    if (get.length === 0) {
        query += '*';
    } else if (Array.isArray(get) && get.length > 0) {
        query += get.join(", "); // Join selected column names with commas
    }

    Object.entries(filters).forEach(([key, value], index) => {
        conditions.push(`${key} = $${index + 1}`);
        values.push(value);
    });

    if (conditions.length > 0) {
        query += ` FROM ${tablename} WHERE ${conditions.join(" AND ")}`;
    } else {
        query += ` FROM ${tablename}`;
    }

    return await db.query(query, values);
}

async function buildRemoveQuery(tablename, filters = {}) {
    if (!tablename || typeof tablename !== "string") {
        throw new Error("table name must be a valid string.");
    }

    if (Object.keys(filters).length === 0) {
        throw new Error("At least one filter condition must be provided.");
    }

    const conditions = [];
    const values = [];
    let query = `DELETE FROM ${tablename}`;

    Object.entries(filters).forEach(([key, value], index) => {
        conditions.push(`${key} = $${index + 1}`);
        values.push(value);
    });

    query += ` WHERE ${conditions.join(" AND ")}`;
    try {
        console.log(query);
        return await db.query(query, values);
    } catch (error) {
        console.error('Error processing delete query: ');
        throw error;
    }
}

async function buildInsertQuery(tablename, data, returning = false) {
    if (!tablename || typeof tablename !== "string") {
        throw new Error("Table name must be a valid string.");
    }
    
    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
        throw new Error("Data must be non-empty object.")
    }
    const columns = Object.keys(data);
    const placeholders = columns.map((_, index) => `$${index + 1}`);
    const values = Object.values(data);

    const query = `INSERT INTO ${tablename} (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`;
    if (returning) {
        query += ` RETURNING ${returning}`;
    }

    try {
        return await db.query(query, values);
    } catch (error) {
        console.error(`Error processing insert query: `);
        throw error;
    }
}

async function createUser(username, email, password) {
    try {
        const result = await db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password]);
        return;
    } catch (error) {
        console.error('Error inserting new account: ', error);
        throw new Error('Failed to remove book from library');
    }
}

async function findBookByTitle(book_title) {

}

async function removeFromLibrary(book_id, user_id) {
    try {
        return await db.query('DELETE FROM book_copies WHERE book_id = $1 AND user_id = $2', [book_id, user_id]);
    } catch (error) {
        console.error('Error removing book from user library: ', error);
        throw error;
    }
}

async function getMyLibrary(user_id) {
    try {
        return await db.query(`
            SELECT books.*, authors.auth_name
            FROM books
            JOIN book_copies ON books.id = book_copies.book_id
            JOIN users ON users.id = book_copies.user_id
            JOIN book_authors ON books.id = book_authors.book_id
            JOIN authors ON authors.id = book_authors.auth_id
            WHERE users.id = $1;
        `, [user_id]);
    } catch (error) {
        console.error('Error retrieving personal libray: ', error);
        throw error;
    }
}

async function getPublicLibrary() {
    try {
        return await db.query(`
            SELECT books.*, authors.auth_name
            FROM books 
            JOIN book_authors ON books.id = book_authors.book_id
            JOIN authors ON authors.id = book_authors.auth_id
            WHERE books.availability = 'PUBLIC'
        `);
        
    } catch (error) {
        console.error('Error retrieving public library: ', error);
        throw error;
    }
}

async function getUserCopy(user_id, book_id) {
    try {
        return await db.query(`
            SELECT books.*
            FROM books
            JOIN book_copies ON $1 = book_copies.book_id
            WHERE $2 = book_copies.user_id
            `, [book_id, user_id]);
    } catch (error) {
        console.error('Error retrieving book: ', error);
        throw error;
    }
}

async function getBook(book_id) {
    try {
        return await db.query(`SELECT * FROM books where books.id = $1`, [book_id]);
    } catch (error) {
        console.error('Error trying to get book details: ', error);
        throw error;
    }   
}

async function isPublic(book_id) {
    try {
        const results = await db.query('SELECT availability FROM books where id = $1', [book_id]);
        if (results.rows.length > 0 && results.rows[0].availability == "PUBLIC") {
            return true;
        } 

        return false;
    } catch (error) {
        console.error('Error retrieving book availabilty: ', error);
        throw error;
    }
} 

module.exports = {
    createUser,
    buildBookQuery,
    buildSearchQuery,
    buildInsertQuery,
    buildRemoveQuery,
    removeFromLibrary,
    getMyLibrary,
    getPublicLibrary,
    getUserCopy,
    getBook,
    isPublic,
}