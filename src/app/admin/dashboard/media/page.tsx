'use client';

import { useEffect, useState, useRef } from 'react';
import { Upload, Trash2, Search, X, Image as ImageIcon, FileText, Film, File, Download, Copy, Check } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface MediaFile {
  id: number;
  filename: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  alt: string | null;
  category: 'image' | 'document' | 'video' | 'other';
  uploadedAt: string;
}

export default function MediaLibraryPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    try {
      const response = await fetch('/api/admin/media');
      if (response.ok) {
        const data = await response.json();
        setMediaFiles(data.data || []);
      } else {
        toast.error('Failed to load media files');
      }
    } catch (error) {
      console.error('Error fetching media files:', error);
      toast.error('Error loading media files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`${files.length} file(s) uploaded successfully`);
        fetchMediaFiles();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to upload files');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Error uploading files');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('File deleted successfully');
        setMediaFiles(mediaFiles.filter((f) => f.id !== id));
        setDeleteConfirm(null);
        if (selectedFile?.id === id) {
          setSelectedFile(null);
        }
      } else {
        toast.error('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Error deleting file');
    }
  };

  const handleUpdateAlt = async (id: number, alt: string) => {
    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt }),
      });

      if (response.ok) {
        toast.success('Alt text updated successfully');
        setMediaFiles(
          mediaFiles.map((f) => (f.id === id ? { ...f, alt } : f))
        );
        if (selectedFile?.id === id) {
          setSelectedFile({ ...selectedFile, alt });
        }
      } else {
        toast.error('Failed to update alt text');
      }
    } catch (error) {
      console.error('Error updating alt text:', error);
      toast.error('Error updating alt text');
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFiles = mediaFiles.filter((file) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      file.originalName.toLowerCase().includes(searchLower) ||
      file.filename.toLowerCase().includes(searchLower) ||
      (file.alt && file.alt.toLowerCase().includes(searchLower));
    const matchesCategory =
      filterCategory === 'all' || file.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getCategoryIcon = (category: string, mimeType: string) => {
    if (category === 'image' || mimeType.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5" />;
    }
    if (category === 'video' || mimeType.startsWith('video/')) {
      return <Film className="w-5 h-5" />;
    }
    if (category === 'document' || mimeType.includes('pdf') || mimeType.includes('document')) {
      return <FileText className="w-5 h-5" />;
    }
    return <File className="w-5 h-5" />;
  };

  const categories = [
    { value: 'all', label: 'All Files' },
    { value: 'image', label: 'Images' },
    { value: 'document', label: 'Documents' },
    { value: 'video', label: 'Videos' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
            Media Library
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage uploaded files and images ({mediaFiles.length} files)
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-5 h-5" />
          <span>{uploading ? 'Uploading...' : 'Upload Files'}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx"
        />
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all appearance-none cursor-pointer min-w-[150px]"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Files Grid */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-4 animate-pulse"
                >
                  <div className="aspect-square bg-[var(--color-dark-100)] rounded-xl mb-3"></div>
                  <div className="h-4 bg-[var(--color-dark-100)] rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-[var(--color-dark-100)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-[var(--color-text-secondary)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                  No files found
                </h3>
                <p className="text-[var(--color-text-secondary)] mb-6">
                  {searchTerm || filterCategory !== 'all'
                    ? 'Try adjusting your filters or search term'
                    : 'Upload your first file to get started'}
                </p>
                {!searchTerm && filterCategory === 'all' && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload Files</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className={`bg-[var(--color-surface-light)] border rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                    selectedFile?.id === file.id
                      ? 'border-[var(--color-gradient-start)] ring-2 ring-[var(--color-gradient-start)]/20'
                      : 'border-[var(--color-dark-200)]'
                  }`}
                >
                  {/* File Preview */}
                  <div className="aspect-square bg-[var(--color-dark-100)] flex items-center justify-center overflow-hidden">
                    {file.mimeType.startsWith('image/') ? (
                      <img
                        src={file.filePath}
                        alt={file.alt || file.originalName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-[var(--color-text-secondary)]">
                        {getCategoryIcon(file.category, file.mimeType)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="p-3">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                      {file.originalName}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                      {formatFileSize(file.fileSize)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* File Details Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl overflow-hidden sticky top-6">
            {selectedFile ? (
              <>
                {/* Preview */}
                <div className="aspect-square bg-[var(--color-dark-100)] flex items-center justify-center overflow-hidden">
                  {selectedFile.mimeType.startsWith('image/') ? (
                    <img
                      src={selectedFile.filePath}
                      alt={selectedFile.alt || selectedFile.originalName}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-[var(--color-text-secondary)] scale-150">
                      {getCategoryIcon(selectedFile.category, selectedFile.mimeType)}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">
                      {selectedFile.originalName}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {formatFileSize(selectedFile.fileSize)} • {selectedFile.category}
                    </p>
                  </div>

                  {/* File Path */}
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                      File URL
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={selectedFile.filePath}
                        readOnly
                        className="flex-1 px-3 py-2 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-lg text-xs text-[var(--color-text-primary)] focus:outline-none"
                      />
                      <button
                        onClick={() => copyToClipboard(selectedFile.filePath, selectedFile.id)}
                        className="p-2 bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] rounded-lg transition-colors"
                      >
                        {copiedId === selectedFile.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-[var(--color-text-secondary)]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Alt Text (for images) */}
                  {selectedFile.mimeType.startsWith('image/') && (
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                        Alt Text
                      </label>
                      <input
                        type="text"
                        value={selectedFile.alt || ''}
                        onChange={(e) => {
                          setSelectedFile({ ...selectedFile, alt: e.target.value });
                        }}
                        onBlur={(e) => handleUpdateAlt(selectedFile.id, e.target.value)}
                        placeholder="Describe this image..."
                        className="w-full px-3 py-2 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)]"
                      />
                    </div>
                  )}

                  {/* Upload Date */}
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                      Uploaded
                    </label>
                    <p className="text-sm text-[var(--color-text-primary)]">
                      {new Date(selectedFile.uploadedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <a
                      href={selectedFile.filePath}
                      download={selectedFile.originalName}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] rounded-xl transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">Download</span>
                    </a>
                    <button
                      onClick={() => setDeleteConfirm(selectedFile.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center p-6">
                  <ImageIcon className="w-16 h-16 text-[var(--color-text-secondary)] mx-auto mb-4 opacity-50" />
                  <p className="text-[var(--color-text-secondary)]">
                    Select a file to view details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                Delete File
              </h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[var(--color-text-secondary)] mb-6">
              Are you sure you want to delete this file? This action cannot be undone and the file will be permanently removed from the server.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
