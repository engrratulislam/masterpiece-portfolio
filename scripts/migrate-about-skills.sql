-- Migration: Add about_skills table for Tech Stack & Expertise section in About page
-- Date: 2026-01-05
-- Description: Creates junction table to allow selecting skills from the skills table
--              to display in the About section's Tech Stack & Expertise area

-- Create about_skills junction table
CREATE TABLE IF NOT EXISTS about_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skillId INT NOT NULL,
    displayOrder INT DEFAULT 0,
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (skillId) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_skill (skillId),
    INDEX idx_about_skills_active (isActive),
    INDEX idx_about_skills_order (displayOrder)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default skills for About section (based on hardcoded techStack from About.tsx)
-- These skills will be displayed in the "Tech Stack & Expertise" section by default
INSERT INTO about_skills (skillId, displayOrder, isActive)
SELECT s.id, 
    CASE s.name
        WHEN 'React' THEN 1
        WHEN 'Next.js' THEN 2
        WHEN 'TypeScript' THEN 3
        WHEN 'Node.js' THEN 4
        WHEN 'Laravel' THEN 5
        WHEN 'MongoDB' THEN 6
        WHEN 'Docker' THEN 7
        WHEN 'AWS' THEN 8
        ELSE 99
    END as displayOrder,
    true
FROM skills s
WHERE s.name IN ('React', 'Next.js', 'TypeScript', 'Node.js', 'Laravel', 'MongoDB', 'Docker', 'AWS')
ON DUPLICATE KEY UPDATE skillId = skillId;

-- Verification query (optional - run to check the migration)
-- SELECT 
--     abs.id,
--     abs.skillId,
--     s.name,
--     s.level,
--     s.icon,
--     s.category,
--     abs.displayOrder
-- FROM about_skills abs
-- JOIN skills s ON abs.skillId = s.id
-- WHERE abs.isActive = true
-- ORDER BY abs.displayOrder ASC;
