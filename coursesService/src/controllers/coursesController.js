const getMyCourses = require("../services/coursesService.js");

async function getCourses(req, res) {
    const user = req.user;

    try {
        if (!user.studentID) {
            return res.status(400).json({ error: 'Missing parameters' });
        }
        if (user.role !== 'STUDENT') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const courses = await getMyCourses(user.studentID);
        if (!courses) {
            return res.status(200).json({ message: 'No courses available' });
        }
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = getCourses;