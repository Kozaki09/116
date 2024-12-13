const db = require('../db/index');

async function findByEmail(email) {
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result || null;
    } catch (error) {
        console.error('Error querying user by email: ', error);
        throw error;
    }
}

async function findByUser(username) {
    try {
        const result = await db.query('SELECT * FROM users where username = $1', [username]);
        return result || null;
    } catch (error) {
        console.error('Error querying by username: ', error);
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

async function getBookCopy(user_id, book_id) {
    try {
        const result = await db.query(`
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
    findByEmail,
    findByUser,
    createUser,
    removeFromLibrary,
    getMyLibrary,
    getPublicLibrary,
    getBookCopy,
    isPublic,
}