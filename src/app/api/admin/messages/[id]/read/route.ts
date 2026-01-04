import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';

// PATCH - Mark message as read/unread
export async function PATCH(
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
    const { isRead } = body;

    if (isRead === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing isRead field' },
        { status: 400 }
      );
    }

    // Set readAt to current timestamp if marking as read, null if marking as unread
    const readAt = isRead ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null;

    await executeQuery(
      'UPDATE contact_messages SET isRead = ?, readAt = ? WHERE id = ?',
      [isRead, readAt, id]
    );

    return NextResponse.json({
      success: true,
      message: `Message marked as ${isRead ? 'read' : 'unread'}`,
    });
  } catch (error) {
    console.error('[MESSAGE_READ]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
