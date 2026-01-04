'use client';

import { useEffect, useState } from 'react';
import { Save, Home, Upload } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface HeroData {
  id: number;
  badge: string;
  name: string;
  title: string;
  description: string;
  cvUrl: string | null;
  profileImage: string | null;
  yearsExperience: string;
  projectsCompleted: string;
  satisfactionRate: string;
  tech1: string | null;
  tech2: string | null;
  tech3: string | null;
  tech4: string | null;
  tech5: string | null;
  tech6: string | null;
  tech7: string | null;
  tech8: string | null;
  tech9: string | null;
  isActive: boolean;
}

export default function HeroPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroData, setHeroData] = useState<HeroData>({
    id: 1,
    badge: '',
    name: '',
    title: '',
    description: '',
    cvUrl: null,
    profileImage: null,
    yearsExperience: '3+',
    projectsCompleted: '50+',
    satisfactionRate: '100%',
    tech1: null,
    tech2: null,
    tech3: null,
    tech4: null,
    tech5: null,
    tech6: null,
    tech7: null,
    tech8: null,
    tech9: null,
    isActive: true,
  });

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await fetch('/api/admin/hero');
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setHeroData(data.data);
        }
      } else {
        toast.error('Failed to load hero section');
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
      toast.error('Error loading hero section');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroData),
      });

      if (response.ok) {
        toast.success('Hero section updated successfully');
        fetchHeroData();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update hero section');
      }
    } catch (error) {
      console.error('Error updating hero section:', error);
      toast.error('Error updating hero section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-500/10 rounded-xl">
          <Home className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
            Hero Section
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage homepage hero section and navbar/sidebar profile
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-[var(--color-dark-100)] rounded w-1/4 animate-pulse"></div>
                <div className="h-12 bg-[var(--color-dark-100)] rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Badge */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={heroData.badge}
                  onChange={(e) => setHeroData({ ...heroData, badge: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  placeholder="Available for Projects"
                  required
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Your Name
                  <span className="text-xs ml-2 text-blue-400">(Also appears in navbar/sidebar)</span>
                </label>
                <input
                  type="text"
                  value={heroData.name}
                  onChange={(e) => setHeroData({ ...heroData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  placeholder="Engr. Ratul"
                  required
                />
              </div>

              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Job Title
                  <span className="text-xs ml-2 text-blue-400">(Also appears in navbar/sidebar)</span>
                </label>
                <input
                  type="text"
                  value={heroData.title}
                  onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  placeholder="Full Stack Developer"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Description
                </label>
                <textarea
                  value={heroData.description}
                  onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all resize-none"
                  placeholder="Crafting exceptional digital experiences..."
                  required
                />
              </div>

              {/* Stats */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Years Experience
                </label>
                <input
                  type="text"
                  value={heroData.yearsExperience}
                  onChange={(e) => setHeroData({ ...heroData, yearsExperience: e.target.value })}
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
                  value={heroData.projectsCompleted}
                  onChange={(e) => setHeroData({ ...heroData, projectsCompleted: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  placeholder="50+"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Satisfaction Rate
                </label>
                <input
                  type="text"
                  value={heroData.satisfactionRate}
                  onChange={(e) => setHeroData({ ...heroData, satisfactionRate: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  placeholder="100%"
                  required
                />
              </div>

              {/* CV URL */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  CV/Resume URL
                </label>
                <input
                  type="text"
                  value={heroData.cvUrl || ''}
                  onChange={(e) => setHeroData({ ...heroData, cvUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  placeholder="/images/about/resume.pdf"
                />
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  Upload file to Media Library, then paste URL here
                </p>
              </div>

              {/* Profile Image URL */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Profile Image URL
                  <span className="text-xs ml-2 text-blue-400">(Navbar/Sidebar avatar)</span>
                </label>
                <input
                  type="text"
                  value={heroData.profileImage || ''}
                  onChange={(e) => setHeroData({ ...heroData, profileImage: e.target.value || null })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  placeholder="/images/about/profile.jpeg"
                />
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  Upload image to Media Library, then paste URL here. This image appears in the navbar/sidebar.
                </p>
              </div>

              {/* Tech Stack Section */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 pb-2 border-b border-[var(--color-dark-200)]">
                  Tech Stack (Hero Card)
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                  Enter up to 9 technologies to display in the Tech Stack card on the hero section
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                      Tech 1
                    </label>
                    <input
                      type="text"
                      value={heroData.tech1 || ''}
                      onChange={(e) => setHeroData({ ...heroData, tech1: e.target.value || null })}
                      className="w-full px-3 py-2 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all text-sm"
                      placeholder="JavaScript"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                      Tech 2
                    </label>
                    <input
                      type="text"
                      value={heroData.tech2 || ''}
                      onChange={(e) => setHeroData({ ...heroData, tech2: e.target.value || null })}
                      className="w-full px-3 py-2 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all text-sm"
                      placeholder="React"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                      Tech 3
                    </label>
                    <input
                      type="text"
                      value={heroData.tech3 || ''}
                      onChange={(e) => setHeroData({ ...heroData, tech3: e.target.value || null })}
                      className="w-full px-3 py-2 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all text-sm"
                      placeholder="Next.js"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                      Tech 4
                    </label>
                    <input
                      type="text"
                      value={heroData.tech4 || ''}
                      onChange={(e) => setHeroData({ ...heroData, tech4: e.target.value || null })}
                      className="w-full px-3 py-2 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all text-sm"
                      placeholder="TypeScript"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                      Tech 5
                    </label>
                    <input
                      type="text"
                      value={heroData.tech5 || ''}
                      onChange={(e) => setHeroData({ ...heroData, tech5: e.target.value || null })}
                      className="w-full px-3 py-2 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all text-sm"
                      placeholder="Node.js"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                      Tech 6
                    </label>
                    <input
                      type="text"
                      value={heroData.tech6 || ''}
                      onChange={(e) => setHeroData({ ...heroData, tech6: e.target.value || null })}
                      className="w-full px-3 py-2 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all text-sm"
                      placeholder="PHP"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                      Tech 7
                    </label>
                    <input
                      type="text"
                      value={heroData.tech7 || ''}
                      onChange={(e) => setHeroData({ ...heroData, tech7: e.target.value || null })}
                      className="w-full px-3 py-2 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all text-sm"
                      placeholder="Laravel"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                      Tech 8
                    </label>
                    <input
                      type="text"
                      value={heroData.tech8 || ''}
                      onChange={(e) => setHeroData({ ...heroData, tech8: e.target.value || null })}
                      className="w-full px-3 py-2 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all text-sm"
                      placeholder="MongoDB"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                      Tech 9
                    </label>
                    <input
                      type="text"
                      value={heroData.tech9 || ''}
                      onChange={(e) => setHeroData({ ...heroData, tech9: e.target.value || null })}
                      className="w-full px-3 py-2 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all text-sm"
                      placeholder="MySQL"
                    />
                  </div>
                </div>
              </div>

              {/* Active Status */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={heroData.isActive}
                    onChange={(e) => setHeroData({ ...heroData, isActive: e.target.checked })}
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
