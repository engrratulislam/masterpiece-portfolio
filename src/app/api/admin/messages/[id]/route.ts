import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

interface MessageRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
}

// GET - Fetch single message
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

    const messages = await executeQuery<MessageRow[]>(
      'SELECT * FROM contact_messages WHERE id = ? LIMIT 1',
      [id]
    );

    if (messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    const message = messages[0];
    const formattedMessage = {
      ...message,
      readAt: message.readAt ? message.readAt.toISOString() : null,
      createdAt: message.createdAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: formattedMessage,
    });
  } catch (error) {
    console.error('[MESSAGE_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete message
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

    await executeQuery('DELETE FROM contact_messages WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('[MESSAGE_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
