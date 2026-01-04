import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';
import { writeFile, mkdir } from 'fs/promises';
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

// GET - Fetch all media files
export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const mediaFiles = await executeQuery<MediaRow[]>(
      `SELECT * FROM media_library ORDER BY uploadedAt DESC`
    );

    const formattedFiles = mediaFiles.map((file) => ({
      ...file,
      uploadedAt: file.uploadedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: formattedFiles,
    });
  } catch (error) {
    console.error('[MEDIA_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Upload new media files
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedFiles = [];

    for (const file of files) {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileExtension = file.name.split('.').pop();
      const filename = `${timestamp}_${randomString}.${fileExtension}`;
      const filePath = `/uploads/${filename}`;
      const fullPath = join(uploadDir, filename);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(fullPath, buffer);

      // Determine category based on MIME type
      let category: 'image' | 'document' | 'video' | 'other' = 'other';
      if (file.type.startsWith('image/')) {
        category = 'image';
      } else if (file.type.startsWith('video/')) {
        category = 'video';
      } else if (
        file.type.includes('pdf') ||
        file.type.includes('document') ||
        file.type.includes('text')
      ) {
        category = 'document';
      }

      // Insert into database
      const result = await executeQuery(
        `INSERT INTO media_library (filename, originalName, filePath, fileSize, mimeType, category)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [filename, file.name, filePath, file.size, file.type, category]
      );

      uploadedFiles.push({
        id: (result as any).insertId,
        filename,
        originalName: file.name,
        filePath,
        fileSize: file.size,
        mimeType: file.type,
        category,
      });
    }

    return NextResponse.json({
      success: true,
      data: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
    });
  } catch (error) {
    console.error('[MEDIA_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
