import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

interface TestimonialRow extends RowDataPacket {
  id: number;
  name: string;
  position: string;
  company: string;
  avatar: string | null;
  rating: number;
  text: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// GET - Fetch single testimonial
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

    const testimonials = await executeQuery<TestimonialRow[]>(
      'SELECT * FROM testimonials WHERE id = ? LIMIT 1',
      [id]
    );

    if (testimonials.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    const testimonial = testimonials[0];
    const formattedTestimonial = {
      ...testimonial,
      createdAt: testimonial.createdAt.toISOString(),
      updatedAt: testimonial.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: formattedTestimonial,
    });
  } catch (error) {
    console.error('[TESTIMONIAL_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update testimonial
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
    const { name, position, company, avatar, rating, text, displayOrder, isActive } = body;

    // Validation
    if (!name || !position || !company || rating === undefined || !text) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    await executeQuery(
      `UPDATE testimonials 
       SET name = ?, position = ?, company = ?, avatar = ?, rating = ?, text = ?, displayOrder = ?, isActive = ?
       WHERE id = ?`,
      [name, position, company, avatar || null, rating, text, displayOrder || 0, isActive !== undefined ? isActive : true, id]
    );

    return NextResponse.json({
      success: true,
      message: 'Testimonial updated successfully',
    });
  } catch (error) {
    console.error('[TESTIMONIAL_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete testimonial
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

    await executeQuery('DELETE FROM testimonials WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    console.error('[TESTIMONIAL_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
