CREATE DATABASE IF NOT EXISTS coursesdb;
USE coursesdb;

DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS courses;

CREATE TABLE courses (
    courseID INT NOT NULL,
    instructorID INT,
    `name` VARCHAR(20) NOT NULL,
    institutionID INT NOT NULL,
    PRIMARY KEY (institutionID, courseID)
    );


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

USE coursesdb;