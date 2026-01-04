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

// GET - Fetch single skill
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const skills = await executeQuery<SkillRow[]>(
      'SELECT * FROM skills WHERE id = ? LIMIT 1',
      [id]
    );

    if (skills.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Skill not found' },
        { status: 404 }
      );
    }

    const skill = skills[0];
    const formattedSkill = {
      ...skill,
      createdAt: skill.createdAt.toISOString(),
      updatedAt: skill.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: formattedSkill,
    });
  } catch (error) {
    console.error('[SKILL_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update skill
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
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

    await executeQuery(
      `UPDATE skills 
       SET name = ?, level = ?, icon = ?, category = ?, displayOrder = ?
       WHERE id = ?`,
      [name, level, icon || null, category, displayOrder || 0, id]
    );

    return NextResponse.json({
      success: true,
      message: 'Skill updated successfully',
    });
  } catch (error) {
    console.error('[SKILL_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete skill
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await executeQuery('DELETE FROM skills WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    console.error('[SKILL_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
