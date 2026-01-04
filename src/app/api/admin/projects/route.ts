import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

interface ProjectRow extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  longDescription: string | null;
  image: string | null;
  category: string; // Changed to string for custom categories
  tags: string;
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

// GET - Fetch all projects
export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const projects = await executeQuery<ProjectRow[]>(
      `SELECT * FROM projects ORDER BY date DESC, createdAt DESC`
    );

    // Parse JSON tags
    const formattedProjects = projects.map((project) => ({
      ...project,
      tags: project.tags ? JSON.parse(project.tags) : [],
      date: project.date.toISOString().split('T')[0],
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: formattedProjects,
    });
  } catch (error) {
    console.error('[PROJECTS_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new project
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
    const {
      title,
      description,
      longDescription,
      image,
      category,
      tags,
      liveUrl,
      githubUrl,
      featured,
      date,
    } = body;

    // Validation
    if (!title || !description || !category || !date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert tags array to JSON string
    const tagsJson = JSON.stringify(tags || []);

    const result = await executeQuery(
      `INSERT INTO projects 
       (title, description, longDescription, image, category, tags, liveUrl, githubUrl, featured, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        longDescription || null,
        image || null,
        category,
        tagsJson,
        liveUrl || null,
        githubUrl || null,
        featured || false,
        date,
      ]
    );

    return NextResponse.json({
      success: true,
      data: { id: (result as any).insertId },
      message: 'Project created successfully',
    });
  } catch (error) {
    console.error('[PROJECTS_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
