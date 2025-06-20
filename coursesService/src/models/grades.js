const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Grade extends Model {}

Grade.init({
    grade_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    course_ref_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    question_grades: {
        type: DataTypes.JSON,
    },
    exam_period: {
        type: DataTypes.STRING(50),
    },
    grading_status: {
        type: DataTypes.ENUM('open', 'closed'),
    },
    total_grade: {
        type: DataTypes.DECIMAL(5, 2),
    },
    institution_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Grade',
    tableName: 'grades',
    timestamps: false,
});

module.exports = Grade;