import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface MediaRow extends RowDataPacket {
  id: number;
  filename: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  alt: string | null;
  category: 'image' | 'document' | 'video' | 'other';
  uploadedAt: Date;
}

// GET - Fetch single media file
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

    const files = await executeQuery<MediaRow[]>(
      'SELECT * FROM media_library WHERE id = ? LIMIT 1',
      [id]
    );

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    const file = files[0];
    const formattedFile = {
      ...file,
      uploadedAt: file.uploadedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: formattedFile,
    });
  } catch (error) {
    console.error('[MEDIA_FILE_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update media file (alt text)
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
    const { alt } = body;

    await executeQuery(
      'UPDATE media_library SET alt = ? WHERE id = ?',
      [alt || null, id]
    );

    return NextResponse.json({
      success: true,
      message: 'File updated successfully',
    });
  } catch (error) {
    console.error('[MEDIA_FILE_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete media file
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

    // Get file info first
    const files = await executeQuery<MediaRow[]>(
      'SELECT * FROM media_library WHERE id = ? LIMIT 1',
      [id]
    );

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    const file = files[0];

    // Delete from database
    await executeQuery('DELETE FROM media_library WHERE id = ?', [id]);

    // Delete physical file
    try {
      const fullPath = join(process.cwd(), 'public', file.filePath);
      if (existsSync(fullPath)) {
        await unlink(fullPath);
      }
    } catch (fileError) {
      console.error('[MEDIA_FILE_DELETE_PHYSICAL]', fileError);
      // Continue even if physical file deletion fails
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('[MEDIA_FILE_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
