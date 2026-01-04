'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, X, Star, ToggleLeft, ToggleRight, Layout } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  avatar: string | null;
  rating: number;
  text: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TestimonialsSection {
  id: number;
  sectionBadge: string;
  sectionTitle: string;
  sectionDescription: string;
  isActive: boolean;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [sectionData, setSectionData] = useState<TestimonialsSection>({
    id: 1,
    sectionBadge: 'Client Feedback',
    sectionTitle: 'What Clients Say',
    sectionDescription: "Don't just take my word for it - hear from some of the clients I've worked with",
    isActive: true,
  });
  const [savingSection, setSavingSection] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState(false);

  useEffect(() => {
    fetchTestimonials();
    fetchSection();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/admin/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data.data || []);
      } else {
        toast.error('Failed to load testimonials');
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Error loading testimonials');
    } finally {
      setLoading(false);
    }
  };

  const fetchSection = async () => {
    try {
      const response = await fetch('/api/admin/testimonials-section');
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
      const response = await fetch('/api/admin/testimonials-section', {
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
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Testimonial deleted successfully');
        setTestimonials(testimonials.filter((t) => t.id !== id));
        setDeleteConfirm(null);
      } else {
        toast.error('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Error deleting testimonial');
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        toast.success(`Testimonial ${!currentStatus ? 'activated' : 'deactivated'}`);
        setTestimonials(
          testimonials.map((t) => (t.id === id ? { ...t, isActive: !currentStatus } : t))
        );
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    }
  };

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      testimonial.name.toLowerCase().includes(searchLower) ||
      testimonial.company.toLowerCase().includes(searchLower) ||
      testimonial.position.toLowerCase().includes(searchLower) ||
      testimonial.text.toLowerCase().includes(searchLower);
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && testimonial.isActive) ||
      (filterStatus === 'inactive' && !testimonial.isActive);
    return matchesSearch && matchesStatus;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-[var(--color-dark-200)]'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
            Testimonials
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage client testimonials, reviews and section header
          </p>
        </div>
        <Link
          href="/admin/dashboard/testimonials/new"
          className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Testimonial</span>
        </Link>
      </div>

      {/* Section Header Management */}
      <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowSectionForm(!showSectionForm)}
          className="w-full flex items-center justify-between p-6 hover:bg-[var(--color-dark-100)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Layout className="w-6 h-6 text-yellow-500" />
            <div className="text-left">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Section Header Content
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Manage the Testimonials section title and description
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
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Client Feedback"
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
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="What Clients Say"
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
                className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-yellow-500 min-h-[100px] resize-y"
                placeholder="Don't just take my word for it - hear from some of the clients I've worked with"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingSection}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              placeholder="Search by name, company, or review text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all appearance-none cursor-pointer min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6 animate-pulse"
            >
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 bg-[var(--color-dark-100)] rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-[var(--color-dark-100)] rounded w-1/3"></div>
                  <div className="h-4 bg-[var(--color-dark-100)] rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-[var(--color-dark-100)] rounded"></div>
                <div className="h-4 bg-[var(--color-dark-100)] rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-[var(--color-dark-100)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-[var(--color-text-secondary)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
              No testimonials found
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your filters or search term'
                : 'Get started by adding your first testimonial'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Link
                href="/admin/dashboard/testimonials/new"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Testimonial</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`bg-[var(--color-surface-light)] border rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200 group ${
                testimonial.isActive
                  ? 'border-[var(--color-dark-200)]'
                  : 'border-[var(--color-dark-200)] opacity-60'
              }`}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-dark-200)]"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] flex items-center justify-center text-white text-xl font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-gradient-start)] transition-colors">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {testimonial.position} at {testimonial.company}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleToggleActive(testimonial.id, testimonial.isActive)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      testimonial.isActive
                        ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                        : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
                    }`}
                  >
                    {testimonial.isActive ? (
                      <span className="flex items-center gap-1">
                        <ToggleRight className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <ToggleLeft className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-[var(--color-text-secondary)] text-sm mb-4 line-clamp-3">
                "{testimonial.text}"
              </p>

              {/* Display Order */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--color-dark-200)]">
                <span className="text-xs text-[var(--color-text-secondary)]">
                  Display Order: {testimonial.displayOrder}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/dashboard/testimonials/${testimonial.id}/edit`}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm font-medium">Edit</span>
                </Link>

                <button
                  onClick={() => setDeleteConfirm(testimonial.id)}
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
                Delete Testimonial
              </h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[var(--color-text-secondary)] mb-6">
              Are you sure you want to delete this testimonial? This action cannot be undone.
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
