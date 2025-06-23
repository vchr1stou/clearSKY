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
        console.log('🔍 getStatsList - Parameters:', { role, institutionId, studentId, userId });
        
        if (role === 'INSTITUTION_REPRESENTATIVE') {
            return await statistics.findAll({
                where: {institution_id: institutionId},
                attributes: ['course_id', 'course_name', 'exam_period']
            });
        } else if (role === 'INSTRUCTOR') {
            const query = `
                SELECT s.course_id, c.name as course_name, s.exam_period
                FROM statistics s
                         JOIN courses c ON s.course_id = c.course_id AND s.institution_id = c.institution_id
                WHERE c.instructor_id = :userId`;

            console.log('🔍 getStatsList - Instructor query:', query);
            console.log('🔍 getStatsList - Instructor userId:', userId);
            
            const result = await sequelize.query(query, {
                replacements: {userId},
                type: sequelize.QueryTypes.SELECT
            });
            
            console.log('📊 getStatsList - Instructor result:', result);
            return result;
        } else if (role === 'STUDENT') {
            const query = `
                SELECT s.course_id, s.course_name, s.exam_period
                FROM statistics s
                         JOIN grades g ON s.course_id = g.courseID AND s.institution_id = g.institutionID
                WHERE g.studentID = :studentId`;

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
            SELECT DISTINCT g.courseID, g.institutionID, g.exam_period
            FROM grades g
                     LEFT JOIN statistics s
                               ON g.courseID = s.course_id
                                   AND g.institutionID = s.institution_id
                                   AND g.exam_period = s.exam_period
            WHERE g.institutionID = :institutionId
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
                const courseId = course.courseID;
                const examPeriod = course.exam_period;
                console.log('Processing course:', course);
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

// Create or update a grade record in the statistics DB
async function createGrade(gradeData) {
    try {
        // 1. Insert course if not exists (ignore duplicate)
        const insertCourseSQL = `
            INSERT INTO courses (course_id, instructor_id, name, institution_id)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE instructor_id = VALUES(instructor_id), name = VALUES(name)
        `;
        await sequelize.query(insertCourseSQL, {
            replacements: [
                gradeData.course_id,
                gradeData.instructor_id,
                gradeData.course_name || `Course ${gradeData.course_id}`,
                gradeData.institution_id
            ]
        });

        // 2. Insert or update grade
        const insertGradeSQL = `
            INSERT INTO grades (studentID, courseID, exam_period, question_grades, grading_status, total_grade, institutionID, instructorID)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                question_grades = VALUES(question_grades),
                grading_status = VALUES(grading_status),
                total_grade = VALUES(total_grade),
                instructorID = VALUES(instructorID),
                updated_at = CURRENT_TIMESTAMP
        `;
        await sequelize.query(insertGradeSQL, {
            replacements: [
                gradeData.student_id,
                gradeData.course_id,
                gradeData.exam_period,
                JSON.stringify(gradeData.question_grades || {}),
                gradeData.grading_status || 'open',
                gradeData.total_grade,
                gradeData.institution_id,
                gradeData.instructor_id
            ]
        });
        return true;
    } catch (error) {
        console.error('Error creating/updating grade in statistics DB (raw SQL):', error);
        throw error;
    }
}

module.exports = {getStats, getStatsList, createStatistics, createGrade};