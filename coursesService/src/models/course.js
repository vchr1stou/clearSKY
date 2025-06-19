const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Course extends Model {}

Course.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    institution_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Course',
    tableName: 'user_courses',
    timestamps: false,
});

module.exports = Course;