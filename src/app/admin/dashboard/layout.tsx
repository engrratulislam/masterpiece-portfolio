'use client';

import { ReactNode, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Code2,
  Briefcase,
  MessageSquare,
  Mail,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/dashboard/projects', icon: FolderKanban },
  { name: 'Skills', href: '/admin/dashboard/skills', icon: Code2 },
  { name: 'Experience', href: '/admin/dashboard/experience', icon: Briefcase },
  { name: 'Testimonials', href: '/admin/dashboard/testimonials', icon: MessageSquare },
  { name: 'Messages', href: '/admin/dashboard/messages', icon: Mail },
  { name: 'Media Library', href: '/admin/dashboard/media', icon: Image },
  { name: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <div className="min-h-screen bg-[var(--color-secondary)]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-[var(--color-surface-light)] border-r border-[var(--color-dark-200)] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-[var(--color-dark-200)]">
            <h1 className="text-xl font-bold bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] bg-clip-text text-transparent">
              Portfolio Admin
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white shadow-lg'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-100)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-[var(--color-dark-200)]">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-[var(--color-dark-100)]">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] flex items-center justify-center text-white font-semibold">
                  {session?.user?.name?.charAt(0) || 'A'}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {session?.user?.name || 'Admin'}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full mt-2 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-[var(--color-surface-light)] border-b border-[var(--color-dark-200)] backdrop-blur-sm">
          <div className="flex items-center justify-between h-full px-4 md:px-6">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Breadcrumb or Title */}
            <div className="flex-1 lg:flex-none">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] hidden lg:block">
                {sidebarLinks.find((link) => link.href === pathname)?.name || 'Dashboard'}
              </h2>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-100)] hover:text-[var(--color-text-primary)] transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Notifications */}
              <button
                className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-100)] hover:text-[var(--color-text-primary)] transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu (Desktop) */}
              <div className="hidden lg:flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] flex items-center justify-center text-white text-sm font-semibold">
                  {session?.user?.name?.charAt(0) || 'A'}
                </div>
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {session?.user?.name || 'Admin'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
