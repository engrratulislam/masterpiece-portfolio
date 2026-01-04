'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Lock, Save, Eye, EyeOff, Shield, Mail, Calendar, CheckCircle } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface ProfileData {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    id: 0,
    name: '',
    email: '',
    role: 'admin',
    isActive: true,
    lastLogin: null,
    createdAt: '',
  });

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/admin/settings/profile');
      if (response.ok) {
        const data = await response.json();
        setProfileData(data.data);
      } else {
        toast.error('Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
        }),
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
        // Update session with new data
        await update({
          name: profileData.name,
          email: profileData.email,
        });
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch('/api/admin/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        toast.success('Password changed successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Error changing password');
    } finally {
      setChangingPassword(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
          Settings
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <User className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                  Profile Information
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Update your account details
                </p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-[var(--color-dark-100)] rounded w-1/4 animate-pulse"></div>
                    <div className="h-12 bg-[var(--color-dark-100)] rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Password Change */}
          <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Lock className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                  Change Password
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Update your password to keep your account secure
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                    placeholder="Enter new password (min. 8 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl p-4">
                <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Password Requirements:
                </p>
                <ul className="space-y-1 text-sm text-[var(--color-text-secondary)]">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Minimum 8 characters long</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Must be different from current password</span>
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={changingPassword}
                className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-5 h-5" />
                <span>{changingPassword ? 'Changing Password...' : 'Change Password'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Account Information Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Account Status */}
          <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                  Account Status
                </h2>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-[var(--color-dark-100)] rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Role */}
                <div className="flex items-center justify-between p-3 bg-[var(--color-dark-100)] rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    <span className="text-sm text-[var(--color-text-secondary)]">Role</span>
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white text-xs font-semibold rounded-full uppercase">
                    {profileData.role}
                  </span>
                </div>

                {/* Email */}
                <div className="flex items-start justify-between p-3 bg-[var(--color-dark-100)] rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-[var(--color-text-secondary)] flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--color-text-secondary)] mb-1">Email</p>
                      <p className="text-sm font-medium text-[var(--color-text-primary)] break-all">
                        {profileData.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Last Login */}
                <div className="flex items-start justify-between p-3 bg-[var(--color-dark-100)] rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-[var(--color-text-secondary)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-1">Last Login</p>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        {formatDate(profileData.lastLogin)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Created */}
                <div className="flex items-start justify-between p-3 bg-[var(--color-dark-100)] rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-[var(--color-text-secondary)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-1">Member Since</p>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        {formatDate(profileData.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-2">
                  Security Tip
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Use a strong, unique password and change it regularly. Never share your credentials with anyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
