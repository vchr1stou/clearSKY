const {createUser, changePassword, getUsersByInstitution, removeUser} = require('../services/userManagementService.js');


async function register(req, res, next) {
    const { studentID, FullName, email, password, role, institutionID } = req.body;
    if (!FullName || !email || !password || !role || !institutionID) {
        return res.status(400).json({ message: 'Invalid or missing required fields' });
    }
    try {
        const newUser = await createUser(req.body);
        return res.status(201).json({userId: newUser.userId, message: 'User created successfully'});
    } catch (error) {
        if (error.status === 409 || error.status === 422) {
            return res.status(error.status).json({ message: error.message });
        }
        error.status = error.status || 400;
        next(error);
    }
}

async function changePassw(req, res, next) {
    const { email, password, studentID, institutionID } = req.body;
    
    if (!email || !password || !studentID || !institutionID) {
        return res.status(400).json({ message: 'Invalid or missing required fields' });
    }
    
    try {
        const updatedUser = await changePassword(req.body);
        res.status(200).json({ userId: updatedUser.userId, message: 'Password changed successfully' });
    } catch (error) {
        if (error.status === 401 || error.status === 403 || error.status === 404) {
            return res.status(error.status).json({ message: error.message });
        }
        error.status = error.status || 400;
        next(error);
    }
}

async function getUsersForInstitution(req, res, next) {
    try {
        const institutionID = req.user.institutionID;
        if (!institutionID) {
            return res.status(400).json({ message: 'Institution ID not found in user context' });
        }
        const users = await getUsersByInstitution(institutionID);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

async function removeUserController(req, res, next) {
    const { email, institutionID } = req.body;
    
    if (!email || !institutionID) {
        return res.status(400).json({ message: 'Invalid or missing required fields' });
    }
    
    try {
        const result = await removeUser(req.body);
        res.status(200).json(result);
    } catch (error) {
        if (error.status === 401 || error.status === 404) {
            return res.status(error.status).json({ message: error.message });
        }
        error.status = error.status || 400;
        next(error);
    }
}

module.exports = {register, changePassw, getUsersForInstitution, removeUserController};