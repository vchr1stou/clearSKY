const sequelize = require('../config/db');

async function getMyCourses(studentId) {
    const query = `
        SELECT 
            g.grading_status, 
            g.exam_period, 
            g.total_grade,
            c.name AS course_name
        FROM grades g
        JOIN courses c
            ON g.course_id = c.course_id AND g.institution_id = c.institution_id
        WHERE g.student_id = :studentId
    `;

    try {
        return await sequelize.query(query, {
            replacements: { studentId },
            type: sequelize.QueryTypes.SELECT
        });

    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
}

module.exports = getMyCourses;