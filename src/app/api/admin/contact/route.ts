import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import type { ContactSection } from '@/types';

// GET - Fetch contact section (admin with auth)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const contact = await executeQuery<(ContactSection & RowDataPacket)[]>(
      'SELECT * FROM contact_section WHERE id = 1 LIMIT 1'
    );

    if (contact.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Contact section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contact[0],
    });
  } catch (error) {
    console.error('[ADMIN_CONTACT_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact section' },
      { status: 500 }
    );
  }
}

// PUT - Update contact section (admin with auth)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      sectionBadge,
      sectionTitle,
      sectionDescription,
      contactInfoTitle,
      contactInfoDescription,
      email,
      phone,
      location,
      socialTitle,
      githubUrl,
      linkedinUrl,
      twitterUrl,
      facebookUrl,
      isActive,
    } = body;

    // Validation
    if (!sectionTitle || !email || !contactInfoTitle) {
      return NextResponse.json(
        { success: false, error: 'Section title, email, and contact info title are required' },
        { status: 400 }
      );
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    await executeQuery<ResultSetHeader>(
      `UPDATE contact_section 
       SET sectionBadge = ?,
           sectionTitle = ?,
           sectionDescription = ?,
           contactInfoTitle = ?,
           contactInfoDescription = ?,
           email = ?,
           phone = ?,
           location = ?,
           socialTitle = ?,
           githubUrl = ?,
           linkedinUrl = ?,
           twitterUrl = ?,
           facebookUrl = ?,
           isActive = ?
       WHERE id = 1`,
      [
        sectionBadge || 'Get In Touch',
        sectionTitle,
        sectionDescription || null,
        contactInfoTitle,
        contactInfoDescription || null,
        email,
        phone || null,
        location || null,
        socialTitle || 'Follow Me',
        githubUrl || null,
        linkedinUrl || null,
        twitterUrl || null,
        facebookUrl || null,
        isActive !== undefined ? isActive : true,
      ]
    );

    // Fetch updated data
    const updated = await executeQuery<(ContactSection & RowDataPacket)[]>(
      'SELECT * FROM contact_section WHERE id = 1 LIMIT 1'
    );

    return NextResponse.json({
      success: true,
      data: updated[0],
      message: 'Contact section updated successfully',
    });
  } catch (error) {
    console.error('[ADMIN_CONTACT_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update contact section' },
      { status: 500 }
    );
  }
}
