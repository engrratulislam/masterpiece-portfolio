import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface HeroRow extends RowDataPacket {
  id: number;
  badge: string;
  name: string;
  title: string;
  description: string;
  cvUrl: string | null;
  profileImage: string | null;
  yearsExperience: string;
  projectsCompleted: string;
  satisfactionRate: string;
  isActive: boolean;
}

// GET - Fetch hero section data (public endpoint)
export async function GET() {
  try {
    const hero = await executeQuery<HeroRow[]>(
      'SELECT * FROM hero_section WHERE id = 1 AND isActive = true LIMIT 1'
    );

    if (hero.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Hero section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: hero[0],
    });
  } catch (error) {
    console.error('[HERO_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hero section' },
      { status: 500 }
    );
  }
}
