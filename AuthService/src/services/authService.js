const User = require('../models/user.js');
const {signToken} = require('../utils/jwt.js');

// Create a new user
async function registerUser(userData) {
    const {studentID, FullName, email, telephone, password, role, institutionID} = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Create new user
    const newUser = await User.create({
        studentID,
        FullName,
        email,
        telephone,
        password,
        role,
        institutionID
    });

    return signToken(
        {   sub: newUser.userID,
                    studentID: newUser.studentID,
                    email: newUser.email,
                    role: newUser.role,
                    institutionID: newUser.institutionID
                }
    );
}

// Login user
async function loginUser(email, password) {
    // Find user by email
    const user = await User.findOne({ where: { email: email } });
    // Check password
    if (!user) {
        const err = new Error('Incorrect email or password');
        err.status = 401; // Unauthorized
        throw err;
    }
    const isPasswordValid = await user.validatePassword(password);

    // error handling
    if (!isPasswordValid) {
        const err = new Error('Incorrect email or password');
        err.status = 401; // Unauthorized
        throw err;
    }
    // Generate JWT token
    return signToken(
        {   sub: user.userID,
                    studentID: user.studentID,
                    email: user.email,
                    role: user.role,
                    institutionID: user.institutionID
                }
    );
}

module.exports = {registerUser, loginUser};