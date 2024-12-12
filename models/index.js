const {Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_URL);

const Author = require('./Author')(sequelize, DataTypes);
const Book = require('./Book')(sequelize, DataTypes);
const BookCopy = require('./BookCopy')(sequelize, DataTypes);
const User = require('./User')(sequelize, DataTypes);

Author.hasMany(Book);
Book.belongsTo(Author);

User.hasMany(BookCopy);
BookCopy.belongsTo(User);

Book.hasMany(BookCopy);
BookCopy.belongsTo(Book);

module.exports = {
    Author,
    Book,
    BookCopy,
    User,
    sequelize,
}