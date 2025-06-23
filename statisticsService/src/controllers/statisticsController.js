const {getStats, getStatsList, createStatistics} = require('../services/statisticsService');
const {course, grades} = require('../models/index');

async function getStatistics(req, res) {
    const {courseId, institutionId, examPeriod} = req.params;
    const user = req.user;

    try {
        let authorized = false;

        if (user.role === 'INSTITUTION_REPRESENTATIVE' && user.institutionId === institutionId) {
            authorized = true;
        } else if (user.role === 'INSTRUCTOR') {
            // Check if instructor teaches this course
            const found = await course.findOne({
                where: {
                    course_id: courseId,
                    institution_id: institutionId,
                    instructor_id: user.sub
                }
            });
            authorized = !!found;
        } else if (user.role === 'STUDENT') {
            // Check if student has a grade for this course
            const found = await grades.findOne({
                where: {
                    course_id: courseId,
                    institution_id: institutionId,
                    student_id: user.studentID
                }
            });
            authorized = !!found;
        }

        if (!authorized) {
            return res.status(403).json({message: 'Forbidden'});
        }

        const stats = await getStats(courseId, institutionId, examPeriod);
        if (!stats) {
            return res.status(404).json({message: 'Statistics not found for this course'});
        }
        res.json(stats);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

async function getMyStats(req, res) {
    const user = req.user;

    try {
        console.log('🔍 getMyStats - User data:', {
            role: user.role,
            institutionID: user.institutionID,
            studentID: user.studentID,
            sub: user.sub,
            instructorID: user.instructorID,
            instructor_id: user.instructor_id
        });
        
        // For instructors, use instructorID instead of sub
        const userId = user.role === 'INSTRUCTOR' ? user.instructorID : user.sub;
        
        const statsList = await getStatsList(user.role, user.institutionID, user.studentID, userId);
        console.log('📊 getMyStats - Result:', statsList);
        res.json(statsList);
    } catch (error) {
        console.error('Error fetching statistics list:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

async function createStats(req, res) {
    //const user = req.user;
    const {institutionId} = req.params;

    try {
        // Create new statistics entry
        await createStatistics(institutionId);

        res.status(200).json({message: 'Statistics created successfully'});
    } catch (error) {
        console.error('Error creating statistics:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = {getStatistics, getMyStats, createStats};