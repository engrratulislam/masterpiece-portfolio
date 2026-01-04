import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface SkillCategoryRow extends RowDataPacket {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// GET - Fetch all skill categories
export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const categories = await executeQuery<SkillCategoryRow[]>(
      `SELECT * FROM skill_categories ORDER BY displayOrder ASC, name ASC`
    );

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('[SKILL_CATEGORIES_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new skill category
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
    const { name, slug, description, icon, displayOrder } = body;

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await executeQuery<SkillCategoryRow[]>(
      `SELECT id FROM skill_categories WHERE slug = ?`,
      [slug]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Category slug already exists' },
        { status: 409 }
      );
    }

    const result = await executeQuery<ResultSetHeader>(
      `INSERT INTO skill_categories (name, slug, description, icon, displayOrder) VALUES (?, ?, ?, ?, ?)`,
      [name, slug, description || null, icon || null, displayOrder || 0]
    );

    return NextResponse.json({
      success: true,
      data: { id: result.insertId },
      message: 'Skill category created successfully',
    });
  } catch (error) {
    console.error('[SKILL_CATEGORIES_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update skill category
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, name, slug, description, icon, displayOrder, isActive } = body;

    // Validation
    if (!id || !name || !slug) {
      return NextResponse.json(
        { success: false, error: 'ID, name, and slug are required' },
        { status: 400 }
      );
    }

    await executeQuery<ResultSetHeader>(
      `UPDATE skill_categories SET name = ?, slug = ?, description = ?, icon = ?, displayOrder = ?, isActive = ? WHERE id = ?`,
      [name, slug, description || null, icon || null, displayOrder || 0, isActive !== false, id]
    );

    return NextResponse.json({
      success: true,
      message: 'Skill category updated successfully',
    });
  } catch (error) {
    console.error('[SKILL_CATEGORIES_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete skill category
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Check if category is being used by any skills
    const skills = await executeQuery<RowDataPacket[]>(
      `SELECT id FROM skills WHERE category = (SELECT slug FROM skill_categories WHERE id = ?) LIMIT 1`,
      [id]
    );

    if (skills.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete category that is in use by skills' },
        { status: 409 }
      );
    }

    await executeQuery<ResultSetHeader>(
      `DELETE FROM skill_categories WHERE id = ?`,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: 'Skill category deleted successfully',
    });
  } catch (error) {
    console.error('[SKILL_CATEGORIES_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
