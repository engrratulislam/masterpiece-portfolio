import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

interface ExperienceRow extends RowDataPacket {
  id: number;
  company: string;
  position: string;
  duration: string;
  description: string;
  logo: string | null;
  technologies: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// GET - Fetch all experiences
export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const experiences = await executeQuery<ExperienceRow[]>(
      `SELECT * FROM work_experience ORDER BY displayOrder ASC, createdAt DESC`
    );

    const formattedExperiences = experiences.map((exp) => ({
      ...exp,
      technologies: exp.technologies ? JSON.parse(exp.technologies) : [],
      createdAt: exp.createdAt.toISOString(),
      updatedAt: exp.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: formattedExperiences,
    });
  } catch (error) {
    console.error('[EXPERIENCE_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new experience
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { company, position, duration, description, logo, technologies, displayOrder } = body;

    // Validation
    if (!company || !position || !duration || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert technologies array to JSON string
    const technologiesJson = JSON.stringify(technologies || []);

    const result = await executeQuery(
      `INSERT INTO work_experience (company, position, duration, description, logo, technologies, displayOrder)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        company,
        position,
        duration,
        description,
        logo || null,
        technologiesJson,
        displayOrder || 0,
      ]
    );

    return NextResponse.json({
      success: true,
      data: { id: (result as any).insertId },
      message: 'Experience created successfully',
    });
  } catch (error) {
    console.error('[EXPERIENCE_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
