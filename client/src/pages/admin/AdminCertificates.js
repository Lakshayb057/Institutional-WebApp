import React, { useState, useEffect, useCallback } from 'react';
import { Award, Plus, Edit2, Trash2, Search, Calendar, CheckCircle, X } from 'lucide-react';
import api from '../../utils/axios';
import { Toast, ConfirmModal } from '../../components/AdminToast';

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    certificateId: '',
    studentName: '',
    courseName: '',
    grade: '',
    issueDate: '',
    completionDate: '',
    duration: '',
    instructor: '',
    studentEmail: '',
    studentPhone: ''
  });

  useEffect(() => {
    fetchCertificates();
  }, [currentPage, searchTerm]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/certificates', {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm
        }
      });
      setCertificates(response.data.data || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateCertificateId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CERT-${year}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCertificate) {
        await api.put(`/api/certificates/${editingCertificate._id}`, formData);
        showToast('Certificate updated successfully!');
      } else {
        const certificateData = {
          ...formData,
          certificateId: formData.certificateId || generateCertificateId()
        };
        await api.post('/api/certificates', certificateData);
        showToast('Certificate created successfully!');
      }
      fetchCertificates();
      resetForm();
    } catch (error) {
      console.error('Error saving certificate:', error);
      showToast('Error saving certificate. Please try again.', 'error');
    }
  };

  const handleEdit = (certificate) => {
    setEditingCertificate(certificate);
    setFormData({
      certificateId: certificate.certificateId,
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      grade: certificate.grade,
      issueDate: new Date(certificate.issueDate).toISOString().split('T')[0],
      completionDate: new Date(certificate.completionDate).toISOString().split('T')[0],
      duration: certificate.duration,
      instructor: certificate.instructor,
      studentEmail: certificate.studentEmail,
      studentPhone: certificate.studentPhone || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = (certDbId) => {
    setConfirmDelete(certDbId);
  };

  const confirmDeleteCertificate = async () => {
    try {
      await api.delete(`/api/certificates/${confirmDelete}`);
      showToast('Certificate deleted successfully!');
      fetchCertificates();
    } catch (error) {
      console.error('Error deleting certificate:', error);
      showToast('Error deleting certificate. Please try again.', 'error');
    } finally {
      setConfirmDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      certificateId: '',
      studentName: '',
      courseName: '',
      grade: '',
      issueDate: '',
      completionDate: '',
      duration: '',
      instructor: '',
      studentEmail: '',
      studentPhone: ''
    });
    setEditingCertificate(null);
    setShowAddForm(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
    { label: 'Total Issued', value: certificates.length, icon: Award, color: 'from-blue-500 to-indigo-600' },
    { label: 'Verified', value: certificates.filter(c => c.isVerified).length, icon: CheckCircle, color: 'from-emerald-500 to-teal-600' },
    { label: 'Top Performance', value: certificates.filter(c => c.grade === 'A+' || c.grade === 'Distinction').length, icon: Award, color: 'from-purple-500 to-violet-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this certificate? It can no longer be verified."
          onConfirm={confirmDeleteCertificate}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-indigo-900/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-primary-900/10 rounded-full blur-[140px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div className="reveal-left">
              <h1 className="text-4xl font-black text-secondary-900 dark:text-white tracking-tight mb-2 uppercase italic">
                Credential <span className="text-primary-600">Vault</span>
              </h1>
              <p className="text-secondary-500 dark:text-slate-400 font-medium">
                Issuing professional excellence to the next generation.
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary h-14 px-8 rounded-2xl shadow-xl shadow-primary-600/20 hover:shadow-primary-600/40 transition-all hover:scale-[1.02] active:scale-[0.98] reveal-right"
            >
              <Plus className="h-5 w-5 mr-2" />
              UPLOAD CREDENTIAL
            </button>
          </div>

          {/* Stats Bar */}
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
                placeholder="Lookup by Certificate ID, Student Name or Course..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-14 pl-12 pr-4 rounded-xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none"
              />
            </div>
          </div>

          {/* Add/Edit Certificate Form */}
          {showAddForm && (
            <div className="glass-morphism p-8 md:p-12 rounded-[40px] border border-white/10 mb-12 reveal-scale">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-secondary-900 dark:text-white tracking-tight">
                  {editingCertificate ? 'Edit Credential' : 'New Credential Upload'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Certificate ID</label>
                    <input
                      type="text"
                      name="certificateId"
                      value={formData.certificateId}
                      onChange={handleChange}
                      placeholder={editingCertificate ? '' : 'Auto-generated if empty'}
                      className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Student Full Name</label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none text-lg font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Course Title</label>
                    <input
                      type="text"
                      name="courseName"
                      value={formData.courseName}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Grade / Performance</label>
                    <input
                      type="text"
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      placeholder="e.g., A+, Distinction"
                      className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none font-black"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Completion Date</label>
                    <input
                      type="date"
                      name="completionDate"
                      value={formData.completionDate}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Issue Date</label>
                    <input
                      type="date"
                      name="issueDate"
                      value={formData.issueDate}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Program Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="e.g., 6 Months"
                      className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Issuing Instructor</label>
                    <input
                      type="text"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Student Email Address</label>
                    <input
                      type="email"
                      name="studentEmail"
                      value={formData.studentEmail}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-16 px-6 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest ml-1">Contact Number</label>
                    <input
                      type="tel"
                      name="studentPhone"
                      value={formData.studentPhone}
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
                    {editingCertificate ? 'UPDATE CREDENTIAL' : 'PUBLISH CREDENTIAL'}
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

          {/* Certificates Table */}
          <div className="glass-morphism rounded-[32px] border border-white/10 overflow-hidden reveal shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-8 py-6 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-[0.2em]">Certificate</th>
                    <th className="px-8 py-6 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-[0.2em]">Recipient</th>
                    <th className="px-8 py-6 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-[0.2em]">Program</th>
                    <th className="px-8 py-6 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-[0.2em]">Performance</th>
                    <th className="px-8 py-6 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-[0.2em]">Verification</th>
                    <th className="px-8 py-6 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {certificates.map((certificate) => (
                    <tr key={certificate._id} className="group hover:bg-white/5 transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary-500/10 text-primary-500 rounded-xl group-hover:scale-110 transition-transform">
                            <Award className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-secondary-900 dark:text-white">
                              {certificate.certificateId}
                            </div>
                            <div className="text-[10px] font-black uppercase text-secondary-500 dark:text-slate-500 tracking-wider">
                              Issued: {new Date(certificate.issueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-secondary-900 dark:text-slate-200">{certificate.studentName}</span>
                          <span className="text-xs text-secondary-500 dark:text-slate-500 italic">{certificate.studentEmail}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-tighter">{certificate.courseName}</span>
                          <span className="text-xs text-secondary-500 dark:text-slate-500">{certificate.duration}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-xl text-xs font-black border border-emerald-500/20 uppercase">
                          {certificate.grade}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${certificate.isVerified ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse' : 'bg-secondary-300'}`} />
                          <span className="text-xs font-black uppercase tracking-widest text-secondary-600 dark:text-slate-400">
                            {certificate.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(certificate)}
                            className="p-3 bg-primary-500/10 text-primary-500 rounded-xl hover:bg-primary-500 hover:text-white transition-all shadow-sm"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(certificate._id)}
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

          {certificates.length === 0 && (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-secondary-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
                No certificates found
              </h3>
              <p className="text-secondary-500 dark:text-slate-400">
                Get started by uploading your first certificate.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-outline btn-sm disabled:opacity-50"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`btn btn-sm ${
                    currentPage === index + 1
                      ? 'btn-primary'
                      : 'btn-outline'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-outline btn-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCertificates;
