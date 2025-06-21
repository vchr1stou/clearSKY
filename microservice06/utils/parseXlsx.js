const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

function parseGradesFile(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  const courseName = sheet['A1']?.v || 'Unknown Course';
  const examPeriod = sheet['B1']?.v || 'Unknown Period';

  const parsedGrades = data.map(row => ({
    student_id: row['Student ID'],
    total_grade: row['Total'],
    question_grades: Object.fromEntries(Object.entries(row).filter(([key]) => key.startsWith('Q')))
  }));

  return { courseName, examPeriod, parsedGrades };
}

module.exports = parseGradesFile;
