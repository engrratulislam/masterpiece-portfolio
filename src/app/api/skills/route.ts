import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface SkillRow extends RowDataPacket {
  id: number;
  name: string;
  level: number;
  icon: string | null;
  category: 'frontend' | 'backend' | 'design' | 'tools';
  displayOrder: number;
}

// GET - Fetch all skills (public endpoint)
export async function GET() {
  try {
    const skills = await executeQuery<SkillRow[]>(
      'SELECT * FROM skills ORDER BY displayOrder ASC, name ASC'
    );

    const formattedSkills = skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      level: skill.level,
      icon: skill.icon || '🔧',
      category: skill.category,
      color: getCategoryColor(skill.category),
    }));

    return NextResponse.json({
      success: true,
      data: formattedSkills,
    });
  } catch (error) {
    console.error('[SKILLS_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// Helper function to get category colors
function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    frontend: 'from-blue-500 to-cyan-500',
    backend: 'from-green-500 to-emerald-500',
    design: 'from-purple-500 to-pink-500',
    tools: 'from-orange-500 to-red-500',
  };
  return colorMap[category] || 'from-gray-500 to-slate-500';
}
