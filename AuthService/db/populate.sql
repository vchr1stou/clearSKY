use authdb;

INSERT INTO `User` (studentID, FullName, email, telephone, password, role, institutionID) VALUES
(1001, 'Alice Johnson', 'alice.johnson@example.com', '123-456-7890', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'STUDENT', 1),
(1002, 'Bob Smith', 'bob.smith@example.com', '123-555-7890', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'STUDENT', 1),
(1003, 'Carol Lee', 'carol.lee@example.com', '123-666-7890', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'STUDENT', 1),
(2001, 'David Kim', 'david.kim@example.com', '987-654-3210', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'STUDENT', 2),
(2002, 'Eva Green', 'eva.green@example.com', '987-000-3210', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'STUDENT', 2),
(03184623, 'Eleni Karagiannis', 'el84623@mail.ntua.gr', '6977777777', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'STUDENT', 1);

INSERT INTO `User` (studentID, FullName, email, telephone, password, role, institutionID) VALUES
(NULL, 'Prof. John Doe', 'john.doe@example.com', '111-222-3333', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'INSTRUCTOR', 1),
(NULL, 'Prof. Maria Lopez', 'maria.lopez@example.com', '222-333-4444', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'INSTRUCTOR', 1),
(NULL, 'Dr. Ahmed Nouri', 'ahmed.nouri@example.com', '333-444-5555', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'INSTRUCTOR', 2);

INSERT INTO `User` (studentID, FullName, email, telephone, password, role, institutionID) VALUES
(NULL, 'Alice Smith', 'alice.smith@university.edu', '555-111-2222', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'INSTITUTION_REPRESENTATIVE', 1),
(NULL, 'Bob Johnson', 'bob.johnson@college.edu', '555-222-3333', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'INSTITUTION_REPRESENTATIVE', 2),
(NULL, 'Carol Lee', 'carol.lee@institute.edu', '555-333-4444', '$2b$10$dbH2AHfhq7fItaLdiyzldeZj/e1nKbLGVOPMRC5MKULXO55GWK.9q', 'INSTITUTION_REPRESENTATIVE', 3);
