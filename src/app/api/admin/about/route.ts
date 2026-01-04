import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';
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
  updatedAt: Date;
}

// GET - Fetch about section data
export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const about = await executeQuery<AboutRow[]>(
      'SELECT * FROM about_section WHERE id = 1 LIMIT 1'
    );

    if (about.length === 0) {
      return NextResponse.json(
        { success: false, error: 'About section not found' },
        { status: 404 }
      );
    }

    const formattedAbout = {
      ...about[0],
      updatedAt: about[0].updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: formattedAbout,
    });
  } catch (error) {
    console.error('[ABOUT_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update about section
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
      sectionBadge,
      sectionTitle,
      sectionDescription,
      profileImage,
      heading,
      paragraph1,
      paragraph2,
      paragraph3,
      cvUrl,
      yearsExperience,
      projectsCompleted,
      clientSatisfaction,
      isActive,
    } = body;

    // Validation
    if (!sectionBadge || !sectionTitle || !paragraph1) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await executeQuery(
      `UPDATE about_section SET 
        sectionBadge = ?,
        sectionTitle = ?,
        sectionDescription = ?,
        profileImage = ?,
        heading = ?,
        paragraph1 = ?,
        paragraph2 = ?,
        paragraph3 = ?,
        cvUrl = ?,
        yearsExperience = ?,
        projectsCompleted = ?,
        clientSatisfaction = ?,
        isActive = ?
      WHERE id = 1`,
      [
        sectionBadge,
        sectionTitle,
        sectionDescription || null,
        profileImage || null,
        heading || null,
        paragraph1,
        paragraph2 || null,
        paragraph3 || null,
        cvUrl || null,
        yearsExperience,
        projectsCompleted,
        clientSatisfaction,
        isActive,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'About section updated successfully',
    });
  } catch (error) {
    console.error('[ABOUT_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
