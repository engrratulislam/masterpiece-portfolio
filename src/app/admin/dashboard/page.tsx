'use client';

import { useEffect, useState } from 'react';
import { FolderKanban, Code2, Briefcase, Mail, TrendingUp, Activity } from 'lucide-react';

interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  totalExperience: number;
  totalMessages: number;
  unreadMessages: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalSkills: 0,
    totalExperience: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Total Skills',
      value: stats.totalSkills,
      icon: Code2,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Work Experience',
      value: stats.totalExperience,
      icon: Briefcase,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-500',
    },
    {
      title: 'Contact Messages',
      value: stats.totalMessages,
      icon: Mail,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-500',
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : null,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] rounded-2xl p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-white/80">Here&apos;s what&apos;s happening with your portfolio today.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <div
              key={index}
              className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                {card.badge && (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                    {card.badge} new
                  </span>
                )}
              </div>
              
              <h3 className="text-[var(--color-text-secondary)] text-sm font-medium mb-1">
                {card.title}
              </h3>
              
              {loading ? (
                <div className="h-8 w-16 bg-[var(--color-dark-100)] animate-pulse rounded"></div>
              ) : (
                <p className="text-3xl font-bold text-[var(--color-text-primary)]">
                  {card.value}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Quick Actions</h2>
            <Activity className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] transition-colors text-[var(--color-text-primary)] font-medium">
              + Add New Project
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] transition-colors text-[var(--color-text-primary)] font-medium">
              + Add Skill
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] transition-colors text-[var(--color-text-primary)] font-medium">
              + Add Work Experience
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] transition-colors text-[var(--color-text-primary)] font-medium">
              + Add Testimonial
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">System Status</h2>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[var(--color-text-primary)] font-medium">Database</span>
              </div>
              <span className="text-green-500 text-sm font-semibold">Connected</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[var(--color-text-primary)] font-medium">Authentication</span>
              </div>
              <span className="text-green-500 text-sm font-semibold">Active</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[var(--color-text-primary)] font-medium">API Services</span>
              </div>
              <span className="text-green-500 text-sm font-semibold">Running</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-[var(--color-text-primary)] font-medium">Last Backup</span>
              </div>
              <span className="text-[var(--color-text-secondary)] text-sm">N/A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="bg-gradient-to-br from-[var(--color-gradient-start)]/10 to-[var(--color-gradient-end)]/10 border border-[var(--color-gradient-start)]/20 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">🚀 Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="text-[var(--color-text-primary)] font-medium">1. Add your projects to showcase your work</p>
            <p className="text-[var(--color-text-primary)] font-medium">2. Update your skills and expertise levels</p>
          </div>
          <div className="space-y-2">
            <p className="text-[var(--color-text-primary)] font-medium">3. Add your work experience timeline</p>
            <p className="text-[var(--color-text-primary)] font-medium">4. Collect and display client testimonials</p>
          </div>
        </div>
      </div>
    </div>
  );
}
