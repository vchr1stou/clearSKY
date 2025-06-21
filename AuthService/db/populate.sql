-- This script populates the User table with sample data for testing purposes.
USE authdb;

INSERT INTO `User` (studentID, FullName, email, telephone, password, role, institutionID) VALUES
-- Institution 1 students
(1001, 'Alice Smith', 'alice1001@example.com', '123-456-1001', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'STUDENT', 1),
(1002, 'Bob Johnson', 'bob1002@example.com', '123-456-1002', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'STUDENT', 1),
(1003, 'Charlie Lee', 'charlie1003@example.com', '123-456-1003', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'STUDENT', 1),
(1004, 'Diana Patel', 'diana1004@example.com', '123-456-1004', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'STUDENT', 1),
(1005, 'Ethan Brown', 'ethan1005@example.com', '123-456-1005', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'STUDENT', 1),

-- Institution 2 students
(2001, 'Fiona Green', 'fiona2001@example.com', '123-456-2001', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'STUDENT', 2),
(2002, 'George Harris', 'george2002@example.com', '123-456-2002', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'STUDENT', 2),
(2003, 'Hannah Kim', 'hannah2003@example.com', '123-456-2003', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'STUDENT', 2),
(2004, 'Isaac Moore', 'isaac2004@example.com', '123-456-2004', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'STUDENT', 2),
(2005, 'Julia Nguyen', 'julia2005@example.com', '123-456-2005', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'STUDENT', 2);


INSERT INTO `User` (studentID, FullName, email, telephone, password, role, institutionID) VALUES
(NULL, 'Prof. John Doe', 'john.doe@example.com', '111-222-3333', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'INSTRUCTOR', 1),
(NULL, 'Prof. Maria Lopez', 'maria.lopez@example.com', '222-333-4444', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'INSTRUCTOR', 1),
(NULL, 'Dr. Ahmed Nouri', 'ahmed.nouri@example.com', '333-444-5555', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'INSTRUCTOR', 2);

INSERT INTO `User` (studentID, FullName, email, telephone, password, role, institutionID) VALUES
(NULL, 'Alice Smith', 'alice.smith@university.edu', '555-111-2222', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'INSTITUTION_REPRESENTATIVE', 1),
(NULL, 'Bob Johnson', 'bob.johnson@college.edu', '555-222-3333', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'INSTITUTION_REPRESENTATIVE', 2),
(NULL, 'Carol Lee', 'carol.lee@institute.edu', '555-333-4444', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'INSTITUTION_REPRESENTATIVE', 3);
