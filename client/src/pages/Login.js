import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Lock, User as UserIcon, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(formData.username, formData.password);
    if (result.success) navigate('/admin/dashboard');
    setIsLoading(false);
  };



  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500 py-12 px-4 shadow-inner">
      

      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-500/10 dark:bg-gold-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      <div className="absolute inset-0 opacity-5 dark:opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Back arrow */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-secondary-600 dark:text-white/70 hover:text-primary-600 dark:hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="max-w-md w-full space-y-6 relative z-10">

        {/* Header */}
        <div className="text-center animate-fadeInUp">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <img 
                src="/logo.png" 
                alt="ABVSTVS Logo" 
                className="h-36 w-36 object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-2 border-white dark:border-indigo-950 flex items-center justify-center shadow-lg">
                <ShieldCheck className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-black text-secondary-900 dark:text-white mb-1">Admin Login</h2>
          <p className="text-secondary-500 dark:text-primary-100/80">ABVSTVS Management Portal</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/40 dark:border-white/20 shadow-2xl p-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>

          {error && (
            <div className="mb-5 p-4 bg-red-500/20 border border-red-400/40 text-red-200 rounded-xl text-sm flex items-start gap-2 animate-slideDown">
              <span className="text-red-400 mt-0.5">✕</span>
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-secondary-800 dark:text-blue-100 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400 dark:text-blue-300" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/50 dark:bg-white/10 border border-secondary-200 dark:border-white/20 rounded-xl focus:outline-none
                             focus:ring-2 focus:ring-primary-400 focus:border-transparent
                             text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-blue-300/60 transition-all duration-300 hover:bg-white/70 dark:hover:bg-white/15"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-secondary-800 dark:text-blue-100 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:outline-none
                             focus:ring-2 focus:ring-primary-400 focus:border-transparent
                             text-white placeholder-blue-300/60 transition-all duration-300 hover:bg-white/15"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-white/30 bg-white/10 text-primary-500 focus:ring-primary-400" />
                <span className="text-sm text-blue-200 font-medium">Remember me</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-primary-700 to-primary-900 text-white font-bold text-base rounded-xl
                         shadow-lg shadow-primary-900/30 hover:shadow-primary-900/50 hover:-translate-y-0.5
                         active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>


        </div>

        <p className="text-center text-sm text-blue-300">
          © {new Date().getFullYear()} ABVSTVS. Secure Admin Portal.
        </p>
      </div>
    </div>
  );
};

export default Login;
