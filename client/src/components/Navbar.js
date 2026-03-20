import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, Users, LogOut, Settings, ChevronDown, LayoutDashboard, BookOpen, Megaphone, Award, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsAdminOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActiveLink = (path) => location.pathname === path;

  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Courses' },
    { path: '/notices', label: 'Notices' },
    { path: '/certificate', label: 'Certificate' },
    { path: '/contact', label: 'Contact' },
    // { path: '/login', label: 'Admin Login' },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/courses', label: 'Manage Courses', icon: BookOpen },
    { path: '/admin/notices', label: 'Manage Notices', icon: Megaphone },
    { path: '/admin/certificates', label: 'Manage Certificates', icon: Award },
    { path: '/admin/students', label: 'Manage Students', icon: Users },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-primary-900/80 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.3)] border-b border-white/10 py-0'
          : 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg shadow-lg border-b border-white/20 dark:border-white/10 py-1'
        }`}
    >
      {scrolled && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent animate-pulse-slow" />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-500 ${scrolled ? 'h-14' : 'h-16'}`}>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="relative">
              <div className="group-hover:scale-110 transition-transform duration-300">
                <img src="/logo.png" alt="ABVSTVS Logo" className="h-16 w-16 object-contain filter drop-shadow-md" />
              </div>
            </div>
            <div>
              <h1 className={`text-xl font-extrabold leading-tight transition-colors duration-500 ${scrolled ? 'text-white' : 'text-primary-900'}`}>ABVSTVS</h1>
              <p className={`text-[10px] hidden sm:block font-medium tracking-wide leading-none transition-colors duration-500 ${scrolled ? 'text-blue-300/80' : 'text-secondary-500'}`}>
                Skill Training & Vocational Studies
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link transition-colors duration-500 ${isActiveLink(link.path)
                    ? scrolled ? 'text-gold-400 bg-white/10' : 'nav-link-active'
                    : scrolled ? 'text-blue-100 hover:text-white hover:bg-white/5' : ''
                  }`}
              >
                {link.label}
                {isActiveLink(link.path) && (
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full transition-colors ${scrolled ? 'bg-gold-500' : 'bg-primary-600'}`} />
                )}
              </Link>
            ))}

            {/* Admin Dropdown */}
            {isAuthenticated && user?.role === 'admin' && (
              <div className="relative group">
                <button
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold
                             text-secondary-700 hover:text-primary-600 hover:bg-primary-50/50
                             transition-all duration-200 bg-amber-50 border border-amber-200"
                >
                  <Settings className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-700">Admin</span>
                  <ChevronDown className="h-3.5 w-3.5 text-amber-600 group-hover:rotate-180 transition-transform duration-300" />
                </button>

                {/* Dropdown — shown on group-hover */}
                <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible
                               translate-y-2 group-hover:translate-y-0 transition-all duration-200
                               bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-secondary-100 py-2 z-50 overflow-hidden">
                  <div className="px-4 py-2 border-b border-secondary-100 mb-1">
                    <p className="text-xs font-bold text-secondary-500 uppercase tracking-wider">Admin Panel</p>
                  </div>
                  {adminLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium
                                 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-150
                                 ${isActiveLink(link.path) ? 'text-primary-600 bg-primary-50' : 'text-secondary-700'}`}
                    >
                      <link.icon className="h-4 w-4 opacity-70" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-300 ml-2 ${scrolled
                  ? 'bg-white/10 text-gold-400 hover:bg-white/20'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Auth Status */}
            {isAuthenticated && user?.role === 'admin' && (
              <div className="flex items-center space-x-2 ml-4">
                <div className="flex items-center space-x-2 bg-secondary-50 dark:bg-slate-800/50 rounded-xl px-3 py-1.5 border border-secondary-200 dark:border-white/10">
                  <div className="h-8 w-8 bg-gradient-to-br from-primary-700 to-primary-900 rounded-full flex items-center justify-center shadow">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-secondary-900 dark:text-white leading-tight">{user?.username}</p>
                    <p className="text-[10px] text-secondary-500 dark:text-slate-400 capitalize leading-tight">{user?.role}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn btn-danger text-xs px-3 py-2 shadow-sm">
                  <LogOut className="h-3.5 w-3.5 mr-1.5" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl text-secondary-700 hover:text-primary-600 hover:bg-primary-50 transition-all"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-slideDown border-t border-secondary-100">
          <div className="bg-white/95 backdrop-blur-xl px-4 pt-4 pb-5 space-y-1">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActiveLink(link.path)
                    ? 'bg-primary-600 text-white shadow'
                    : 'text-secondary-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-slate-800'
                  }`}
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-secondary-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-800 transition-all"
            >
              <div className="flex items-center gap-2">
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <span className="text-xs text-secondary-400 uppercase tracking-widest">{theme}</span>
            </button>

            {isAuthenticated && user?.role === 'admin' && (
              <div className="pt-3 mt-3 border-t border-secondary-100">
                <button
                  onClick={() => setIsAdminOpen(!isAdminOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200"
                >
                  <span className="flex items-center gap-2"><Settings className="h-4 w-4" /> Admin Panel</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isAdminOpen ? 'rotate-180' : ''}`} />
                </button>
                {isAdminOpen && (
                  <div className="mt-1 pl-2 space-y-1">
                    {adminLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-secondary-700 hover:text-primary-600 hover:bg-primary-50"
                      >
                        <link.icon className="h-4 w-4 opacity-60" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="pt-3 mt-3 border-t border-secondary-100">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-secondary-50 rounded-xl">
                    <div className="h-9 w-9 bg-gradient-to-br from-primary-700 to-primary-900 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-secondary-900">{user?.username}</p>
                      <p className="text-xs text-secondary-500 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary w-full justify-center">
                  Login to Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
