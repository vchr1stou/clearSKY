const { db } = require('./dbConfig.js');

async function checkAndFixSchema() {
  try {
    console.log('🔍 Checking database schema...');
    
    // Check current table structure
    const [columns] = await db.query('DESCRIBE grades');
    console.log('Current grades table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });
    
    // Check for triggers
    console.log('\n🔍 Checking for triggers...');
    const [triggers] = await db.query('SHOW TRIGGERS WHERE `Table` = "grades"');
    if (triggers.length > 0) {
      console.log('Triggers found:');
      triggers.forEach(trigger => {
        console.log(`  - ${trigger.Trigger} (${trigger.Timing} ${trigger.Event})`);
      });
    } else {
      console.log('No triggers found on grades table');
    }
    
    // Check for foreign key constraints
    console.log('\n🔍 Checking for foreign key constraints...');
    const [constraints] = await db.query(`
      SELECT 
        CONSTRAINT_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM information_schema.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = 'grading_system' 
      AND TABLE_NAME = 'grades' 
      AND REFERENCED_TABLE_NAME IS NOT NULL
    `);
    
    if (constraints.length > 0) {
      console.log('Foreign key constraints found:');
      constraints.forEach(constraint => {
        console.log(`  - ${constraint.CONSTRAINT_NAME}: ${constraint.COLUMN_NAME} -> ${constraint.REFERENCED_TABLE_NAME}.${constraint.REFERENCED_COLUMN_NAME}`);
      });
    } else {
      console.log('No foreign key constraints found');
    }
    
    // Check if we need to fix the schema
    const hasStudentID = columns.some(col => col.Field === 'studentID');
    const hasStudentId = columns.some(col => col.Field === 'student_id');
    
    if (hasStudentId && !hasStudentID) {
      console.log('⚠️ Table uses snake_case, need to fix to camelCase');
      console.log('Please run the following SQL commands:');
      console.log(`
        ALTER TABLE grades CHANGE student_id studentID INT NOT NULL;
        ALTER TABLE grades CHANGE course_id courseID INT NOT NULL;
        ALTER TABLE grades CHANGE grade_id gradeID INT AUTO_INCREMENT PRIMARY KEY;
        ALTER TABLE grades CHANGE institution_id institutionID INT;
        ALTER TABLE grades CHANGE request_id requestID INT AUTO_INCREMENT PRIMARY KEY;
        ALTER TABLE grades CHANGE instructor_id instructorID INT NOT NULL;
      `);
    } else if (hasStudentID) {
      console.log('✅ Table structure is correct (camelCase)');
    } else {
      console.log('❓ Unknown table structure');
    }
    
  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    await db.end();
  }
}

checkAndFixSchema(); 