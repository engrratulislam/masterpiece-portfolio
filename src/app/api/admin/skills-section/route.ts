import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

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
  updatedAt: Date;
}

// Check if stat columns exist and add them if missing
async function ensureStatColumnsExist(): Promise<void> {
  try {
    // Check if stat1Value column exists
    const columns = await executeQuery<RowDataPacket[]>(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() 
       AND TABLE_NAME = 'skills_section' 
       AND COLUMN_NAME = 'stat1Value'`
    );

    if (columns.length === 0) {
      // Add all stat columns
      await executeQuery(
        `ALTER TABLE skills_section
         ADD COLUMN stat1Value VARCHAR(50) DEFAULT '16+' AFTER sectionDescription,
         ADD COLUMN stat1Label VARCHAR(100) DEFAULT 'Technologies Mastered' AFTER stat1Value,
         ADD COLUMN stat2Value VARCHAR(50) DEFAULT '85%' AFTER stat1Label,
         ADD COLUMN stat2Label VARCHAR(100) DEFAULT 'Average Proficiency' AFTER stat2Value,
         ADD COLUMN stat3Value VARCHAR(50) DEFAULT '5+' AFTER stat2Label,
         ADD COLUMN stat3Label VARCHAR(100) DEFAULT 'Years Learning' AFTER stat3Value`
      );

      // Update existing row with default values
      await executeQuery(
        `UPDATE skills_section SET
         stat1Value = '16+',
         stat1Label = 'Technologies Mastered',
         stat2Value = '85%',
         stat2Label = 'Average Proficiency',
         stat3Value = '5+',
         stat3Label = 'Years Learning'
         WHERE id = 1`
      );
    }
  } catch (error) {
    console.error('[ENSURE_STAT_COLUMNS]', error);
    // Continue even if this fails - the columns might already exist
  }
}

// GET - Fetch skills section (admin endpoint)
export async function GET() {
  try {
    // Ensure stat columns exist before fetching
    await ensureStatColumnsExist();

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
    // Ensure stat columns exist before updating
    await ensureStatColumnsExist();

    const body = await request.json();
    const { 
      sectionBadge, 
      sectionTitle, 
      sectionDescription, 
      stat1Value,
      stat1Label,
      stat2Value,
      stat2Label,
      stat3Value,
      stat3Label,
      isActive 
    } = body;

    // Validation
    if (!sectionTitle || !sectionDescription) {
      return NextResponse.json(
        { success: false, error: 'Section title and description are required' },
        { status: 400 }
      );
    }

    await executeQuery<ResultSetHeader>(
      `UPDATE skills_section 
       SET sectionBadge = ?, sectionTitle = ?, sectionDescription = ?, 
           stat1Value = ?, stat1Label = ?, stat2Value = ?, stat2Label = ?, 
           stat3Value = ?, stat3Label = ?, isActive = ?
       WHERE id = 1`,
      [
        sectionBadge, 
        sectionTitle, 
        sectionDescription, 
        stat1Value || '16+',
        stat1Label || 'Technologies Mastered',
        stat2Value || '85%',
        stat2Label || 'Average Proficiency',
        stat3Value || '5+',
        stat3Label || 'Years Learning',
        isActive !== false
      ]
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
