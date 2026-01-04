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

// GET - Fetch all messages
export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const messages = await executeQuery<MessageRow[]>(
      `SELECT * FROM contact_messages ORDER BY createdAt DESC`
    );

    const formattedMessages = messages.map((message) => ({
      ...message,
      readAt: message.readAt ? message.readAt.toISOString() : null,
      createdAt: message.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: formattedMessages,
    });
  } catch (error) {
    console.error('[MESSAGES_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new message (for contact form submission)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const result = await executeQuery(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES (?, ?, ?, ?)`,
      [name, email, subject || null, message]
    );

    return NextResponse.json({
      success: true,
      data: { id: (result as any).insertId },
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('[MESSAGES_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
