'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, X, Building2, Calendar, MapPin, Layout } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';

interface Experience {
  id: number;
  company: string;
  position: string;
  duration: string;
  description: string;
  logo: string | null;
  technologies: string[];
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface ExperienceSection {
  id: number;
  sectionBadge: string;
  sectionTitle: string;
  sectionDescription: string;
  isActive: boolean;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [sectionData, setSectionData] = useState<ExperienceSection>({
    id: 1,
    sectionBadge: 'Career Journey',
    sectionTitle: 'Work Experience',
    sectionDescription: 'My professional journey and key achievements',
    isActive: true,
  });
  const [savingSection, setSavingSection] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState(false);

  useEffect(() => {
    fetchExperiences();
    fetchSection();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/admin/experience');
      if (response.ok) {
        const data = await response.json();
        setExperiences(data.data || []);
      } else {
        toast.error('Failed to load experiences');
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
      toast.error('Error loading experiences');
    } finally {
      setLoading(false);
    }
  };

  const fetchSection = async () => {
    try {
      const response = await fetch('/api/admin/experience-section');
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
      const response = await fetch('/api/admin/experience-section', {
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
      const response = await fetch(`/api/admin/experience/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Experience deleted successfully');
        setExperiences(experiences.filter((e) => e.id !== id));
        setDeleteConfirm(null);
      } else {
        toast.error('Failed to delete experience');
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Error deleting experience');
    }
  };

  const filteredExperiences = experiences.filter((exp) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      exp.company.toLowerCase().includes(searchLower) ||
      exp.position.toLowerCase().includes(searchLower) ||
      exp.description.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
            Work Experience
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage your professional work history and section header
          </p>
        </div>
        <Link
          href="/admin/dashboard/experience/new"
          className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Experience</span>
        </Link>
      </div>

      {/* Section Header Management */}
      <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowSectionForm(!showSectionForm)}
          className="w-full flex items-center justify-between p-6 hover:bg-[var(--color-dark-100)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Layout className="w-6 h-6 text-blue-500" />
            <div className="text-left">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Section Header Content
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Manage the Experience section title and description
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
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Career Journey"
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
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Work Experience"
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
                className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
                placeholder="My professional journey and key achievements"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingSection}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingSection ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Search */}
      <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
          <input
            type="text"
            placeholder="Search by company, position, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
          />
        </div>
      </div>

      {/* Experience Timeline */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6 animate-pulse"
            >
              <div className="flex gap-6">
                <div className="w-16 h-16 bg-[var(--color-dark-100)] rounded-xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-[var(--color-dark-100)] rounded w-1/3"></div>
                  <div className="h-4 bg-[var(--color-dark-100)] rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredExperiences.length === 0 ? (
        <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-[var(--color-dark-100)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-[var(--color-text-secondary)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
              No experience found
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-6">
              {searchTerm
                ? 'Try adjusting your search term'
                : 'Get started by adding your first work experience'}
            </p>
            {!searchTerm && (
              <Link
                href="/admin/dashboard/experience/new"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Experience</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredExperiences.map((exp, index) => (
            <div
              key={exp.id}
              className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200 group"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                  {exp.logo ? (
                    <img
                      src={exp.logo}
                      alt={exp.company}
                      className="w-16 h-16 rounded-xl object-cover border border-[var(--color-dark-200)]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>

                {/* Experience Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-gradient-start)] transition-colors mb-1">
                        {exp.position}
                      </h3>
                      <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-2">
                        <Building2 className="w-4 h-4" />
                        <span className="font-medium">{exp.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <Calendar className="w-4 h-4" />
                        <span>{exp.duration}</span>
                      </div>
                    </div>

                    {/* Display Order Badge */}
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-[var(--color-dark-100)] text-[var(--color-text-secondary)] text-xs font-medium rounded-full">
                        Order: {exp.displayOrder}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[var(--color-text-secondary)] text-sm mb-4 line-clamp-2">
                    {exp.description}
                  </p>

                  {/* Technologies */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {exp.technologies.slice(0, 6).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-[var(--color-gradient-start)]/10 text-[var(--color-gradient-start)] text-xs font-medium rounded-lg"
                        >
                          {tech}
                        </span>
                      ))}
                      {exp.technologies.length > 6 && (
                        <span className="px-3 py-1 text-[var(--color-text-secondary)] text-xs font-medium">
                          +{exp.technologies.length - 6} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-[var(--color-dark-200)]">
                    <Link
                      href={`/admin/dashboard/experience/${exp.id}/edit`}
                      className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-sm font-medium">Edit</span>
                    </Link>

                    <button
                      onClick={() => setDeleteConfirm(exp.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  </div>
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
                Delete Experience
              </h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[var(--color-text-secondary)] mb-6">
              Are you sure you want to delete this work experience? This action cannot be undone.
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
