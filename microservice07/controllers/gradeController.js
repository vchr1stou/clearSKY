const db = require('../models/db');

exports.getStudentGrades = async (req, res, next) => {
  const { studentId } = req.params;
  try {
    const [grades] = await db.query(`
      SELECT g.grade_id, c.name AS course_name, g.exam_period, g.grading_status
      FROM grades g
      JOIN courses c ON g.course_id = c.course_id
      WHERE g.student_id = ?`, [studentId]);
    res.json(grades);
  } catch (err) {
    next(err);
  }
};

exports.getGradeDetails = async (req, res, next) => {
  const { studentId, gradeId } = req.params;
  try {
    const [results] = await db.query(`
      SELECT g.grade_id, c.name AS course_name, g.exam_period, g.grading_status
      FROM grades g
      JOIN courses c ON g.course_id = c.course_id
      WHERE g.student_id = ? AND g.grade_id = ?`, [studentId, gradeId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Grade not found' });
    }

    res.json(results[0]);
  } catch (err) {
    next(err);
  }
};
