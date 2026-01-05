-- =============================================
-- Migration: Add missing fields to work_experience table
-- Date: 2026-01-05
-- Description: Adds location, responsibilities, achievements, and companyUrl fields
-- =============================================

-- Add location column (Remote, On-site, Hybrid)
ALTER TABLE work_experience
ADD COLUMN IF NOT EXISTS location VARCHAR(100) DEFAULT 'Remote' AFTER duration;

-- Add companyUrl column for company website links
ALTER TABLE work_experience
ADD COLUMN IF NOT EXISTS companyUrl VARCHAR(500) AFTER logo;

-- Add responsibilities column (JSON array of strings)
ALTER TABLE work_experience
ADD COLUMN IF NOT EXISTS responsibilities JSON AFTER description;

-- Add achievements column (JSON array of strings)
ALTER TABLE work_experience
ADD COLUMN IF NOT EXISTS achievements JSON AFTER responsibilities;

-- Update existing records with default values
UPDATE work_experience 
SET location = 'Remote' 
WHERE location IS NULL;

UPDATE work_experience 
SET responsibilities = '[]' 
WHERE responsibilities IS NULL;

UPDATE work_experience 
SET achievements = '[]' 
WHERE achievements IS NULL;

-- Verify the changes
DESCRIBE work_experience;
