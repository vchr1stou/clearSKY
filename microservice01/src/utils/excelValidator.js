// Excel Column Validation Utility
const { transformExamPeriodInData } = require('./examPeriodTransformer.js');

// Define the exact required columns in order
const REQUIRED_COLUMNS = [
  'Τμήμα Τάξης',           // Course Class
  'Περίοδος δήλωσης',      // Declaration Period
  'Αριθμός Μητρώου',       // Student ID
  'Βαθμολογία',            // Total Grade
  'Q01', 'Q02', 'Q03', 'Q04', 'Q05',  // Question grades 1-5
  'Q06', 'Q07', 'Q08', 'Q09', 'Q10'   // Question grades 6-10
];

/**
 * Validates Excel file structure
 * @param {Array} data - Parsed Excel data
 * @returns {Object} Validation result
 */
function validateExcelStructure(data) {
  if (!data || data.length === 0) {
    return {
      isValid: false,
      error: 'Empty file - no data found'
    };
  }

  // Get headers from first row
  const firstRow = data[0];
  const actualColumns = Object.keys(firstRow);

  // Check if all required columns are present
  const missingColumns = REQUIRED_COLUMNS.filter(col => !actualColumns.includes(col));
  
  if (missingColumns.length > 0) {
    return {
      isValid: false,
      error: `Missing required columns: ${missingColumns.join(', ')}`,
      missingColumns: missingColumns,
      expectedColumns: REQUIRED_COLUMNS,
      actualColumns: actualColumns
    };
  }

  // Check for extra columns (strict validation)
  const extraColumns = actualColumns.filter(col => !REQUIRED_COLUMNS.includes(col));
  
  if (extraColumns.length > 0) {
    return {
      isValid: false,
      error: `Extra columns found: ${extraColumns.join(', ')}. Only the exact required columns are allowed.`,
      extraColumns: extraColumns,
      expectedColumns: REQUIRED_COLUMNS,
      actualColumns: actualColumns
    };
  }

  // Validate course format in first row
  const courseField = firstRow['Τμήμα Τάξης'];
  if (!courseField) {
    return {
      isValid: false,
      error: 'Course field (Τμήμα Τάξης) is empty in first row'
    };
  }

  const courseMatch = courseField.toString().match(/(.+)\((\d+)\)/);
  if (!courseMatch) {
    return {
      isValid: false,
      error: `Invalid course format in Τμήμα Τάξης: "${courseField}". Expected format: "Course Name (CourseID)"`
    };
  }

  // Validate data types and required fields
  const validationErrors = [];
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNumber = i + 2; // Excel rows start from 2 (header is row 1)
    
    // Check required fields
    if (!row['Αριθμός Μητρώου']) {
      validationErrors.push(`Row ${rowNumber}: Missing Student ID (Αριθμός Μητρώου)`);
    }
    
    if (!row['Περίοδος δήλωσης']) {
      validationErrors.push(`Row ${rowNumber}: Missing Declaration Period (Περίοδος δήλωσης)`);
    }
    
    if (!row['Βαθμολογία']) {
      validationErrors.push(`Row ${rowNumber}: Missing Total Grade (Βαθμολογία)`);
    }
    
    // Validate question grades are numeric
    for (let q = 1; q <= 10; q++) {
      const questionKey = `Q${q.toString().padStart(2, '0')}`;
      const grade = row[questionKey];
      
      if (grade !== undefined && grade !== null && grade !== '') {
        const numGrade = parseFloat(grade);
        if (isNaN(numGrade) || numGrade < 0 || numGrade > 10) {
          validationErrors.push(`Row ${rowNumber}: Invalid grade for ${questionKey}: "${grade}". Must be a number between 0-10`);
        }
      }
    }
  }

  if (validationErrors.length > 0) {
    return {
      isValid: false,
      error: 'Data validation errors found',
      validationErrors: validationErrors
    };
  }

  return {
    isValid: true,
    courseName: courseMatch[1].trim(),
    courseId: courseMatch[2].trim(),
    totalRows: data.length,
    columns: actualColumns
  };
}

/**
 * Extracts course information from validated data
 * @param {Array} data - Validated Excel data
 * @returns {Object} Course information
 */
function extractCourseInfo(data) {
  const firstRow = data[0];
  const courseField = firstRow['Τμήμα Τάξης'];
  const match = courseField.toString().match(/(.+)\((\d+)\)/);
  
  return {
    courseName: match[1].trim(),
    courseId: match[2].trim(),
    examPeriod: firstRow['Περίοδος δήλωσης']
  };
}

module.exports = {
  validateExcelStructure,
  extractCourseInfo,
  REQUIRED_COLUMNS
}; 