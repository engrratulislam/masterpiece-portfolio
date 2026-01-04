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

-- 5. Project Categories Table (for custom project categories)
CREATE TABLE IF NOT EXISTS project_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    displayOrder INT DEFAULT 0,
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categories_slug (slug),
    INDEX idx_categories_active (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Default Categories
INSERT INTO project_categories (name, slug, displayOrder) VALUES
('Web', 'web', 1),
('Mobile', 'mobile', 2),
('Design', 'design', 3),
('3D', '3d', 4)
ON DUPLICATE KEY UPDATE slug = slug;

-- 5.5. Skill Categories Table (for custom skill categories)
CREATE TABLE IF NOT EXISTS skill_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    displayOrder INT DEFAULT 0,
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_skill_categories_slug (slug),
    INDEX idx_skill_categories_active (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Default Skill Categories
INSERT INTO skill_categories (name, slug, description, icon, displayOrder) VALUES
('Frontend Development', 'frontend', 'Building beautiful and responsive user interfaces', '🎨', 1),
('Backend Development', 'backend', 'Creating robust and scalable server-side applications', '⚙️', 2),
('Design & UX', 'design', 'Crafting intuitive user experiences and interfaces', '✨', 3),
('Tools & DevOps', 'tools', 'Development tools and cloud infrastructure', '🛠️', 4)
ON DUPLICATE KEY UPDATE slug = slug;

-- 6. Projects Table (for CRUD management)
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    longDescription TEXT,
    image VARCHAR(500),
    category VARCHAR(100) NOT NULL DEFAULT 'web',
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

-- 7. Project Images Table (for multiple images per project)
CREATE TABLE IF NOT EXISTS project_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    projectId INT NOT NULL,
    imageUrl VARCHAR(500) NOT NULL,
    displayOrder INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project_images_projectId (projectId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level INT NOT NULL CHECK (level >= 0 AND level <= 100),
    icon VARCHAR(100),
    category VARCHAR(100) NOT NULL DEFAULT 'frontend',
    displayOrder INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_skills_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Work Experience Table
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

-- 10. Testimonials Table
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

-- 11. Media Library Table
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

-- 12. Hero Section Table (Single Row Configuration)
CREATE TABLE IF NOT EXISTS hero_section (
    id INT PRIMARY KEY DEFAULT 1,
    badge TEXT NOT NULL DEFAULT 'Available for Projects',
    name VARCHAR(255) NOT NULL DEFAULT 'Engr. Ratul',
    title VARCHAR(255) NOT NULL DEFAULT 'Full Stack Developer',
    description TEXT NOT NULL,
    cvUrl VARCHAR(500),
    profileImage VARCHAR(500),
    yearsExperience VARCHAR(50) DEFAULT '3+',
    projectsCompleted VARCHAR(50) DEFAULT '50+',
    satisfactionRate VARCHAR(50) DEFAULT '100%',
    -- Tech Stack Fields (up to 9 items)
    tech1 VARCHAR(100),
    tech2 VARCHAR(100),
    tech3 VARCHAR(100),
    tech4 VARCHAR(100),
    tech5 VARCHAR(100),
    tech6 VARCHAR(100),
    tech7 VARCHAR(100),
    tech8 VARCHAR(100),
    tech9 VARCHAR(100),
    isActive BOOLEAN DEFAULT true,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. About Section Table (Single Row Configuration)
CREATE TABLE IF NOT EXISTS about_section (
    id INT PRIMARY KEY DEFAULT 1,
    sectionBadge VARCHAR(100) DEFAULT 'Get to Know Me',
    sectionTitle VARCHAR(255) NOT NULL DEFAULT 'About Me',
    sectionDescription TEXT,
    profileImage VARCHAR(500),
    heading VARCHAR(255),
    paragraph1 TEXT NOT NULL,
    paragraph2 TEXT,
    paragraph3 TEXT,
    cvUrl VARCHAR(500),
    yearsExperience VARCHAR(50) DEFAULT '3+',
    projectsCompleted VARCHAR(50) DEFAULT '50+',
    clientSatisfaction VARCHAR(50) DEFAULT '100% Client',
    isActive BOOLEAN DEFAULT true,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Footer Section Table (Single Row Configuration)
CREATE TABLE IF NOT EXISTS footer_section (
    id INT PRIMARY KEY DEFAULT 1,
    brandName VARCHAR(255) NOT NULL DEFAULT 'Engr. Ratul',
    brandDescription TEXT NOT NULL,
    quickLinksTitle VARCHAR(100) DEFAULT 'Quick Links',
    -- Quick Links (Individual Fields)
    quickLink1Name VARCHAR(100) DEFAULT 'Home',
    quickLink1Href VARCHAR(255) DEFAULT '/',
    quickLink2Name VARCHAR(100) DEFAULT 'About',
    quickLink2Href VARCHAR(255) DEFAULT '#about',
    quickLink3Name VARCHAR(100) DEFAULT 'Projects',
    quickLink3Href VARCHAR(255) DEFAULT '#projects',
    quickLink4Name VARCHAR(100) DEFAULT 'Contact',
    quickLink4Href VARCHAR(255) DEFAULT '#contact',
    socialTitle VARCHAR(100) DEFAULT 'Connect',
    -- Social Links (Synced with Sidebar)
    githubUrl VARCHAR(500),
    linkedinUrl VARCHAR(500),
    emailAddress VARCHAR(255),
    copyrightText VARCHAR(255) NOT NULL,
    footerNote VARCHAR(255),
    isActive BOOLEAN DEFAULT true,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Contact Section Table (Single Row Configuration)
CREATE TABLE IF NOT EXISTS contact_section (
    id INT PRIMARY KEY DEFAULT 1,
    sectionBadge VARCHAR(100) DEFAULT 'Get In Touch',
    sectionTitle VARCHAR(255) NOT NULL DEFAULT 'Let\'s Work Together',
    sectionDescription TEXT,
    contactInfoTitle VARCHAR(100) DEFAULT 'Contact Information',
    contactInfoDescription TEXT,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    location VARCHAR(255),
    socialTitle VARCHAR(100) DEFAULT 'Follow Me',
    githubUrl VARCHAR(500),
    linkedinUrl VARCHAR(500),
    twitterUrl VARCHAR(500),
    facebookUrl VARCHAR(500),
    isActive BOOLEAN DEFAULT true,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Default Hero Section Data
INSERT INTO hero_section (
    id,
    badge,
    name,
    title,
    description,
    yearsExperience,
    projectsCompleted,
    satisfactionRate,
    tech1,
    tech2,
    tech3,
    tech4,
    tech5,
    tech6,
    tech7,
    tech8,
    tech9
)
VALUES (
    1,
    'Available for Projects',
    'Engr. Ratul',
    'Full Stack Developer',
    'Crafting exceptional digital experiences with modern technologies. Specialized in building scalable architectures and seamless user interfaces.',
    '3+',
    '50+',
    '100%',
    'JavaScript',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'PHP',
    'Laravel',
    'MongoDB',
    'MySQL'
) ON DUPLICATE KEY UPDATE id = id;

-- Insert Default About Section Data
INSERT INTO about_section (
    id, 
    sectionBadge, 
    sectionTitle, 
    sectionDescription,
    heading,
    paragraph1, 
    paragraph2, 
    paragraph3,
    yearsExperience,
    projectsCompleted,
    clientSatisfaction
)
VALUES (
    1,
    'Get to Know Me',
    'About Me',
    'Passionate developer crafting exceptional digital experiences',
    'Hi, I\'m Engr. Ratul',
    'A passionate Full Stack Developer with over 3 years of experience building modern web applications. I specialize in creating scalable, performant, and user-friendly solutions using cutting-edge technologies.',
    'With a strong foundation in both frontend and backend development, I bring ideas to life through clean code, thoughtful design, and innovative problem-solving.',
    'When I\'m not coding, you\'ll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.',
    '3+',
    '50+',
    '100% Client'
) ON DUPLICATE KEY UPDATE id = id;

-- Insert Default Footer Section Data
INSERT INTO footer_section (
    id,
    brandName,
    brandDescription,
    quickLinksTitle,
    quickLink1Name,
    quickLink1Href,
    quickLink2Name,
    quickLink2Href,
    quickLink3Name,
    quickLink3Href,
    quickLink4Name,
    quickLink4Href,
    socialTitle,
    githubUrl,
    linkedinUrl,
    emailAddress,
    copyrightText,
    footerNote
)
VALUES (
    1,
    'Engr. Ratul',
    'Full Stack Developer & Server Infrastructure Specialist crafting scalable solutions.',
    'Quick Links',
    'Home', '/',
    'About', '#about',
    'Projects', '#projects',
    'Contact', '#contact',
    'Connect',
    'https://github.com/engrratulislam',
    'https://linkedin.com/in/engrratulislam',
    'engrratulislam@gmail.com',
    'Engr. Ratul. All rights reserved.',
    'Made with ❤️ using Next.js'
) ON DUPLICATE KEY UPDATE id = id;

-- Insert Default Contact Section Data
INSERT INTO contact_section (
    id,
    sectionBadge,
    sectionTitle,
    sectionDescription,
    contactInfoTitle,
    contactInfoDescription,
    email,
    phone,
    location,
    socialTitle,
    githubUrl,
    linkedinUrl,
    twitterUrl,
    facebookUrl
)
VALUES (
    1,
    'Get In Touch',
    'Let\'s Work Together',
    'Have a project in mind? Let\'s discuss how I can help bring your ideas to life',
    'Contact Information',
    'Feel free to reach out through any of these channels. I\'m always open to discussing new projects and opportunities.',
    'ratul.innovations@gmail.com',
    '+880 1XXX-XXXXXX',
    'Kushtia, Bangladesh',
    'Follow Me',
    'https://github.com/engrratulislam',
    'https://www.linkedin.com/in/engr-ratulislam/',
    'https://twitter.com/yourusername',
    'https://facebook.com/yourusername'
) ON DUPLICATE KEY UPDATE id = id;

-- =============================================
-- Insert Default Admin User
-- Password: admin123 (CHANGE THIS IMMEDIATELY)
-- This is a bcrypt hash with 12 salt rounds
-- =============================================
INSERT INTO users (email, password_hash, name, role, isActive)
VALUES (
    'admin@portfolio.com',
    '$2b$12$NrGxbra657ZOtYBXMYZSRe7/FW0km.fU6Ns.byu1hNptgZ2c3iAnu',
    'Admin User',
    'admin',
    true
) ON DUPLICATE KEY UPDATE email = email;

-- =============================================
-- Insert Sample Projects Data
-- =============================================
INSERT INTO projects (title, description, longDescription, image, category, tags, liveUrl, githubUrl, featured, date)
VALUES 
('E-Commerce Platform', 'A full-featured online shopping platform with payment integration and admin dashboard', 'Built a comprehensive e-commerce solution with React, Node.js, and Stripe integration. Features include product management, shopping cart, user authentication, order tracking, and admin dashboard with real-time analytics.', 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop', 'web', '["React", "Node.js", "MongoDB", "Stripe", "Redux", "Express.js"]', 'https://example.com', 'https://github.com/engrratulislam', true, '2024-03-01'),
('Task Management System', 'Collaborative task management tool with real-time updates and team features', 'Developed a Trello-like task management system with drag-and-drop functionality. Includes team collaboration, real-time updates via WebSockets, file attachments, comments, and advanced filtering options.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop', 'web', '["React", "TypeScript", "Socket.io", "Node.js", "PostgreSQL", "Tailwind CSS"]', 'https://example.com', 'https://github.com/engrratulislam', true, '2024-02-15'),
('Restaurant Booking App', 'Modern restaurant booking and menu management application', 'Created a restaurant management system with table booking, menu management, and online ordering. Features include real-time availability, payment processing, and customer reviews.', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 'web', '["React", "TypeScript", "Tailwind CSS", "Firebase"]', 'https://example.com', 'https://github.com/engrratulislam', true, '2024-01-20'),
('3D Portfolio Experience', 'Interactive 3D portfolio website with Three.js animations', 'Created an immersive portfolio experience using Three.js and React Three Fiber. Features include 3D models, particle effects, smooth animations, and interactive elements.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop', 'web', '["Three.js", "React", "WebGL", "GSAP", "Framer Motion"]', 'https://example.com', 'https://github.com/engrratulislam', true, '2023-12-10'),
('RESTful API Gateway', 'Scalable API gateway with authentication and rate limiting', 'Built a high-performance API gateway handling authentication, rate limiting, request routing, and logging. Implements JWT auth, Redis caching, and comprehensive error handling.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop', 'web', '["Node.js", "Express", "Redis", "JWT", "Docker"]', NULL, 'https://github.com/engrratulislam', false, '2023-11-05'),
('Social Media Dashboard', 'Analytics dashboard for social media management', 'Comprehensive social media analytics platform with real-time data visualization, post scheduling, and engagement tracking across multiple platforms.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', 'web', '["Next.js", "Chart.js", "Tailwind CSS", "Node.js"]', 'https://example.com', NULL, false, '2023-10-15')
ON DUPLICATE KEY UPDATE id = id;

-- =============================================
-- Insert Sample Skills Data
-- =============================================
INSERT INTO skills (name, level, icon, category, displayOrder)
VALUES 
-- Frontend
('React', 95, '⚛️', 'frontend', 1),
('Next.js', 92, '▲', 'frontend', 2),
('TypeScript', 90, 'TS', 'frontend', 3),
('Tailwind CSS', 88, '🎨', 'frontend', 4),
('JavaScript', 95, 'JS', 'frontend', 5),
('HTML/CSS', 95, '🌐', 'frontend', 6),
-- Backend
('Node.js', 88, '🟢', 'backend', 7),
('Express.js', 85, '🚂', 'backend', 8),
('Laravel', 85, '🔴', 'backend', 9),
('PHP', 82, '🐘', 'backend', 10),
('REST APIs', 90, '🔌', 'backend', 11),
-- Design  
('Figma', 75, '🎨', 'design', 12),
('UI/UX Design', 80, '✨', 'design', 13),
('Responsive Design', 92, '📱', 'design', 14),
-- Tools
('Git', 90, '📦', 'tools', 15),
('Docker', 75, '🐳', 'tools', 16),
('VS Code', 95, '💻', 'tools', 17),
('Postman', 85, '📮', 'tools', 18),
('AWS', 70, '☁️', 'tools', 19),
('MongoDB', 87, '🍃', 'tools', 20)
ON DUPLICATE KEY UPDATE id = id;

-- =============================================
-- Insert Sample Work Experience Data
-- =============================================
INSERT INTO work_experience (company, position, duration, description, logo, technologies, displayOrder)
VALUES 
('Tech Solutions Inc.', 'Full Stack Developer', 'June 2023 - Present', 'Leading development of modern web applications using React, Next.js, and Node.js. Working with cross-functional teams to deliver high-quality software solutions.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop', '["React", "Next.js", "Node.js", "TypeScript", "MongoDB", "Docker", "AWS"]', 1),
('Digital Innovations Ltd.', 'Frontend Developer', 'March 2022 - May 2023', 'Developed responsive web applications and improved user experience across multiple products. Collaborated with designers to implement pixel-perfect interfaces.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop', '["React", "Vue.js", "Tailwind CSS", "JavaScript", "REST API"]', 2),
('Freelance Developer', 'Full Stack Developer', 'January 2021 - February 2022', 'Worked with various clients to build custom web applications, e-commerce platforms, and business websites. Managed projects from conception to deployment.', 'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=200&h=200&fit=crop', '["React", "Node.js", "Express.js", "MongoDB", "PHP", "Laravel", "MySQL"]', 3),
('StartUp Ventures', 'Junior Web Developer', 'August 2020 - December 2020', 'Started professional journey as a junior developer, learning modern web development practices and contributing to various projects.', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop', '["HTML", "CSS", "JavaScript", "React", "Git", "REST API"]', 4)
ON DUPLICATE KEY UPDATE id = id;

-- =============================================
-- Insert Sample Testimonials Data
-- =============================================
INSERT INTO testimonials (name, position, company, avatar, rating, text, displayOrder, isActive)
VALUES 
('Sarah Johnson', 'CEO', 'TechStart Inc.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', 5, 'Working with Ratul was an absolute pleasure. He delivered our e-commerce platform ahead of schedule and exceeded all our expectations. His attention to detail and technical expertise is outstanding.', 1, true),
('Michael Chen', 'Product Manager', 'Digital Solutions Ltd.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 5, 'Ratul is a highly skilled developer who brings both technical excellence and creative problem-solving to every project. He transformed our outdated website into a modern, responsive application.', 2, true),
('Emily Rodriguez', 'Founder', 'Creative Agency Pro', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', 5, 'I have worked with many developers, but Ratul stands out for his professionalism and ability to understand business requirements. The portfolio website he built for us is stunning!', 3, true),
('David Thompson', 'CTO', 'Innovation Labs', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', 5, 'Ratul\'s expertise in full-stack development is exceptional. He built a complex dashboard for our SaaS product with excellent performance and user experience. Highly recommended!', 4, true),
('Lisa Anderson', 'Marketing Director', 'Growth Partners', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', 5, 'We hired Ratul to build our company website and he delivered beyond expectations. The site is fast, beautiful, and perfectly represents our brand. Communication was excellent throughout.', 5, true),
('Robert Martinez', 'Founder', 'EduLearn Platform', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', 5, 'Ratul developed our online learning platform with video streaming, quizzes, and progress tracking. The platform is robust and handles thousands of users without any issues.', 6, true)
ON DUPLICATE KEY UPDATE id = id;

-- Projects Section Table (Single Row Configuration for Section Header)
CREATE TABLE IF NOT EXISTS projects_section (
    id INT PRIMARY KEY DEFAULT 1,
    sectionBadge VARCHAR(100) DEFAULT 'My Work',
    sectionTitle VARCHAR(255) NOT NULL DEFAULT 'Featured Projects',
    sectionDescription TEXT DEFAULT 'Showcasing my best work in web development and creative coding',
    isActive BOOLEAN DEFAULT true,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Default Projects Section Data
INSERT INTO projects_section (id, sectionBadge, sectionTitle, sectionDescription)
VALUES (1, 'My Work', 'Featured Projects', 'Showcasing my best work in web development and creative coding')
ON DUPLICATE KEY UPDATE id = id;

-- Skills Section Table (Single Row Configuration for Section Header)
CREATE TABLE IF NOT EXISTS skills_section (
    id INT PRIMARY KEY DEFAULT 1,
    sectionBadge VARCHAR(100) DEFAULT 'What I Do Best',
    sectionTitle VARCHAR(255) NOT NULL DEFAULT 'Skills & Expertise',
    sectionDescription TEXT DEFAULT 'Technologies and tools I use to bring ideas to life',
    isActive BOOLEAN DEFAULT true,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Default Skills Section Data
INSERT INTO skills_section (id, sectionBadge, sectionTitle, sectionDescription)
VALUES (1, 'What I Do Best', 'Skills & Expertise', 'Technologies and tools I use to bring ideas to life')
ON DUPLICATE KEY UPDATE id = id;

-- Experience Section Table (Single Row Configuration for Section Header)
CREATE TABLE IF NOT EXISTS experience_section (
    id INT PRIMARY KEY DEFAULT 1,
    sectionBadge VARCHAR(100) DEFAULT 'Career Journey',
    sectionTitle VARCHAR(255) NOT NULL DEFAULT 'Work Experience',
    sectionDescription TEXT DEFAULT 'My professional journey and key achievements',
    isActive BOOLEAN DEFAULT true,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Default Experience Section Data
INSERT INTO experience_section (id, sectionBadge, sectionTitle, sectionDescription)
VALUES (1, 'Career Journey', 'Work Experience', 'My professional journey and key achievements')
ON DUPLICATE KEY UPDATE id = id;

-- Testimonials Section Table (Single Row Configuration for Section Header)
CREATE TABLE IF NOT EXISTS testimonials_section (
    id INT PRIMARY KEY DEFAULT 1,
    sectionBadge VARCHAR(100) DEFAULT 'Client Feedback',
    sectionTitle VARCHAR(255) NOT NULL DEFAULT 'What Clients Say',
    sectionDescription TEXT DEFAULT 'Don\'t just take my word for it - hear from some of the clients I\'ve worked with',
    isActive BOOLEAN DEFAULT true,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Default Testimonials Section Data
INSERT INTO testimonials_section (id, sectionBadge, sectionTitle, sectionDescription)
VALUES (1, 'Client Feedback', 'What Clients Say', 'Don\'t just take my word for it - hear from some of the clients I\'ve worked with')
ON DUPLICATE KEY UPDATE id = id;
