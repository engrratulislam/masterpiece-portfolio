'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';

interface ExperienceFormData {
  company: string;
  position: string;
  duration: string;
  description: string;
  logo: string;
  technologies: string[];
  displayOrder: number;
}

export default function NewExperiencePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [formData, setFormData] = useState<ExperienceFormData>({
    company: '',
    position: '',
    duration: '',
    description: '',
    logo: '',
    technologies: [],
    displayOrder: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Experience created successfully!');
        router.push('/admin/dashboard/experience');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to create experience');
      }
    } catch (error) {
      console.error('Error creating experience:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      });
      setTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((tech) => tech !== techToRemove),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/dashboard/experience"
          className="p-2 rounded-lg bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
            Add Work Experience
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Add a new work experience to your timeline
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6 space-y-6">
          {/* Company & Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Position / Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                placeholder="Full Stack Developer"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Duration <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
              placeholder="Jan 2023 - Present or Jan 2023 - Dec 2023"
            />
            <p className="text-xs text-[var(--color-text-secondary)] mt-2">
              Example: "Jan 2023 - Present" or "2 years 6 months"
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all resize-none"
              placeholder="Describe your role, responsibilities, and key achievements..."
            />
          </div>

          {/* Company Logo URL */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Company Logo URL
            </label>
            <input
              type="url"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
              placeholder="https://example.com/logo.png"
            />
            {formData.logo && (
              <div className="mt-3 p-4 bg-[var(--color-dark-100)] rounded-xl flex items-center justify-center">
                <img
                  src={formData.logo}
                  alt="Logo preview"
                  className="w-16 h-16 rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Technologies Used
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                className="flex-1 px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                placeholder="React, Node.js, MongoDB, etc."
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-6 py-3 bg-[var(--color-gradient-start)] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
              >
                Add
              </button>
            </div>
            {formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-gradient-start)]/10 text-[var(--color-gradient-start)] text-sm font-medium rounded-lg"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tech)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Display Order */}
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
              Lower numbers appear first in the timeline (default: 0)
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Create Experience</span>
              </>
            )}
          </button>

          <Link
            href="/admin/dashboard/experience"
            className="px-8 py-3 bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] font-medium rounded-xl transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
