import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';

// PATCH - Toggle testimonial active status
export async function PATCH(
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
    const { isActive } = body;

    if (isActive === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing isActive field' },
        { status: 400 }
      );
    }

    await executeQuery(
      'UPDATE testimonials SET isActive = ? WHERE id = ?',
      [isActive, id]
    );

    return NextResponse.json({
      success: true,
      message: `Testimonial ${isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('[TESTIMONIAL_TOGGLE]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
