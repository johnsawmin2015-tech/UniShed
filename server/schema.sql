CREATE DATABASE IF NOT EXISTS unisched_db;
USE unisched_db;

CREATE TABLE IF NOT EXISTS class_sessions (
    id VARCHAR(36) PRIMARY KEY,
    subjectCode VARCHAR(20) NOT NULL,
    subjectName VARCHAR(255) NOT NULL,
    professor VARCHAR(255) NOT NULL,
    room VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    section CHAR(1) NOT NULL,
    day VARCHAR(10) NOT NULL,
    startMinutes INT NOT NULL,
    durationMinutes INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Create an index for faster queries by year/section
CREATE INDEX idx_year_section ON class_sessions (year, section);