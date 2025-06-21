CREATE DATABASE IF NOT EXISTS coursesdb;
USE coursesdb;

DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS courses;

CREATE TABLE courses (
    course_id INT NOT NULL,
    instructor_id INT,
    `name` VARCHAR(20) NOT NULL,
    institution_id INT NOT NULL,
    PRIMARY KEY (institution_id, course_id)
    );


CREATE TABLE grades (
    grade_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    student_id INT,
    question_grades JSON,
    exam_period varchar(50),
    grading_status enum('open', 'closed'),
    total_grade DECIMAL(5,2),
    institution_id INT NOT NULL,
    FOREIGN KEY (institution_id, course_id) REFERENCES courses(institution_id, course_id) ON DELETE CASCADE
    );

USE coursesdb;