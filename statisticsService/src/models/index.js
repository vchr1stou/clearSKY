const sequelize = require('../config/db.js');
const grades = require('./grades');
const statistics = require('./statistics');
const course = require('./course');

// Initialize Sequelize instance
async function initDB() {
    try {
        await sequelize.authenticate();
        console.log('Database connected Successfully');
        await sequelize.sync(); // Sync models with the database
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = {grades, course, statistics, initDB};