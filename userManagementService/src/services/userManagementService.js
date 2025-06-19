const User = require('../models/user.js');
const bcrypt = require('bcrypt');

// Create a new user
async function createUser(userData) {
    const {studentID, FullName, email, telephone, password, role, institutionID} = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
        const error = new Error('User with this email or student ID already exists');
        error.status = 409; // Conflict
        throw error;
    }
    // Check if email is a valid email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        const error = new Error('Invalid email format');
        error.status = 422; // Unprocessable Entity
        throw error;
    }
    // Create new user
    const newUser = await User.create({
        studentID: studentID,
        FullName: FullName,
        email: email,
        telephone: telephone,
        password: password,
        role: role,
        institutionID: institutionID,
    });
    return newUser;
}

// Change user password
async function changePassword(userData) {
    const { email, password, studentID, institutionID} = userData;
    // Find user by email
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
        const err = new Error('User not found');
        err.status = 404; // Not Found
        throw err;
    }
    else if (user.studentID !== studentID) {
        const err = new Error('Student ID does not match');
        err.status = 403; // Forbidden
        throw err;
    }
    else if (user.institutionID !== institutionID) {
        const err = new Error('User does not belong to this institution');
        err.status = 401; // Unauthorized
        throw err;
    }
    // Update user password
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    return user;
}

module.exports = {createUser, changePassword};