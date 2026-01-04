import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import type { FooterSection } from '@/types';

// GET - Fetch footer section (admin with auth)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const footer = await executeQuery<(FooterSection & RowDataPacket)[]>(
      'SELECT * FROM footer_section WHERE id = 1 LIMIT 1'
    );

    if (footer.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Footer section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: footer[0],
    });
  } catch (error) {
    console.error('[ADMIN_FOOTER_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch footer section' },
      { status: 500 }
    );
  }
}

// PUT - Update footer section (admin with auth)
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
      brandName,
      brandDescription,
      quickLinksTitle,
      quickLink1Name,
      quickLink1Href,
      quickLink2Name,
      quickLink2Href,
      quickLink3Name,
      quickLink3Href,
      quickLink4Name,
      quickLink4Href,
      socialTitle,
      githubUrl,
      linkedinUrl,
      emailAddress,
      copyrightText,
      footerNote,
      isActive,
    } = body;

    // Validation
    if (!brandName || !brandDescription || !copyrightText) {
      return NextResponse.json(
        { success: false, error: 'Brand name, description, and copyright text are required' },
        { status: 400 }
      );
    }

    await executeQuery<ResultSetHeader>(
      `UPDATE footer_section 
       SET brandName = ?,
           brandDescription = ?,
           quickLinksTitle = ?,
           quickLink1Name = ?,
           quickLink1Href = ?,
           quickLink2Name = ?,
           quickLink2Href = ?,
           quickLink3Name = ?,
           quickLink3Href = ?,
           quickLink4Name = ?,
           quickLink4Href = ?,
           socialTitle = ?,
           githubUrl = ?,
           linkedinUrl = ?,
           emailAddress = ?,
           copyrightText = ?,
           footerNote = ?,
           isActive = ?
       WHERE id = 1`,
      [
        brandName,
        brandDescription,
        quickLinksTitle || 'Quick Links',
        quickLink1Name || null,
        quickLink1Href || null,
        quickLink2Name || null,
        quickLink2Href || null,
        quickLink3Name || null,
        quickLink3Href || null,
        quickLink4Name || null,
        quickLink4Href || null,
        socialTitle || 'Connect',
        githubUrl || null,
        linkedinUrl || null,
        emailAddress || null,
        copyrightText,
        footerNote || null,
        isActive !== undefined ? isActive : true,
      ]
    );

    // Fetch updated data
    const updated = await executeQuery<(FooterSection & RowDataPacket)[]>(
      'SELECT * FROM footer_section WHERE id = 1 LIMIT 1'
    );

    return NextResponse.json({
      success: true,
      data: updated[0],
      message: 'Footer section updated successfully',
    });
  } catch (error) {
    console.error('[ADMIN_FOOTER_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update footer section' },
      { status: 500 }
    );
  }
}
