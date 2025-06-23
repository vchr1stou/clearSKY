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
async function connectWithRetry(retries = 10, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            await sequelize.authenticate();
            console.log('Database connection established.');
            return sequelize;
        } catch (err) {
            console.error(`DB connection failed (attempt ${i + 1}):`, err.message);
            if (i < retries - 1) {
                await new Promise(res => setTimeout(res, delay));
            } else {
                throw err;
            }
        }
    }
}

module.exports = {grades, course, statistics, initDB, connectWithRetry};