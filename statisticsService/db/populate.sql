USE statisticsdb;

-- Courses
INSERT INTO courses (course_id, instructor_id, name, institution_id) VALUES
(3205, 7, 'Software Engineering', 1),
(102, 8, 'Algorithms', 1),
(201, 9, 'Computer Vision', 2);

-- Grades with total_grade up to 10.0, even for 'open' statuses
INSERT INTO grades (courseID, studentID, question_grades, exam_period, grading_status, total_grade, institutionID, instructorID) VALUES
-- Course 101 (Databases), Institution 1, Instructor 7 (Prof. John Doe)
(3205, 3184623, '{"q1": 3.0, "q2": 3.5, "q3": 2.5}', '2025 Spring', 'closed', 9.0, 1, 7),
(3205, 1002, '{"q1": 3.0, "q2": 2.5, "q3": 2.0}', '2025 Spring', 'closed', 7.5, 1, 7),
(3205, 1003, '{"q1": 3.5, "q2": 3.0, "q3": 3.0}', '2025 Spring', 'open', 9.5, 1, 7),
(3205, 1004, '{"q1": 2.0, "q2": 2.5, "q3": 1.5}', '2025 Spring', 'closed', 6.0, 1, 7),
(3205, 1005, '{"q1": 3.3, "q2": 3.3, "q3": 3.4}', '2025 Spring', 'closed', 10.0, 1, 7),

-- Course 102 (Algorithms), Institution 1, Instructor 8 (Prof. Maria Lopez)
(102, 1001, '{"q1": 3.0, "q2": 3.0, "q3": 2.0}', '2025 Spring', 'closed', 8.0, 1, 8),
(102, 1002, '{"q1": 3.5, "q2": 3.5, "q3": 3.0}', '2025 Spring', 'closed', 10.0, 1, 8),
(102, 1003, '{"q1": 2.5, "q2": 2.0, "q3": 2.0}', '2025 Spring', 'closed', 6.5, 1, 8),
(102, 1004, '{"q1": 3.0, "q2": 3.0, "q3": 3.0}', '2025 Spring', 'open', 9.0, 1, 8),

-- Course 201 (Computer Vision), Institution 2, Instructor 9 (Dr. Ahmed Nouri)
(201, 2001, '{"q1": 5.0, "q2": 4.5}', '2025 Winter', 'closed', 9.5, 2, 9),
(201, 2002, '{"q1": 4.5, "q2": 4.5}', '2025 Winter', 'open', 9.0, 2, 9),
(201, 2003, '{"q1": 4.0, "q2": 4.0}', '2025 Winter', 'closed', 8.0, 2, 9),
(201, 2004, '{"q1": 3.0, "q2": 3.0}', '2025 Winter', 'closed', 6.0, 2, 9),
(201, 2005, '{"q1": 4.0, "q2": 5.0}', '2025 Winter', 'closed', 9.0, 2, 9);

INSERT INTO statistics (
    course_id, institution_id, course_name, exam_period, avg_grade,
    grade_distribution, total_students, pass_rate, fail_rate,
    highest_grade, lowest_grade
) VALUES (
             3205, 1, 'Software Engineering', '2025 Spring', 8.13,
             '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":1,"7":1,"8":0,"9":2,"10":0}', 4,
             100.00, 0.00, 10.0, 6.0
         );

INSERT INTO statistics (
    course_id, institution_id, course_name, exam_period, avg_grade,
    grade_distribution, total_students, pass_rate, fail_rate,
    highest_grade, lowest_grade
) VALUES (
             102, 1, 'Algorithms', '2025 Spring', 8.17,
             '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":1,"7":0,"8":1,"9":0,"10":1}', 3,
             100.00, 0.00, 10.0, 6.5
         );

INSERT INTO statistics (
    course_id, institution_id, course_name, exam_period, avg_grade,
    grade_distribution, total_students, pass_rate, fail_rate,
    highest_grade, lowest_grade
) VALUES (
             201, 2, 'Computer Vision', '2025 Winter', 8.13,
             '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":1,"7":1,"8":1,"9":1,"10":0}', 4,
             100.00, 0.00, 9.5, 6.0
         );

use statisticsdb;