import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface SkillsSectionRow extends RowDataPacket {
  id: number;
  sectionBadge: string;
  sectionTitle: string;
  sectionDescription: string;
  isActive: boolean;
}

// GET - Fetch skills section data (public endpoint)
export async function GET() {
  try {
    const section = await executeQuery<SkillsSectionRow[]>(
      'SELECT * FROM skills_section WHERE id = 1 AND isActive = true LIMIT 1'
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
    console.error('[SKILLS_SECTION_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills section' },
      { status: 500 }
    );
  }
}
