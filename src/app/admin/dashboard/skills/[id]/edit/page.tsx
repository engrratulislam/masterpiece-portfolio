'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Plus as PlusIcon, X, Upload, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';

interface SkillCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
}

interface SkillFormData {
  name: string;
  level: number;
  icon: string;
  category: string;
  displayOrder: number;
}

export default function EditSkillPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [editCategoryDescription, setEditCategoryDescription] = useState('');
  const [editCategoryIcon, setEditCategoryIcon] = useState('');
  const [categoryIconType, setCategoryIconType] = useState<'emoji' | 'image'>('emoji');
  const [uploadingCategoryIcon, setUploadingCategoryIcon] = useState(false);
  const [editCategoryIconType, setEditCategoryIconType] = useState<'emoji' | 'image'>('emoji');
  const [uploadingEditCategoryIcon, setUploadingEditCategoryIcon] = useState(false);
  const categoryIconInputRef = useRef<HTMLInputElement>(null);
  const editCategoryIconInputRef = useRef<HTMLInputElement>(null);
  const [iconType, setIconType] = useState<'emoji' | 'image'>('emoji');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<SkillFormData>({
    name: '',
    level: 50,
    icon: '',
    category: 'frontend',
    displayOrder: 0,
  });

  useEffect(() => {
    if (skillId) {
      fetchSkill();
    }
    fetchCategories();
  }, [skillId]);

  // Set icon type based on loaded icon value
  useEffect(() => {
    if (formData.icon) {
      setIconType(formData.icon.startsWith('/') ? 'image' : 'emoji');
    }
  }, [formData.icon]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/skill-categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch selected category details when category changes
  useEffect(() => {
    const selectedCat = categories.find(cat => cat.slug === formData.category);
    if (selectedCat) {
      setEditCategoryDescription(selectedCat.description || '');
      setEditCategoryIcon(selectedCat.icon || '');
    }
  }, [formData.category, categories]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Category name is required');
      return;
    }

    const slug = newCategory.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    try {
      const response = await fetch('/api/admin/skill-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newCategory.trim(), 
          slug,
          description: newCategoryDescription.trim() || null,
          icon: newCategoryIcon.trim() || null,
          displayOrder: categories.length + 1 
        }),
      });

      if (response.ok) {
        toast.success('Category added successfully');
        setNewCategory('');
        setNewCategoryDescription('');
        setNewCategoryIcon('');
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

  const handleUpdateCategory = async () => {
    const selectedCat = categories.find(cat => cat.slug === formData.category);
    if (!selectedCat) {
      toast.error('Category not found');
      return;
    }

    try {
      const response = await fetch('/api/admin/skill-categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: selectedCat.id,
          name: selectedCat.name,
          slug: selectedCat.slug,
          description: editCategoryDescription.trim() || null,
          icon: editCategoryIcon.trim() || null,
          displayOrder: selectedCat.displayOrder,
          isActive: selectedCat.isActive
        }),
      });

      if (response.ok) {
        toast.success('Category updated successfully');
        setShowEditCategory(false);
        fetchCategories();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Error updating category');
    }
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
        setFormData({ ...formData, icon: uploadedFile.filePath });
        toast.success('Icon uploaded successfully');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to upload icon');
      }
    } catch (error) {
      console.error('Error uploading icon:', error);
      toast.error('Error uploading icon');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCategoryIconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setUploadingCategoryIcon(true);
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
        setNewCategoryIcon(uploadedFile.filePath);
        toast.success('Category icon uploaded');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to upload');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      toast.error('Error uploading');
    } finally {
      setUploadingCategoryIcon(false);
      if (categoryIconInputRef.current) {
        categoryIconInputRef.current.value = '';
      }
    }
  };

  const handleEditCategoryIconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setUploadingEditCategoryIcon(true);
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
        setEditCategoryIcon(uploadedFile.filePath);
        toast.success('Category icon uploaded');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to upload');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      toast.error('Error uploading');
    } finally {
      setUploadingEditCategoryIcon(false);
      if (editCategoryIconInputRef.current) {
        editCategoryIconInputRef.current.value = '';
      }
    }
  };

  const fetchSkill = async () => {
    try {
      const response = await fetch(`/api/admin/skills/${skillId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.data.name,
          level: data.data.level,
          icon: data.data.icon || '',
          category: data.data.category,
          displayOrder: data.data.displayOrder,
        });
      } else {
        toast.error('Failed to load skill');
        router.push('/admin/dashboard/skills');
      }
    } catch (error) {
      console.error('Error fetching skill:', error);
      toast.error('Error loading skill');
      router.push('/admin/dashboard/skills');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/skills/${skillId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Skill updated successfully!');
        router.push('/admin/dashboard/skills');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to update skill');
      }
    } catch (error) {
      console.error('Error updating skill:', error);
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 80) return 'from-green-500 to-emerald-500';
    if (level >= 60) return 'from-blue-500 to-cyan-500';
    if (level >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-orange-500 to-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[var(--color-gradient-start)] animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)]">Loading skill...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/dashboard/skills"
          className="p-2 rounded-lg bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
            Edit Skill
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Update skill details
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6 space-y-6">
          {/* Skill Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Skill Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
              placeholder="React, Node.js, Docker, etc."
            />
          </div>

          {/* Category */}
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
              <div className="space-y-3">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                  placeholder="Enter category name (e.g., Frontend Development)"
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  autoFocus
                />
                <input
                  type="text"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="Enter category description (e.g., Building beautiful user interfaces)"
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                />

                {/* Category Icon Type Toggle */}
                <div>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryIconType('emoji');
                        if (newCategoryIcon.startsWith('/')) setNewCategoryIcon('');
                      }}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        categoryIconType === 'emoji'
                          ? 'bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white'
                          : 'bg-[var(--color-dark-200)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      😀 Emoji
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryIconType('image')}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        categoryIconType === 'image'
                          ? 'bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white'
                          : 'bg-[var(--color-dark-200)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4 inline mr-1" /> Image
                    </button>
                  </div>

                  {categoryIconType === 'emoji' ? (
                    <input
                      type="text"
                      value={newCategoryIcon.startsWith('/') ? '' : newCategoryIcon}
                      onChange={(e) => setNewCategoryIcon(e.target.value)}
                      placeholder="Enter category icon (emoji: 🎨)"
                      className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                      maxLength={10}
                    />
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => categoryIconInputRef.current?.click()}
                        disabled={uploadingCategoryIcon}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] hover:bg-[var(--color-dark-200)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploadingCategoryIcon ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[var(--color-text-primary)] border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">Upload Icon</span>
                          </>
                        )}
                      </button>
                      {newCategoryIcon.startsWith('/') && (
                        <button
                          type="button"
                          onClick={() => setNewCategoryIcon('')}
                          className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                  <input
                    ref={categoryIconInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCategoryIconUpload}
                    className="hidden"
                  />
                  {newCategoryIcon && (
                    <div className="mt-2 p-3 bg-[var(--color-dark-200)] rounded-lg flex items-center justify-center">
                      {newCategoryIcon.startsWith('/') ? (
                        <img src={newCategoryIcon} alt="Category icon" className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-2xl">{newCategoryIcon}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="flex-1 px-4 py-3 bg-[var(--color-gradient-start)] text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Category
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCategory('');
                      setNewCategoryDescription('');
                      setNewCategoryIcon('');
                    }}
                    className="px-4 py-3 bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] rounded-xl transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Edit Selected Category */}
            {!showNewCategory && formData.category && formData.category !== '__new__' && (
              <div className="mt-4 p-4 bg-[var(--color-dark-100)] rounded-xl border border-[var(--color-dark-200)]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-[var(--color-text-primary)]">
                    Category Details
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowEditCategory(!showEditCategory)}
                    className="text-xs px-3 py-1.5 bg-[var(--color-gradient-start)] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {showEditCategory ? 'Cancel' : 'Edit Category'}
                  </button>
                </div>
                
                {showEditCategory ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                        Category Description
                      </label>
                      <input
                        type="text"
                        value={editCategoryDescription}
                        onChange={(e) => setEditCategoryDescription(e.target.value)}
                        placeholder="Enter category description"
                        className="w-full px-4 py-2.5 bg-[var(--color-dark-200)] border border-[var(--color-dark-300)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                        Category Icon
                      </label>
                      
                      {/* Icon Type Toggle */}
                      <div className="flex gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditCategoryIconType('emoji');
                            if (editCategoryIcon.startsWith('/')) setEditCategoryIcon('');
                          }}
                          className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            editCategoryIconType === 'emoji'
                              ? 'bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white'
                              : 'bg-[var(--color-dark-300)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                          }`}
                        >
                          😀 Emoji
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditCategoryIconType('image')}
                          className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            editCategoryIconType === 'image'
                              ? 'bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white'
                              : 'bg-[var(--color-dark-300)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                          }`}
                        >
                          <ImageIcon className="w-3 h-3 inline mr-1" /> Image
                        </button>
                      </div>

                      {editCategoryIconType === 'emoji' ? (
                        <input
                          type="text"
                          value={editCategoryIcon.startsWith('/') ? '' : editCategoryIcon}
                          onChange={(e) => setEditCategoryIcon(e.target.value)}
                          placeholder="Enter emoji (e.g., 🎨)"
                          className="w-full px-4 py-2.5 bg-[var(--color-dark-200)] border border-[var(--color-dark-300)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all text-sm"
                          maxLength={10}
                        />
                      ) : (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => editCategoryIconInputRef.current?.click()}
                            disabled={uploadingEditCategoryIcon}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-dark-200)] border border-[var(--color-dark-300)] rounded-lg text-[var(--color-text-primary)] hover:bg-[var(--color-dark-300)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            {uploadingEditCategoryIcon ? (
                              <>
                                <div className="w-3 h-3 border-2 border-[var(--color-text-primary)] border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-xs">Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3 h-3" />
                                <span className="text-xs">Upload Icon</span>
                              </>
                            )}
                          </button>
                          {editCategoryIcon.startsWith('/') && (
                            <button
                              type="button"
                              onClick={() => setEditCategoryIcon('')}
                              className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                      <input
                        ref={editCategoryIconInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleEditCategoryIconUpload}
                        className="hidden"
                      />
                      {editCategoryIcon && (
                        <div className="mt-2 p-2 bg-[var(--color-dark-300)] rounded-lg flex items-center justify-center">
                          {editCategoryIcon.startsWith('/') ? (
                            <img src={editCategoryIcon} alt="Category icon" className="w-6 h-6 object-contain" />
                          ) : (
                            <span className="text-xl">{editCategoryIcon}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleUpdateCategory}
                      className="w-full px-4 py-2.5 bg-[var(--color-gradient-start)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                    >
                      Update Category
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-medium text-[var(--color-text-secondary)] min-w-[80px]">
                        Description:
                      </span>
                      <span className="text-xs text-[var(--color-text-primary)] flex-1">
                        {editCategoryDescription || 'No description'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-medium text-[var(--color-text-secondary)] min-w-[80px]">
                        Icon:
                      </span>
                      <div className="flex items-center gap-2">
                        {editCategoryIcon ? (
                          editCategoryIcon.startsWith('/') ? (
                            <img src={editCategoryIcon} alt="Category icon" className="w-6 h-6 object-contain" />
                          ) : (
                            <span className="text-xl">{editCategoryIcon}</span>
                          )
                        ) : (
                          <span className="text-xs text-[var(--color-text-primary)]">No icon</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Proficiency Level */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Proficiency Level <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">Level</span>
                <span className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {formData.level}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: parseInt(e.target.value) })
                }
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    var(--color-gradient-start) 0%, 
                    var(--color-gradient-end) ${formData.level}%, 
                    var(--color-dark-100) ${formData.level}%, 
                    var(--color-dark-100) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-[var(--color-text-secondary)]">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Advanced</span>
                <span>Expert</span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="mt-4 h-4 bg-[var(--color-dark-100)] rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getLevelColor(formData.level)} transition-all duration-300`}
                style={{ width: `${formData.level}%` }}
              ></div>
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Skill Icon
            </label>
            
            {/* Icon Type Toggle */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setIconType('emoji');
                  if (formData.icon.startsWith('/')) setFormData({ ...formData, icon: '' });
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  iconType === 'emoji'
                    ? 'bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white'
                    : 'bg-[var(--color-dark-100)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                😀 Emoji
              </button>
              <button
                type="button"
                onClick={() => {
                  setIconType('image');
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  iconType === 'image'
                    ? 'bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white'
                    : 'bg-[var(--color-dark-100)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <ImageIcon className="w-4 h-4 inline mr-1" /> Image
              </button>
            </div>

            {iconType === 'emoji' ? (
              <>
                <input
                  type="text"
                  value={formData.icon.startsWith('/') ? '' : formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
                  placeholder="⚛️, 🟢, 🎨, etc."
                  maxLength={10}
                />
                <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                  Use an emoji to represent this skill (optional)
                </p>
                {formData.icon && !formData.icon.startsWith('/') && (
                  <div className="mt-3 p-4 bg-[var(--color-dark-100)] rounded-xl text-center">
                    <span className="text-4xl">{formData.icon}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex gap-2">
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
                        <span>Upload Icon Image</span>
                      </>
                    )}
                  </button>
                  {formData.icon.startsWith('/') && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: '' })}
                      className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors"
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
                <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                  Upload an image icon (PNG, JPG, SVG recommended, max 2MB)
                </p>
                {formData.icon.startsWith('/') && (
                  <div className="mt-3 p-4 bg-[var(--color-dark-100)] rounded-xl flex justify-center">
                    <img
                      src={formData.icon}
                      alt="Icon preview"
                      className="w-16 h-16 object-contain rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Display Order
            </label>
            <input
              type="number"
              min="0"
              value={formData.displayOrder}
              onChange={(e) =>
                setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
              placeholder="0"
            />
            <p className="text-xs text-[var(--color-text-secondary)] mt-2">
              Lower numbers appear first (default: 0)
            </p>
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
                <span>Update Skill</span>
              </>
            )}
          </button>

          <Link
            href="/admin/dashboard/skills"
            className="px-8 py-3 bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] font-medium rounded-xl transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
