const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');

class User extends Model {
};

User.init(
    {
        userID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        studentID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        FullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        telephone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('STUDENT', 'INSTRUCTOR',
                'INSTITUTION_REPRESENTATIVE', 'ADMIN'),  // customize roles
            allowNull: false,
            defaultValue: 'STUDENT',  // default role
        },
        institutionID: {
            type: DataTypes.INTEGER,
            allowNull: true,

        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'User',
        timestamps: false,
    }
);

// Hash password before creating the user
User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});



module.exports = User;