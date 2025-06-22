const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Grade extends Model {}

Grade.init({
    gradeID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    courseID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    studentID: {
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
    institutionID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'Grade',
    tableName: 'grades',
    timestamps: false, // We handle timestamps manually
});

module.exports = Grade;