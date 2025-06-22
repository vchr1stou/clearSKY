# Grading Service API Documentation

## Overview
This microservice provides a comprehensive grading system with Excel file upload capabilities, supporting both basic and detailed Greek formats.

## Authentication
All endpoints (except health check and template) require Bearer token authentication:
```
Authorization: Bearer <your-jwt-token>
```

## Supported Excel Formats

The service accepts Excel files with the following column structures:

### Basic Greek Format (Case 1)
Required columns in exact order:
- `Αριθμός Μητρώου` - Student ID
- `Ονοματεπώνυμο` - Full Name  
- `Ακαδημαϊκό E-mail` - Academic Email
- `Περίοδος δήλωσης` - Declaration Period
- `Τμήμα Τάξης` - Course Class (format: "Course Name (CourseID)")
- `Κλίμακα βαθμολόγησης` - Grading Scale
- `Βαθμολογία` - Total Grade

### Detailed Greek Format (Case 2)
**Same basic columns as Case 1, plus optional:**
- `Q01`, `Q02`, `Q03`, `Q04`, `Q05`, `Q06`, `Q07`, `Q08`, `Q09`, `Q10` - Individual question grades
- `W01`, `W02`, `W03`, `W04`, `W05`, `W06`, `W07`, `W08`, `W09`, `W10` - Question weights

**Rules for Q and W columns:**
- Q columns must be sequential starting from Q01 (e.g., Q01-Q05 is valid, Q01-Q03-Q05 is not)
- W columns must match the number of Q columns (if Q01-Q05, then W01-W05)
- Both Q and W columns are optional but must follow these rules if present
- Q grades must be numbers between 0-10
- W weights must be numbers between 0-100
- **Sum of all W weights must equal exactly 100**
- **Sum of all Q grades in a row must not exceed 100**

### Exam Period Format Transformation
The service automatically transforms exam period formats from Greek to English:
- `YYYY-YYYY ΧΕΙΜ YYYY` → `YYYY-YY Winter` (e.g., "2024-2025 ΧΕΙΜ 2024" → "2024-25 Winter")
- `YYYY-YYYY ΕΑΡ YYYY` → `YYYY-YY Spring` (e.g., "2024-2025 ΕΑΡ 2024" → "2024-25 Spring")
- `YYYY-YY ΧΕΙΜ` → `YYYY-YY Winter` (e.g., "2024-25 ΧΕΙΜ" → "2024-25 Winter")
- `YYYY-YY ΕΑΡ` → `YYYY-YY Spring` (e.g., "2024-25 ΕΑΡ" → "2024-25 Spring")
- Other formats remain unchanged

This transformation is applied during Excel parsing and affects all data processing endpoints.

## API Endpoints

### Health Check
```
GET /health
```
Returns service status (no authentication required).

### Get Excel Template
```
GET /api/excel-template
```
Returns the required Excel column structure (no authentication required).

**Response:**
```json
{
  "success": true,
  "data": {
    "requiredColumns": [
      "Αριθμός Μητρώου",
      "Ονοματεπώνυμο", 
      "Ακαδημαϊκό E-mail",
      "Περίοδος δήλωσης",
      "Τμήμα Τάξης",
      "Κλίμακα βαθμολόγησης",
      "Βαθμολογία"
    ],
    "optionalColumns": {
      "questionColumns": ["Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07", "Q08", "Q09", "Q10"],
      "weightColumns": ["W01", "W02", "W03", "W04", "W05", "W06", "W07", "W08", "W09", "W10"]
    },
    "description": "Supports both basic and detailed formats",
    "format": {
      "courseFormat": "Course Name (CourseID) - e.g., \"Computer Science (101)\"",
      "gradeRange": "Q grades: 0-10, W weights: 0-100, Total grade: 0-10",
      "requiredFields": "All basic columns are required",
      "optionalFields": "Q and W columns are optional but must be sequential if present",
      "validationRules": "Sum of W weights must equal 100, Sum of Q grades must not exceed 100"
    },
    "examples": {
      "basicFormat": {
        "description": "Basic format - total grades only",
        "headers": [...],
        "sampleRow": {...}
      },
      "detailedFormat": {
        "description": "Detailed format - with individual question grades",
        "headers": [...],
        "sampleRow": {...}
      },
      "detailedWithWeights": {
        "description": "Detailed format - with question grades and weights",
        "headers": [...],
        "sampleRow": {...}
      }
    }
  }
}
```

### Debug Excel Structure
```
POST /api/debug-excel-structure
Content-Type: multipart/form-data
```
Analyzes uploaded Excel file structure to help debug format issues (no authentication required).

**Request Body:**
- `file` - Excel file (.xlsx)

**Response:**
```json
{
  "success": true,
  "data": {
    "sheetInfo": { ... },
    "parsingResults": { ... },
    "expectedGreekColumns": [...]
  }
}
```

### Preview Excel Upload
```
POST /api/grades/upload/preview
Content-Type: multipart/form-data
Authorization: Bearer <token>
```
Uploads and previews Excel file without saving to database.

**Request Body:**
- `file` - Excel file (.xlsx)

**Response:**
```json
{
  "success": true,
  "data": {
    "course_name": "Computer Science",
    "course_id": "101",
    "exam_period": "2024-01",
    "grade_count": 25,
    "temp_file": "uploads/preview-1234567890.json",
    "parse_range": 2,
    "format": {
      "isDetailed": true,
      "hasWeights": false,
      "questionCount": 5,
      "questionColumns": ["Q01", "Q02", "Q03", "Q04", "Q05"],
      "weightColumns": []
    },
    "validation": {
      "columns": [...],
      "extraColumns": [...],
      "totalRows": 25,
      "isValid": true
    }
  }
}
```

### Confirm Excel Upload
```
POST /api/grades/upload/confirm
Authorization: Bearer <token>
Content-Type: application/json
```
Processes and stores the grades from the previewed Excel file.

**Request Body:**
```json
{
  "temp_file": "uploads/preview-1234567890.json",
  "grading_status": "open"
}
```

**Parameters:**
- `temp_file` (required): Path to the temporary file created by preview
- `grading_status` (optional): Status for the grades ("open" or "closed"). Defaults to "open"

**JWT Token Requirements:**
The JWT token must contain the user's `institutionID` or `institution_id` field to associate grades with the correct institution.

**Response:**
```json
{
  "success": true,
  "message": "Grades processed successfully",
  "data": {
    "processed_count": 25,
    "total_count": 25,
    "errors": [],
    "format_used": {
      "isDetailed": true,
      "hasWeights": false,
      "questionCount": 5,
      "questionColumns": ["Q01", "Q02", "Q03", "Q04", "Q05"],
      "weightColumns": []
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to confirm upload",
  "message": "Detailed error message"
}
```

**What the API does:**
1. **Reads the temp file** created by the preview API
2. **Extracts course info** from the first row (courseID and exam_period)
3. **Gets institutionID** from the authenticated user's JWT token
4. **Maps grading_status** from frontend selector:
   - "Initial" → "open"
   - "Final" → "closed"
5. **Processes each row** with proper field mapping:
   - `studentID` ← `Αριθμός Μητρώου` (from each row)
   - `courseID` ← extracted from `Τμήμα Τάξης` (same for all rows)
   - `total_grade` ← `Βαθμολογία` (from each row)
   - `question_grades` ← JSON format of Q01-Q10 (if detailed format)
   - `exam_period` ← from first row (same for all rows)
   - `grading_status` ← mapped from frontend selector
   - `institutionID` ← from authenticated user
6. **Inserts/Updates grades** in the database using UPSERT logic
7. **Returns processing results** with success count and any errors
8. **Cleans up** the temporary file after processing

**Database Operations:**
- Uses `INSERT ... ON DUPLICATE KEY UPDATE` for upsert functionality
- Stores question grades as JSON in the `question_grades` field
- Updates `updated_at` timestamp for modified records
- Maintains unique constraint on (studentID, courseID, exam_period)
- Includes `institutionID` from authenticated user

### Get Student Grades
```
GET /api/grades/student/:studentId
Authorization: Bearer <token>
```
Returns all grades for a specific student.

### Get Course Grades
```
GET /api/grades/student/:studentId/course/:courseId
Authorization: Bearer <token>
```
Returns grades for a specific student and course.

### Create Grade
```
POST /api/grades
Authorization: Bearer <token>
```
Creates a new grade entry.

**Request Body:**
```json
{
  "student_id": "12345",
  "course_id": "101",
  "exam_period": "2024-01",
  "total_grade": 8.5,
  "question_grades": {
    "Q1": 8, "Q2": 7, "Q3": 9, "Q4": 6, "Q5": 8,
    "Q6": null, "Q7": null, "Q8": null, "Q9": null, "Q10": null
  },
  "grading_status": "completed"
}
```

### Update Grade
```
PUT /api/grades/:gradeId
Authorization: Bearer <token>
```
Updates an existing grade entry.

### Delete Grade
```
DELETE /api/grades/:gradeId
Authorization: Bearer <token>
```
Deletes a grade entry.

### Get Student Review Requests
```
GET /api/requests/student/:studentId
Authorization: Bearer <token>
```
Returns all review requests for a student.

### Get Instructor Review Requests
```
GET /api/requests/instructor/:instructorId
Authorization: Bearer <token>
```
Returns all review requests for an instructor.

### Create Review Request
```
POST /api/requests
Authorization: Bearer <token>
```
Creates a new review request.

**Request Body:**
```json
{
  "student_id": "12345",
  "instructor_id": "INSTR001",
  "course_id": "101",
  "request_message": "Requesting review of grade"
}
```

### Update Review Request
```
PUT /api/requests/:requestId
Authorization: Bearer <token>
```
Updates a review request.

### Delete Review Request
```
DELETE /api/requests/:requestId
Authorization: Bearer <token>
```
Deletes a review request.

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message",
  "details": {
    // Additional error details when available
  }
}
```

## File Upload Guidelines

1. **Supported Formats**: Excel files (.xlsx) only
2. **Column Requirements**: 
   - Basic columns must match exactly
   - Q columns must be sequential (Q01, Q02, Q03...)
   - W columns must match Q columns (W01, W02, W03...)
3. **Course Format**: Course class must follow format "Course Name (CourseID)" - e.g., "Computer Science (101)"
4. **Grade Validation**: 
   - Q grades must be numbers between 0-10
   - W weights must be numbers between 0-100
   - Total grade must be a number between 0-10
   - **Sum of all W weights must equal exactly 100**
   - **Sum of all Q grades in a row must not exceed 100**
5. **Required Fields**: All basic fields are required
6. **Two-Step Process**: Upload → Preview → Confirm for data safety

## Database Schema

### Grades Table
- `grade_id` (Primary Key)
- `student_id`
- `course_id`
- `exam_period`
- `total_grade`
- `question_grades` (JSON - stores Q1-Q10 grades)
- `grading_status`
- `created_at`
- `updated_at`

### Requests Table
- `request_id` (Primary Key)
- `student_id`
- `instructor_id`
- `course_id`
- `request_message`
- `respond_message`
- `review_status`
- `created_at`
- `updated_at`

## Example Usage

### Upload Excel File with Postman

1. **Preview Upload**:
   ```
   POST http://localhost:3003/api/grades/upload/preview
   Headers: Authorization: Bearer <your-token>
   Body: form-data
   Key: file, Value: [select your Excel file]
   ```

2. **Confirm Upload**:
   ```
   POST http://localhost:3003/api/grades/upload/confirm
   Headers: 
     Authorization: Bearer <your-token>
     Content-Type: application/json
   Body:
   {
     "temp_file": "uploads/preview-1234567890.json",
     "grading_status": "completed"
   }
   ```

## Format Examples

### Basic Format Example
| Αριθμός Μητρώου | Ονοματεπώνυμο | Ακαδημαϊκό E-mail | Περίοδος δήλωσης | Τμήμα Τάξης | Κλίμακα βαθμολόγησης | Βαθμολογία |
|------------------|---------------|-------------------|-------------------|-------------|---------------------|------------|
| 12345 | John Doe | john@university.edu | 2024-01 | Computer Science (101) | 0-10 | 8.5 |

### Detailed Format Example (Q01-Q05)
| Αριθμός Μητρώου | Ονοματεπώνυμο | Ακαδημαϊκό E-mail | Περίοδος δήλωσης | Τμήμα Τάξης | Κλίμακα βαθμολόγησης | Βαθμολογία | Q01 | Q02 | Q03 | Q04 | Q05 |
|------------------|---------------|-------------------|-------------------|-------------|---------------------|------------|-----|-----|-----|-----|-----|
| 12345 | John Doe | john@university.edu | 2024-01 | Computer Science (101) | 0-10 | 8.5 | 8 | 7 | 9 | 6 | 8 |

**Validation**: Sum of Q grades = 38 (within 100 limit) ✅

### Detailed Format with Weights Example (Q01-Q03, W01-W03)
| Αριθμός Μητρώου | Ονοματεπώνυμο | Ακαδημαϊκό E-mail | Περίοδος δήλωσης | Τμήμα Τάξης | Κλίμακα βαθμολόγησης | Βαθμολογία | Q01 | Q02 | Q03 | W01 | W02 | W03 |
|------------------|---------------|-------------------|-------------------|-------------|---------------------|------------|-----|-----|-----|-----|-----|-----|
| 12345 | John Doe | john@university.edu | 2024-01 | Computer Science (101) | 0-10 | 8.5 | 8 | 7 | 9 | 30 | 30 | 40 |

**Validation**: Sum of Q grades = 24 (within 100 limit) ✅, Sum of W weights = 100 ✅