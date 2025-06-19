CREATE DATABASE IF NOT EXISTS coursesdb;
USE coursesdb;

CREATE TABLE IF NOT EXISTS user_courses (
    user_id INT,
    course_id INT,
    `name` VARCHAR(20) NOT NULL,
    institution_id INT NOT NULL,
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
    );


CREATE TABLE IF NOT EXISTS grades (
    grade_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    student_id INT,
    question_grades JSON,
    exam_period varchar(50),
    grading_status enum('open', 'closed'),
    total_grade DECIMAL(5,2),
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

USE coursesdb;