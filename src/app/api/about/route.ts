import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface AboutRow extends RowDataPacket {
  id: number;
  sectionBadge: string;
  sectionTitle: string;
  sectionDescription: string | null;
  profileImage: string | null;
  heading: string | null;
  paragraph1: string;
  paragraph2: string | null;
  paragraph3: string | null;
  cvUrl: string | null;
  yearsExperience: string;
  projectsCompleted: string;
  clientSatisfaction: string;
  isActive: boolean;
}

// GET - Fetch about section data (public endpoint)
export async function GET() {
  try {
    const about = await executeQuery<AboutRow[]>(
      'SELECT * FROM about_section WHERE id = 1 AND isActive = true LIMIT 1'
    );

    if (about.length === 0) {
      return NextResponse.json(
        { success: false, error: 'About section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: about[0],
    });
  } catch (error) {
    console.error('[ABOUT_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch about section' },
      { status: 500 }
    );
  }
}
