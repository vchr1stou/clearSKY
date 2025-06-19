const sequelize = require('../config/db');
const Grade = require('./grades.js');
const Course = require('./course.js');

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

Grade.belongsTo(require('./course'), {
    foreignKey: 'course_id',
    targetKey: 'course_id',
});

module.exports = {Grade, Course, initDB};