-- Create the database
CREATE DATABASE IF NOT EXISTS etherwave_emporium_db;
USE etherwave_emporium_db;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO users (username, email, password, full_name) VALUES
('john_doe', 'john@example.com', 'hashed_password_1', 'John Doe'),
('jane_smith', 'jane@example.com', 'hashed_password_2', 'Jane Smith');

-- Note: In a real application, you would never store plain text passwords.
-- Always use a secure hashing algorithm like bcrypt.
