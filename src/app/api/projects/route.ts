import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface ProjectRow extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  longDescription: string | null;
  image: string | null;
  category: 'web' | 'mobile' | 'design' | '3d';
  tags: string;
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectImageRow extends RowDataPacket {
  imageUrl: string;
}

// GET - Fetch all projects (public endpoint)
export async function GET() {
  try {
    const projects = await executeQuery<ProjectRow[]>(
      `SELECT * FROM projects ORDER BY date DESC, createdAt DESC`
    );

    // Fetch images for each project
    const projectsWithImages = await Promise.all(
      projects.map(async (project) => {
        const images = await executeQuery<ProjectImageRow[]>(
          'SELECT imageUrl FROM project_images WHERE projectId = ? ORDER BY displayOrder ASC',
          [project.id]
        );

        return {
          id: project.id.toString(),
          title: project.title,
          description: project.description,
          longDescription: project.longDescription || project.description,
          image: project.image || (images.length > 0 ? images[0].imageUrl : ''),
          images: images.map(img => img.imageUrl),
          category: project.category,
          tags: JSON.parse(project.tags || '[]'),
          liveUrl: project.liveUrl,
          githubUrl: project.githubUrl,
          featured: project.featured,
          date: project.date.toISOString().split('T')[0],
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: projectsWithImages,
    });
  } catch (error) {
    console.error('[PROJECTS_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
