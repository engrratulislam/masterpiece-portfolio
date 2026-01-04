import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { auth } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface CategoryRow extends RowDataPacket {
  id: number;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// GET - Fetch all categories
export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const categories = await executeQuery<CategoryRow[]>(
      `SELECT * FROM project_categories ORDER BY displayOrder ASC, name ASC`
    );

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('[CATEGORIES_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new category
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
    const { name, slug, displayOrder } = body;

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await executeQuery<CategoryRow[]>(
      `SELECT id FROM project_categories WHERE slug = ?`,
      [slug]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Category slug already exists' },
        { status: 409 }
      );
    }

    const result = await executeQuery<ResultSetHeader>(
      `INSERT INTO project_categories (name, slug, displayOrder) VALUES (?, ?, ?)`,
      [name, slug, displayOrder || 0]
    );

    return NextResponse.json({
      success: true,
      data: { id: result.insertId },
      message: 'Category created successfully',
    });
  } catch (error) {
    console.error('[CATEGORIES_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update category
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
    const { id, name, slug, displayOrder, isActive } = body;

    // Validation
    if (!id || !name || !slug) {
      return NextResponse.json(
        { success: false, error: 'ID, name, and slug are required' },
        { status: 400 }
      );
    }

    await executeQuery<ResultSetHeader>(
      `UPDATE project_categories SET name = ?, slug = ?, displayOrder = ?, isActive = ? WHERE id = ?`,
      [name, slug, displayOrder || 0, isActive !== false, id]
    );

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('[CATEGORIES_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
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

    // Check if category is being used by any projects
    const projects = await executeQuery<RowDataPacket[]>(
      `SELECT id FROM projects WHERE category = (SELECT slug FROM project_categories WHERE id = ?) LIMIT 1`,
      [id]
    );

    if (projects.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete category that is in use by projects' },
        { status: 409 }
      );
    }

    await executeQuery<ResultSetHeader>(
      `DELETE FROM project_categories WHERE id = ?`,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('[CATEGORIES_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
