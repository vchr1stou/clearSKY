const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Grade extends Model {}

Grade.init({
    grade_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'gradeID',
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'courseID',
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'studentID',
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
        field: 'institutionID',
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
    },
}, {
    sequelize,
    modelName: 'Grade',
    tableName: 'grades',
    timestamps: false,
});

module.exports = Grade;