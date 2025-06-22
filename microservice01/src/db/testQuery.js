const { db } = require('./dbConfig.js');

async function testQuery() {
  try {
    console.log('🧪 Testing the exact query from confirm API...');
    
    const testData = {
      studentId: '03184623',
      courseId: '101',
      examPeriod: '2024-01',
      numTotalGrade: 8.5,
      questionGrades: { Q1: 8, Q2: 7, Q3: 9, Q4: 6, Q5: 8 },
      dbGradingStatus: 'open',
      institutionID: 123
    };
    
    const sqlQuery = `
      INSERT INTO grades (studentID, courseID, exam_period, total_grade, question_grades, grading_status, institutionID)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        total_grade = VALUES(total_grade), 
        question_grades = VALUES(question_grades), 
        grading_status = VALUES(grading_status),
        institutionID = VALUES(institutionID),
        updated_at = CURRENT_TIMESTAMP
    `;
    
    console.log('SQL Query:', sqlQuery);
    console.log('Parameters:', [testData.studentId, testData.courseId, testData.examPeriod, testData.numTotalGrade, JSON.stringify(testData.questionGrades), testData.dbGradingStatus, testData.institutionID]);
    
    const result = await db.query(sqlQuery, [testData.studentId, testData.courseId, testData.examPeriod, testData.numTotalGrade, JSON.stringify(testData.questionGrades), testData.dbGradingStatus, testData.institutionID]);
    
    console.log('✅ Query executed successfully!');
    console.log('Result:', result);
    
  } catch (error) {
    console.error('❌ Query failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await db.end();
  }
}

testQuery(); 