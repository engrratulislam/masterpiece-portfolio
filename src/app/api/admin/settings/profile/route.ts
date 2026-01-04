import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
}

// GET - Fetch current user profile
export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const users = await executeQuery<UserRow[]>(
      'SELECT id, email, name, role, isActive, lastLogin, createdAt FROM users WHERE email = ? LIMIT 1',
      [session.user.email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const user = users[0];
    const formattedUser = {
      ...user,
      lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
      createdAt: user.createdAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: formattedUser,
    });
  } catch (error) {
    console.error('[PROFILE_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
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

    // Check if new email is already taken by another user
    if (email !== session.user.email) {
      const existingUsers = await executeQuery<UserRow[]>(
        'SELECT id FROM users WHERE email = ? AND email != ? LIMIT 1',
        [email, session.user.email]
      );

      if (existingUsers.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Email is already in use' },
          { status: 400 }
        );
      }
    }

    // Update user profile
    await executeQuery(
      'UPDATE users SET name = ?, email = ? WHERE email = ?',
      [name, email, session.user.email]
    );

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: { name, email },
    });
  } catch (error) {
    console.error('[PROFILE_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
