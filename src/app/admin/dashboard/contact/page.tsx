'use client';

import { useEffect, useState } from 'react';
import { Save, Mail } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface ContactData {
  id: number;
  sectionBadge: string;
  sectionTitle: string;
  sectionDescription: string | null;
  contactInfoTitle: string;
  contactInfoDescription: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  socialTitle: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  facebookUrl: string | null;
  isActive: boolean;
}

export default function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contactData, setContactData] = useState<ContactData>({
    id: 1,
    sectionBadge: '',
    sectionTitle: '',
    sectionDescription: null,
    contactInfoTitle: '',
    contactInfoDescription: null,
    email: '',
    phone: null,
    location: null,
    socialTitle: '',
    githubUrl: null,
    linkedinUrl: null,
    twitterUrl: null,
    facebookUrl: null,
    isActive: true,
  });

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await fetch('/api/admin/contact');
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setContactData(data.data);
        }
      } else {
        toast.error('Failed to load contact section');
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
      toast.error('Error loading contact section');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        toast.success('Contact section updated successfully');
        fetchContactData();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update contact section');
      }
    } catch (error) {
      console.error('Error updating contact section:', error);
      toast.error('Error updating contact section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-cyan-500/10 rounded-xl">
          <Mail className="w-6 h-6 text-cyan-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
            Contact Section
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage your contact section content and information
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
              {/* Section Badge */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Section Badge
                </label>
                <input
                  type="text"
                  value={contactData.sectionBadge}
                  onChange={(e) => setContactData({ ...contactData, sectionBadge: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="Get In Touch"
                  required
                />
              </div>

              {/* Section Title */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={contactData.sectionTitle}
                  onChange={(e) => setContactData({ ...contactData, sectionTitle: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="Let's Work Together"
                  required
                />
              </div>

              {/* Section Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Section Description
                </label>
                <textarea
                  value={contactData.sectionDescription || ''}
                  onChange={(e) => setContactData({ ...contactData, sectionDescription: e.target.value || null })}
                  rows={2}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none"
                  placeholder="Have a project in mind..."
                />
              </div>

              {/* Contact Info Title */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Contact Info Title
                </label>
                <input
                  type="text"
                  value={contactData.contactInfoTitle}
                  onChange={(e) => setContactData({ ...contactData, contactInfoTitle: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="Contact Information"
                  required
                />
              </div>

              {/* Contact Info Description */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Contact Info Description
                </label>
                <textarea
                  value={contactData.contactInfoDescription || ''}
                  onChange={(e) => setContactData({ ...contactData, contactInfoDescription: e.target.value || null })}
                  rows={2}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none"
                  placeholder="Feel free to reach out..."
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="email@example.com"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  value={contactData.phone || ''}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value || null })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="+880 1XXX-XXXXXX"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={contactData.location || ''}
                  onChange={(e) => setContactData({ ...contactData, location: e.target.value || null })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="City, Country"
                />
              </div>

              {/* Social Title */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Social Title
                </label>
                <input
                  type="text"
                  value={contactData.socialTitle}
                  onChange={(e) => setContactData({ ...contactData, socialTitle: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="Follow Me"
                />
              </div>

              {/* Social Links */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={contactData.githubUrl || ''}
                  onChange={(e) => setContactData({ ...contactData, githubUrl: e.target.value || null })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={contactData.linkedinUrl || ''}
                  onChange={(e) => setContactData({ ...contactData, linkedinUrl: e.target.value || null })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Twitter URL
                </label>
                <input
                  type="url"
                  value={contactData.twitterUrl || ''}
                  onChange={(e) => setContactData({ ...contactData, twitterUrl: e.target.value || null })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={contactData.facebookUrl || ''}
                  onChange={(e) => setContactData({ ...contactData, facebookUrl: e.target.value || null })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="https://facebook.com/username"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={contactData.isActive}
                  onChange={(e) => setContactData({ ...contactData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-[var(--color-dark-200)] bg-[var(--color-dark-100)] text-cyan-500 focus:ring-2 focus:ring-cyan-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-[var(--color-text-secondary)]">
                  Active Contact Section
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-[var(--color-dark-200)]">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
