-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS FITNESS;
USE FITNESS;

-- Create 'users' table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    password VARCHAR(255),
    dob DATE,
    age INT,
    gender ENUM('Male', 'Female', 'Other'),
    username VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create 'email' table
CREATE TABLE email (
    user_id INT PRIMARY KEY,
    email VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create 'goals' table
CREATE TABLE goals (
    goal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    goal_type VARCHAR(100),
    target_value FLOAT,
    current_value FLOAT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create 'activities' table
CREATE TABLE activities (
    activity_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    activity_type VARCHAR(100),
    calories_burnt FLOAT,
    distance FLOAT,
    duration TIME,
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create 'acheives' table
CREATE TABLE acheives (
    goal_id INT,
    activity_id INT,
    PRIMARY KEY (goal_id, activity_id),
    FOREIGN KEY (goal_id) REFERENCES goals(goal_id),
    FOREIGN KEY (activity_id) REFERENCES activities(activity_id)
);

-- Create 'profiles' table
CREATE TABLE profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    height FLOAT,
    weight FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    difficulty_level ENUM('Beginner', 'Intermediate', 'Advanced'),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

