const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');

function serveStatic(folderName) {
    const directoryPath = path.resolve(__dirname, '..', folderName);
    return express.static(directoryPath);
}

function hashPassword(password) {
    const saltRounds = 10;
    try {
        return bcrypt.hash(password, saltRounds);
    } catch (error) {;
        throw error;
    }
}

function getSession(req){
    const session = {
        name: req.session.user_name,
        id: req.session.user_id,
        email: req.session.user_email,
        role: req.session.isAdmin ? "Admin" : "User"
    }

    return session;
}

async function comparePassword(password, hash) {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {;
        throw error;
    }
}

function resolvePath(segments) {
    return path.resolve(__dirname, '..', segments);
}

function formatBookResults(results) {
    const books = {};

    results.rows.forEach((row) => {
        if (!books[row.id]) {
            books[row.id] = {
                id: row.id,
                title: row.title,
                isbn: row.isbn,
                publication: row.publication,
                publisher: row.pub_id && row.pub_name
                ? {id: row.pub_id, name: row.pub_name}
                : {id: null, name: 'Unknown'},
                authors: []
            }
        }

        if (row.auth_id && row.auth_name) {
            books[row.id].authors.push({id: row.auth_id, name: row.auth_name});
        }
    });

    return books;
}

function redirectBack(req, res, message) {
    const previousPage = req.get('Refer') || '/';
    const redirectUrl = message ? `${previousPage}?message=${encodeURIComponent(message)}` : previousPage;
    return res.redirect(redirectUrl);
}

module.exports = {
    serveStatic,
    hashPassword,
    getSession,
    comparePassword,
    resolvePath,
    formatBookResults,
    redirectBack,
}