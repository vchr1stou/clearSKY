const { db } = require('./dbConfig.js');

async function testConnection() {
  try {
    console.log('🔍 Testing database connection and configuration...');
    
    // Test 1: Basic connection
    const [result1] = await db.query('SELECT 1 as test');
    console.log('✅ Basic connection test:', result1);
    
    // Test 2: Check current database
    const [result2] = await db.query('SELECT DATABASE() as current_db');
    console.log('✅ Current database:', result2[0].current_db);
    
    // Test 3: Check table structure
    const [columns] = await db.query('DESCRIBE grades');
    console.log('✅ Grades table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });
    
    // Test 4: Try a simple insert with the exact same data
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
    
    console.log('\n🧪 Testing exact query from API...');
    console.log('SQL Query:', sqlQuery);
    console.log('Parameters:', [testData.studentId, testData.courseId, testData.examPeriod, testData.numTotalGrade, JSON.stringify(testData.questionGrades), testData.dbGradingStatus, testData.institutionID]);
    
    const result = await db.query(sqlQuery, [testData.studentId, testData.courseId, testData.examPeriod, testData.numTotalGrade, JSON.stringify(testData.questionGrades), testData.dbGradingStatus, testData.institutionID]);
    
    console.log('✅ Query executed successfully!');
    console.log('Result:', result);
    
    // Test 5: Check if there are any active transactions or sessions
    const [sessions] = await db.query('SHOW PROCESSLIST');
    console.log('\n🔍 Active database sessions:', sessions.length);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await db.end();
  }
}

testConnection(); 