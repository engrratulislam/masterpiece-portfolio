import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
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
}

// GET - Fetch all active testimonials (public endpoint)
export async function GET() {
  try {
    const testimonials = await executeQuery<TestimonialRow[]>(
      'SELECT * FROM testimonials WHERE isActive = true ORDER BY displayOrder ASC, createdAt DESC'
    );

    const formattedTestimonials = testimonials.map(testimonial => ({
      id: testimonial.id.toString(),
      name: testimonial.name,
      position: testimonial.position,
      company: testimonial.company,
      image: testimonial.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      rating: testimonial.rating,
      text: testimonial.text,
      date: testimonial.createdAt.toISOString().split('T')[0],
      projectType: undefined, // Can be added to schema later
    }));

    return NextResponse.json({
      success: true,
      data: formattedTestimonials,
    });
  } catch (error) {
    console.error('[TESTIMONIALS_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}
