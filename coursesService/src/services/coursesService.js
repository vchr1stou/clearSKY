const sequelize = require('../config/db');

async function getMyCourses(studentId) {
    const query = `
        SELECT 
            g.grading_status, 
            g.exam_period, 
            g.total_grade,
            g.question_grades,
            c.name AS course_name,
            c.courseID AS courseID,
            c.instructorID AS instructorID
        FROM grades g
        JOIN courses c
            ON g.courseID = c.courseID AND g.institutionID = c.institutionID
        WHERE g.studentID = :studentId
    `;

    try {
        const results = await sequelize.query(query, {
            replacements: { studentId },
            type: sequelize.QueryTypes.SELECT
        });

        // Debug logging
        console.log('🔍 Query results for studentId:', studentId);
        console.log('📊 Number of results:', results.length);
        if (results.length > 0) {
            console.log('📋 First result keys:', Object.keys(results[0]));
            console.log('📋 Sample result:', JSON.stringify(results[0], null, 2));
        }

        return results;

    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
}

module.exports = getMyCourses;