/**
 * Exam Period Transformer Utility
 * Transforms exam period formats from Greek to English
 */

/**
 * Transforms exam period from Greek format to English format
 * @param {string} examPeriod - The exam period string to transform
 * @returns {string} Transformed exam period
 */
function transformExamPeriod(examPeriod) {
  if (!examPeriod || typeof examPeriod !== 'string') {
    return examPeriod;
  }

  // Trim whitespace
  const trimmedPeriod = examPeriod.trim();
  
  // Pattern to match various Greek exam period formats:
  // - YYYY-YYYY ΧΕΙΜ YYYY (e.g., "2024-2025 ΧΕΙΜ 2024")
  // - YYYY-YY ΧΕΙΜ (e.g., "2024-25 ΧΕΙΜ")
  // - YYYY-YYYY ΕΑΡ YYYY (e.g., "2024-2025 ΕΑΡ 2024")
  // - YYYY-YY ΕΑΡ (e.g., "2024-25 ΕΑΡ")
  const greekPattern = /^(\d{4}-\d{2,4})\s+(ΧΕΙΜ|ΕΑΡ)(?:\s+\d{4})?$/i;
  
  const match = trimmedPeriod.match(greekPattern);
  
  if (match) {
    const yearPart = match[1]; // e.g., "2024-2025" or "2024-25"
    const seasonPart = match[2].toUpperCase(); // e.g., "ΧΕΙΜ" or "ΕΑΡ"
    
    // Transform Greek season to English
    let englishSeason;
    if (seasonPart === 'ΧΕΙΜ') {
      englishSeason = 'Winter';
    } else if (seasonPart === 'ΕΑΡ') {
      englishSeason = 'Spring';
    } else {
      // If it's not one of the expected Greek seasons, return as is
      return trimmedPeriod;
    }
    
    // Return in format "YYYY-YY Season" (normalize to short year format)
    // Extract the first year and last two digits of the second year
    const yearMatch = yearPart.match(/^(\d{4})-(\d{2,4})$/);
    if (yearMatch) {
      const firstYear = yearMatch[1]; // e.g., "2024"
      const secondYear = yearMatch[2]; // e.g., "2025" or "25"
      
      // If second year is 4 digits, take last 2 digits
      const shortSecondYear = secondYear.length === 4 ? secondYear.slice(-2) : secondYear;
      
      return `${firstYear}-${shortSecondYear} ${englishSeason}`;
    }
    
    // Fallback: return as is if year parsing fails
    return `${yearPart} ${englishSeason}`;
  }
  
  // If it doesn't match the Greek pattern, return as is
  return trimmedPeriod;
}

/**
 * Transforms exam period in a data row
 * @param {Object} row - Data row object
 * @returns {Object} Row with transformed exam period
 */
function transformExamPeriodInRow(row) {
  if (row && row['Περίοδος δήλωσης']) {
    const transformedRow = { ...row };
    transformedRow['Περίοδος δήλωσης'] = transformExamPeriod(row['Περίοδος δήλωσης']);
    return transformedRow;
  }
  return row;
}

/**
 * Transforms exam period in an array of data rows
 * @param {Array} data - Array of data rows
 * @returns {Array} Array of rows with transformed exam periods
 */
function transformExamPeriodInData(data) {
  if (!Array.isArray(data)) {
    return data;
  }
  
  return data.map(row => transformExamPeriodInRow(row));
}

module.exports = {
  transformExamPeriod,
  transformExamPeriodInRow,
  transformExamPeriodInData
}; 