const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const messagingService = require('./messagingService.js');

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

    // Send message to AuthService to create user in authdb
    try {
        await messagingService.sendUserCreationMessage({
            email: email,
            password: password, // Send the original password, not the hashed one
            studentID: studentID,
            FullName: FullName,
            telephone: telephone,
            role: role,
            institutionID: institutionID
        });
    } catch (error) {
        console.error('Failed to send user creation message:', error);
        // Don't throw error here, as the main database was updated successfully
    }

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
    else if (user.studentID !== studentID && user.studentID !== null) {
        const err = new Error('Student ID does not match');
        err.status = 403; // Forbidden
        throw err;
    }
    else if (user.institutionID !== institutionID) {
        const err = new Error('User does not belong to this institution');
        err.status = 401; // Unauthorized
        throw err;
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update password in userManagementService database
    await User.update(
        { password: hashedPassword },
        { where: { email: email } }
    );
    
    // Send message to AuthService to update password in authdb
    try {
        await messagingService.sendPasswordUpdateMessage({
            email: email,
            password: password // Send the original password, not the hashed one
        });
    } catch (error) {
        console.error('Failed to send password update message:', error);
        // Don't throw error here, as the main database was updated successfully
    }
    
    const updatedUser = await User.findOne({ where: { email: email } });
    return updatedUser;
}

// Fetch all users by institutionID
async function getUsersByInstitution(institutionID) {
    return await User.findAll({ where: { institutionID } });
}

// Remove user
async function removeUser(userData) {
    const { email, institutionID } = userData;
    
    // Find user by email
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
        const err = new Error('User not found');
        err.status = 404; // Not Found
        throw err;
    }
    
    if (user.institutionID !== Number(institutionID)) {
        const err = new Error('User does not belong to this institution');
        err.status = 401; // Unauthorized
        throw err;
    }
    
    // Delete user from userManagementService database
    await User.destroy({ where: { email: email } });
    
    // Send message to AuthService to remove from authdb
    try {
        await messagingService.sendUserRemovalMessage({
            email: email
        });
    } catch (error) {
        console.error('Failed to send user removal message:', error);
        // Don't throw error here, as the main database was updated successfully
    }
    
    return { message: 'User removed successfully' };
}

module.exports = {createUser, changePassword, getUsersByInstitution, removeUser};