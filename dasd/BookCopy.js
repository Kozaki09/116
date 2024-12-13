const { DataTypes } = require('sequelize');
const sequelize = require('../db');

module.exports = (sequelize, DataTypes) => {
    const BookCopy = sequelize.define('BookCopy', {
        book_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'books',
                key: 'id',
            },
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id',
            },
            primaryKey: true,
            allowNull: false,
        },
    }, {
        tablename: 'book_copies',
        timestamps: false,
    });

    return BookCopy;
}