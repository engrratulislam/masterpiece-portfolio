import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

interface SkillRow extends RowDataPacket {
  id: number;
  name: string;
  level: number;
  icon: string | null;
  category: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// GET - Fetch all skills
export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const skills = await executeQuery<SkillRow[]>(
      `SELECT * FROM skills ORDER BY displayOrder ASC, category ASC, createdAt DESC`
    );

    const formattedSkills = skills.map((skill) => ({
      ...skill,
      createdAt: skill.createdAt.toISOString(),
      updatedAt: skill.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: formattedSkills,
    });
  } catch (error) {
    console.error('[SKILLS_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new skill
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, level, icon, category, displayOrder } = body;

    // Validation
    if (!name || level === undefined || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate level range
    if (level < 0 || level > 100) {
      return NextResponse.json(
        { success: false, error: 'Level must be between 0 and 100' },
        { status: 400 }
      );
    }

    const result = await executeQuery(
      `INSERT INTO skills (name, level, icon, category, displayOrder)
       VALUES (?, ?, ?, ?, ?)`,
      [name, level, icon || null, category, displayOrder || 0]
    );

    return NextResponse.json({
      success: true,
      data: { id: (result as any).insertId },
      message: 'Skill created successfully',
    });
  } catch (error) {
    console.error('[SKILLS_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
