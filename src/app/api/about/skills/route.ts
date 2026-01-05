import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface AboutSkillRow extends RowDataPacket {
  id: number;
  skillId: number;
  displayOrder: number;
  name: string;
  level: number;
  icon: string | null;
  category: string;
}

// Check if the about_skills table exists
async function tableExists(): Promise<boolean> {
  try {
    const result = await executeQuery<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = DATABASE() AND table_name = 'about_skills'`
    );
    return result[0]?.count > 0;
  } catch {
    return false;
  }
}

// GET - Fetch selected skills for About section (public endpoint)
export async function GET() {
  try {
    // Check if table exists first
    const exists = await tableExists();
    if (!exists) {
      // Return empty array if table doesn't exist yet
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const skills = await executeQuery<AboutSkillRow[]>(
      `SELECT 
        abs.id,
        abs.skillId,
        abs.displayOrder,
        s.name,
        s.level,
        s.icon,
        s.category
      FROM about_skills abs
      JOIN skills s ON abs.skillId = s.id
      WHERE abs.isActive = true
      ORDER BY abs.displayOrder ASC`
    );

    // Format skills with color based on category
    const formattedSkills = skills.map(skill => ({
      id: skill.skillId,
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
    console.error('[ABOUT_SKILLS_PUBLIC_GET]', error);
    // Return empty array on error to prevent UI from breaking
    return NextResponse.json({
      success: true,
      data: [],
    });
  }
}

// Helper function to get category colors (matching Skills section pattern)
function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    frontend: 'from-blue-500 to-cyan-500',
    backend: 'from-green-500 to-emerald-500',
    design: 'from-purple-500 to-pink-500',
    tools: 'from-orange-500 to-red-500',
  };
  return colorMap[category] || 'from-gray-500 to-slate-500';
}
