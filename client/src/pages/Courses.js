import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Clock, Users, IndianRupee, Search, X, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../utils/axios';

/* ── Toast Component ── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`toast ${type === 'success' ? 'toast-success' : 'toast-error'}`}>
      {type === 'success' ? <CheckCircle className="h-5 w-5 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
      <div className="flex-1">
        <p className="font-semibold text-sm">{message}</p>
      </div>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

/* ── Skeleton Card ── */
const SkeletonCard = () => (
  <div className="card p-0 overflow-hidden">
    <div className="skeleton h-40 rounded-none rounded-t-2xl" />
    <div className="p-6 space-y-3">
      <div className="skeleton h-5 w-3/4 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="skeleton h-10 w-full rounded-xl mt-4" />
    </div>
  </div>
);

const categoryColors = {
  'Computer Applications': 'from-blue-500 to-indigo-600',
  'Technical Trades':      'from-orange-500 to-amber-600',
  'Business Management':   'from-emerald-500 to-teal-600',
  'Digital Marketing':     'from-purple-500 to-violet-600',
  'E-commerce':            'from-pink-500 to-rose-600',
  'Other':                 'from-secondary-500 to-secondary-600',
};

const categoryBadge = {
  'Computer Applications': 'bg-blue-100 text-blue-800',
  'Technical Trades':      'bg-orange-100 text-orange-800',
  'Business Management':   'bg-emerald-100 text-emerald-800',
  'Digital Marketing':     'bg-purple-100 text-purple-800',
  'E-commerce':            'bg-pink-100 text-pink-800',
  'Other':                 'bg-secondary-100 text-secondary-700',
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  const categories = [
    { value: 'all', label: 'All Courses' },
    { value: 'Computer Applications', label: 'Computer Applications' },
    { value: 'Technical Trades',      label: 'Technical Trades' },
    { value: 'Business Management',   label: 'Business Management' },
    { value: 'Digital Marketing',     label: 'Digital Marketing' },
    { value: 'E-commerce',            label: 'E-commerce' },
    { value: 'Other',                 label: 'Other' },
  ];

  const showToast = useCallback((message, type) => setToast({ message, type }), []);

  useEffect(() => { fetchCourses(); }, []);

  useEffect(() => {
    let filtered = courses;
    if (selectedCategory !== 'all') filtered = filtered.filter(c => c.category === selectedCategory);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.instructor?.toLowerCase().includes(q)
      );
    }
    setFilteredCourses(filtered);
  }, [courses, selectedCategory, searchTerm]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/courses');
      setCourses(res.data.data || []);
    } catch (e) {
      console.error('Error fetching courses:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = (course) => {
    window.open(
      `https://wa.me/8295886832?text=Hi! I'm interested in enrolling for the course: ${course.title}`,
      '_blank'
    );
    showToast(`Redirecting you to WhatsApp for "${course.title}" enrollment!`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-primary-800 to-blue-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-blue-100 text-sm font-semibold rounded-full mb-4 border border-white/20">
            All Programs
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Our Courses</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Discover our comprehensive range of skill development programs designed to enhance your career prospects.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Available Courses', value: filteredCourses.length, color: 'text-primary-600' },
            { label: 'Categories', value: categories.length - 1, color: 'text-emerald-600' },
            { label: 'Enrolled Students', value: courses.reduce((s, c) => s + (c.currentStudents || 0), 0), color: 'text-purple-600' },
          ].map((s, idx) => (
            <div key={idx} className={`card text-center p-4 dark:bg-slate-900/40 reveal-scale stagger-${idx + 1}`}>
              <div className={`text-2xl font-black ${s.color} dark:text-primary-400`}>{s.value}</div>
              <div className="text-xs text-secondary-500 dark:text-slate-400 font-semibold mt-1 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card mb-8 p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search courses, instructors..."
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
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input appearance-none"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
          {(searchTerm || selectedCategory !== 'all') && (
            <div className="mt-3 flex items-center gap-2 text-sm text-secondary-500 dark:text-slate-400">
              <span>Showing <strong className="text-secondary-900 dark:text-slate-200">{filteredCourses.length}</strong> results</span>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 font-semibold flex items-center gap-1 transition-colors"
              >
                <X className="h-3.5 w-3.5" /> Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(idx => <SkeletonCard key={idx} />)}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="card text-center py-16">
            <BookOpen className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-secondary-900 mb-2">No courses found</h3>
            <p className="text-secondary-500">Try adjusting your search or filter criteria</p>
            <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} className="btn btn-outline mt-4">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, idx) => {
              const gradColor = categoryColors[course.category] || categoryColors['Other'];
              const badgeColor = categoryBadge[course.category] || categoryBadge['Other'];
              const isFull = course.currentStudents >= course.maxStudents;
              const fillPct = Math.min((course.currentStudents / (course.maxStudents || 1)) * 100, 100);

              return (
                <div key={course._id} className={`group card p-0 overflow-hidden hover:-translate-y-2 transition-all duration-300 reveal-scale stagger-${(idx % 3) + 1}`}>
                  {/* Card Header */}
                  <div className={`h-44 bg-gradient-to-br ${gradColor} flex items-center justify-center relative`}>
                    <BookOpen className="h-16 w-16 text-white/80 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${badgeColor}`}>
                        {course.category}
                      </span>
                    </div>
                    {isFull && (
                      <div className="absolute top-4 left-4 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        FULL
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-lg font-bold text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-secondary-500 dark:text-slate-400 text-sm line-clamp-2">{course.description}</p>
  
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-secondary-600 dark:text-slate-300">
                          <Users className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                          <span className="font-medium">{course.instructor}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-secondary-600 dark:text-slate-300">
                            <Clock className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-1 text-primary-700 dark:text-primary-400 font-bold">
                            <IndianRupee className="h-4 w-4" />
                            <span>{course.fees?.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                    {/* Enrollment Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-secondary-500 dark:text-slate-400 mb-1.5">
                        <span>Enrollment</span>
                        <span className="font-semibold text-secondary-700 dark:text-slate-300">{course.currentStudents}/{course.maxStudents}</span>
                      </div>
                      <div className="w-full bg-secondary-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-gradient-to-r from-primary-500 to-primary-600'}`}
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                      {fillPct > 80 && !isFull && (
                        <p className="text-xs text-orange-600 font-semibold mt-1">⚡ Almost full — {course.maxStudents - course.currentStudents} seats left</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleEnroll(course)}
                      disabled={isFull}
                      className={`btn w-full ${isFull ? 'opacity-50 cursor-not-allowed bg-secondary-300 text-secondary-600 shadow-none hover:translate-y-0' : 'btn-primary'}`}
                    >
                      {isFull ? 'Course Full' : 'Enroll Now via WhatsApp'}
                    </button>
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

export default Courses;
