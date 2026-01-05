'use client';

import { useEffect, useState } from 'react';
import { Save, User, Plus, X, ChevronUp, ChevronDown, Code2 } from 'lucide-react';
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

interface Skill {
  id: number;
  name: string;
  level: number;
  icon: string | null;
  category: string;
  isSelected: boolean;
  displayOrder: number | null;
  aboutSkillId: number | null;
}

interface SelectedSkill {
  id: number;
  skillId: number;
  name: string;
  level: number;
  icon: string | null;
  category: string;
  displayOrder: number;
}

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);
  const [showSkillsSection, setShowSkillsSection] = useState(false);
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
    fetchSkills();
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

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/admin/about/skills');
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setAllSkills(data.data.allSkills || []);
          setSelectedSkills(data.data.selectedSkills || []);
        }
      } else {
        toast.error('Failed to load skills');
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Error loading skills');
    } finally {
      setSkillsLoading(false);
    }
  };

  const handleSkillToggle = async (skill: Skill) => {
    try {
      if (skill.isSelected) {
        // Remove skill
        const response = await fetch(`/api/admin/about/skills?skillId=${skill.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          toast.success(`${skill.name} removed from Tech Stack`);
          fetchSkills(); // Refresh the list
        } else {
          toast.error('Failed to remove skill');
        }
      } else {
        // Add skill
        const response = await fetch('/api/admin/about/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skillId: skill.id }),
        });
        
        if (response.ok) {
          toast.success(`${skill.name} added to Tech Stack`);
          fetchSkills(); // Refresh the list
        } else {
          toast.error('Failed to add skill');
        }
      }
    } catch (error) {
      console.error('Error toggling skill:', error);
      toast.error('Error updating skill');
    }
  };

  const moveSkill = async (skillId: number, direction: 'up' | 'down') => {
    const index = selectedSkills.findIndex(s => s.skillId === skillId);
    if (index === -1) return;
    
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === selectedSkills.length - 1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newSelectedSkills = [...selectedSkills];
    [newSelectedSkills[index], newSelectedSkills[newIndex]] = [newSelectedSkills[newIndex], newSelectedSkills[index]];
    
    // Update display orders
    const updatedSkills = newSelectedSkills.map((skill, idx) => ({
      skillId: skill.skillId,
      displayOrder: idx + 1,
    }));
    
    try {
      const response = await fetch('/api/admin/about/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: updatedSkills }),
      });
      
      if (response.ok) {
        setSelectedSkills(newSelectedSkills);
        toast.success('Order updated');
      } else {
        toast.error('Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Error updating order');
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

            {/* Tech Stack Skills Section */}
            <div className="pt-6 border-t border-[var(--color-dark-200)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Code2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      Tech Stack & Expertise
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Select skills to display in the "Tech Stack & Expertise" section
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSkillsSection(!showSkillsSection)}
                  className="px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] rounded-lg transition-colors"
                >
                  {showSkillsSection ? 'Hide' : 'Manage Skills'}
                </button>
              </div>

              {showSkillsSection && (
                <div className="space-y-4">
                  {/* Selected Skills with Reordering */}
                  {selectedSkills.length > 0 && (
                    <div className="bg-[var(--color-dark-100)] rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                        Selected Skills ({selectedSkills.length})
                      </h4>
                      <div className="space-y-2">
                        {selectedSkills.map((skill, index) => (
                          <div
                            key={skill.id}
                            className="flex items-center justify-between p-3 bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {skill.icon && (
                                skill.icon.startsWith('/') ? (
                                  <img src={skill.icon} alt={skill.name} className="w-6 h-6 object-contain" />
                                ) : (
                                  <span className="text-2xl">{skill.icon}</span>
                                )
                              )}
                              <div>
                                <span className="font-medium text-[var(--color-text-primary)]">{skill.name}</span>
                                <span className="text-xs text-[var(--color-text-secondary)] ml-2">
                                  {skill.level}% • {skill.category}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => moveSkill(skill.skillId, 'up')}
                                disabled={index === 0}
                                className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-dark-100)] rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Move up"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveSkill(skill.skillId, 'down')}
                                disabled={index === selectedSkills.length - 1}
                                className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-dark-100)] rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Move down"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSkillToggle({ ...skill, isSelected: true, aboutSkillId: skill.id, id: skill.skillId })}
                                className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                title="Remove"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Skills Selection */}
                  <div className="bg-[var(--color-dark-100)] rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                      All Skills (Click to add/remove)
                    </h4>
                    {skillsLoading ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="h-12 bg-[var(--color-dark-200)] animate-pulse rounded-lg" />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                        {allSkills.map((skill) => (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => handleSkillToggle(skill)}
                            className={`flex items-center gap-2 p-2.5 rounded-lg text-left transition-all ${
                              skill.isSelected
                                ? 'bg-blue-500/20 border-2 border-blue-500 text-[var(--color-text-primary)]'
                                : 'bg-[var(--color-surface-light)] border-2 border-[var(--color-dark-200)] text-[var(--color-text-secondary)] hover:border-[var(--color-dark-300)] hover:text-[var(--color-text-primary)]'
                            }`}
                          >
                            {skill.icon && (
                              skill.icon.startsWith('/') ? (
                                <img src={skill.icon} alt={skill.name} className="w-5 h-5 object-contain" />
                              ) : (
                                <span className="text-lg">{skill.icon}</span>
                              )
                            )}
                            <span className="text-sm font-medium truncate">{skill.name}</span>
                            {skill.isSelected && (
                              <div className="ml-auto flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <Plus className="w-3 h-3 text-white rotate-45" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
