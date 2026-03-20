import React, { useState } from 'react';
import { Search, Award, CheckCircle, AlertCircle, Calendar, BookOpen, X, Shield, RotateCcw } from 'lucide-react';
import api from '../utils/axios';

const CertificateVerification = () => {
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certificateId.trim()) { setError('Please enter a certificate ID'); return; }
    setLoading(true);
    setError('');
    setCertificate(null);
    setIsVerified(false);

    try {
      const res = await api.get(`/api/certificates/verify/${certificateId.trim()}`);
      if (res.data.status === 'success') {
        setCertificate(res.data.data);
        setIsVerified(true);
      }
    } catch (err) {
      setError(
        err.response?.status === 404
          ? 'Certificate not found. Please check the ID and try again.'
          : 'An error occurred. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCertificateId('');
    setCertificate(null);
    setError('');
    setIsVerified(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-primary-800 to-blue-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-3xl border border-white/20 flex items-center justify-center shadow-2xl">
                <Award className="h-10 w-10 text-amber-300" />
              </div>
              <div className="absolute -inset-2 bg-amber-400/20 rounded-3xl blur-xl" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Certificate Verification</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Verify the authenticity of ABVSTVS certificates. Enter the certificate ID below to check its validity.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Verification Form */}
        <div className="card mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <Shield className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Verify Certificate</h2>
              <p className="text-sm text-secondary-500 dark:text-slate-400">Enter the ID printed on the certificate document</p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label htmlFor="certificateId" className="label">Certificate ID</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <input
                  id="certificateId"
                  type="text"
                  value={certificateId}
                  onChange={(e) => { setCertificateId(e.target.value); setError(''); }}
                  placeholder="e.g., CERT-2024-001"
                  className="input pl-12 font-mono"
                />
                {certificateId && (
                  <button type="button" onClick={() => setCertificateId('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="mt-1.5 text-xs text-secondary-400">The certificate ID is typically printed on the bottom of the certificate document</p>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400 rounded-xl animate-slideDown">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1 py-3.5 text-base font-bold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Verifying...</>
                ) : (
                  <><Search className="h-5 w-5 mr-2" />Verify Certificate</>
                )}
              </button>
              {isVerified && (
                <button type="button" onClick={handleReset} className="btn btn-outline px-5">
                  <RotateCcw className="h-4 w-4 mr-2" />Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Certificate Result */}
        {isVerified && certificate && (
          <div className="animate-fadeInUp">
            {/* Verified Banner */}
            <div className="mb-6 p-4 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-600/20 flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-lg">Certificate Verified Successfully ✓</p>
                <p className="text-emerald-100 text-sm">This is an authentic certificate issued by ABVSTVS</p>
              </div>
            </div>

            {/* Certificate Card */}
            <div className="card p-0 overflow-hidden">
              {/* Certificate Header (decorative) */}
              <div className="bg-gradient-to-r from-indigo-900 via-primary-800 to-blue-700 p-8 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 11px)' }} />
                <div className="relative z-10">
                  <Award className="h-12 w-12 text-amber-300 mx-auto mb-3" />
                  <h3 className="text-2xl font-black mb-1">Certificate of Completion</h3>
                  <p className="text-blue-200 text-sm font-mono">{certificate.certificateId}</p>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Student Info */}
                  <div>
                    <h4 className="text-sm font-bold text-secondary-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-6 h-0.5 bg-primary-600 dark:bg-primary-400 inline-block" />
                      Student Information
                    </h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Student Name', value: certificate.studentName },
                        { label: 'Grade', value: certificate.grade },
                        { label: 'Certificate ID', value: certificate.certificateId, mono: true },
                      ].map(({ label, value, mono }) => (
                        <div key={label}>
                          <p className="text-xs font-semibold text-secondary-400 dark:text-slate-500 uppercase tracking-wide">{label}</p>
                          <p className={`text-secondary-900 dark:text-slate-200 font-semibold mt-0.5 ${mono ? 'font-mono bg-secondary-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-sm inline-block' : ''}`}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Course Info */}
                  <div>
                    <h4 className="text-sm font-bold text-secondary-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      Course Information
                    </h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Course Name', value: certificate.courseName },
                        { label: 'Duration', value: certificate.duration },
                        { label: 'Instructor', value: certificate.instructor },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-xs font-semibold text-secondary-400 dark:text-slate-500 uppercase tracking-wide">{label}</p>
                          <p className="text-secondary-900 dark:text-slate-200 font-semibold">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-secondary-100 dark:border-white/5">
                  {[
                    { label: 'Completion Date', value: certificate.completionDate },
                    { label: 'Issue Date', value: certificate.issueDate },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-xl border border-primary-100 dark:border-primary-800/30">
                      <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wide">{label}</p>
                        <p className="font-bold text-secondary-900 dark:text-slate-200">{new Date(value).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Authentic Certificate</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-500">Verified {certificate.verificationCount} time{certificate.verificationCount !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 bg-emerald-600 dark:bg-emerald-700 text-white text-xs font-bold rounded-full">✓ VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How-to Instructions */}
        {!isVerified && (
          <div className="card">
            <h3 className="text-lg font-bold text-secondary-900 mb-5 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary-600" />
              How to Verify a Certificate
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { step: '1', title: 'Find Certificate ID', desc: 'Locate the unique certificate ID printed on your certificate document.' },
                { step: '2', title: 'Enter the ID', desc: 'Type the certificate ID in the search field above.' },
                { step: '3', title: 'Click Verify', desc: 'Click "Verify Certificate" to check its authenticity against our database.' },
                { step: '4', title: 'View Results', desc: 'Review the verification results and detailed certificate information.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4 p-4 bg-secondary-50 dark:bg-slate-900/50 rounded-xl border border-transparent dark:border-white/5">
                  <div className="w-9 h-9 bg-primary-600 dark:bg-primary-700 text-white rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0">
                    {step}
                  </div>
                  <div>
                    <p className="font-bold text-secondary-900 dark:text-slate-200 text-sm">{title}</p>
                    <p className="text-secondary-500 dark:text-slate-400 text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateVerification;
