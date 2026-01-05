import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface SkillsSectionRow extends RowDataPacket {
  id: number;
  sectionBadge: string;
  sectionTitle: string;
  sectionDescription: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
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

    // Ensure stat fields have default values if columns don't exist yet
    const data = {
      ...section[0],
      stat1Value: section[0].stat1Value || '16+',
      stat1Label: section[0].stat1Label || 'Technologies Mastered',
      stat2Value: section[0].stat2Value || '85%',
      stat2Label: section[0].stat2Label || 'Average Proficiency',
      stat3Value: section[0].stat3Value || '5+',
      stat3Label: section[0].stat3Label || 'Years Learning',
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('[SKILLS_SECTION_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills section' },
      { status: 500 }
    );
  }
}
