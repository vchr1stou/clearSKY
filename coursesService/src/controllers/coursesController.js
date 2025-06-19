const getMyCourses = require("../services/coursesService.js");

async function getCourses(req, res) {
    const studentId = req.params.studentId;

    try {
        if (!studentId) {
            return res.status(400).json({ error: 'Missing student id' });
        }
        const courses = await getMyCourses(studentId);
        if (!courses) {
            return res.status(200).json({ error: 'No courses available' });
        }
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = getCourses;