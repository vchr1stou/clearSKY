const db = require('./db');

const GradeModel = {
  async insertTempGrades(course_id, student_id, exam_period, total_grade, question_grades, status = 'open') {
    const [result] = await db.execute(
      `INSERT INTO grades (course_id, student_id, exam_period, grading_status, total_grade, question_grades)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [course_id, student_id, exam_period, status, total_grade, JSON.stringify(question_grades)]
    );
    return result.insertId;
  },

  async getGradesByStudent(studentId) {
    const [rows] = await db.execute(
      `SELECT c.name AS course_name, g.exam_period, g.grading_status
       FROM grades g JOIN courses c ON g.course_id = c.course_id
       WHERE g.student_id = ?`,
      [studentId]
    );
    return rows;
  },

  async getGradeDetails(studentId, courseName) {
    const [rows] = await db.execute(
      `SELECT g.total_grade, g.question_grades
       FROM grades g
       JOIN courses c ON g.course_id = c.course_id
       WHERE g.student_id = ? AND c.name = ?`,
      [studentId, courseName]
    );
    return rows[0];
  }
};

module.exports = GradeModel;
