const db = require('../models/db');

exports.getPendingRequests = async (req, res, next) => {
  const { instructorId } = req.params;
  try {
    const [requests] = await db.query(`
      SELECT c.name AS course_name, g.exam_period, u.name AS student, r.request_id
      FROM requests r
      JOIN grades g ON r.grade_id = g.grade_id
      JOIN courses c ON r.course_id = c.course_id
      JOIN users u ON r.student_id = u.user_id
      WHERE r.instructor_id = ? AND r.review_status = 'pending'`, [instructorId]);
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

exports.submitFeedback = async (req, res, next) => {
  const { studentId, gradeId } = req.params;
  const { request_message } = req.body;

  try {
    const [existing] = await db.query(`SELECT * FROM requests WHERE student_id = ? AND grade_id = ?`, [studentId, gradeId]);

    if (existing.length === 0) {
      const [[grade]] = await db.query(`SELECT course_id FROM grades WHERE grade_id = ?`, [gradeId]);
      if (!grade) return res.status(404).json({ error: 'Grade not found' });

      const courseId = grade.course_id;

      const [instructors] = await db.query(`
        SELECT u.user_id FROM users u
        JOIN user_courses uc ON u.user_id = uc.user_id
        WHERE uc.course_id = ? AND u.role = 'instructor'
        LIMIT 1`, [courseId]);

      if (instructors.length === 0) {
        return res.status(404).json({ error: 'Instructor not found for course' });
      }

      const instructorId = instructors[0].user_id;

      await db.query(`
        INSERT INTO requests (student_id, grade_id, course_id, instructor_id, request_message, review_status)
        VALUES (?, ?, ?, ?, ?, 'pending')`, [studentId, gradeId, courseId, instructorId, request_message]);

      return res.status(201).json({ message: 'Review request created successfully' });
    }

    await db.query(`
      UPDATE requests SET request_message = ?
      WHERE student_id = ? AND grade_id = ?`, [request_message, studentId, gradeId]);

    res.status(200).json({ message: 'Review request updated successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getReviewData = async (req, res, next) => {
  const { requestId } = req.params;
  try {
    const [results] = await db.query(`
      SELECT c.name AS course_name, g.exam_period, u.name AS student,
             r.instructor_id, r.request_message
      FROM requests r
      JOIN courses c ON r.course_id = c.course_id
      JOIN grades g ON r.grade_id = g.grade_id
      JOIN users u ON r.student_id = u.user_id
      WHERE r.request_id = ?
      LIMIT 1
    `, [requestId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(results[0]);
  } catch (err) {
    next(err);
  }
};

exports.replyToRequest = async (req, res, next) => {
  const { requestId } = req.params;
  const { respond_message } = req.body;

  if (!respond_message || !respond_message.trim()) {
    return res.status(400).json({ error: 'Το μήνυμα απάντησης δεν μπορεί να είναι κενό.' });
  }

  try {
    await db.query(`
      UPDATE requests
      SET respond_message = ?, review_status = 'finished'
      WHERE request_id = ?
    `, [respond_message, requestId]);

    res.json({ message: 'Η απάντηση υποβλήθηκε.' });
  } catch (err) {
    next(err);
  }
};

exports.getReviewStatus = async (req, res, next) => {
  const { studentId, courseName, examPeriod } = req.params;

  try {
    const [results] = await db.query(`
      SELECT r.review_status, r.respond_message
      FROM requests r
      JOIN courses c ON r.course_id = c.course_id
      JOIN grades g ON r.grade_id = g.grade_id
      WHERE r.student_id = ? AND c.name = ? AND g.exam_period = ?
      LIMIT 1
    `, [studentId, courseName, examPeriod]);

    if (results.length === 0) {
      return res.json({ review_status: 'none' });
    }

    res.json({
      review_status: results[0].review_status,
      respond_message: results[0].respond_message || ''
    });
  } catch (err) {
    next(err);
  }
};

