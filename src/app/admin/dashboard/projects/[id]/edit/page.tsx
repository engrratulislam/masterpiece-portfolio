'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, X, Loader2, Plus as PlusIcon, Upload, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
}

interface ProjectFormData {
  title: string;
  description: string;
  longDescription: string;
  image: string;
  category: string; // Changed to string for custom categories
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  date: string;
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    longDescription: '',
    image: '',
    category: 'web',
    tags: [],
    liveUrl: '',
    githubUrl: '',
    featured: false,
    date: '',
  });

  useEffect(() => {
    fetchCategories();
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Category name is required');
      return;
    }

    const slug = newCategory.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newCategory.trim(), 
          slug,
          displayOrder: categories.length + 1 
        }),
      });

      if (response.ok) {
        toast.success('Category added successfully');
        setNewCategory('');
        setShowNewCategory(false);
        fetchCategories();
        setFormData({ ...formData, category: slug });
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Error adding category');
    }
  };

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.data.title,
          description: data.data.description,
          longDescription: data.data.longDescription || '',
          image: data.data.image || '',
          category: data.data.category,
          tags: data.data.tags || [],
          liveUrl: data.data.liveUrl || '',
          githubUrl: data.data.githubUrl || '',
          featured: data.data.featured,
          date: data.data.date,
        });
      } else {
        toast.error('Failed to load project');
        router.push('/admin/dashboard/projects');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Error loading project');
      router.push('/admin/dashboard/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Project updated successfully!');
        router.push('/admin/dashboard/projects');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setFormData({ ...formData, image: uploadedFile.filePath });
        toast.success('Image uploaded successfully');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[var(--color-gradient-start)] animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)]">Loading project...</p>
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
          href="/admin/dashboard/projects"
          className="p-2 rounded-lg bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
            Edit Project
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Update project details
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
              placeholder="E-Commerce Platform"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Short Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all resize-none"
              placeholder="A brief description of your project (1-2 sentences)"
            />
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Detailed Description
            </label>
            <textarea
              rows={6}
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all resize-none"
              placeholder="A detailed description with features, technologies used, challenges overcome, etc."
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              {!showNewCategory ? (
                <>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => {
                      if (e.target.value === '__new__') {
                        setShowNewCategory(true);
                      } else {
                        setFormData({ ...formData, category: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                    <option value="__new__" className="text-[var(--color-gradient-start)] font-semibold">
                      + Add New Category
                    </option>
                  </select>
                </>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                    placeholder="Enter category name"
                    className="flex-1 px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-4 py-3 bg-[var(--color-gradient-start)] text-white rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCategory('');
                    }}
                    className="px-4 py-3 bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] rounded-xl transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Project Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
              />
            </div>
          </div>

          {/* Image Upload/URL */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Project Image
            </label>
            
            {/* Upload Button */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] hover:bg-[var(--color-dark-200)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[var(--color-text-primary)] border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                  </>
                )}
              </button>
              {formData.image && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: '' })}
                  className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <p className="text-xs text-[var(--color-text-secondary)] mb-3">
              Upload an image (PNG, JPG, WebP, max 2MB) or enter URL below
            </p>

            {/* URL Input */}
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
              placeholder="Or paste image URL: https://example.com/image.jpg"
            />
            
            {/* Image Preview */}
            {formData.image && (
              <div className="mt-3 rounded-xl overflow-hidden border border-[var(--color-dark-200)] bg-[var(--color-dark-100)]">
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    Preview
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Technologies / Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                placeholder="React, Node.js, etc."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-6 py-3 bg-[var(--color-gradient-start)] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
              >
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-gradient-start)]/10 text-[var(--color-gradient-start)] text-sm font-medium rounded-lg"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Live URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-5 h-5 rounded border-[var(--color-dark-200)] bg-[var(--color-dark-100)] text-[var(--color-gradient-start)] focus:ring-2 focus:ring-[var(--color-gradient-start)] focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="featured" className="text-sm font-medium text-[var(--color-text-primary)] cursor-pointer">
              Mark as featured project
            </label>
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
                <span>Update Project</span>
              </>
            )}
          </button>

          <Link
            href="/admin/dashboard/projects"
            className="px-8 py-3 bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] font-medium rounded-xl transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
