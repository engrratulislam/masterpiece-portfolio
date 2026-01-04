'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, X, TrendingUp, Layout } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';

interface Skill {
  id: number;
  name: string;
  level: number;
  icon: string | null;
  category: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface SkillCategory {
  id: number;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
}

interface SkillsSection {
  id: number;
  sectionBadge: string;
  sectionTitle: string;
  sectionDescription: string;
  isActive: boolean;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [sectionData, setSectionData] = useState<SkillsSection>({
    id: 1,
    sectionBadge: 'What I Do Best',
    sectionTitle: 'Skills & Expertise',
    sectionDescription: 'Technologies and tools I use to bring ideas to life',
    isActive: true,
  });
  const [savingSection, setSavingSection] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState(false);

  useEffect(() => {
    fetchSkills();
    fetchSection();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/skill-categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/admin/skills');
      if (response.ok) {
        const data = await response.json();
        setSkills(data.data || []);
      } else {
        toast.error('Failed to load skills');
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Error loading skills');
    } finally {
      setLoading(false);
    }
  };

  const fetchSection = async () => {
    try {
      const response = await fetch('/api/admin/skills-section');
      if (response.ok) {
        const data = await response.json();
        setSectionData(data.data);
      }
    } catch (error) {
      console.error('Error fetching section:', error);
    }
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSection(true);

    try {
      const response = await fetch('/api/admin/skills-section', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionData),
      });

      if (response.ok) {
        toast.success('Section header updated successfully');
        fetchSection();
      } else {
        toast.error('Failed to update section header');
      }
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error('Error updating section header');
    } finally {
      setSavingSection(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Skill deleted successfully');
        setSkills(skills.filter((s) => s.id !== id));
        setDeleteConfirm(null);
      } else {
        toast.error('Failed to delete skill');
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Error deleting skill');
    }
  };

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || skill.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      frontend: 'bg-cyan-500/10 text-cyan-500',
      backend: 'bg-green-500/10 text-green-500',
      design: 'bg-purple-500/10 text-purple-500',
      tools: 'bg-orange-500/10 text-orange-500',
    };
    return colors[category] || 'bg-gray-500/10 text-gray-500';
  };

  const getLevelColor = (level: number) => {
    if (level >= 80) return 'text-green-500';
    if (level >= 60) return 'text-blue-500';
    if (level >= 40) return 'text-yellow-500';
    return 'text-orange-500';
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
            Skills
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage your technical skills and section header
          </p>
        </div>
        <Link
          href="/admin/dashboard/skills/new"
          className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Skill</span>
        </Link>
      </div>

      {/* Section Header Management */}
      <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowSectionForm(!showSectionForm)}
          className="w-full flex items-center justify-between p-6 hover:bg-[var(--color-dark-100)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Layout className="w-6 h-6 text-orange-500" />
            <div className="text-left">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Section Header Content
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Manage the Skills section title and description
              </p>
            </div>
          </div>
          <span className="text-[var(--color-text-secondary)] text-sm">
            {showSectionForm ? 'Hide' : 'Show'}
          </span>
        </button>
        
        {showSectionForm && (
          <form onSubmit={handleSaveSection} className="p-6 pt-0 space-y-4 border-t border-[var(--color-dark-200)]">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Section Badge
                </label>
                <input
                  type="text"
                  value={sectionData.sectionBadge}
                  onChange={(e) => setSectionData({ ...sectionData, sectionBadge: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="What I Do Best"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={sectionData.sectionTitle}
                  onChange={(e) => setSectionData({ ...sectionData, sectionTitle: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Skills & Expertise"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                Section Description
              </label>
              <textarea
                value={sectionData.sectionDescription}
                onChange={(e) => setSectionData({ ...sectionData, sectionDescription: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px] resize-y"
                placeholder="Technologies and tools I use to bring ideas to life"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingSection}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingSection ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Skills List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6 animate-pulse"
            >
              <div className="h-6 bg-[var(--color-dark-100)] rounded mb-4"></div>
              <div className="h-4 bg-[var(--color-dark-100)] rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-[var(--color-dark-100)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-[var(--color-text-secondary)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
              No skills found
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-6">
              {searchTerm || filterCategory !== 'all'
                ? 'Try adjusting your filters or search term'
                : 'Get started by adding your first skill'}
            </p>
            {!searchTerm && filterCategory === 'all' && (
              <Link
                href="/admin/dashboard/skills/new"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Skill</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200 group"
            >
              {/* Skill Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {skill.icon && (
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-dark-100)] flex items-center justify-center text-2xl">
                      {skill.icon}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-gradient-start)] transition-colors">
                      {skill.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(skill.category)}`}>
                      {skill.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Level Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--color-text-secondary)] font-medium">
                    Proficiency Level
                  </span>
                  <span className={`text-sm font-bold ${getLevelColor(skill.level)}`}>
                    {skill.level}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[var(--color-dark-100)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] transition-all duration-300"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>

              {/* Display Order */}
              <div className="flex items-center space-x-2 mb-4 text-xs text-[var(--color-text-secondary)]">
                <TrendingUp className="w-4 h-4" />
                <span>Display Order: {skill.displayOrder}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-[var(--color-dark-200)]">
                <Link
                  href={`/admin/dashboard/skills/${skill.id}/edit`}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm font-medium">Edit</span>
                </Link>

                <button
                  onClick={() => setDeleteConfirm(skill.id)}
                  className="flex items-center justify-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                Delete Skill
              </h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[var(--color-text-secondary)] mb-6">
              Are you sure you want to delete this skill? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
