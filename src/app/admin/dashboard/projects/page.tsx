'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Filter, X, Save, Layout } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';

interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string | null;
  image: string | null;
  category: string; // Changed to string for custom categories
  tags: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
}

interface ProjectsSection {
  id: number;
  sectionBadge: string;
  sectionTitle: string;
  sectionDescription: string;
  isActive: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [sectionData, setSectionData] = useState<ProjectsSection>({
    id: 1,
    sectionBadge: 'My Work',
    sectionTitle: 'Featured Projects',
    sectionDescription: 'Showcasing my best work in web development and creative coding',
    isActive: true,
  });
  const [savingSection, setSavingSection] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchSection();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      } else {
        toast.error('Failed to load projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Error loading projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchSection = async () => {
    try {
      const response = await fetch('/api/admin/projects-section');
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
      const response = await fetch('/api/admin/projects-section', {
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
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Project deleted successfully');
        setProjects(projects.filter((p) => p.id !== id));
        setDeleteConfirm(null);
      } else {
        toast.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Error deleting project');
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
            Projects
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage your portfolio projects and section header
          </p>
        </div>
        <Link
          href="/admin/dashboard/projects/new"
          className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Project</span>
        </Link>
      </div>

      {/* Section Header Management */}
      <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowSectionForm(!showSectionForm)}
          className="w-full flex items-center justify-between p-6 hover:bg-[var(--color-dark-100)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Layout className="w-6 h-6 text-purple-500" />
            <div className="text-left">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Section Header Content
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Manage the Projects section title and description
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
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="My Work"
                  required
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
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Featured Projects"
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
                rows={2}
                className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Showcasing my best work..."
                required
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={savingSection}
                className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                {savingSection ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Section
                  </>
                )}
              </button>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Changes reflect on homepage immediately
              </p>
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
              placeholder="Search projects..."
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
              <option value="all">All Projects</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6 animate-pulse"
            >
              <div className="h-48 bg-[var(--color-dark-100)] rounded-xl mb-4"></div>
              <div className="h-6 bg-[var(--color-dark-100)] rounded mb-2"></div>
              <div className="h-4 bg-[var(--color-dark-100)] rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-[var(--color-dark-100)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-[var(--color-text-secondary)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
              No projects found
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-6">
              {searchTerm || filterCategory !== 'all'
                ? 'Try adjusting your filters or search term'
                : 'Get started by adding your first project'}
            </p>
            {!searchTerm && filterCategory === 'all' && (
              <Link
                href="/admin/dashboard/projects/new"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Project</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
            >
              {/* Project Image */}
              {project.image && (
                <div className="relative h-48 overflow-hidden bg-[var(--color-dark-100)]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {project.featured && (
                    <span className="absolute top-3 right-3 px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              )}

              {/* Project Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-gradient-start)] transition-colors">
                    {project.title}
                  </h3>
                </div>

                <p className="text-[var(--color-text-secondary)] text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Category Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-[var(--color-dark-100)] text-[var(--color-text-primary)] text-xs font-medium rounded-full capitalize">
                    {project.category}
                  </span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {new Date(project.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[var(--color-gradient-start)]/10 text-[var(--color-gradient-start)] text-xs font-medium rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-1 text-[var(--color-text-secondary)] text-xs font-medium">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-[var(--color-dark-200)]">
                  <Link
                    href={`/admin/dashboard/projects/${project.id}/edit`}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit</span>
                  </Link>

                  <button
                    onClick={() => setDeleteConfirm(project.id)}
                    className="flex items-center justify-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
                Delete Project
              </h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[var(--color-text-secondary)] mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
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
