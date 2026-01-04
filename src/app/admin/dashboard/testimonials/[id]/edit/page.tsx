'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';

interface TestimonialFormData {
  name: string;
  position: string;
  company: string;
  avatar: string;
  rating: number;
  text: string;
  displayOrder: number;
  isActive: boolean;
}

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const testimonialId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    position: '',
    company: '',
    avatar: '',
    rating: 5,
    text: '',
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    if (testimonialId) {
      fetchTestimonial();
    }
  }, [testimonialId]);

  const fetchTestimonial = async () => {
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.data.name,
          position: data.data.position,
          company: data.data.company,
          avatar: data.data.avatar || '',
          rating: data.data.rating,
          text: data.data.text,
          displayOrder: data.data.displayOrder,
          isActive: data.data.isActive,
        });
      } else {
        toast.error('Failed to load testimonial');
        router.push('/admin/dashboard/testimonials');
      }
    } catch (error) {
      console.error('Error fetching testimonial:', error);
      toast.error('Error loading testimonial');
      router.push('/admin/dashboard/testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Testimonial updated successfully!');
        router.push('/admin/dashboard/testimonials');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to update testimonial');
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => setFormData({ ...formData, rating: index + 1 })}
        className={`w-8 h-8 transition-colors ${
          index < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-[var(--color-dark-200)] hover:text-yellow-400'
        }`}
      >
        <Star className="w-full h-full" />
      </button>
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[var(--color-gradient-start)] animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)]">Loading testimonial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/dashboard/testimonials"
          className="p-2 rounded-lg bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
            Edit Testimonial
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Update testimonial details
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6 space-y-6">
          {/* Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Position / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                placeholder="CEO, Founder, etc."
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
              placeholder="Tech Solutions Inc."
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Avatar / Photo URL
            </label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
              placeholder="https://example.com/photo.jpg"
            />
            {formData.avatar && (
              <div className="mt-3 flex justify-center">
                <img
                  src={formData.avatar}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-[var(--color-dark-200)]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {renderStars(formData.rating)}
              <span className="ml-2 text-[var(--color-text-primary)] font-medium">
                {formData.rating} / 5
              </span>
            </div>
          </div>

          {/* Testimonial Text */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Testimonial Text <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all resize-none"
              placeholder="Write the testimonial text here..."
            />
          </div>

          {/* Display Order & Active Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                placeholder="0"
              />
              <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                Lower numbers appear first (default: 0)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Status
              </label>
              <div className="flex items-center gap-3 h-[52px]">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-[var(--color-dark-200)] bg-[var(--color-dark-100)] text-[var(--color-gradient-start)] focus:ring-2 focus:ring-[var(--color-gradient-start)] focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-[var(--color-text-primary)] cursor-pointer">
                  Active (visible on website)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Update Testimonial</span>
              </>
            )}
          </button>

          <Link
            href="/admin/dashboard/testimonials"
            className="px-8 py-3 bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] font-medium rounded-xl transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
