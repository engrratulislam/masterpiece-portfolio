-- =============================================
-- Authentication System Schema for Portfolio
-- Database: next_portfolio
-- Single Admin System with Session Management
-- =============================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin',
    isActive BOOLEAN DEFAULT true,
    lastLogin DATETIME,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_active (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    userId INT NOT NULL,
    sessionToken TEXT NOT NULL,
    expiresAt DATETIME NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sessions_userId (userId),
    INDEX idx_sessions_expiresAt (expiresAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Rate Limiting Table (for login attempts)
CREATE TABLE IF NOT EXISTS rate_limits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL,
    attempts INT DEFAULT 1,
    lastAttempt DATETIME NOT NULL,
    lockedUntil DATETIME,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_identifier (identifier),
    INDEX idx_rate_limits_identifier (identifier),
    INDEX idx_rate_limits_locked (lockedUntil)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    isRead BOOLEAN DEFAULT false,
    readAt DATETIME,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_contact_isRead (isRead),
    INDEX idx_contact_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Projects Table (for CRUD management)
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    longDescription TEXT,
    image VARCHAR(500),
    category ENUM('web', 'mobile', 'design', '3d') NOT NULL,
    tags JSON,
    liveUrl VARCHAR(500),
    githubUrl VARCHAR(500),
    featured BOOLEAN DEFAULT false,
    date DATE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_projects_category (category),
    INDEX idx_projects_featured (featured),
    INDEX idx_projects_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Project Images Table (for multiple images per project)
CREATE TABLE IF NOT EXISTS project_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    projectId INT NOT NULL,
    imageUrl VARCHAR(500) NOT NULL,
    displayOrder INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project_images_projectId (projectId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level INT NOT NULL CHECK (level >= 0 AND level <= 100),
    icon VARCHAR(100),
    category ENUM('frontend', 'backend', 'design', 'tools') NOT NULL,
    displayOrder INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_skills_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Work Experience Table
CREATE TABLE IF NOT EXISTS work_experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    logo VARCHAR(500),
    technologies JSON,
    displayOrder INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_experience_displayOrder (displayOrder)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    displayOrder INT DEFAULT 0,
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_testimonials_active (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Media Library Table
CREATE TABLE IF NOT EXISTS media_library (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    originalName VARCHAR(255) NOT NULL,
    filePath VARCHAR(500) NOT NULL,
    fileSize INT NOT NULL,
    mimeType VARCHAR(100) NOT NULL,
    alt VARCHAR(255),
    category ENUM('image', 'document', 'video', 'other') DEFAULT 'image',
    uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_media_category (category),
    INDEX idx_media_uploadedAt (uploadedAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Insert Default Admin User
-- Password: admin123 (CHANGE THIS IMMEDIATELY)
-- This is a bcrypt hash with 12 salt rounds
-- =============================================
INSERT INTO users (email, password_hash, name, role, isActive)
VALUES (
    'admin@portfolio.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eWJ5ghaMmuSW',
    'Admin User',
    'admin',
    true
) ON DUPLICATE KEY UPDATE email = email;
