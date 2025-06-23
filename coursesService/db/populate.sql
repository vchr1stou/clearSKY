use coursesdb;
-- Courses
INSERT INTO courses (courseID, instructorID, name, institutionID) VALUES
(3205, 7, 'Software Engineering', 1),
(102, 8, 'Algorithms', 1),
(201, 9, 'Computer Vision', 2);

-- Grades with total_grade up to 10.0, even for 'open' statuses
INSERT INTO grades (courseID, studentID, question_grades, exam_period, grading_status, total_grade, institutionID) VALUES
-- Course 101 (Databases), Institution 1
(3205, 3184623, '{"q1": 3.0, "q2": 3.5, "q3": 2.5}', '2025 Spring', 'closed', 9.0, 1),
(3205, 1002, '{"q1": 3.0, "q2": 2.5, "q3": 2.0}', '2025 Spring', 'closed', 7.5, 1),
(3205, 1003, '{"q1": 3.5, "q2": 3.0, "q3": 3.0}', '2025 Spring', 'open', 9.5, 1),
(3205, 1004, '{"q1": 2.0, "q2": 2.5, "q3": 1.5}', '2025 Spring', 'closed', 6.0, 1),
(3205, 1005, '{"q1": 3.3, "q2": 3.3, "q3": 3.4}', '2025 Spring', 'closed', 10.0, 1),

-- Course 102 (Algorithms), Institution 1
(102, 1001, '{"q1": 3.0, "q2": 3.0, "q3": 2.0}', '2025 Spring', 'closed', 8.0, 1),
(102, 1002, '{"q1": 3.5, "q2": 3.5, "q3": 3.0}', '2025 Spring', 'closed', 10.0, 1),
(102, 1003, '{"q1": 2.5, "q2": 2.0, "q3": 2.0}', '2025 Spring', 'closed', 6.5, 1),
(102, 1004, '{"q1": 3.0, "q2": 3.0, "q3": 3.0}', '2025 Spring', 'open', 9.0, 1),

-- Course 201 (Computer Vision), Institution 2
(201, 2001, '{"q1": 5.0, "q2": 4.5}', '2025 Winter', 'closed', 9.5, 2),
(201, 2002, '{"q1": 4.5, "q2": 4.5}', '2025 Winter', 'open', 9.0, 2),
(201, 2003, '{"q1": 4.0, "q2": 4.0}', '2025 Winter', 'closed', 8.0, 2),
(201, 2004, '{"q1": 3.0, "q2": 3.0}', '2025 Winter', 'closed', 6.0, 2),
(201, 2005, '{"q1": 4.0, "q2": 5.0}', '2025 Winter', 'closed', 9.0, 2);
