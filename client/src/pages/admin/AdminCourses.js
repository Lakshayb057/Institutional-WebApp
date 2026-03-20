import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Search, Users, Clock, IndianRupee, X } from 'lucide-react';
import api from '../../utils/axios';
import { Toast, ConfirmModal } from '../../components/AdminToast';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Computer Applications',
    duration: '',
    fees: '',
    instructor: '',
    schedule: '',
    maxStudents: 30,
    prerequisites: [],
    learningOutcomes: []
  });

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Computer Applications', label: 'Computer Applications' },
    { value: 'Technical Trades', label: 'Technical Trades' },
    { value: 'Business Management', label: 'Business Management' },
    { value: 'Digital Marketing', label: 'Digital Marketing' },
    { value: 'E-commerce', label: 'E-commerce' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, selectedCategory, searchTerm]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/courses');
      setCourses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
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
      if (editingCourse) {
        await api.put(`/api/courses/${editingCourse._id}`, formData);
        showToast('Course updated successfully!');
      } else {
        await api.post('/api/courses', formData);
        showToast('Course created successfully!');
      }
      fetchCourses();
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
      showToast('Error saving course. Please try again.', 'error');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      duration: course.duration,
      fees: course.fees,
      instructor: course.instructor,
      schedule: course.schedule,
      maxStudents: course.maxStudents,
      prerequisites: course.prerequisites || [],
      learningOutcomes: course.learningOutcomes || []
    });
    setShowAddForm(true);
  };

  const handleDelete = (courseId) => {
    setConfirmDelete(courseId);
  };

  const confirmDeleteCourse = async () => {
    try {
      await api.delete(`/api/courses/${confirmDelete}`);
      showToast('Course deleted successfully!');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      showToast('Error deleting course. Please try again.', 'error');
    } finally {
      setConfirmDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Computer Applications',
      duration: '',
      fees: '',
      instructor: '',
      schedule: '',
      maxStudents: 30,
      prerequisites: [],
      learningOutcomes: []
    });
    setEditingCourse(null);
    setShowAddForm(false);
  };

  const filteredCourses = filterCourses();

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
    { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
    { label: 'Total Seats', value: courses.reduce((acc, c) => acc + (c.maxStudents || 0), 0), icon: Users, color: 'from-emerald-500 to-teal-600' },
    { label: 'Avg. Course Fee', value: `₹${(courses.reduce((acc, c) => acc + (c.fees || 0), 0) / (courses.length || 1)).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'from-purple-500 to-violet-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this course? This action cannot be undone."
          onConfirm={confirmDeleteCourse}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div className="reveal-left">
              <h1 className="text-4xl font-black text-secondary-900 dark:text-white tracking-tight mb-2">
                Course <span className="text-primary-600">Catalyst</span>
              </h1>
              <p className="text-secondary-500 dark:text-slate-400 font-medium">
                Designing tomorrow's curriculum, today.
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary h-14 px-8 rounded-2xl shadow-xl shadow-primary-600/20 hover:shadow-primary-600/40 transition-all hover:scale-[1.02] active:scale-[0.98] reveal-right"
            >
              <Plus className="h-5 w-5 mr-2" />
              CREATE NEW COURSE
            </button>
          </div>

          {/* Stats Grid */}
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

          {/* Control Bar */}
          <div className="glass-morphism p-4 rounded-[24px] border border-white/10 mb-8 reveal shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Filter courses by name, instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-14 pl-12 pr-4 rounded-xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none"
                />
              </div>
              <div className="md:w-64 relative">
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
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                  <BookOpen className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Add/Edit Course Form */}
          {showAddForm && (
            <div className="glass-morphism p-8 md:p-12 rounded-[40px] border border-white/10 mb-12 reveal-scale">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-secondary-900 dark:text-white tracking-tight">
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Course Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none text-lg"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Primary Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none text-lg"
                      required
                    >
                      <option value="Computer Applications">Computer Applications</option>
                      <option value="Technical Trades">Technical Trades</option>
                      <option value="Business Management">Business Management</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Comprehensive Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 p-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none text-lg resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="e.g., 3 months"
                      className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none text-lg"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Tuition Fees (₹)</label>
                    <input
                      type="number"
                      name="fees"
                      value={formData.fees}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none text-lg"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Lead Instructor</label>
                    <input
                      type="text"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none text-lg"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Session Schedule</label>
                    <input
                      type="text"
                      name="schedule"
                      value={formData.schedule}
                      onChange={handleChange}
                      placeholder="e.g., Mon-Fri 9AM-12PM"
                      className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none text-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Enrollment Capacity</label>
                  <input
                    type="number"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={handleChange}
                    min="1"
                    className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none text-lg"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="btn btn-primary h-16 px-12 rounded-2xl text-lg font-black"
                  >
                    {editingCourse ? 'UPDATE COURSE' : 'PUBLISH COURSE'}
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

          {/* Courses Table */}
          <div className="glass-morphism rounded-[32px] border border-white/10 overflow-hidden reveal shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-8 py-6 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-[0.2em]">Course Details</th>
                    <th className="px-8 py-6 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-[0.2em]">Category</th>
                    <th className="px-8 py-6 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-[0.2em]">Instructor</th>
                    <th className="px-8 py-6 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-[0.2em]">Metrics</th>
                    <th className="px-8 py-6 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCourses.map((course) => (
                    <tr key={course._id} className="group hover:bg-white/5 transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-lg font-black text-secondary-900 dark:text-white group-hover:text-primary-500 transition-colors">{course.title}</span>
                          <span className="text-sm text-secondary-500 dark:text-slate-400 line-clamp-1 max-w-sm">{course.description}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm">
                        <span className="px-3 py-1.5 rounded-xl bg-primary-500/10 text-primary-500 font-black text-xs border border-primary-500/20 uppercase tracking-wider">
                          {course.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-secondary-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-secondary-700 dark:text-slate-300">
                            {course.instructor.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-secondary-900 dark:text-slate-300">{course.instructor}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-secondary-500 dark:text-slate-400">
                            <IndianRupee className="h-3 w-3" />
                            <span>{course.fees.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-secondary-500 dark:text-slate-400">
                            <Users className="h-3 w-3" />
                            <span>{course.currentStudents || 0}/{course.maxStudents} Seats</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleEdit(course)}
                            className="p-3 bg-primary-500/10 text-primary-500 rounded-xl hover:bg-primary-500 hover:text-white transition-all shadow-sm"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(course._id)}
                            className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-secondary-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
                No courses found
              </h3>
              <p className="text-secondary-500 dark:text-slate-400">
                Get started by creating your first course.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
