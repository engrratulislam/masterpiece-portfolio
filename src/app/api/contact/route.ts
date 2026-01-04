import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface ContactRow extends RowDataPacket {
  id: number;
  sectionBadge: string;
  sectionTitle: string;
  sectionDescription: string | null;
  contactInfoTitle: string;
  contactInfoDescription: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  socialTitle: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  facebookUrl: string | null;
  isActive: boolean;
}

// GET - Fetch contact section data (public endpoint)
export async function GET() {
  try {
    const contact = await executeQuery<ContactRow[]>(
      'SELECT * FROM contact_section WHERE id = 1 AND isActive = true LIMIT 1'
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
    console.error('[CONTACT_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact section' },
      { status: 500 }
    );
  }
}
