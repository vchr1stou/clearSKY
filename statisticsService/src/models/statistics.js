const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Statistics extends Model {}

Statistics.init({
    statistics_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    institution_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    courseName: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'course_name',
    },
    examPeriod: {
        type: DataTypes.STRING(25),
        allowNull: false,
        field: 'exam_period',
    },
    avgGrade: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        field: 'avg_grade',
    },
    gradeDistribution: {
        type: DataTypes.JSON,
        allowNull: false,
        field: 'grade_distribution',
    },
    totalStudents: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'total_students',
    },
    passRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: 'pass_rate',
    },
    failRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: 'fail_rate',
    },
    highestGrade: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        field: 'highest_grade',
    },
    lowestGrade: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        field: 'lowest_grade',
    },
}, {
    sequelize,
    modelName: 'Statistics',
    tableName: 'statistics',
    timestamps: false,
});

module.exports = Statistics;
