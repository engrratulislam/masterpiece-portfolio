import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface SkillsSectionRow extends RowDataPacket {
  id: number;
  sectionBadge: string;
  sectionTitle: string;
  sectionDescription: string;
  isActive: boolean;
  updatedAt: Date;
}

// GET - Fetch skills section (admin endpoint)
export async function GET() {
  try {
    const section = await executeQuery<SkillsSectionRow[]>(
      'SELECT * FROM skills_section WHERE id = 1 LIMIT 1'
    );

    if (section.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Skills section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: section[0],
    });
  } catch (error) {
    console.error('[ADMIN_SKILLS_SECTION_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills section' },
      { status: 500 }
    );
  }
}

// PUT - Update skills section
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { sectionBadge, sectionTitle, sectionDescription, isActive } = body;

    // Validation
    if (!sectionTitle || !sectionDescription) {
      return NextResponse.json(
        { success: false, error: 'Section title and description are required' },
        { status: 400 }
      );
    }

    await executeQuery<ResultSetHeader>(
      `UPDATE skills_section 
       SET sectionBadge = ?, sectionTitle = ?, sectionDescription = ?, isActive = ?
       WHERE id = 1`,
      [sectionBadge, sectionTitle, sectionDescription, isActive !== false]
    );

    // Fetch updated data
    const updated = await executeQuery<SkillsSectionRow[]>(
      'SELECT * FROM skills_section WHERE id = 1 LIMIT 1'
    );

    return NextResponse.json({
      success: true,
      data: updated[0],
      message: 'Skills section updated successfully',
    });
  } catch (error) {
    console.error('[ADMIN_SKILLS_SECTION_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update skills section' },
      { status: 500 }
    );
  }
}
