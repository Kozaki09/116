require('dotenv').config();
const express = require("express");
const db = require('./db');


query1 = 'CREATE TABLE book_copies (book_id INT REFERENCES books(id) ON DELETE CASCADE, user_id INT REFERENCES users(id) ON DELETE CASCADE, PRIMARY KEY (book_id, user_id));';
query2 = 'INSERT INTO authors (auth_name) VALUES ($1);';
query3 = 'INSERT INTO publishers (publishers) VALUES ($1);';
query4 = `INSERT INTO books (isbn, title, author, year_publication, availability) VALUES ($1, $2, $3, $4, 'PUBLIC');`;
query5 = `
    INSERT INTO book_copies (book_id, user_id)
    VALUES ($1, $2);
`;
// db.query(query1);
// db.query(query2, ["NISIOISIN"]);
// db.query(query4, ["978-4-06-283602-9", "Bakemonogatari (Vol. 1)", "NISIOISIN", "November 2, 2006"]);
db.query(query5, [1, 1]);


console.log("Querry Done.")
