import React, { useState, useEffect, useCallback } from 'react';
import { Megaphone, Plus, Edit2, Trash2, Search, Calendar, AlertCircle, X } from 'lucide-react';
import api from '../../utils/axios';
import { Toast, ConfirmModal } from '../../components/AdminToast';

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium',
    expiryDate: ''
  });

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'admission', label: 'Admission' },
    { value: 'examination', label: 'Examination' },
    { value: 'general', label: 'General' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'result', label: 'Result' },
    { value: 'scholarship', label: 'Scholarship' }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };

  const categoryColors = {
    admission: 'bg-blue-100 text-blue-800',
    examination: 'bg-purple-100 text-purple-800',
    general: 'bg-gray-100 text-gray-800',
    holiday: 'bg-green-100 text-green-800',
    result: 'bg-orange-100 text-orange-800',
    scholarship: 'bg-pink-100 text-pink-800'
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    filterNotices();
  }, [notices, selectedCategory, selectedPriority, searchTerm]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/notices');
      setNotices(response.data.data || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotices = () => {
    let filtered = notices;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(notice => notice.category === selectedCategory);
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(notice => notice.priority === selectedPriority);
    }

    if (searchTerm) {
      filtered = filtered.filter(notice =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNotice) {
        await api.put(`/api/notices/${editingNotice._id}`, formData);
        showToast('Notice updated successfully!');
      } else {
        await api.post('/api/notices', formData);
        showToast('Notice created successfully!');
      }
      fetchNotices();
      resetForm();
    } catch (error) {
      console.error('Error saving notice:', error);
      showToast('Error saving notice. Please try again.', 'error');
    }
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      priority: notice.priority,
      expiryDate: notice.expiryDate ? new Date(notice.expiryDate).toISOString().split('T')[0] : ''
    });
    setShowAddForm(true);
  };

  const handleDelete = (noticeId) => {
    setConfirmDelete(noticeId);
  };

  const confirmDeleteNotice = async () => {
    try {
      await api.delete(`/api/notices/${confirmDelete}`);
      showToast('Notice deleted successfully!');
      fetchNotices();
    } catch (error) {
      console.error('Error deleting notice:', error);
      showToast('Error deleting notice. Please try again.', 'error');
    } finally {
      setConfirmDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'general',
      priority: 'medium',
      expiryDate: ''
    });
    setEditingNotice(null);
    setShowAddForm(false);
  };

  const filteredNotices = filterNotices();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Live Notices', value: notices.length, icon: Megaphone, color: 'from-blue-500 to-indigo-600' },
    { label: 'High Priority', value: notices.filter(n => n.priority === 'high').length, icon: AlertCircle, color: 'from-red-500 to-rose-600' },
    { label: 'Last 7 Days', value: notices.filter(n => (new Date() - new Date(n.date)) / (1000 * 60 * 60 * 24) <= 7).length, icon: Calendar, color: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this notice? This action cannot be undone."
          onConfirm={confirmDeleteNotice}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-blue-900/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-primary-900/10 rounded-full blur-[140px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div className="reveal-left">
              <h1 className="text-4xl font-black text-secondary-900 dark:text-white tracking-tight mb-2 uppercase">
                Notice <span className="text-primary-600">Central</span>
              </h1>
              <p className="text-secondary-500 dark:text-slate-400 font-medium">
                Broadcast information across the institutional network.
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary h-14 px-8 rounded-2xl shadow-xl shadow-primary-600/20 hover:shadow-primary-600/40 transition-all hover:scale-[1.02] active:scale-[0.98] reveal-right"
            >
              <Plus className="h-5 w-5 mr-2" />
              POST NEW NOTICE
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, idx) => (
              <div key={idx} className={`glass-morphism p-6 rounded-[32px] border border-white/10 reveal-scale stagger-${idx+1}`}>
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                    <stat.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-black text-secondary-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="glass-morphism p-4 rounded-[24px] border border-white/10 mb-8 reveal shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Seach by title or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-14 pl-12 pr-4 rounded-xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none"
                />
              </div>
              <div className="lg:w-48 relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-14 px-4 rounded-xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none appearance-none cursor-pointer"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value} className="bg-slate-900">
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="lg:w-48 relative">
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-14 px-4 rounded-xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none appearance-none cursor-pointer"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value} className="bg-slate-900">
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Add/Edit Notice Form */}
          {showAddForm && (
            <div className="glass-morphism p-8 md:p-12 rounded-[40px] border border-white/10 mb-12 reveal-scale">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-secondary-900 dark:text-white tracking-tight">
                  {editingNotice ? 'Update Announcement' : 'New Announcement'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-3">
                  <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Announcement Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none text-xl font-bold"
                    placeholder="E.g., Winter Semester Admissions Open"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Notice Content</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={6}
                    className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 p-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none text-lg resize-none"
                    placeholder="Write the detailed announcement here..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none"
                      required
                    >
                      <option value="admission">Admission</option>
                      <option value="examination">Examination</option>
                      <option value="general">General</option>
                      <option value="holiday">Holiday</option>
                      <option value="result">Result</option>
                      <option value="scholarship">Scholarship</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Priority Level</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none"
                      required
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Auto-Expiry Date</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="btn btn-primary h-16 px-12 rounded-2xl text-lg font-black"
                  >
                    {editingNotice ? 'UPDATE ANNOUNCEMENT' : 'PUBLISH NOTICE'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-outline h-16 px-12 rounded-2xl text-lg font-black"
                  >
                    DISCARD
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notices Grid */}
          <div className="grid grid-cols-1 gap-6">
            {filteredNotices.map((notice, idx) => (
              <div key={notice._id} className={`glass-morphism p-8 rounded-[40px] border border-white/10 hover:border-primary-500/40 transition-all duration-500 group reveal stagger-${(idx % 5) + 1} shadow-lg shadow-black/5`}>
                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                  {/* Icon & Category */}
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 rounded-[28px] bg-gradient-to-br ${notice.priority === 'high' ? 'from-red-500 to-rose-600 shadow-red-500/20' : notice.priority === 'medium' ? 'from-amber-500 to-orange-600 shadow-amber-500/20' : 'from-emerald-500 to-teal-600 shadow-emerald-500/20'} flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                      <AlertCircle className="h-10 w-10" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black tracking-widest text-primary-400 uppercase">
                        {notice.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${notice.priority === 'high' ? 'text-red-500 bg-red-500/10' : notice.priority === 'medium' ? 'text-amber-500 bg-amber-500/10' : 'text-emerald-500 bg-emerald-500/10'}`}>
                        {notice.priority} Priority
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-secondary-900 dark:text-white group-hover:text-primary-500 transition-colors tracking-tight mb-2">
                        {notice.title}
                      </h3>
                      <p className="text-secondary-600 dark:text-slate-400 text-lg line-clamp-2 italic font-medium">
                        "{notice.content}"
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-xs font-black text-secondary-500 dark:text-slate-500 uppercase tracking-tighter">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary-500" />
                        <span>Issued: {new Date(notice.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      {notice.expiryDate && (
                        <div className="flex items-center gap-2 text-rose-500/80">
                          <AlertCircle className="h-4 w-4" />
                          <span>Expires: {new Date(notice.expiryDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row lg:flex-col gap-3 justify-end">
                    <button
                      onClick={() => handleEdit(notice)}
                      className="p-4 bg-primary-500/10 text-primary-500 rounded-2xl hover:bg-primary-500 hover:text-white transition-all shadow-sm"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(notice._id)}
                      className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNotices.length === 0 && (
            <div className="card text-center py-12 dark:bg-slate-900/40">
              <Megaphone className="h-16 w-16 text-secondary-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
                No notices found
              </h3>
              <p className="text-secondary-600 dark:text-slate-400">
                Get started by posting your first notice.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotices;
