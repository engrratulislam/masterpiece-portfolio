'use client';

import { useEffect, useState } from 'react';
import { Trash2, Search, X, Mail, MailOpen, Calendar, User } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      } else {
        toast.error('Failed to load messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Error loading messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number, isRead: boolean) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !isRead }),
      });

      if (response.ok) {
        toast.success(`Message marked as ${!isRead ? 'read' : 'unread'}`);
        setMessages(
          messages.map((m) =>
            m.id === id ? { ...m, isRead: !isRead, readAt: !isRead ? new Date().toISOString() : null } : m
          )
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, isRead: !isRead });
        }
      } else {
        toast.error('Failed to update message');
      }
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Error updating message');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Message deleted successfully');
        setMessages(messages.filter((m) => m.id !== id));
        setDeleteConfirm(null);
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } else {
        toast.error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Error deleting message');
    }
  };

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    
    // Auto-mark as read when viewing
    if (!message.isRead) {
      await handleMarkAsRead(message.id, false);
    }
  };

  const filteredMessages = messages.filter((message) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      message.name.toLowerCase().includes(searchLower) ||
      message.email.toLowerCase().includes(searchLower) ||
      (message.subject && message.subject.toLowerCase().includes(searchLower)) ||
      message.message.toLowerCase().includes(searchLower);
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'unread' && !message.isRead) ||
      (filterStatus === 'read' && message.isRead);
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
            Contact Messages
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            View and manage contact form submissions
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-[var(--color-dark-100)] border border-[var(--color-dark-200)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gradient-start)] transition-all appearance-none cursor-pointer min-w-[150px]"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[var(--color-dark-200)]">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Inbox</h2>
          </div>

          <div className="overflow-y-auto max-h-[600px]">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-[var(--color-dark-100)] rounded-xl animate-pulse">
                    <div className="h-4 bg-[var(--color-dark-200)] rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-[var(--color-dark-200)] rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center">
                <Mail className="w-12 h-12 text-[var(--color-text-secondary)] mx-auto mb-3" />
                <p className="text-[var(--color-text-secondary)]">No messages found</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => handleViewMessage(message)}
                  className={`p-4 border-b border-[var(--color-dark-200)] cursor-pointer transition-colors hover:bg-[var(--color-dark-100)] ${
                    selectedMessage?.id === message.id ? 'bg-[var(--color-dark-100)]' : ''
                  } ${!message.isRead ? 'border-l-4 border-l-[var(--color-gradient-start)]' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {message.isRead ? (
                        <MailOpen className="w-5 h-5 text-[var(--color-text-secondary)]" />
                      ) : (
                        <Mail className="w-5 h-5 text-[var(--color-gradient-start)]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`text-sm truncate ${
                            message.isRead
                              ? 'text-[var(--color-text-secondary)] font-normal'
                              : 'text-[var(--color-text-primary)] font-semibold'
                          }`}
                        >
                          {message.name}
                        </h3>
                        <span className="text-xs text-[var(--color-text-secondary)] ml-2">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] truncate mb-1">
                        {message.subject || 'No subject'}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl overflow-hidden">
          {selectedMessage ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-[var(--color-dark-200)]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                      {selectedMessage.subject || 'No subject'}
                    </h2>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{selectedMessage.name}</span>
                        <span className="text-[var(--color-gradient-start)]">
                          {selectedMessage.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(selectedMessage.createdAt).toLocaleString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 hover:bg-[var(--color-dark-100)] rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMarkAsRead(selectedMessage.id, selectedMessage.isRead)}
                    className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-dark-100)] hover:bg-[var(--color-dark-200)] text-[var(--color-text-primary)] rounded-lg transition-colors text-sm"
                  >
                    {selectedMessage.isRead ? (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Mark Unread</span>
                      </>
                    ) : (
                      <>
                        <MailOpen className="w-4 h-4" />
                        <span>Mark Read</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setDeleteConfirm(selectedMessage.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-6 overflow-y-auto max-h-[500px]">
                <div className="prose prose-invert max-w-none">
                  <p className="text-[var(--color-text-primary)] whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <Mail className="w-16 h-16 text-[var(--color-text-secondary)] mx-auto mb-4 opacity-50" />
                <p className="text-[var(--color-text-secondary)]">
                  Select a message to view its content
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-surface-light)] border border-[var(--color-dark-200)] rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                Delete Message
              </h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[var(--color-text-secondary)] mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
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
