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

// GET - Fetch all testimonials
export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const testimonials = await executeQuery<TestimonialRow[]>(
      `SELECT * FROM testimonials ORDER BY displayOrder ASC, createdAt DESC`
    );

    const formattedTestimonials = testimonials.map((testimonial) => ({
      ...testimonial,
      createdAt: testimonial.createdAt.toISOString(),
      updatedAt: testimonial.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: formattedTestimonials,
    });
  } catch (error) {
    console.error('[TESTIMONIALS_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    const result = await executeQuery(
      `INSERT INTO testimonials (name, position, company, avatar, rating, text, displayOrder, isActive)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        position,
        company,
        avatar || null,
        rating,
        text,
        displayOrder || 0,
        isActive !== undefined ? isActive : true,
      ]
    );

    return NextResponse.json({
      success: true,
      data: { id: (result as any).insertId },
      message: 'Testimonial created successfully',
    });
  } catch (error) {
    console.error('[TESTIMONIALS_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
