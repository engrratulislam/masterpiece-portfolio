'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, X, Loader2, Plus, Award, Briefcase, Link as LinkIcon, MapPin, Upload, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';

interface ExperienceFormData {
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  responsibilities: string[];
  achievements: string[];
  logo: string;
  companyUrl: string;
  technologies: string[];
  displayOrder: number;
}

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const experienceId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [techInput, setTechInput] = useState('');
  const [respInput, setRespInput] = useState('');
  const [achieveInput, setAchieveInput] = useState('');
  const [formData, setFormData] = useState<ExperienceFormData>({
    company: '',
    position: '',
    duration: '',
    location: 'Remote',
    description: '',
    responsibilities: [],
    achievements: [],
    logo: '',
    companyUrl: '',
    technologies: [],
    displayOrder: 0,
  });

  useEffect(() => {
    if (experienceId) {
      fetchExperience();
    }
  }, [experienceId]);

  const fetchExperience = async () => {
    try {
      const response = await fetch(`/api/admin/experience/${experienceId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          company: data.data.company,
          position: data.data.position,
          duration: data.data.duration,
          location: data.data.location || 'Remote',
          description: data.data.description,
          responsibilities: data.data.responsibilities || [],
          achievements: data.data.achievements || [],
          logo: data.data.logo || '',
          companyUrl: data.data.companyUrl || '',
          technologies: data.data.technologies || [],
          displayOrder: data.data.displayOrder,
        });
      } else {
        toast.error('Failed to load experience');
        router.push('/admin/dashboard/experience');
      }
    } catch (error) {
      console.error('Error fetching experience:', error);
      toast.error('Error loading experience');
      router.push('/admin/dashboard/experience');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/experience/${experienceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Experience updated successfully!');
        router.push('/admin/dashboard/experience');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to update experience');
      }
    } catch (error) {
      console.error('Error updating experience:', error);
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
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

  const handleAddResponsibility = () => {
    if (respInput.trim() && !formData.responsibilities.includes(respInput.trim())) {
      setFormData({
        ...formData,
        responsibilities: [...formData.responsibilities, respInput.trim()],
      });
      setRespInput('');
    }
  };

  const handleRemoveResponsibility = (respToRemove: string) => {
    setFormData({
      ...formData,
      responsibilities: formData.responsibilities.filter((resp) => resp !== respToRemove),
    });
  };

  const handleAddAchievement = () => {
    if (achieveInput.trim() && !formData.achievements.includes(achieveInput.trim())) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, achieveInput.trim()],
      });
      setAchieveInput('');
    }
  };

  const handleRemoveAchievement = (achieveToRemove: string) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((achieve) => achieve !== achieveToRemove),
    });
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('files', file);

    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        const uploadedFile = data.data[0];
        setFormData({ ...formData, logo: uploadedFile.filePath });
        toast.success('Logo uploaded successfully');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to upload logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Error uploading logo');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logo: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[var(--color-gradient-start)] animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)]">Loading experience...</p>
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
          href="/admin/dashboard/experience"
          className="p-2 rounded-lg bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
            Edit Work Experience
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Update work experience details
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

          {/* Duration & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Jan 2023 - Present"
              />
              <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                Example: "Jan 2023 - Present" or "2 years 6 months"
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </span>
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
              >
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
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

          {/* Company Logo */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              <span className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Company Logo
              </span>
            </label>
            
            {/* Logo Preview */}
            {formData.logo ? (
              <div className="mb-4 p-4 bg-[var(--color-dark-100)] rounded-xl">
                <div className="flex items-center gap-4">
                  <img
                    src={formData.logo}
                    alt="Company logo preview"
                    className="w-20 h-20 rounded-xl object-cover border-2 border-[var(--color-dark-200)]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect fill="%23374151" width="80" height="80"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239CA3AF" font-size="12">No Image</text></svg>';
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-[var(--color-text-secondary)] truncate max-w-xs">
                      {formData.logo}
                    </p>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="mt-2 text-sm text-red-500 hover:text-red-400 transition-colors"
                    >
                      Remove Logo
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Upload Area */}
            <div className="space-y-3">
              {/* File Upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[var(--color-dark-200)] rounded-xl p-6 text-center cursor-pointer hover:border-[var(--color-gradient-start)] hover:bg-[var(--color-dark-100)] transition-all"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 text-[var(--color-gradient-start)] animate-spin mb-2" />
                    <span className="text-sm text-[var(--color-text-secondary)]">Uploading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-[var(--color-text-secondary)] mb-2" />
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">Click to upload logo</span>
                    <span className="text-xs text-[var(--color-text-secondary)] mt-1">PNG, JPG, GIF up to 2MB</span>
                  </div>
                )}
              </div>

              {/* Or Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[var(--color-dark-200)]"></div>
                <span className="text-xs text-[var(--color-text-secondary)]">OR</span>
                <div className="flex-1 h-px bg-[var(--color-dark-200)]"></div>
              </div>

              {/* URL Input */}
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-[var(--color-text-secondary)]">
                Enter a direct URL to the company logo image
              </p>
            </div>
          </div>

          {/* Company URL */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              <span className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Company Website URL
              </span>
            </label>
            <input
              type="url"
              value={formData.companyUrl}
              onChange={(e) => setFormData({ ...formData, companyUrl: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
              placeholder="https://company-website.com"
            />
            <p className="text-xs text-[var(--color-text-secondary)] mt-2">
              Link to the company's website (optional)
            </p>
          </div>

          {/* Key Responsibilities */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Key Responsibilities
              </span>
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={respInput}
                onChange={(e) => setRespInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResponsibility())}
                className="flex-1 px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                placeholder="e.g., Leading development of web applications"
              />
              <button
                type="button"
                onClick={handleAddResponsibility}
                className="px-4 py-3 bg-[var(--color-gradient-start)] text-white font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            {formData.responsibilities.length > 0 && (
              <ul className="space-y-2">
                {formData.responsibilities.map((resp, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 bg-[var(--color-dark-100)] rounded-lg"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gradient-start)] mt-2 flex-shrink-0" />
                    <span className="flex-1 text-[var(--color-text-secondary)] text-sm">{resp}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveResponsibility(resp)}
                      className="text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Key Achievements */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Key Achievements
              </span>
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={achieveInput}
                onChange={(e) => setAchieveInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAchievement())}
                className="flex-1 px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                placeholder="e.g., Reduced load time by 40%"
              />
              <button
                type="button"
                onClick={handleAddAchievement}
                className="px-4 py-3 bg-amber-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            {formData.achievements.length > 0 && (
              <ul className="space-y-2">
                {formData.achievements.map((achieve, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 bg-[var(--color-dark-100)] rounded-lg"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                    <span className="flex-1 text-[var(--color-text-secondary)] text-sm">{achieve}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAchievement(achieve)}
                      className="text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
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
                <span>Update Experience</span>
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
