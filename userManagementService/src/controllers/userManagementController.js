const {createUser, changePassword} = require('../services/userManagementService.js');


async function register(req, res, next) {
    const { studentID, FullName, email, password, role, institutionID } = req.body;
    if (!studentID || !FullName || !email || !password || !role || !institutionID) {
        return res.status(400).json({ message: 'Invalid or missing required fields' });
    }
    try {
        const newUser = await createUser(req.body);
        res.status(201).json({userId: newUser.userId, message: 'User created successfully'});
    } catch (error) {
        error.status = error.status || 400;
        next(error);
    }
}

async function changePassw(req, res, next) {
    const { email, password, studentID } = req.body;
    if (!email || !password || !studentID) {
        return res.status(400).json({ message: 'Invalid or missing required fields' });
    }
    try {
        const updatedUser = await changePassword(req.body);
        res.status(200).json({ userId: updatedUser.userId, message: 'Password changed successfully' });
    } catch (error) {
        error.status = error.status || 400;
        next(error);
    }
}

module.exports = {register, changePassw};