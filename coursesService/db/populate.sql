use coursesdb;

INSERT INTO courses (courseID, instructorID, name, institutionID) VALUES
(3205, 1, 'Software Engineering', 1),
(3204, 1, 'HCI', 1),
(3201, 1, 'Maths', 1),
(3200, 1, 'Algorithms', 1),
(102, 2, 'Algorithms', 1),
(201, 3, 'Computer Vision', 2);

INSERT INTO grades (courseID, studentID, question_grades, exam_period, grading_status, total_grade, institutionID) VALUES
-- Course 101 (Databases), Institution 1
(101, 1001, '{"q1": 5, "q2": 4.5, "q3": 3.5}', 'Spring 2025 ', 'Closed', 13.0, 1),
(101, 1002, '{"q1": 4, "q2": 3.5, "q3": 4}', 'Spring 2025 ', 'Closed', 11.5, 1),
(101, 1003, '{"q1": 5, "q2": 5, "q3": 4.5}', 'Spring 2025 ', 'Open', NULL, 1),

-- Course 102 (Algorithms), Institution 1
(102, 1001, '{"q1": 4, "q2": 4, "q3": 3}', 'Spring 2025', 'Closed', 11.0, 1),
(102, 1002, '{"q1": 5, "q2": 5, "q3": 5}', 'Spring 2025', 'Closed', 15.0, 1),

-- Course 201 (Computer Vision), Institution 2
(201, 2001, '{"q1": 5, "q2": 4.5}', 'Winter 2025', 'Closed', 9.5, 2),
(201, 2002, '{"q1": 4.5, "q2": 4.5}', 'Winter 2025', 'Open', NULL, 2);
