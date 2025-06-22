# Grading Service

A microservice for managing student grades and grade review requests. This service handles all grading-related operations including grade storage, retrieval, bulk uploads, and review requests.

## Features

- **Grade Management**: CRUD operations for student grades
- **Bulk Grade Upload**: Excel file processing for mass grade imports
- **Grade Review Requests**: Handle student requests for grade reviews
- **RESTful API**: Clean, consistent API endpoints

## Database Schema

The service maintains two main tables:
- `grades`: Stores student grades with question-level details
- `requests`: Manages grade review requests between students and instructors

Note: User and course data are managed by other microservices.

## Project Structure

```
microservice01/
├── src/
│   ├── app.js              # Main application file
│   ├── db/                 # Database configuration and scripts
│   │   ├── dbConfig.js     # Database connection
│   │   └── init.sql        # Database initialization
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   └── config/             # Configuration files
├── package.json
└── README.md
```

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up MySQL database**:
   ```bash
   mysql -u root -p < src/db/init.sql
   ```

3. **Configure environment variables** (optional):
   Create a `.env` file in the root directory:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=grading_system
   PORT=3003
   ```

4. **Start the service**:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Health Check
- `GET /health` - Service health status

### Grades
- `GET /api/grades/student/:studentId` - Get all grades for a student
- `GET /api/grades/student/:studentId/course/:courseId` - Get grades for specific course/student
- `GET /api/grades/course/:courseId` - Get all grades for a course
- `POST /api/grades` - Create or update a grade
- `PUT /api/grades/:gradeId` - Update a specific grade
- `DELETE /api/grades/:gradeId` - Delete a grade

### Bulk Upload
- `POST /api/grades/upload/preview` - Preview uploaded Excel file
- `POST /api/grades/upload/confirm` - Confirm and process uploaded grades

### Requests
- `GET /api/requests/student/:studentId` - Get requests for a student
- `GET /api/requests/instructor/:instructorId` - Get requests for an instructor
- `POST /api/requests` - Create a new review request
- `PUT /api/requests/:requestId` - Update a request (instructor response)

## Environment Variables

- `DB_HOST` - Database host (default: localhost)
- `DB_USER` - Database username (default: root)
- `DB_PASS` - Database password (default: empty)
- `DB_NAME` - Database name (default: grading_system)
- `DB_PORT` - Database port (default: 3306)
- `PORT` - Service port (default: 3003)