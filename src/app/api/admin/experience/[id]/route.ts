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

// GET - Fetch single experience
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const experiences = await executeQuery<ExperienceRow[]>(
      'SELECT * FROM work_experience WHERE id = ? LIMIT 1',
      [id]
    );

    if (experiences.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Experience not found' },
        { status: 404 }
      );
    }

    const exp = experiences[0];
    const formattedExperience = {
      ...exp,
      technologies: exp.technologies ? JSON.parse(exp.technologies) : [],
      createdAt: exp.createdAt.toISOString(),
      updatedAt: exp.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: formattedExperience,
    });
  } catch (error) {
    console.error('[EXPERIENCE_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update experience
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
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

    await executeQuery(
      `UPDATE work_experience 
       SET company = ?, position = ?, duration = ?, description = ?, logo = ?, technologies = ?, displayOrder = ?
       WHERE id = ?`,
      [company, position, duration, description, logo || null, technologiesJson, displayOrder || 0, id]
    );

    return NextResponse.json({
      success: true,
      message: 'Experience updated successfully',
    });
  } catch (error) {
    console.error('[EXPERIENCE_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete experience
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await executeQuery('DELETE FROM work_experience WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Experience deleted successfully',
    });
  } catch (error) {
    console.error('[EXPERIENCE_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
