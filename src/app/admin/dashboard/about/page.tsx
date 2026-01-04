'use client';

import { useEffect, useState } from 'react';
import { Save, User } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface AboutData {
  id: number;
  sectionBadge: string;
  sectionTitle: string;
  sectionDescription: string | null;
  profileImage: string | null;
  heading: string | null;
  paragraph1: string;
  paragraph2: string | null;
  paragraph3: string | null;
  cvUrl: string | null;
  yearsExperience: string;
  projectsCompleted: string;
  clientSatisfaction: string;
  isActive: boolean;
}

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutData, setAboutData] = useState<AboutData>({
    id: 1,
    sectionBadge: '',
    sectionTitle: '',
    sectionDescription: null,
    profileImage: null,
    heading: null,
    paragraph1: '',
    paragraph2: null,
    paragraph3: null,
    cvUrl: null,
    yearsExperience: '3+',
    projectsCompleted: '50+',
    clientSatisfaction: '100% Client',
    isActive: true,
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/admin/about');
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setAboutData(data.data);
        }
      } else {
        toast.error('Failed to load about section');
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
      toast.error('Error loading about section');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData),
      });

      if (response.ok) {
        toast.success('About section updated successfully');
        fetchAboutData();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update about section');
      }
    } catch (error) {
      console.error('Error updating about section:', error);
      toast.error('Error updating about section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-purple-500/10 rounded-xl">
          <User className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
            About Section
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage your about section content and profile information
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-[var(--color-dark-100)] rounded w-1/4 animate-pulse"></div>
                <div className="h-12 bg-[var(--color-dark-100)] rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section Header Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Section Badge
                </label>
                <input
                  type="text"
                  value={aboutData.sectionBadge}
                  onChange={(e) => setAboutData({ ...aboutData, sectionBadge: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  placeholder="Get to Know Me"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={aboutData.sectionTitle}
                  onChange={(e) => setAboutData({ ...aboutData, sectionTitle: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  placeholder="About Me"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Section Description
                </label>
                <input
                  type="text"
                  value={aboutData.sectionDescription || ''}
                  onChange={(e) => setAboutData({ ...aboutData, sectionDescription: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  placeholder="Passionate developer crafting exceptional digital experiences"
                />
              </div>
            </div>

            {/* Content Fields */}
            <div className="space-y-4 pt-4 border-t border-[var(--color-dark-200)]">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">About Content</h3>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Heading (Type Animation Text)
                </label>
                <input
                  type="text"
                  value={aboutData.heading || ''}
                  onChange={(e) => setAboutData({ ...aboutData, heading: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  placeholder="Hi, I'm Engr. Ratul"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Paragraph 1 *
                </label>
                <textarea
                  value={aboutData.paragraph1}
                  onChange={(e) => setAboutData({ ...aboutData, paragraph1: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all resize-none"
                  placeholder="First paragraph about yourself..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Paragraph 2
                </label>
                <textarea
                  value={aboutData.paragraph2 || ''}
                  onChange={(e) => setAboutData({ ...aboutData, paragraph2: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all resize-none"
                  placeholder="Second paragraph (optional)..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Paragraph 3
                </label>
                <textarea
                  value={aboutData.paragraph3 || ''}
                  onChange={(e) => setAboutData({ ...aboutData, paragraph3: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all resize-none"
                  placeholder="Third paragraph (optional)..."
                />
              </div>
            </div>

            {/* Stats and Media */}
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-[var(--color-dark-200)]">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Years Experience
                </label>
                <input
                  type="text"
                  value={aboutData.yearsExperience}
                  onChange={(e) => setAboutData({ ...aboutData, yearsExperience: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  placeholder="3+"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Projects Completed
                </label>
                <input
                  type="text"
                  value={aboutData.projectsCompleted}
                  onChange={(e) => setAboutData({ ...aboutData, projectsCompleted: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  placeholder="50+"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Client Satisfaction
                </label>
                <input
                  type="text"
                  value={aboutData.clientSatisfaction}
                  onChange={(e) => setAboutData({ ...aboutData, clientSatisfaction: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  placeholder="100% Client"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  value={aboutData.profileImage || ''}
                  onChange={(e) => setAboutData({ ...aboutData, profileImage: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  placeholder="/images/about/profile.jpeg"
                />
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  Upload to Media Library first
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  CV/Resume URL
                </label>
                <input
                  type="text"
                  value={aboutData.cvUrl || ''}
                  onChange={(e) => setAboutData({ ...aboutData, cvUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  placeholder="/images/about/resume.pdf"
                />
              </div>

              {/* Active Status */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aboutData.isActive}
                    onChange={(e) => setAboutData({ ...aboutData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-[var(--color-dark-200)] text-[var(--color-gradient-start)] focus:ring-2 focus:ring-[var(--color-gradient-start)] focus:ring-offset-0"
                  />
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    Active (Show on homepage)
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-dark-200)]">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Changes will be reflected on the homepage immediately
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
