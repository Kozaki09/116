const { DataTypes } = require('sequelize');
const sequelize = require('../db');

module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        isbn: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        year_publication: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        availability: {
            type: DataTypes.ENUM('PUBLIC', 'PRIVATE'),
            defaultValue: 'PRIVATE',
        }
    }, {
        tableName: 'books',
        timestamps: false,
    });

    return Book;
}
