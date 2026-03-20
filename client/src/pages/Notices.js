import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, Search, X, Bell, Clock } from 'lucide-react';
import api from '../utils/axios';

const priorityConfig = {
  high:   { border: 'border-l-red-500',   badge: 'bg-red-100 text-red-700',    dot: 'bg-red-500',   label: 'High' },
  medium: { border: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', label: 'Medium' },
  low:    { border: 'border-l-green-500', badge: 'bg-green-100 text-green-700', dot: 'bg-green-500', label: 'Low' },
};

const categoryConfig = {
  admission:   'bg-blue-100 text-blue-800',
  examination: 'bg-purple-100 text-purple-800',
  general:     'bg-secondary-100 text-secondary-700',
  holiday:     'bg-green-100 text-green-800',
  result:      'bg-orange-100 text-orange-800',
  scholarship: 'bg-pink-100 text-pink-800',
};

const SkeletonNotice = () => (
  <div className="card p-6">
    <div className="flex gap-4">
      <div className="skeleton w-16 h-20 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="flex gap-2">
          <div className="skeleton h-5 w-20 rounded-full" />
          <div className="skeleton h-5 w-24 rounded-full" />
        </div>
        <div className="skeleton h-6 w-3/4 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
      </div>
    </div>
  </div>
);

const isNew = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  return (now - d) / (1000 * 60 * 60 * 24) <= 7;
};

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'admission',   label: 'Admission' },
    { value: 'examination', label: 'Examination' },
    { value: 'general',     label: 'General' },
    { value: 'holiday',     label: 'Holiday' },
    { value: 'result',      label: 'Result' },
    { value: 'scholarship', label: 'Scholarship' },
  ];

  const priorities = [
    { value: 'all',    label: 'All Priorities' },
    { value: 'high',   label: '🔴 High' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'low',    label: '🟢 Low' },
  ];

  useEffect(() => { fetchNotices(); }, []);

  useEffect(() => {
    let filtered = notices;
    if (selectedCategory !== 'all') filtered = filtered.filter(n => n.category === selectedCategory);
    if (selectedPriority !== 'all') filtered = filtered.filter(n => n.priority === selectedPriority);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }
    setFilteredNotices(filtered);
  }, [notices, selectedCategory, selectedPriority, searchTerm]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/notices');
      setNotices(res.data.data || []);
    } catch (e) {
      console.error('Error fetching notices:', e);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (ds) => new Date(ds).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  const hightPriorityCount = filteredNotices.filter(n => n.priority === 'high').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-primary-800 to-blue-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-blue-100 text-sm font-semibold rounded-full mb-4 border border-white/20">
            Stay Updated
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Notices &amp; Announcements</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Stay updated with the latest news, announcements, and important information from ABVSTVS.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Notices',  value: filteredNotices.length, color: 'text-primary-600' },
            { label: 'High Priority',  value: filteredNotices.filter(n => n.priority === 'high').length, color: 'text-red-600' },
            { label: 'Medium Priority',value: filteredNotices.filter(n => n.priority === 'medium').length, color: 'text-amber-600' },
            { label: 'Low Priority',   value: filteredNotices.filter(n => n.priority === 'low').length, color: 'text-green-600' },
          ].map((s, idx) => (
            <div key={idx} className={`card text-center p-4 dark:bg-slate-900/40 reveal-scale stagger-${idx + 1}`}>
              <div className={`text-2xl font-black ${s.color} dark:text-opacity-90`}>{s.value}</div>
              <div className="text-xs text-secondary-500 dark:text-slate-400 font-semibold mt-1 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>

        {/* High-priority alert banner */}
        {hightPriorityCount > 0 && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-2xl text-red-700 dark:text-red-400">
            <Bell className="h-5 w-5 flex-shrink-0 animate-pulse" />
            <p className="text-sm font-semibold">
              You have <strong>{hightPriorityCount}</strong> high-priority {hightPriorityCount === 1 ? 'notice' : 'notices'} that require immediate attention.
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-8 p-5">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-11"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="lg:w-48">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="input appearance-none">
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="lg:w-48">
              <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} className="input appearance-none">
                {priorities.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
          {(searchTerm || selectedCategory !== 'all' || selectedPriority !== 'all') && (
            <div className="mt-3 flex items-center gap-2 text-sm text-secondary-500 dark:text-slate-400">
              <span>Showing <strong className="text-secondary-900 dark:text-slate-200">{filteredNotices.length}</strong> results</span>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedPriority('all'); }}
                className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 font-semibold flex items-center gap-1 transition-colors"
              >
                <X className="h-3.5 w-3.5" /> Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Notices List */}
        {loading ? (
          <div className="space-y-6">{[1, 2, 3].map(idx => <SkeletonNotice key={idx} />)}</div>
        ) : filteredNotices.length === 0 ? (
          <div className="card text-center py-16">
            <Megaphone className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-secondary-900 mb-2">No notices found</h3>
            <p className="text-secondary-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredNotices.map((notice, idx) => {
              const pc = priorityConfig[notice.priority] || priorityConfig.low;
              const cc = categoryConfig[notice.category] || 'bg-secondary-100 text-secondary-700';
              const noticeIsNew = isNew(notice.date);

              return (
                <div key={notice._id} className={`card border-l-4 ${pc.border} hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300 p-0 reveal-left stagger-${(idx % 5) + 1}`}>
                  <div className="flex flex-col md:flex-row md:items-stretch">
                    {/* Date block */}
                    <div className="flex-shrink-0 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-tl-2xl rounded-bl-none md:rounded-bl-2xl rounded-tr-2xl md:rounded-tr-none p-5 flex flex-col items-center justify-center min-w-[90px] md:min-w-[90px]">
                      <span className="text-3xl font-black">{new Date(notice.date).getDate()}</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary-200">
                        {new Date(notice.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-xs text-primary-300">{new Date(notice.date).getFullYear()}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-wrap gap-2 mb-3 items-center">
                        <span className={`badge capitalize ${cc}`}>{notice.category}</span>
                        <span className={`badge ${pc.badge}`}>
                          <span className={`inline-block w-2 h-2 rounded-full ${pc.dot} mr-1.5`} />
                          {pc.label} Priority
                        </span>
                        {noticeIsNew && (
                          <span className="badge bg-emerald-100 text-emerald-700 animate-pulse">🆕 New</span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">{notice.title}</h3>
                      <p className="text-secondary-600 dark:text-slate-300 leading-relaxed mb-4">{notice.content}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                          {formatDate(notice.date)}
                        </div>
                        {notice.author && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                            Posted by: <strong className="text-secondary-700 dark:text-slate-300">{notice.author.username}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;
