CREATE DATABASE IF NOT EXISTS statisticsdb;
USE statisticsdb;



CREATE TABLE IF NOT EXISTS courses (
    course_id INT NOT NULL,
    instructor_id INT,
    `name` VARCHAR(20) NOT NULL,
    institution_id INT NOT NULL,
    PRIMARY KEY (institution_id, course_id)
);


CREATE TABLE IF NOT EXISTS grades (
    gradeID INT AUTO_INCREMENT PRIMARY KEY,
    courseID INT NOT NULL,
    studentID INT NOT NULL ,
    question_grades JSON,
    exam_period varchar(50),
    grading_status enum('open', 'closed'),
    total_grade DECIMAL(5,2),
    institutionID INT NOT NULL,
    instructorID INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institutionID, courseID) REFERENCES courses(institution_id, course_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS statistics (
    statistics_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    institution_id INT NOT NULL,
    course_name VARCHAR(45) NOT NULL,
    exam_period VARCHAR(25) NOT NULL,
    avg_grade DECIMAL(4,2) NOT NULL,
    grade_distribution JSON NOT NULL,
    total_students INT NOT NULL,
    pass_rate DECIMAL(5,2) NOT NULL,
    fail_rate DECIMAL(5,2) NOT NULL,
    highest_grade DECIMAL(4,2) NOT NULL,
    lowest_grade DECIMAL(4,2) NOT NULL,
    FOREIGN KEY (institution_id, course_id) REFERENCES courses(institution_id, course_id) ON DELETE CASCADE
);

use statisticsdb;