const fs = require('fs');
const path = require('path');
const parseGradesFile = require('../utils/parseXlsx');
const GradeModel = require('../models/grade.model');

exports.uploadPreview = async (req, res, next) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Only instructors can upload grades' });
    }

    const file = req.file;
    const { grading_type } = req.body;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const parsed = parseGradesFile(file.path);
    const tempFilename = path.basename(file.path);

    res.json({
      course_name: parsed.courseName,
      exam_period: parsed.examPeriod,
      grade_count: parsed.parsedGrades.length,
      temp_file: tempFilename
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadConfirm = async (req, res, next) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Only instructors can confirm grades' });
    }

    const { temp_file, grading_type } = req.body;
    const filePath = path.join(__dirname, '..', 'uploads', temp_file);
    const parsed = parseGradesFile(filePath);

    const course_id = 1; // Προς το παρόν είναι mock

    for (const g of parsed.parsedGrades) {
      await GradeModel.insertTempGrades(
        course_id,
        g.student_id,
        parsed.examPeriod,
        g.total_grade,
        g.question_grades,
        grading_type
      );
    }

    fs.unlinkSync(filePath); // Διαγραφή προσωρινού αρχείου

    res.json({ message: 'Grades successfully inserted' });
  } catch (error) {
    next(error);
  }
};

exports.getGradesByStudent = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;

    if (req.user.role === 'student' && req.user.user_id != studentId) {
      return res.status(403).json({ message: 'Access denied: not your grades' });
    }

    const grades = await GradeModel.getGradesByStudent(studentId);
    res.json(grades);
  } catch (error) {
    next(error);
  }
};

exports.getGradeDetails = async (req, res, next) => {
  try {
    const { studentId, courseName } = req.params;

    if (req.user.role === 'student' && req.user.user_id != studentId) {
      return res.status(403).json({ message: 'Access denied: not your grades' });
    }

    const grade = await GradeModel.getGradeDetails(studentId, courseName);
    res.json(grade);
  } catch (error) {
    next(error);
  }
};
