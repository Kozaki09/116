const bcrypt = require('bcryptjs');
const express = require('express');
const path = require('path');

function serveStaticFiles(folderName) {
    const directoryPath = path.resolve(__dirname, '..', folderName);
    return express.static(directoryPath);
}

function sendHtmlFile(res, filename) {
    const filepath = path.resolve(__dirname, '..', 'html', filename);
    return res.sendFile(filepath);
}

async function hashPassword(password) {
    const saltRounds = 10;
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.error('Error hashing password: ', error);
        throw error;
    }
}

async function comparePassword(password, hash) {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('Error comparing password: ', error);
        throw error;
    }
}

async function redirectBack(req, res, message) {
    const previousPage = req.get('Refer') || '/';
    const redirectUrl = message ? `${previousPage}?message=${encodeURIComponent(message)}` : previousPage;
    return res.redirect(redirectUrl);
}

module.exports = {
    serveStaticFiles,
    sendHtmlFile,
    hashPassword,
    comparePassword,
    redirectBack,
}