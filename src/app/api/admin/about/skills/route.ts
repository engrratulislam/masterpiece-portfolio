import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface AboutSkillRow extends RowDataPacket {
  id: number;
  skillId: number;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Joined skill data
  name: string;
  level: number;
  icon: string | null;
  category: string;
}

interface SkillRow extends RowDataPacket {
  id: number;
  name: string;
  level: number;
  icon: string | null;
  category: string;
}

// Check if the about_skills table exists
async function tableExists(): Promise<boolean> {
  try {
    const result = await executeQuery<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = DATABASE() AND table_name = 'about_skills'`
    );
    return result[0]?.count > 0;
  } catch {
    return false;
  }
}

// Create the about_skills table if it doesn't exist
async function ensureTableExists(): Promise<void> {
  const exists = await tableExists();
  if (!exists) {
    // Create the table
    await executeQuery(
      `CREATE TABLE IF NOT EXISTS about_skills (
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );
    
    // Insert default skills (React, Next.js, TypeScript, Node.js, Laravel, MongoDB, Docker, AWS)
    await executeQuery(
      `INSERT INTO about_skills (skillId, displayOrder, isActive)
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
       ON DUPLICATE KEY UPDATE skillId = skillId`
    );
  }
}

// GET - Fetch all skills with selection status for About section
export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ensure table exists before querying
    await ensureTableExists();

    // Fetch all skills with their selection status
    const skills = await executeQuery<(SkillRow & { isSelected: boolean; displayOrder: number | null; aboutSkillId: number | null })[]>(
      `SELECT 
        s.id,
        s.name,
        s.level,
        s.icon,
        s.category,
        CASE WHEN abs.id IS NOT NULL THEN true ELSE false END as isSelected,
        abs.displayOrder,
        abs.id as aboutSkillId
      FROM skills s
      LEFT JOIN about_skills abs ON s.id = abs.skillId AND abs.isActive = true
      ORDER BY s.category ASC, s.name ASC`
    );

    // Fetch selected skills with full details
    const selectedSkills = await executeQuery<AboutSkillRow[]>(
      `SELECT 
        abs.id,
        abs.skillId,
        abs.displayOrder,
        abs.isActive,
        abs.createdAt,
        abs.updatedAt,
        s.name,
        s.level,
        s.icon,
        s.category
      FROM about_skills abs
      JOIN skills s ON abs.skillId = s.id
      WHERE abs.isActive = true
      ORDER BY abs.displayOrder ASC`
    );

    return NextResponse.json({
      success: true,
      data: {
        allSkills: skills,
        selectedSkills: selectedSkills,
      },
    });
  } catch (error) {
    console.error('[ABOUT_SKILLS_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// POST - Add a skill to About section
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ensure table exists before any operation
    await ensureTableExists();

    const body = await request.json();
    const { skillId } = body;

    if (!skillId) {
      return NextResponse.json(
        { success: false, error: 'Skill ID is required' },
        { status: 400 }
      );
    }

    // Check if skill exists
    const skillExists = await executeQuery<SkillRow[]>(
      'SELECT id FROM skills WHERE id = ?',
      [skillId]
    );

    if (skillExists.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Skill not found' },
        { status: 404 }
      );
    }

    // Get max display order
    const maxOrderResult = await executeQuery<RowDataPacket[]>(
      'SELECT COALESCE(MAX(displayOrder), 0) as maxOrder FROM about_skills WHERE isActive = true'
    );
    const newDisplayOrder = (maxOrderResult[0]?.maxOrder || 0) + 1;

    // Insert or update the skill in about_skills
    await executeQuery(
      `INSERT INTO about_skills (skillId, displayOrder, isActive)
       VALUES (?, ?, true)
       ON DUPLICATE KEY UPDATE isActive = true, displayOrder = ?`,
      [skillId, newDisplayOrder, newDisplayOrder]
    );

    return NextResponse.json({
      success: true,
      message: 'Skill added to About section successfully',
    });
  } catch (error) {
    console.error('[ABOUT_SKILLS_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add skill' },
      { status: 500 }
    );
  }
}

// PUT - Update display order of skills
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ensure table exists before any operation
    await ensureTableExists();

    const body = await request.json();
    const { skills } = body; // Array of { skillId, displayOrder }

    if (!Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid skills array' },
        { status: 400 }
      );
    }

    // Update display order for each skill
    for (const skill of skills) {
      await executeQuery(
        'UPDATE about_skills SET displayOrder = ? WHERE skillId = ? AND isActive = true',
        [skill.displayOrder, skill.skillId]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Skills order updated successfully',
    });
  } catch (error) {
    console.error('[ABOUT_SKILLS_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update skills order' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a skill from About section
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ensure table exists before any operation
    await ensureTableExists();

    const { searchParams } = new URL(request.url);
    const skillId = searchParams.get('skillId');

    if (!skillId) {
      return NextResponse.json(
        { success: false, error: 'Skill ID is required' },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    const result = await executeQuery<ResultSetHeader>(
      'UPDATE about_skills SET isActive = false WHERE skillId = ?',
      [skillId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Skill not found in About section' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Skill removed from About section successfully',
    });
  } catch (error) {
    console.error('[ABOUT_SKILLS_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove skill' },
      { status: 500 }
    );
  }
}
