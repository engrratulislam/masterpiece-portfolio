import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';
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
  tech1: string | null;
  tech2: string | null;
  tech3: string | null;
  tech4: string | null;
  tech5: string | null;
  tech6: string | null;
  tech7: string | null;
  tech8: string | null;
  tech9: string | null;
  isActive: boolean;
  updatedAt: Date;
}

// GET - Fetch hero section data
export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const hero = await executeQuery<HeroRow[]>(
      'SELECT * FROM hero_section WHERE id = 1 LIMIT 1'
    );

    if (hero.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Hero section not found' },
        { status: 404 }
      );
    }

    const formattedHero = {
      ...hero[0],
      updatedAt: hero[0].updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: formattedHero,
    });
  } catch (error) {
    console.error('[HERO_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update hero section
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      badge,
      name,
      title,
      description,
      cvUrl,
      profileImage,
      yearsExperience,
      projectsCompleted,
      satisfactionRate,
      tech1,
      tech2,
      tech3,
      tech4,
      tech5,
      tech6,
      tech7,
      tech8,
      tech9,
      isActive,
    } = body;

    // Validation
    if (!badge || !name || !title || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await executeQuery(
      `UPDATE hero_section SET 
        badge = ?,
        name = ?,
        title = ?,
        description = ?,
        cvUrl = ?,
        profileImage = ?,
        yearsExperience = ?,
        projectsCompleted = ?,
        satisfactionRate = ?,
        tech1 = ?,
        tech2 = ?,
        tech3 = ?,
        tech4 = ?,
        tech5 = ?,
        tech6 = ?,
        tech7 = ?,
        tech8 = ?,
        tech9 = ?,
        isActive = ?
      WHERE id = 1`,
      [
        badge,
        name,
        title,
        description,
        cvUrl || null,
        profileImage || null,
        yearsExperience,
        projectsCompleted,
        satisfactionRate,
        tech1 || null,
        tech2 || null,
        tech3 || null,
        tech4 || null,
        tech5 || null,
        tech6 || null,
        tech7 || null,
        tech8 || null,
        tech9 || null,
        isActive,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Hero section updated successfully',
    });
  } catch (error) {
    console.error('[HERO_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
