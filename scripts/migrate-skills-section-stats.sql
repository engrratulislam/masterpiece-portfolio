-- Migration: Add stat cards to skills_section table
-- Date: 2026-01-05
-- Description: Adds 3 stat card fields (value + label pairs) to the skills_section table

-- Add stat card columns if they don't exist
ALTER TABLE skills_section
ADD COLUMN IF NOT EXISTS stat1Value VARCHAR(50) DEFAULT '16+' AFTER sectionDescription,
ADD COLUMN IF NOT EXISTS stat1Label VARCHAR(100) DEFAULT 'Technologies Mastered' AFTER stat1Value,
ADD COLUMN IF NOT EXISTS stat2Value VARCHAR(50) DEFAULT '85%' AFTER stat1Label,
ADD COLUMN IF NOT EXISTS stat2Label VARCHAR(100) DEFAULT 'Average Proficiency' AFTER stat2Value,
ADD COLUMN IF NOT EXISTS stat3Value VARCHAR(50) DEFAULT '5+' AFTER stat2Label,
ADD COLUMN IF NOT EXISTS stat3Label VARCHAR(100) DEFAULT 'Years Learning' AFTER stat3Value;

-- Update existing row with default stat values if not already set
UPDATE skills_section 
SET 
  stat1Value = COALESCE(stat1Value, '16+'),
  stat1Label = COALESCE(stat1Label, 'Technologies Mastered'),
  stat2Value = COALESCE(stat2Value, '85%'),
  stat2Label = COALESCE(stat2Label, 'Average Proficiency'),
  stat3Value = COALESCE(stat3Value, '5+'),
  stat3Label = COALESCE(stat3Label, 'Years Learning')
WHERE id = 1;
