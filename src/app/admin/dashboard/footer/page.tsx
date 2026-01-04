'use client';

import { useEffect, useState } from 'react';
import { Save, Layout } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface FooterData {
  id: number;
  brandName: string;
  brandDescription: string;
  quickLinksTitle: string;
  quickLink1Name: string | null;
  quickLink1Href: string | null;
  quickLink2Name: string | null;
  quickLink2Href: string | null;
  quickLink3Name: string | null;
  quickLink3Href: string | null;
  quickLink4Name: string | null;
  quickLink4Href: string | null;
  socialTitle: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
  emailAddress: string | null;
  copyrightText: string;
  footerNote: string | null;
  isActive: boolean;
}

export default function FooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [footerData, setFooterData] = useState<FooterData>({
    id: 1,
    brandName: '',
    brandDescription: '',
    quickLinksTitle: 'Quick Links',
    quickLink1Name: 'Home',
    quickLink1Href: '/',
    quickLink2Name: 'About',
    quickLink2Href: '#about',
    quickLink3Name: 'Projects',
    quickLink3Href: '#projects',
    quickLink4Name: 'Contact',
    quickLink4Href: '#contact',
    socialTitle: 'Connect',
    githubUrl: null,
    linkedinUrl: null,
    emailAddress: null,
    copyrightText: '',
    footerNote: null,
    isActive: true,
  });

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const response = await fetch('/api/admin/footer');
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setFooterData(data.data);
        }
      } else {
        toast.error('Failed to load footer section');
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
      toast.error('Error loading footer section');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(footerData),
      });

      if (response.ok) {
        toast.success('Footer section updated successfully');
        fetchFooterData();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update footer section');
      }
    } catch (error) {
      console.error('Error updating footer section:', error);
      toast.error('Error updating footer section');
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
          <Layout className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
            Footer Section
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage your website footer content and links
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
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Brand Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-dark-200)] pb-3">
                Brand Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Brand Name */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={footerData.brandName}
                    onChange={(e) => setFooterData({ ...footerData, brandName: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="Engr. Ratul"
                    required
                  />
                </div>

                {/* Copyright Text */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Copyright Text
                  </label>
                  <input
                    type="text"
                    value={footerData.copyrightText}
                    onChange={(e) => setFooterData({ ...footerData, copyrightText: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="All rights reserved."
                    required
                  />
                </div>

                {/* Brand Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Brand Description
                  </label>
                  <textarea
                    value={footerData.brandDescription}
                    onChange={(e) => setFooterData({ ...footerData, brandDescription: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                    placeholder="Full Stack Developer crafting scalable solutions..."
                    required
                  />
                </div>

                {/* Footer Note */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Footer Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={footerData.footerNote || ''}
                    onChange={(e) => setFooterData({ ...footerData, footerNote: e.target.value || null })}
                    className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="Made with ❤️ using Next.js"
                  />
                </div>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-dark-200)] pb-3">
                Quick Links
              </h2>
              <div className="space-y-4">
                {/* Quick Link 1 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Link 1 - Name
                    </label>
                    <input
                      type="text"
                      value={footerData.quickLink1Name || ''}
                      onChange={(e) => setFooterData({ ...footerData, quickLink1Name: e.target.value || null })}
                      className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="Home"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Link 1 - URL
                    </label>
                    <input
                      type="text"
                      value={footerData.quickLink1Href || ''}
                      onChange={(e) => setFooterData({ ...footerData, quickLink1Href: e.target.value || null })}
                      className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="/"
                    />
                  </div>
                </div>

                {/* Quick Link 2 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Link 2 - Name
                    </label>
                    <input
                      type="text"
                      value={footerData.quickLink2Name || ''}
                      onChange={(e) => setFooterData({ ...footerData, quickLink2Name: e.target.value || null })}
                      className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="About"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Link 2 - URL
                    </label>
                    <input
                      type="text"
                      value={footerData.quickLink2Href || ''}
                      onChange={(e) => setFooterData({ ...footerData, quickLink2Href: e.target.value || null })}
                      className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="#about"
                    />
                  </div>
                </div>

                {/* Quick Link 3 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Link 3 - Name
                    </label>
                    <input
                      type="text"
                      value={footerData.quickLink3Name || ''}
                      onChange={(e) => setFooterData({ ...footerData, quickLink3Name: e.target.value || null })}
                      className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="Projects"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Link 3 - URL
                    </label>
                    <input
                      type="text"
                      value={footerData.quickLink3Href || ''}
                      onChange={(e) => setFooterData({ ...footerData, quickLink3Href: e.target.value || null })}
                      className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="#projects"
                    />
                  </div>
                </div>

                {/* Quick Link 4 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Link 4 - Name
                    </label>
                    <input
                      type="text"
                      value={footerData.quickLink4Name || ''}
                      onChange={(e) => setFooterData({ ...footerData, quickLink4Name: e.target.value || null })}
                      className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="Contact"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Link 4 - URL
                    </label>
                    <input
                      type="text"
                      value={footerData.quickLink4Href || ''}
                      onChange={(e) => setFooterData({ ...footerData, quickLink4Href: e.target.value || null })}
                      className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="#contact"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-dark-200)] pb-3">
                Social Links
                <span className="text-sm font-normal text-[var(--color-text-secondary)] ml-3">
                  (These links will also appear in the sidebar and About section)
                </span>
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {/* GitHub URL */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={footerData.githubUrl || ''}
                    onChange={(e) => setFooterData({ ...footerData, githubUrl: e.target.value || null })}
                    className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="https://github.com/username"
                  />
                </div>

                {/* LinkedIn URL */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={footerData.linkedinUrl || ''}
                    onChange={(e) => setFooterData({ ...footerData, linkedinUrl: e.target.value || null })}
                    className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={footerData.emailAddress || ''}
                    onChange={(e) => setFooterData({ ...footerData, emailAddress: e.target.value || null })}
                    className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3 pt-6 border-t border-[var(--color-dark-200)]">
              <input
                type="checkbox"
                id="isActive"
                checked={footerData.isActive}
                onChange={(e) => setFooterData({ ...footerData, isActive: e.target.checked })}
                className="w-5 h-5 rounded border-[var(--color-dark-200)] bg-[var(--color-dark-100)] text-purple-500 focus:ring-2 focus:ring-purple-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-[var(--color-text-secondary)]">
                Active Footer Section
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-[var(--color-dark-200)]">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
