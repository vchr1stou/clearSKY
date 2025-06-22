# Courses Service Database Setup

This guide explains how to set up the database for the Courses Service with RabbitMQ integration.

## Quick Setup

### Option 1: Automatic Setup (Recommended)

The service will automatically set up the database schema on startup. Just run:

```bash
npm start
```

### Option 2: Manual Setup

If you prefer to set up the database manually:

```bash
# Run the database setup script
node setup-database.js
```

## Database Schema

The service uses the following database schema:

### Tables

1. **courses** - Stores course information
2. **grades** - Stores student grades (synced from grading service)

### Grades Table Structure

```sql
CREATE TABLE grades (
    gradeID INT AUTO_INCREMENT PRIMARY KEY,
    courseID INT NOT NULL,
    studentID INT NOT NULL,
    question_grades JSON,
    exam_period VARCHAR(50),
    grading_status ENUM('open', 'closed'),
    total_grade DECIMAL(5,2),
    institutionID INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_grade (studentID, courseID, exam_period)
);
```

**Note**: This structure matches the grading service database exactly for seamless integration.

## Environment Variables

Set these environment variables for database connection:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_PORT=3306
```

## RabbitMQ Integration

The service automatically:

1. Connects to RabbitMQ on startup
2. Listens for grade sync messages
3. Processes and stores grades in the database
4. Handles duplicate grades (upsert logic)

### RabbitMQ Configuration

```bash
RABBITMQ_URL=amqp://localhost:5672
```

## Troubleshooting

### "Unknown column" Error

This error occurs if the database doesn't have the correct column structure. The service will automatically:

1. Detect the missing or incorrect columns
2. Run migration to update the table structure
3. Log the migration process

To fix this permanently, run the database setup:

```bash
node setup-database.js
```

**Common column name issues:**
- `grade_id` → `gradeID`
- `course_id` → `courseID` 
- `student_id` → `studentID`
- `institution_id` → `institutionID`

### Database Connection Issues

1. Ensure MySQL is running
2. Check environment variables
3. Verify database credentials
4. Make sure the `coursesdb` database exists

### RabbitMQ Connection Issues

1. Ensure RabbitMQ is running
2. Check `RABBITMQ_URL` environment variable
3. Verify network connectivity

## Manual Database Commands

If you need to run database commands manually:

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE IF NOT EXISTS coursesdb;
USE coursesdb;

-- Run the init.sql script
source db/init.sql;

-- Run migration if needed
source db/migrate.sql;
```

## Verification

To verify the setup is working:

1. Start the service
2. Check logs for successful database connection
3. Check logs for successful RabbitMQ connection
4. Send a test grade from the grading service
5. Verify the grade appears in the courses database 