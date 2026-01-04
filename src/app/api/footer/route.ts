import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface FooterRow extends RowDataPacket {
  id: number;
  brandName: string;
  brandDescription: string;
  quickLinksTitle: string;
  quickLink1Name: string | null;
  quickLink1Href: string | null;
  quickLink2Name: string | null;
  quickLink2Href: string | null;
  quickLink3Name: string | null;
  quickLink3Href: string | null;
  quickLink4Name: string | null;
  quickLink4Href: string | null;
  socialTitle: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
  emailAddress: string | null;
  copyrightText: string;
  footerNote: string | null;
  isActive: boolean;
}

// GET - Fetch footer section data (public endpoint)
export async function GET() {
  try {
    const footer = await executeQuery<FooterRow[]>(
      'SELECT * FROM footer_section WHERE id = 1 AND isActive = true LIMIT 1'
    );

    if (footer.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Footer section not found' },
        { status: 404 }
      );
    }

    const footerData = footer[0];

    return NextResponse.json({
      success: true,
      data: footerData,
    });
  } catch (error) {
    console.error('[FOOTER_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch footer section' },
      { status: 500 }
    );
  }
}
