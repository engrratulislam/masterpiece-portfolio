'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, LogIn } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { authenticate } from './actions';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authenticate(
        formData.email,
        formData.password,
        formData.rememberMe
      );

      if (!result.success) {
        toast.error(result.error || 'Login failed');
      } else {
        toast.success('Login successful! Redirecting...');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[var(--color-dark-900)] via-[var(--color-surface-dark)] to-[var(--color-dark-800)]">
      <Toaster position="top-right" />
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-[var(--color-accent-cool)] to-[var(--color-accent-warm)] rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md mx-4 z-10">
        {/* Glassmorphic Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-[var(--color-dark-400)] text-sm">Sign in to manage your portfolio</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-dark-300)]">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[var(--color-dark-400)]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[var(--color-dark-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] focus:border-transparent transition-all duration-200"
                  placeholder="admin@portfolio.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-dark-300)]">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[var(--color-dark-400)]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[var(--color-dark-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--color-dark-400)] hover:text-[var(--color-dark-300)] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-[var(--color-gradient-start)] focus:ring-2 focus:ring-[var(--color-gradient-start)] focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-sm text-[var(--color-dark-300)] group-hover:text-white transition-colors">
                  Remember me
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[var(--color-gradient-start)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] focus:ring-offset-2 focus:ring-offset-[var(--color-dark-900)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Default Credentials Info */}
          <div className="mt-6 p-4 bg-[var(--color-accent-warm)]/10 border border-[var(--color-accent-warm)]/20 rounded-xl">
            <p className="text-xs text-[var(--color-dark-300)] text-center">
              <span className="font-semibold text-[var(--color-accent-warm)]">Default:</span> admin@portfolio.com / admin123
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[var(--color-dark-400)] text-xs mt-6">
          © {new Date().getFullYear()} Portfolio Admin. All rights reserved.
        </p>
      </div>
    </div>
  );
}
