import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface ExperienceSectionRow extends RowDataPacket {
  id: number;
  sectionBadge: string;
  sectionTitle: string;
  sectionDescription: string;
  isActive: boolean;
}

// GET - Fetch experience section data (public endpoint)
export async function GET() {
  try {
    const section = await executeQuery<ExperienceSectionRow[]>(
      'SELECT * FROM experience_section WHERE id = 1 AND isActive = true LIMIT 1'
    );

    if (section.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Experience section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: section[0],
    });
  } catch (error) {
    console.error('[EXPERIENCE_SECTION_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch experience section' },
      { status: 500 }
    );
  }
}
