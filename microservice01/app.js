const express = require('express');
const path = require('path');
const { testDB, db } = require('./db/dbConfig.js');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Serve HTML pages
app.get('/GradingService/InitialGrades', (req, res) => {
  res.sendFile(path.join(__dirname, 'InitialGrades.html'));
});

app.get('/GradingService/FinalGrades', (req, res) => {
  res.sendFile(path.join(__dirname, 'FinalGrades.html'));
});

app.get('/Grades', (req, res) => {
  res.sendFile(path.join(__dirname, 'grades_backup.html'));
});

app.get('/GradingService/Grades/:studentId', (req, res) => {
  res.sendFile(path.join(__dirname, 'grades.html'));
});


// API for student grades
app.get('/GradingService/Grades/:studentId/data', async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const [grades] = await db.query(`
      SELECT 
        c.name AS course_name,
        g.exam_period,
        g.grading_status
      FROM grades g
      JOIN courses c ON g.course_id = c.course_id
      WHERE g.student_id = ?
    `, [studentId]);

    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/GradingService/Grades/:studentId/:courseName/data', async (req, res) => {
  const { studentId, courseName } = req.params;

  try {
    const [results] = await db.query(`
      SELECT g.total_grade, g.question_grades
      FROM grades g
      JOIN courses c ON g.course_id = c.course_id
      WHERE g.student_id = ? 
        AND c.name = ?
      LIMIT 1
    `, [studentId, courseName]);

    if (results.length === 0) {
      return res.status(404).json({});
    }

    const result = results[0];
    res.json({
      total_grade: result.total_grade,
      question_grades: result.question_grades
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PREVIEW route
app.post('/upload-preview', upload.single('file'), async (req, res) => {
  try {
    const gradingType = req.body.grading_type;
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { range: 2 });



    if (data.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Empty file' });
    }

    const courseField = data[0]['Τμήμα Τάξης'];
    const period = data[0]['Περίοδος δήλωσης'];

    const match = courseField?.match(/(.+)\((\d+)\)/);
    if (!match) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Invalid course format in Τμήμα Τάξης' });
    }

    const courseName = match[1].trim();
    const gradeCount = data.length;

    const tempFilePath = `uploads/preview-${Date.now()}.json`;
    fs.writeFileSync(tempFilePath, JSON.stringify(data));

    fs.unlinkSync(req.file.path); // Clean up XLSX

    res.json({
      course_name: courseName,
      exam_period: period,
      grade_count: gradeCount,
      temp_file: tempFilePath
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to preview file' });
  }
});

// CONFIRM route
app.post('/upload-confirm', express.json(), async (req, res) => {
  try {
    const { temp_file, grading_type } = req.body;
    const fileData = JSON.parse(fs.readFileSync(temp_file, 'utf-8'));
    const gradingStatus = grading_type === 'final' ? 'closed' : 'open';

    for (const row of fileData) {
      const userId = row['Αριθμός Μητρώου'];
      const fullName = row['Ονοματεπώνυμο'];
      const email = row['Ακαδημαϊκό E-mail'];
      const period = row['Περίοδος δήλωσης'];
      const courseField = row['Τμήμα Τάξης'];
      const totalGrade = row['Βαθμολογία'];

      const match = courseField?.match(/(.+)\((\d+)\)/);
      if (!match) continue;

      const courseName = match[1].trim();
      const courseId = match[2].trim();

      const questionGrades = {
        Q1: row['Q01'], Q2: row['Q02'], Q3: row['Q03'], Q4: row['Q04'],
        Q5: row['Q05'], Q6: row['Q06'], Q7: row['Q07'], Q8: row['Q08'],
        Q9: row['Q09'], Q10: row['Q10']
      };

      await db.query(`
        INSERT INTO users (user_id, name, email, role)
        VALUES (?, ?, ?, 'student')
        ON DUPLICATE KEY UPDATE email = VALUES(email)
      `, [userId, fullName, email]);

      await db.query(`
        INSERT INTO courses (course_id, name)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name)
      `, [courseId, courseName]);

      await db.query(`
        INSERT INTO grades (student_id, course_id, exam_period, total_grade, question_grades, grading_status)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE total_grade = VALUES(total_grade), question_grades = VALUES(question_grades), grading_status = ?
      `, [userId, courseId, period, totalGrade, JSON.stringify(questionGrades), gradingStatus, gradingStatus]);
    }

    fs.unlinkSync(temp_file);
    res.json({ message: '✅ Grades confirmed and stored' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Confirm upload failed' });
  }
});

app.listen(PORT, async () => {
  await testDB();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
