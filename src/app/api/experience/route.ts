import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
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

// GET - Fetch all work experience (public endpoint)
export async function GET() {
  try {
    const experiences = await executeQuery<ExperienceRow[]>(
      'SELECT * FROM work_experience ORDER BY displayOrder ASC, createdAt DESC'
    );

    const formattedExperiences = experiences.map(exp => ({
      id: exp.id.toString(),
      company: exp.company,
      position: exp.position,
      location: 'Remote', // Default location
      type: 'full-time' as const,
      startDate: exp.duration.split(' - ')[0] || exp.duration,
      endDate: exp.duration.includes('Present') ? 'Present' : (exp.duration.split(' - ')[1] || 'Present'),
      description: exp.description,
      responsibilities: [], // Can be added to schema later
      achievements: [], // Can be added to schema later
      technologies: JSON.parse(exp.technologies || '[]'),
      logo: exp.logo,
      companyUrl: undefined,
    }));

    return NextResponse.json({
      success: true,
      data: formattedExperiences,
    });
  } catch (error) {
    console.error('[EXPERIENCE_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}
