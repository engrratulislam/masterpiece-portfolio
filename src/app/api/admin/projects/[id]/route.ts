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

// GET - Fetch single project
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

    const projects = await executeQuery<ProjectRow[]>(
      'SELECT * FROM projects WHERE id = ? LIMIT 1',
      [id]
    );

    if (projects.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const project = projects[0];
    const formattedProject = {
      ...project,
      tags: project.tags ? JSON.parse(project.tags) : [],
      date: project.date.toISOString().split('T')[0],
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: formattedProject,
    });
  } catch (error) {
    console.error('[PROJECT_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update project
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

    await executeQuery(
      `UPDATE projects 
       SET title = ?, description = ?, longDescription = ?, image = ?, 
           category = ?, tags = ?, liveUrl = ?, githubUrl = ?, featured = ?, date = ?
       WHERE id = ?`,
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
        id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
    });
  } catch (error) {
    console.error('[PROJECT_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
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

    await executeQuery('DELETE FROM projects WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('[PROJECT_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
