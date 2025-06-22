const xlsx = require('xlsx');
const fs = require('fs');
const { transformExamPeriodInData } = require('./examPeriodTransformer.js');

// Define the exact required columns for the basic Greek format
const REQUIRED_COLUMNS = [
  'Αριθμός Μητρώου',       // Student ID
  'Ονοματεπώνυμο',         // Full Name
  'Ακαδημαϊκό E-mail',     // Academic Email
  'Περίοδος δήλωσης',      // Declaration Period
  'Τμήμα Τάξης',           // Course Class
  'Κλίμακα βαθμολόγησης',  // Grading Scale
  'Βαθμολογία'             // Total Grade
];

// Optional question columns (Q01-Q10)
const QUESTION_COLUMNS = ['Q01', 'Q02', 'Q03', 'Q04', 'Q05', 'Q06', 'Q07', 'Q08', 'Q09', 'Q10'];

// Optional weight columns (W01-W10)
const WEIGHT_COLUMNS = ['W01', 'W02', 'W03', 'W04', 'W05', 'W06', 'W07', 'W08', 'W09', 'W10'];

// Course format pattern: "Course Name (CourseID)"
const COURSE_FORMAT = /(.+)\((\d+)\)/;

/**
 * Detects the format type based on column presence
 * @param {Array} actualColumns - Actual columns in the Excel file
 * @returns {Object} Format information
 */
function detectFormat(actualColumns) {
  const hasQuestions = QUESTION_COLUMNS.some(col => actualColumns.includes(col));
  const hasWeights = WEIGHT_COLUMNS.some(col => actualColumns.includes(col));
  
  // Find the range of question columns present
  const presentQuestions = QUESTION_COLUMNS.filter(col => actualColumns.includes(col));
  const presentWeights = WEIGHT_COLUMNS.filter(col => actualColumns.includes(col));
  
  return {
    isDetailed: hasQuestions,
    hasWeights: hasWeights,
    questionColumns: presentQuestions,
    weightColumns: presentWeights,
    questionCount: presentQuestions.length
  };
}

/**
 * Validates Excel structure with exact column requirements
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

  const firstRow = data[0];
  const actualColumns = Object.keys(firstRow);

  // Check if all required columns are present
  const missingColumns = REQUIRED_COLUMNS.filter(col => !actualColumns.includes(col));
  const extraColumns = actualColumns.filter(col => 
    !REQUIRED_COLUMNS.includes(col) && 
    !QUESTION_COLUMNS.includes(col) && 
    !WEIGHT_COLUMNS.includes(col)
  );

  if (missingColumns.length > 0) {
    return {
      isValid: false,
      error: `Missing required columns: ${missingColumns.join(', ')}`,
      details: {
        missingColumns,
        actualColumns,
        requiredColumns: REQUIRED_COLUMNS
      }
    };
  }

  // Detect format
  const formatInfo = detectFormat(actualColumns);

  // Validate question and weight columns consistency
  if (formatInfo.isDetailed) {
    // Check if weights match questions
    if (formatInfo.hasWeights && formatInfo.questionCount !== formatInfo.weightColumns.length) {
      return {
        isValid: false,
        error: `Mismatch between question columns (${formatInfo.questionCount}) and weight columns (${formatInfo.weightColumns.length})`,
        details: {
          questionColumns: formatInfo.questionColumns,
          weightColumns: formatInfo.weightColumns
        }
      };
    }

    // Check if question columns are sequential
    const expectedQuestions = QUESTION_COLUMNS.slice(0, formatInfo.questionCount);
    if (!arraysEqual(formatInfo.questionColumns, expectedQuestions)) {
      return {
        isValid: false,
        error: `Question columns must be sequential starting from Q01. Found: ${formatInfo.questionColumns.join(', ')}`,
        details: {
          expectedQuestions,
          actualQuestions: formatInfo.questionColumns
        }
      };
    }

    // Check if weight columns are sequential (if present)
    if (formatInfo.hasWeights) {
      const expectedWeights = WEIGHT_COLUMNS.slice(0, formatInfo.questionCount);
      if (!arraysEqual(formatInfo.weightColumns, expectedWeights)) {
        return {
          isValid: false,
          error: `Weight columns must be sequential starting from W01. Found: ${formatInfo.weightColumns.join(', ')}`,
          details: {
            expectedWeights,
            actualWeights: formatInfo.weightColumns
          }
        };
      }
    }
  }

  // Validate course format in first row
  const courseField = firstRow['Τμήμα Τάξης'];
  if (!courseField) {
    return {
      isValid: false,
      error: 'Course field (Τμήμα Τάξης) is empty in first row'
    };
  }

  const courseMatch = courseField.toString().match(COURSE_FORMAT);
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
      validationErrors.push(`Row ${rowNumber}: Missing Period (Περίοδος δήλωσης)`);
    }
    
    if (!row['Βαθμολογία']) {
      validationErrors.push(`Row ${rowNumber}: Missing Total Grade (Βαθμολογία)`);
    }
    
    // Validate total grade is numeric
    const totalGrade = row['Βαθμολογία'];
    if (totalGrade !== undefined && totalGrade !== null && totalGrade !== '') {
      const numGrade = parseFloat(totalGrade);
      if (isNaN(numGrade) || numGrade < 0 || numGrade > 10) {
        validationErrors.push(`Row ${rowNumber}: Invalid grade for Βαθμολογία: "${totalGrade}". Must be a number between 0-10`);
      }
    }

    // Validate question grades if present
    if (formatInfo.isDetailed) {
      let questionSum = 0;
      let weightSum = 0;
      
      for (const questionCol of formatInfo.questionColumns) {
        const questionGrade = row[questionCol];
        if (questionGrade !== undefined && questionGrade !== null && questionGrade !== '') {
          const numGrade = parseFloat(questionGrade);
          if (isNaN(numGrade) || numGrade < 0 || numGrade > 10) {
            validationErrors.push(`Row ${rowNumber}: Invalid grade for ${questionCol}: "${questionGrade}". Must be a number between 0-10`);
          } else {
            questionSum += numGrade;
          }
        }
      }

      // Validate weight values if present
      if (formatInfo.hasWeights) {
        for (const weightCol of formatInfo.weightColumns) {
          const weightValue = row[weightCol];
          if (weightValue !== undefined && weightValue !== null && weightValue !== '') {
            const numWeight = parseFloat(weightValue);
            if (isNaN(numWeight) || numWeight < 0 || numWeight > 100) {
              validationErrors.push(`Row ${rowNumber}: Invalid weight for ${weightCol}: "${weightValue}". Must be a number between 0-100`);
            } else {
              weightSum += numWeight;
            }
          }
        }
      }

      // Validate sum of question grades doesn't exceed 100
      if (questionSum > 100) {
        validationErrors.push(`Row ${rowNumber}: Sum of question grades (${questionSum.toFixed(1)}) exceeds 100. Must be 100 or less.`);
      }

      // Validate sum of weights equals 100 (if weights are present)
      if (formatInfo.hasWeights && Math.abs(weightSum - 100) > 0.01) {
        validationErrors.push(`Row ${rowNumber}: Sum of weights (${weightSum.toFixed(1)}) must equal 100. Current sum: ${weightSum.toFixed(1)}`);
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
    columns: actualColumns,
    extraColumns: extraColumns,
    format: formatInfo
  };
}

/**
 * Helper function to compare arrays
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @returns {boolean} True if arrays are equal
 */
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((val, index) => val === arr2[index]);
}

/**
 * Extracts course information from validated data
 * @param {Array} data - Validated Excel data
 * @returns {Object} Course information
 */
function extractCourseInfo(data) {
  const firstRow = data[0];
  const courseField = firstRow['Τμήμα Τάξης'];
  const match = courseField.toString().match(COURSE_FORMAT);
  
  // The exam period should already be transformed by parseExcelFile, but ensure it's correct
  const examPeriod = firstRow['Περίοδος δήλωσης'];
  
  return {
    courseName: match[1].trim(),
    courseId: match[2].trim(),
    examPeriod: examPeriod
  };
}

/**
 * Parses Excel file
 * @param {string} filePath - Path to Excel file
 * @returns {Object} Parsed data
 */
function parseExcelFile(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  
  // Parse starting from row 2 (skip header)
  const data = xlsx.utils.sheet_to_json(sheet, { range: 2, raw: false, defval: "" });
  
  if (data.length === 0) {
    throw new Error('No data found in Excel file');
  }
  
  // Transform exam periods from Greek to English format
  const transformedData = transformExamPeriodInData(data);
  
  return { data: transformedData, range: 2 };
}

module.exports = {
  validateExcelStructure,
  extractCourseInfo,
  parseExcelFile,
  REQUIRED_COLUMNS,
  QUESTION_COLUMNS,
  WEIGHT_COLUMNS,
  detectFormat
}; 