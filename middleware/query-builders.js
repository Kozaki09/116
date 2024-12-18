const db = require('../db/index');

async function buildBookQuery(filters = {}) {
    // base query
    let query = `
    SELECT books.*, authors.auth_name, book_authors.auth_id, publishers.pub_name 
    FROM books 
    LEFT JOIN book_authors ON books.id = book_authors.book_id
    LEFT JOIN publishers ON books.pub_id = publishers.id
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
    } 
    
    if (filters.public) {
        whereClause += ` AND books.availability = 'public'`;
    }

    if (filters.title) {
        whereClause += ' AND title ILIKE $' + (parameters.length + 1);
        parameters.push('%' + filters.title + '%');
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
        whereClause += ` ORDER BY books.title ${sortOrder}`;
    }

    query += whereClause;
    try {
        if (filters.email) {
            return await db.query('SELECT * FROM users where email = $1', [filters.email]);
        }    
        if (Object.keys(filters).length > 0) {
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
        throw new Error("Data must be non-empty object.");
    }
    const columns = Object.keys(data);
    const placeholders = columns.map((_, index) => `$${index + 1}`);
    const values = Object.values(data);

    let query = `INSERT INTO ${tablename} (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`;
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

async function buildUpdateQuery(tablename, data = {}, filters = {}) {
    if (!tablename || typeof tablename !== "string") {
        throw new Error("Table name must be a valid string.");
    }

    if (!data || Object.keys(data).length === 0 || typeof data !== "object") {
        throw new Error("Data must be non-empty object.");
    }

    if (typeof filters !== "object" || Object.keys(filters).length === 0) {
        throw new Error("At least one filter condition must be provided.");
    }

    let query = `UPDATE ${tablename} SET `;
    const columns = [];
    const conditions = [];
    const values = [];

    let index = 1;
    Object.entries(data).forEach(([key, value]) => {
        if (value !== null) {
            columns.push(` ${key} = $${index}`);
            values.push(value);
            index++;
        }
    });

    Object.entries(filters).forEach(([key, value]) => {
        conditions.push(` ${key} = $${index}`);
        values.push(value);
        index++;
    });

    query += columns.join(', ');
    query += " WHERE " + conditions.join(' AND ');
    return await db.query(query, values);
}

module.exports = {
    buildBookQuery,
    buildInsertQuery,
    buildRemoveQuery,
    buildSearchQuery,
    buildUpdateQuery,
}