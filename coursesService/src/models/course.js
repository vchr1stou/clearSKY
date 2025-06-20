const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Course extends Model {}

Course.init({
    instructor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
        primaryKey: true,
    },
}, {
    sequelize,
    modelName: 'Course',
    tableName: 'courses',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['course_id', 'institution_id']
        }
    ]
});

module.exports = Course;