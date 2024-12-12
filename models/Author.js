const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Author = sequelize.define('Author', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
    }
}, {
    tablename: 'authors',
    timestamp: false,
});

module.exports = Author;