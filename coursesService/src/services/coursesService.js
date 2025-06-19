const {Grade, Course} = require('../models/index.js');
// get list of (graded) courses  for a student
async function getMyCourses(studentId) {
    /*We want:
    * exam period (from Grade)
    * grading status (from Grade)
    * and course name (from Course)
    * */
    try {
        return await Grade.findAll({
            where: {student_id: studentId},
            attributes: ['grading_status', 'exam_period'],
            include: [{
                model: Course,
                attributes: ['name'], // Include course name
            }]
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
}

module.exports = getMyCourses;