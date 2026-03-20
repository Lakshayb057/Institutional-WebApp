import React, { useState, useEffect, useCallback } from 'react';
import { Users, Search, Mail, Phone, MapPin, Shield, CheckCircle, XCircle, Trash2, UserPlus, Filter } from 'lucide-react';
import api from '../../utils/axios';
import { Toast, ConfirmModal } from '../../components/AdminToast';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState(null);
  const [confirmToggle, setConfirmToggle] = useState(null);

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/students', {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm
        }
      });
      setStudents(response.data.data || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching students:', error);
      showToast('Error fetching students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!confirmToggle) return;
    try {
      await api.patch(`/api/admin/users/${confirmToggle._id}/toggle`);
      showToast(`User ${confirmToggle.isActive ? 'deactivated' : 'activated'} successfully!`);
      fetchStudents();
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('Error toggling user status', 'error');
    } finally {
      setConfirmToggle(null);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (loading && students.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Enrolled', value: students.length, icon: Users, color: 'from-blue-500 to-indigo-600' },
    { label: 'Verified Accounts', value: students.filter(s => s.isActive).length, icon: Shield, color: 'from-emerald-500 to-teal-600' },
    { label: 'New Students', value: students.filter(s => (new Date() - new Date(s.createdAt)) / (1000 * 60 * 60 * 24) <= 30).length, icon: UserPlus, color: 'from-purple-500 to-violet-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {confirmToggle && (
        <ConfirmModal
          title={confirmToggle.isActive ? 'Suspend Access' : 'Restore Access'}
          message={`Are you sure you want to ${confirmToggle.isActive ? 'deactivate' : 'reactivate'} @${confirmToggle.username}'s account?`}
          confirmText={confirmToggle.isActive ? 'Deactivate' : 'Activate'}
          confirmVariant={confirmToggle.isActive ? 'danger' : 'success'}
          onConfirm={handleToggleStatus}
          onCancel={() => setConfirmToggle(null)}
        />
      )}

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-primary-900/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-indigo-900/10 rounded-full blur-[140px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div className="reveal-left">
              <h1 className="text-4xl font-black text-secondary-900 dark:text-white tracking-tight mb-2 uppercase italic">
                Student <span className="text-primary-600">Directory</span>
              </h1>
              <p className="text-secondary-500 dark:text-slate-400 font-medium">
                Monitoring the heartbeat of our academic community.
              </p>
            </div>
            <div className="flex items-center gap-4 reveal-right">
               <button className="btn btn-outline h-14 px-8 rounded-2xl border-white/10 hover:bg-white/5 transition-all">
                  EXPORT CSV
               </button>
            </div>
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

          {/* Search Bar */}
          <div className="glass-morphism p-4 rounded-[24px] border border-white/10 mb-8 reveal shadow-sm">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search by name, email, or @username..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-14 pl-12 pr-4 rounded-xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="glass-morphism rounded-[32px] border border-white/10 overflow-hidden reveal shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-8 py-6 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-[0.2em]">Student Profile</th>
                    <th className="px-8 py-6 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-[0.2em]">Communication</th>
                    <th className="px-8 py-6 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-[0.2em]">Registration</th>
                    <th className="px-8 py-6 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-[0.2em]">Account Status</th>
                    <th className="px-8 py-6 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {students.map((student, idx) => (
                    <tr key={student._id} className="group hover:bg-white/5 transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform">
                            {student.profile?.firstName?.[0] || student.username?.[0] || 'U'}
                          </div>
                          <div>
                            <div className="text-base font-black text-secondary-900 dark:text-white group-hover:text-primary-500 transition-colors capitalize">
                              {student.profile?.firstName} {student.profile?.lastName}
                            </div>
                            <div className="text-xs font-bold text-secondary-400 dark:text-slate-500 tracking-wider uppercase">
                              @{student.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm font-bold text-secondary-600 dark:text-slate-400">
                            <Mail className="h-4 w-4 text-primary-500" />
                            <span>{student.email}</span>
                          </div>
                          {student.profile?.phone && (
                            <div className="flex items-center gap-2 text-sm font-bold text-secondary-600 dark:text-slate-400">
                              <Phone className="h-4 w-4 text-emerald-500" />
                              <span>{student.profile.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-sm font-bold text-secondary-900 dark:text-slate-300">
                          <MapPin className="h-4 w-4 text-rose-500" />
                          <span>{new Date(student.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${student.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                           <span className={`text-xs font-black uppercase tracking-widest ${student.isActive ? 'text-emerald-500' : 'text-red-500'}`}>
                             {student.isActive ? 'Active Member' : 'Account Suspended'}
                           </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setConfirmToggle(student)}
                            className={`p-3 rounded-xl transition-all shadow-sm ${
                              student.isActive 
                              ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' 
                              : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                            }`}
                          >
                            {student.isActive ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {students.length === 0 && (
            <div className="text-center py-16">
              <UserPlus className="h-16 w-16 text-secondary-200 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-1">No students found</h3>
              <p className="text-secondary-500 dark:text-slate-400">No student accounts found matching your search.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-secondary-50 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-outline btn-sm disabled:opacity-50"
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`h-8 w-8 rounded-lg text-sm font-bold transition-all ${
                      currentPage === idx + 1 
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                        : 'bg-white text-secondary-600 hover:bg-primary-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn btn-outline btn-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

          {/* Stats & Filters Footer */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-morphism p-8 rounded-[40px] border border-white/10 reveal shadow-lg">
              <h3 className="text-lg font-black text-secondary-900 dark:text-white mb-6 flex items-center gap-3 uppercase tracking-tight">
                <Filter className="h-5 w-5 text-primary-500" />
                Intelligent Filters
              </h3>
              <div className="flex flex-wrap gap-3">
                {['All Roles', 'Recent', 'Active', 'Suspended'].map((f) => (
                  <button key={f} className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-black text-secondary-500 dark:text-slate-400 uppercase tracking-widest hover:border-primary-500 hover:text-primary-500 transition-all">
                    {f}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="glass-morphism p-8 rounded-[40px] border border-white/10 reveal shadow-lg bg-gradient-to-br from-primary-600/20 to-indigo-600/20 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">Administrative Shield</h3>
                <p className="text-sm font-medium text-slate-400 mb-6 italic">Secure management of institutional credentials and access.</p>
                <button className="btn btn-primary h-12 px-6 rounded-xl text-xs font-black uppercase tracking-widest group-hover:scale-105 transition-transform">
                  Access Support
                </button>
              </div>
              <Shield className="absolute -right-6 -bottom-6 h-32 w-32 text-primary-500/10 group-hover:scale-110 transition-transform duration-700" />
            </div>

            <div className="glass-morphism p-8 rounded-[40px] border border-white/10 reveal shadow-lg flex flex-col justify-center items-center text-center">
               <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 animate-bounce">
                  <CheckCircle className="h-8 w-8" />
               </div>
               <h3 className="text-xl font-black text-secondary-900 dark:text-white uppercase tracking-tighter">System Sanitized</h3>
               <p className="text-xs font-bold text-secondary-500 dark:text-slate-500 uppercase tracking-widest mt-1">All registries up to date</p>
            </div>
          </div>
      </div>
    </div>
  );
};

export default AdminStudents;
