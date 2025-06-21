CREATE DATABASE IF NOT EXISTS authdb;
USE authdb;

DROP TABLE IF EXISTS `User`;

CREATE TABLE IF NOT EXISTS `User` (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    FullName varchar(45) NOT NULL,
    email varchar(45) NOT NULL UNIQUE,
    telephone varchar(45),
    password varchar(70) NOT NULL,
    role ENUM('STUDENT', 'INSTRUCTOR','INSTITUTION_REPRESENTATIVE','ADMIN') NOT NULL,
    institutionID INT
    );

use authdb;