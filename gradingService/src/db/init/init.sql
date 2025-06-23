CREATE DATABASE IF NOT EXISTS grading_system;
USE grading_system;

DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS requests;

DROP TABLE IF EXISTS courses;


-- Only grading-related tables since users, courses, and user_courses are handled by other microservices
CREATE TABLE IF NOT EXISTS grades (
  gradeID INT AUTO_INCREMENT PRIMARY KEY,
  courseID INT NOT NULL,
  studentID INT NOT NULL,
  question_grades JSON,
  exam_period VARCHAR(50),
  grading_status ENUM('open', 'closed'),
  total_grade DECIMAL(5,2),
  institutionID INT,
  instructorID INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_grade (studentID, courseID, exam_period)
);

CREATE TABLE IF NOT EXISTS requests (
  requestID INT AUTO_INCREMENT PRIMARY KEY,
  courseID INT NOT NULL,
  studentID INT NOT NULL,
  instructorID INT NOT NULL,
  request_message VARCHAR(1024),
  respond_message VARCHAR(1024),
  course_name VARCHAR(255),
  exam_period VARCHAR(50),
  FullName VARCHAR(255),
  review_status ENUM('pending', 'finished', 'none') NOT NULL DEFAULT 'none',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

USE grading_system; 