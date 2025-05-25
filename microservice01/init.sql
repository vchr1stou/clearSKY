CREATE DATABASE IF NOT EXISTS grading_system;
USE grading_system;

CREATE TABLE courses (
  course_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role ENUM('student', 'instructor') NOT NULL,
  email varchar(255)
);

CREATE TABLE user_courses (
  user_id INT,
  course_id INT,
  PRIMARY KEY (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

CREATE TABLE grades (
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
USE grading_system;


CREATE TABLE IF NOT EXISTS requests (
  request_id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  student_id INT NOT NULL,
  instructor_id INT NOT NULL,
  request_message VARCHAR(1024),
  respond_message VARCHAR(1024),
  review_status ENUM('pending', 'finished', 'none') NOT NULL DEFAULT 'none',

  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (instructor_id) REFERENCES users(user_id) ON DELETE CASCADE
);
