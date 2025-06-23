const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const cors = require('cors');
const dbConfig = require('./db/dbConfig.js');
const { verifyToken } = require('./middleware/auth.js');
const rabbitMQService = require('./services/rabbitmqService.js');
const { 
  validateExcelStructure, 
  extractCourseInfo, 
  parseExcelFile,
  REQUIRED_COLUMNS,
  QUESTION_COLUMNS,
  WEIGHT_COLUMNS
} = require('./utils/flexibleExcelParser.js');
const { transformExamPeriod } = require('./utils/examPeriodTransformer.js');

// Course format pattern: "Course Name (CourseID)"
const COURSE_FORMAT = /(.+)\((\d+)\)/;

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Health check endpoint (no authentication required)
app.get('/health', (req, res) => {
  dbConfig.db.query('SELECT 1')
    .then(() => {
      res.json({ status: 'OK', service: 'grading-service', database: 'connected' });
    })
    .catch((err) => {
      res.status(503).json({ 
        status: 'error', 
        service: 'grading-service', 
        database: 'disconnected',
        error: err.message
      });
    });
});

// Get required Excel column structure (no authentication required)
app.get('/api/excel-template', (req, res) => {
  res.json({
    success: true,
    data: {
      requiredColumns: REQUIRED_COLUMNS,
      optionalColumns: {
        questionColumns: QUESTION_COLUMNS,
        weightColumns: WEIGHT_COLUMNS
      },
      description: 'Supports both basic and detailed formats',
      format: {
        courseFormat: 'Course Name (CourseID) - e.g., "Computer Science (101)"',
        gradeRange: 'Grades must be numbers between 0-10',
        requiredFields: 'All basic columns are required',
        optionalFields: 'Q and W columns are optional but must be sequential if present'
      },
      examples: {
        basicFormat: {
          description: 'Basic format - total grades only',
          headers: REQUIRED_COLUMNS,
          sampleRow: {
            'Αριθμός Μητρώου': '12345',
            'Ονοματεπώνυμο': 'John Doe',
            'Ακαδημαϊκό E-mail': 'john.doe@university.edu',
            'Περίοδος δήλωσης': '2024-25 Winter',
            'Τμήμα Τάξης': 'Computer Science (101)',
            'Κλίμακα βαθμολόγησης': '0-10',
            'Βαθμολογία': '8.5'
          }
        },
        detailedFormat: {
          description: 'Detailed format - with individual question grades',
          headers: [...REQUIRED_COLUMNS, ...QUESTION_COLUMNS.slice(0, 5)],
          sampleRow: {
            'Αριθμός Μητρώου': '12345',
            'Ονοματεπώνυμο': 'John Doe',
            'Ακαδημαϊκό E-mail': 'john.doe@university.edu',
            'Περίοδος δήλωσης': '2024-25 Spring',
            'Τμήμα Τάξης': 'Computer Science (101)',
            'Κλίμακα βαθμολόγησης': '0-10',
            'Βαθμολογία': '8.5',
            'Q01': '8', 'Q02': '7', 'Q03': '9', 'Q04': '6', 'Q05': '8'
          }
        },
        detailedWithWeights: {
          description: 'Detailed format - with question grades and weights',
          headers: [...REQUIRED_COLUMNS, ...QUESTION_COLUMNS.slice(0, 3), ...WEIGHT_COLUMNS.slice(0, 3)],
          sampleRow: {
            'Αριθμός Μητρώου': '12345',
            'Ονοματεπώνυμο': 'John Doe',
            'Ακαδημαϊκό E-mail': 'john.doe@university.edu',
            'Περίοδος δήλωσης': '2024-25 Winter',
            'Τμήμα Τάξης': 'Computer Science (101)',
            'Κλίμακα βαθμολόγησης': '0-10',
            'Βαθμολογία': '8.5',
            'Q01': '8', 'Q02': '7', 'Q03': '9',
            'W01': '30', 'W02': '30', 'W03': '40'
          }
        }
      }
    }
  });
});

// Debug endpoint to analyze Excel file structure (no authentication required)
app.post('/api/debug-excel-structure', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Get the range of the sheet
    const range = xlsx.utils.decode_range(sheet['!ref']);
    
    // Try different parsing strategies
    const results = {};
    
    // Strategy 1: Start from row 2 (skip header)
    try {
      const data1 = xlsx.utils.sheet_to_json(sheet, { range: 2 });
      results.strategy1 = {
        range: 2,
        dataLength: data1.length,
        columns: data1.length > 0 ? Object.keys(data1[0]) : [],
        firstRow: data1.length > 0 ? data1[0] : null
      };
    } catch (e) {
      results.strategy1 = { error: e.message };
    }
    
    // Strategy 2: Start from row 1 (include header)
    try {
      const data2 = xlsx.utils.sheet_to_json(sheet, { range: 1 });
      results.strategy2 = {
        range: 1,
        dataLength: data2.length,
        columns: data2.length > 0 ? Object.keys(data2[0]) : [],
        firstRow: data2.length > 0 ? data2[0] : null
      };
    } catch (e) {
      results.strategy2 = { error: e.message };
    }
    
    // Strategy 3: Auto-detect
    try {
      const data3 = xlsx.utils.sheet_to_json(sheet);
      results.strategy3 = {
        range: 'auto',
        dataLength: data3.length,
        columns: data3.length > 0 ? Object.keys(data3[0]) : [],
        firstRow: data3.length > 0 ? data3[0] : null
      };
    } catch (e) {
      results.strategy3 = { error: e.message };
    }

    // Get raw sheet info
    const sheetInfo = {
      sheetName: workbook.SheetNames[0],
      range: sheet['!ref'],
      decodedRange: range,
      cellCount: Object.keys(sheet).length - 1 // Exclude !ref
    };

    fs.unlinkSync(req.file.path); // Clean up

    res.json({
      success: true,
      data: {
        sheetInfo,
        parsingResults: results,
        expectedGreekColumns: REQUIRED_COLUMNS.GREEK_FORMAT.requiredColumns
      }
    });
  } catch (err) {
    console.error('Error analyzing Excel structure:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze Excel structure',
      message: err.message
    });
  }
});

// Debug endpoint to check table structure
app.get('/api/debug/table-structure', verifyToken, async (req, res) => {
  try {
    const [columns] = await dbConfig.db.query('DESCRIBE grades');
    const [requestsColumns] = await dbConfig.db.query('DESCRIBE requests');
    
    res.json({
      success: true,
      data: {
        grades_table: columns,
        requests_table: requestsColumns
      }
    });
  } catch (error) {
    console.error('Error checking table structure:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check table structure',
      message: error.message
    });
  }
});

// ===== GRADES API ENDPOINTS =====

// Get all grades for a student
app.get('/api/grades/student/:studentId', verifyToken, async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const [grades] = await dbConfig.db.query(`
      SELECT g.*, c.name as course_name 
      FROM grades g
      LEFT JOIN courses c ON g.courseID = c.courseID
      WHERE g.studentID = ?
      ORDER BY g.created_at DESC
    `, [studentId]);

    res.json({
      success: true,
      data: grades
    });
  } catch (err) {
    console.error('Error fetching student grades:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch student grades',
      message: err.message
    });
  }
});

// Get grades for a specific student and course
app.get('/api/grades/student/:studentId/course/:courseId', verifyToken, async (req, res) => {
  const studentId = req.params.studentId;
  const courseId = req.params.courseId;

  try {
    const [grades] = await dbConfig.db.query(`
      SELECT g.*, c.name as course_name 
      FROM grades g
      LEFT JOIN courses c ON g.courseID = c.courseID
      WHERE g.studentID = ? AND g.courseID = ?
      ORDER BY g.created_at DESC
    `, [studentId, courseId]);

    res.json({
      success: true,
      data: grades
    });
  } catch (err) {
    console.error('Error fetching student course grades:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch student course grades',
      message: err.message
    });
  }
});

// Get all grades (for instructors/admins)
app.get('/api/grades', verifyToken, async (req, res) => {
  try {
    const [grades] = await dbConfig.db.query(`
      SELECT 
        g.gradeID,
        g.studentID,
        g.courseID,
        g.exam_period,
        g.total_grade,
        g.question_grades,
        g.grading_status,
        g.institutionID,
        g.created_at,
        g.updated_at
      FROM grades g
      ORDER BY g.studentID, g.created_at DESC
    `);

    res.json({
      success: true,
      data: grades
    });
  } catch (err) {
    console.error('Error fetching grades:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch grades',
      message: err.message
    });
  }
});

// Get all grades for an instructor (new endpoint)
app.get('/api/grades/instructor/:instructorId', verifyToken, async (req, res) => {
  const instructorId = req.params.instructorId;

  try {
    // This query assumes an instructorID column exists in the grades table.
    // We will need to add it.
    const [courses] = await dbConfig.db.query(`
      SELECT DISTINCT 
        g.courseID, 
        c.name as course_name, 
        g.exam_period
      FROM grades g
      LEFT JOIN courses c ON g.courseID = c.courseID
      WHERE g.instructorID = ?
      ORDER BY c.name, g.exam_period
    `, [instructorId]);

    res.json({
      success: true,
      data: courses
    });
  } catch (err) {
    console.error('Error fetching instructor grades:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch instructor grades',
      message: err.message
    });
  }
});

// Create a new grade
app.post('/api/grades', verifyToken, async (req, res) => {
  const { studentID, courseID, exam_period, total_grade, question_grades, grading_status } = req.body;

  try {
    const [result] = await dbConfig.db.query(`
      INSERT INTO grades (studentID, courseID, exam_period, total_grade, question_grades, grading_status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [studentID, courseID, exam_period, total_grade, JSON.stringify(question_grades), grading_status]);

    // Send grade data to RabbitMQ for courses service sync
    try {
      const gradeDataForSync = {
        student_id: studentID,
        course_id: parseInt(courseID),
        course_ref_id: parseInt(courseID), // Use same as course_id for now
        question_grades: question_grades || {},
        exam_period: exam_period,
        grading_status: grading_status || 'open',
        total_grade: parseFloat(total_grade),
        institution_id: req.user?.institutionID || req.user?.institution_id || 1,
        instructor_id: req.user?.sub
      };
      
      await rabbitMQService.sendGradeData(gradeDataForSync);
      console.log(`✅ Grade data sent to RabbitMQ for student ${studentID}`);
    } catch (rabbitError) {
      console.error(`❌ Failed to send grade data to RabbitMQ for student ${studentID}:`, rabbitError.message);
      // Don't fail the entire process if RabbitMQ fails
      // The grade is already saved in the database
    }

    res.status(201).json({
      success: true,
      message: 'Grade created successfully',
      grade_id: result.insertId
    });
  } catch (err) {
    console.error('Error creating grade:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create grade',
      message: err.message
    });
  }
});

// Update a grade
app.put('/api/grades/:gradeId', verifyToken, async (req, res) => {
  const gradeId = req.params.gradeId;
  const { total_grade, question_grades, grading_status } = req.body;

  try {
    // First get the existing grade to get student and course info
    const [existingGrade] = await dbConfig.db.query(`
      SELECT studentID, courseID, exam_period, institutionID FROM grades WHERE gradeID = ?
    `, [gradeId]);

    if (existingGrade.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Grade not found'
      });
    }

    const grade = existingGrade[0];

    await dbConfig.db.query(`
      UPDATE grades 
      SET total_grade = ?, question_grades = ?, grading_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE gradeID = ?
    `, [total_grade, JSON.stringify(question_grades), grading_status, gradeId]);

    // Send updated grade data to RabbitMQ for courses service sync
    try {
      const gradeDataForSync = {
        student_id: grade.studentID,
        course_id: parseInt(grade.courseID),
        course_ref_id: parseInt(grade.courseID), // Use same as course_id for now
        question_grades: question_grades || {},
        exam_period: grade.exam_period,
        grading_status: grading_status || 'open',
        total_grade: parseFloat(total_grade),
        institution_id: grade.institutionID || req.user?.institutionID || req.user?.institution_id || 1,
        instructor_id: req.user?.sub
      };
      
      await rabbitMQService.sendGradeData(gradeDataForSync);
      console.log(`✅ Updated grade data sent to RabbitMQ for student ${grade.studentID}`);
    } catch (rabbitError) {
      console.error(`❌ Failed to send updated grade data to RabbitMQ for student ${grade.studentID}:`, rabbitError.message);
      // Don't fail the entire process if RabbitMQ fails
      // The grade is already updated in the database
    }

    res.json({
      success: true,
      message: 'Grade updated successfully'
    });
  } catch (err) {
    console.error('Error updating grade:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update grade',
      message: err.message 
    });
  }
});

// Delete a grade
app.delete('/api/grades/:gradeId', verifyToken, async (req, res) => {
  const gradeId = req.params.gradeId;

  try {
    await dbConfig.db.query('DELETE FROM grades WHERE gradeID = ?', [gradeId]);

    res.json({
      success: true,
      message: 'Grade deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting grade:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete grade',
      message: err.message 
    });
  }
});

// ===== BULK UPLOAD API ENDPOINTS =====

// Preview uploaded grades file
app.post('/api/grades/upload/preview', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Parse Excel file
    const parseResult = parseExcelFile(req.file.path);
    const data = parseResult.data;

    // Log first row values for debugging
    if (data && data.length > 0) {
      console.log('\n=== FIRST ROW COLUMN VALUES ===');
      const firstRow = data[0];
      const columns = Object.keys(firstRow);
      
      columns.forEach((column, index) => {
        console.log(`Column ${index + 1} (${column}): "${firstRow[column]}"`);
      });
      console.log('=== END FIRST ROW ===\n');
    }

    // Validate Excel structure
    const validation = validateExcelStructure(data);

    if (!validation.isValid) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        error: validation.error,
        details: {
          missingColumns: validation.details?.missingColumns,
          extraColumns: validation.details?.extraColumns,
          expectedColumns: validation.details?.requiredColumns,
          actualColumns: validation.details?.actualColumns,
          validationErrors: validation.validationErrors
        }
      });
    }

    // Extract course information from validated data
    const courseInfo = extractCourseInfo(data);

    const tempFilePath = `uploads/preview-${Date.now()}.json`;
    fs.writeFileSync(tempFilePath, JSON.stringify({
      data: data,
      parseRange: parseResult.range,
      format: validation.format
    }));

    fs.unlinkSync(req.file.path); // Clean up XLSX

    res.json({
      success: true,
      data: {
        course_name: courseInfo.courseName,
        course_id: courseInfo.courseId,
        exam_period: courseInfo.examPeriod,
        grade_count: validation.totalRows,
        temp_file: tempFilePath,
        parse_range: parseResult.range,
        format: {
          isDetailed: validation.format.isDetailed,
          hasWeights: validation.format.hasWeights,
          questionCount: validation.format.questionCount,
          questionColumns: validation.format.questionColumns,
          weightColumns: validation.format.weightColumns
        },
        validation: {
          columns: validation.columns,
          extraColumns: validation.extraColumns,
          totalRows: validation.totalRows,
          isValid: true
        }
      }
    });
  } catch (err) {
    console.error('Error previewing file:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to preview file',
      message: err.message
    });
  }
});

// Confirm and process uploaded grades
app.post('/api/grades/upload/confirm', verifyToken, express.json(), async (req, res) => {
  try {
    const { temp_file, grading_status = 'open' } = req.body;
    
    if (!temp_file || !fs.existsSync(temp_file)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid temp file'
      });
    }

    const fileData = JSON.parse(fs.readFileSync(temp_file, 'utf-8'));
    const data = fileData.data;
    const format = fileData.format; // Get format information from temp file
    
    // Get course info from the first row (same for all rows)
    const firstRow = data[0];
    const courseField = firstRow['Τμήμα Τάξης'];
    const courseMatch = courseField.toString().match(COURSE_FORMAT);
    if (!courseMatch) {
      return res.status(400).json({
        success: false,
        error: `Invalid course format: "${courseField}". Expected format: "Course Name (CourseID)"`
      });
    }
    const courseId = courseMatch[2].trim();
    const examPeriod = firstRow['Περίοδος δήλωσης'];
    
    // Get institutionID from the authenticated user
    const institutionID = req.user?.institutionID || req.user?.institution_id;
    if (!institutionID) {
      return res.status(400).json({
        success: false,
        error: 'User institution ID not found'
      });
    }

    // Get instructorID from the authenticated user
    const instructorID = req.user?.sub;
    if (!instructorID) {
      return res.status(400).json({
        success: false,
        error: 'User instructor ID not found in token'
      });
    }

    // Map grading_status from frontend selector
    const dbGradingStatus = grading_status === 'Final' ? 'closed' : 'open';
    
    let processedCount = 0;
    const errors = [];

    console.log('Processing grades with format:', format);
    console.log('Course ID:', courseId, 'Exam Period:', examPeriod, 'Institution ID:', institutionID);

    for (const row of data) {
      try {
        console.log(`\n--- Processing row for student ${row['Αριθμός Μητρώου']} ---`);
        
        const studentId = row['Αριθμός Μητρώου'];
        const totalGrade = row['Βαθμολογία'];

        // Validate required fields
        if (!studentId || totalGrade === undefined) {
          errors.push(`Row missing required fields for student ${studentId || 'unknown'}`);
          continue;
        }

        console.log('Student ID:', studentId);
        console.log('Total Grade:', totalGrade);

        // Handle question grades based on format
        const questionGrades = {};
        
        if (format && format.isDetailed && format.questionColumns) {
          // Detailed format - extract question grades from detected columns
          for (const questionCol of format.questionColumns) {
            const questionNumber = questionCol.replace('Q', '');
            questionGrades[`Q${questionNumber}`] = row[questionCol] !== undefined && row[questionCol] !== '' ? parseFloat(row[questionCol]) : null;
          }
          
          // Fill remaining Q columns with null
          for (let q = 1; q <= 10; q++) {
            if (!questionGrades[`Q${q}`]) {
              questionGrades[`Q${q}`] = null;
            }
          }
        } else {
          // Basic format - store empty question grades
          for (let q = 1; q <= 10; q++) {
            questionGrades[`Q${q}`] = null;
          }
        }

        console.log('Question Grades:', questionGrades);

        // Validate total grade
        const numTotalGrade = parseFloat(totalGrade);
        if (isNaN(numTotalGrade) || numTotalGrade < 0 || numTotalGrade > 10) {
          errors.push(`Invalid total grade for student ${studentId}: "${totalGrade}". Must be between 0-10`);
          continue;
        }

        console.log('Validated Total Grade:', numTotalGrade);

        // Insert or update grade in database
        const sqlQuery = `
          INSERT INTO grades (studentID, courseID, exam_period, total_grade, question_grades, grading_status, institutionID, instructorID)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE 
            total_grade = VALUES(total_grade), 
            question_grades = VALUES(question_grades), 
            grading_status = VALUES(grading_status),
            institutionID = VALUES(institutionID),
            instructorID = VALUES(instructorID),
            updated_at = CURRENT_TIMESTAMP
        `;
        
        console.log('Executing SQL query:', sqlQuery);
        console.log('Parameters:', [studentId, courseId, examPeriod, numTotalGrade, JSON.stringify(questionGrades), dbGradingStatus, institutionID, instructorID]);
        
        // Debug: Check actual table structure
        try {
          const [columns] = await dbConfig.db.query('DESCRIBE grades');
          console.log('Actual grades table columns:');
          columns.forEach(col => {
            console.log(`  - ${col.Field} (${col.Type})`);
          });
        } catch (descError) {
          console.error('Could not describe table:', descError.message);
        }
        
        // Test query to check table structure
        try {
          const [testResult] = await dbConfig.db.query('SELECT COUNT(*) as count FROM grades LIMIT 1');
          console.log('Test query successful, table exists');
        } catch (testError) {
          console.error('Test query failed:', testError.message);
          throw new Error(`Database table issue: ${testError.message}`);
        }
        
        console.log('About to execute main query...');
        const result = await dbConfig.db.query(sqlQuery, [studentId, courseId, examPeriod, numTotalGrade, JSON.stringify(questionGrades), dbGradingStatus, institutionID, instructorID]);
        console.log('Main query executed successfully:', result);

        // Send grade data to RabbitMQ for courses service sync
        try {
          const gradeDataForSync = {
            student_id: studentId,
            course_id: parseInt(courseId),
            course_ref_id: parseInt(courseId), // Use same as course_id for now
            question_grades: questionGrades,
            exam_period: examPeriod,
            grading_status: dbGradingStatus,
            total_grade: numTotalGrade,
            institution_id: institutionID,
            instructor_id: instructorID
          };
          
          await rabbitMQService.sendGradeData(gradeDataForSync);
          console.log(`✅ Grade data sent to RabbitMQ for student ${studentId}`);
        } catch (rabbitError) {
          console.error(`❌ Failed to send grade data to RabbitMQ for student ${studentId}:`, rabbitError.message);
          // Don't fail the entire process if RabbitMQ fails
          // The grade is already saved in the database
        }

        processedCount++;
        console.log(`Processed grade for student ${studentId}, course ${courseId}`);
      } catch (error) {
        console.error(`Error processing row for student ${row['Αριθμός Μητρώου'] || 'unknown'}:`, error);
        console.error('Full error object:', error);
        console.error(`Error processing row:`, error);
        errors.push(`Error processing student ${row['Αριθμός Μητρώου'] || 'unknown'}: ${error.message}`);
      }
    }

    // Clean up temp file
    fs.unlinkSync(temp_file);

    // Notify statistics service that batch is complete
    try {
      await rabbitMQService.sendGradeSyncComplete({ institution_id: institutionID });
    } catch (err) {
      console.error('❌ Failed to send GRADE_SYNC_COMPLETE to RabbitMQ:', err.message);
      // Don't fail the process if this fails
    }

    res.json({
      success: true,
      message: 'Grades processed successfully',
      data: {
        processed_count: processedCount,
        total_count: data.length,
        errors: errors,
        format_used: format,
        course_id: courseId,
        exam_period: examPeriod,
        grading_status: dbGradingStatus,
        institutionID: institutionID
      }
    });
  } catch (err) {
    console.error('Error confirming upload:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to confirm upload',
      message: err.message
    });
  }
});

// ===== REQUESTS API ENDPOINTS =====

// Get all requests for a student
app.get('/api/requests/student/:studentId', verifyToken, async (req, res) => {
  if (!dbConfig.db) {
    return res.status(503).json({ success: false, error: 'Database not connected' });
  }
  const studentId = req.params.studentId;

  try {
    const [requests] = await dbConfig.db.query(`
      SELECT * FROM requests 
      WHERE studentID = ?
      ORDER BY created_at DESC
    `, [studentId]);

    res.json({
      success: true,
      data: requests
    });
  } catch (err) {
    console.error('Error fetching student requests:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch student requests',
      message: err.message
    });
  }
});

// Get all requests for an instructor
app.get('/api/requests/instructor/:instructorId', verifyToken, async (req, res) => {
  if (!dbConfig.db) {
    return res.status(503).json({ success: false, error: 'Database not connected' });
  }
  const instructorId = req.params.instructorId;

  try {
    const [requests] = await dbConfig.db.query(`
      SELECT * FROM requests 
      WHERE instructorID = ?
      ORDER BY created_at DESC
    `, [instructorId]);

    res.json({
      success: true,
      data: requests
    });
  } catch (err) {
    console.error('Error fetching instructor requests:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch instructor requests',
      message: err.message
    });
  }
});

// Create a new request
app.post('/api/requests', verifyToken, async (req, res) => {
  if (!dbConfig.db) {
    return res.status(503).json({ success: false, error: 'Database not connected' });
  }
  const { courseID, studentID, instructorID, request_message, course_name, exam_period, FullName } = req.body;

  // Validate all required fields
  if (!courseID || !studentID || !instructorID) {
    return res.status(400).json({
      success: false,
      error: 'courseID, studentID, and instructorID are required'
    });
  }
  if (!course_name || !exam_period || !FullName) {
    return res.status(400).json({
      success: false,
      error: 'course_name, exam_period, and FullName are required in the request body'
    });
  }

  try {
    const [result] = await dbConfig.db.query(`
      INSERT INTO requests (courseID, studentID, instructorID, request_message, course_name, exam_period, FullName)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [courseID, studentID, instructorID, request_message, course_name, exam_period, FullName]);

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      request_id: result.insertId,
      course_name,
      exam_period,
      FullName
    });
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create request',
      message: err.message
    });
  }
});

// Update a request (for instructor response)
app.put('/api/requests/:requestId', verifyToken, async (req, res) => {
  const requestId = req.params.requestId;
  const { respond_message, review_status } = req.body;

  try {
    const [result] = await dbConfig.db.query(`
      UPDATE requests 
      SET respond_message = ?, review_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE requestID = ?
    `, [respond_message, review_status, requestId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }

    res.json({
      success: true,
      message: 'Request updated successfully'
    });
  } catch (err) {
    console.error('Error updating request:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update request',
      message: err.message
    });
  }
});

// Respond to a request
app.put('/api/requests/:requestId/respond', verifyToken, async (req, res) => {
  if (!dbConfig.db) {
    return res.status(503).json({ success: false, error: 'Database not connected' });
  }
  const requestId = req.params.requestId;
  const { respond_message, review_status } = req.body;

  // Basic validation
  if (!respond_message || !review_status) {
    return res.status(400).json({
      success: false,
      error: 'respond_message and review_status are required'
    });
  }

  try {
    const [result] = await dbConfig.db.query(`
      UPDATE requests 
      SET respond_message = ?, review_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE requestID = ?
    `, [respond_message, review_status, requestId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }

    res.json({
      success: true,
      message: 'Request updated successfully'
    });
  } catch (err) {
    console.error('Error updating request:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update request',
      message: err.message
    });
  }
});

// Update the status of a request
app.put('/api/requests/:requestId/status', verifyToken, async (req, res) => {
  if (!dbConfig.db) {
    return res.status(503).json({ success: false, error: 'Database not connected' });
  }
  const requestId = req.params.requestId;
  const { review_status } = req.body;

  // Basic validation
  if (!review_status) {
    return res.status(400).json({
      success: false,
      error: 'review_status is required'
    });
  }

  try {
    const [result] = await dbConfig.db.query(`
      UPDATE requests 
      SET review_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE requestID = ?
    `, [review_status, requestId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }

    res.json({
      success: true,
      message: 'Request status updated successfully'
    });
  } catch (err) {
    console.error('Error updating request status:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update request status',
      message: err.message
    });
  }
});

// Delete a request
app.delete('/api/requests/:requestId', verifyToken, async (req, res) => {
  if (!dbConfig.db) {
    return res.status(503).json({ success: false, error: 'Database not connected' });
  }
  const requestId = req.params.requestId;

  try {
    await dbConfig.db.query('DELETE FROM requests WHERE requestID = ?', [requestId]);

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting request:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete request',
      message: err.message
    });
  }
});

// ===== RABBITMQ EVENT HANDLERS =====
async function handleUserCreated(userData) {
  // ... existing code ...
}

// ===== SERVER STARTUP =====

async function startServer() {
  await dbConfig.connectWithRetry(); // Ensure DB is connected before starting server
  
  // Set up RabbitMQ listeners after DB connection is established
  try {
    await rabbitMQService.connect();
    await rabbitMQService.consumeUserCreated(handleUserCreated);
  } catch (error) {
    console.error('Failed to start RabbitMQ consumer:', error);
    // Decide if you want to exit or continue without RabbitMQ
    // For now, we log the error and continue
  }

  app.listen(PORT, () => {
    console.log(`🚀 Grading service running on port ${PORT}`);
    console.log('🔗 Endpoints available at http://localhost:3003');
  });
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down grading service gracefully...');
  await rabbitMQService.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down grading service gracefully...');
  await rabbitMQService.close();
  process.exit(0);
});
