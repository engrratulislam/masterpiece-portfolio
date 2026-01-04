import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { executeQuery } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface CountResult extends RowDataPacket {
  count: number;
}

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all statistics in parallel
    const [projectsResult, skillsResult, experienceResult, messagesResult, unreadResult, mediaResult] = await Promise.all([
      executeQuery<CountResult[]>('SELECT COUNT(*) as count FROM projects'),
      executeQuery<CountResult[]>('SELECT COUNT(*) as count FROM skills'),
      executeQuery<CountResult[]>('SELECT COUNT(*) as count FROM work_experience'),
      executeQuery<CountResult[]>('SELECT COUNT(*) as count FROM contact_messages'),
      executeQuery<CountResult[]>('SELECT COUNT(*) as count FROM contact_messages WHERE isRead = false'),
      executeQuery<CountResult[]>('SELECT COUNT(*) as count FROM media_library'),
    ]);

    const stats = {
      totalProjects: projectsResult[0].count,
      totalSkills: skillsResult[0].count,
      totalExperience: experienceResult[0].count,
      totalMessages: messagesResult[0].count,
      unreadMessages: unreadResult[0].count,
      totalMedia: mediaResult[0].count,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
