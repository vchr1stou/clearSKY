const {course, statistics, grades} = require('../models/index');
const sequelize = require('../config/db');

/*Function to get available statistics for a specific course for a specific exam period
* */
async function getStats(courseId, institutionId, examPeriod) {
    try {
        const stats = await statistics.findOne({
            where: {
                course_id: courseId,
                institution_id: institutionId,
                examPeriod: examPeriod
            },
            attributes: [
                'courseName',
                'examPeriod',
                'avgGrade',
                'gradeDistribution',
                'totalStudents',
                'passRate',
                'failRate',
                'highestGrade',
                'lowestGrade'
            ],
        });
        return stats;
    } catch (error) {
        console.error('Error fetching statistics:', error);
        throw error;
    }

}

/*A function to get a list of available statistics
* We have different roles:
* - institution representative: can see every stat in his institution
* - instructor: can see all stats for all of his courses for all previous exams
* - student: can see stats for all exams in the year he took the course*/
async function getStatsList(role, institutionId, studentId, userId) {
    try {
        if (role === 'INSTITUTION_REPRESENTATIVE') {
            return await statistics.findAll({
                where: {institution_id: institutionId},
                attributes: ['course_id', 'course_name', 'exam_period']
            });
        } else if (role === 'INSTRUCTOR') {
            const query = `
                SELECT s.course_id, s.course_name, s.exam_period
                FROM statistics s
                         JOIN courses c ON s.course_id = c.course_id AND s.institution_id = c.institution_id
                WHERE c.instructor_id = :userId`;

            return await sequelize.query(query, {
                replacements: {userId},
                type: sequelize.QueryTypes.SELECT
            });
        } else if (role === 'STUDENT') {
            const query = `
                SELECT s.course_id, s.course_name, s.exam_period
                FROM statistics s
                         JOIN grades g ON s.course_id = g.course_id AND s.institution_id = g.institution_id
                WHERE g.student_id = :studentId`;

            return await sequelize.query(query, {
                replacements: {studentId},
                type: sequelize.QueryTypes.SELECT
            });
        } else {
            throw new Error('Invalid role');
        }
    } catch (error) {
        console.error('Error fetching all statistics:', error);
        throw error;
    }
}

// Returns a list of { course_id, institution_id, exam_period } where grades exist but no statistics
async function findCoursesWithNoStats(institutionId) {
    try {
        const query = `
            SELECT DISTINCT g.course_id, g.institution_id, g.exam_period
            FROM grades g
                     LEFT JOIN statistics s
                               ON g.course_id = s.course_id
                                   AND g.institution_id = s.institution_id
                                   AND g.exam_period = s.exam_period
            WHERE g.institution_id = :institutionId
              AND s.statistics_id IS NULL
        `;
        return await sequelize.query(query, {
            replacements: {institutionId},
            type: sequelize.QueryTypes.SELECT
        });
    } catch (error) {
        console.error('Error finding courses with grades but no statistics:', error);
        throw error;
    }
}


/* A function to create statistics if there are new grades for a course*/
async function createStatistics(institutionId) {
    try {
        // Find courses with grades and no stats
        const courses = await findCoursesWithNoStats(institutionId);
        if (courses.length !== 0) {
            console.log(`Found ${courses.length} courses with grades but no statistics for institution ${institutionId}`);
            for (const course of courses) {
                const courseId = course.course_id;
                const examPeriod = course.exam_period;
                // Find all grades for the course
                const gradesRecords = await grades.findAll({
                    where: {
                        course_id: courseId,
                        institution_id: institutionId,
                        exam_period: examPeriod,
                    }
                });

                if (gradesRecords.length > 0) {
                    const totalStudents = gradesRecords.length;
                    const avgGrade = gradesRecords.reduce((sum, grade) => sum + parseFloat(grade.total_grade || 0), 0) / totalStudents;
                    const highestGrade = Math.max(...gradesRecords.map(grade => parseFloat(grade.total_grade || 0)));
                    const lowestGrade = Math.min(...gradesRecords.map(grade => parseFloat(grade.total_grade || 0)));
                    const passRate = (gradesRecords.filter(grade => parseFloat(grade.total_grade || 0) >= 5).length / totalStudents) * 100;
                    const failRate = (gradesRecords.filter(grade => parseFloat(grade.total_grade || 0) < 5).length / totalStudents) * 100;

                    // Create grade distribution
                    const gradeDistribution = {};
                    for (let i = 0; i <= 10; i++) {
                        gradeDistribution[i] = 0;
                    }
                    const gradeValues = gradesRecords.map(g => parseFloat(g.total_grade));
                    for (const grade of gradeValues) {
                        const bucket = Math.floor(grade);
                        gradeDistribution[bucket]++;
                    }
                    const query = `SELECT name
                                   FROM courses
                                   WHERE course_id = :courseId
                                     AND institution_id = :institutionId`;
                    const courseResult = await sequelize.query(query, {
                        replacements: {courseId, institutionId},
                        type: sequelize.QueryTypes.SELECT
                    });
                    console.log(`
                        courseId: ${courseId},
                        institutionId: ${institutionId},
                        courseName: ${courseResult[0].name},
                        examPeriod: ${examPeriod},
                        avgGrade: ${avgGrade.toFixed(2)},
                        gradeDistribution: ${JSON.stringify(gradeDistribution)},
                        totalStudents: ${totalStudents},
                        passRate: ${passRate.toFixed(2)},
                        failRate: ${failRate.toFixed(2)},
                        highestGrade: ${highestGrade.toFixed(2)},
                        lowestGrade: ${lowestGrade.toFixed(2)}`);

                    await statistics.create({
                        course_id: courseId,
                        institution_id: institutionId,
                        courseName: courseResult[0].name,
                        examPeriod: examPeriod,
                        avgGrade: avgGrade.toFixed(2),
                        gradeDistribution: JSON.stringify(gradeDistribution),
                        totalStudents: totalStudents,
                        passRate: passRate.toFixed(2),
                        failRate: failRate.toFixed(2),
                        highestGrade: highestGrade.toFixed(2),
                        lowestGrade: lowestGrade.toFixed(2)
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error creating statistics:', error);
        throw error;
    }
}

module.exports = {getStats, getStatsList, createStatistics};