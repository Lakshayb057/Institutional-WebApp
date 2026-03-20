import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, BookOpen, Users, Award, ArrowRight,
  Megaphone, CheckCircle, Star, Zap, Globe, Rocket
} from 'lucide-react';
import api from '../utils/axios';

/* ── Animated Counter ── */
const AnimatedNumber = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (target === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const Home = () => {
  const [stats, setStats] = useState({ courses: 12, students: 486, certificates: 156, notices: 24 });
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const fetchDashboardData = async () => {
    try {
      const [coursesRes, noticesRes] = await Promise.all([
        api.get('/api/courses?limit=3'),
        api.get('/api/notices?limit=3'),
      ]);
      const courses = coursesRes.data.data || [];
      const notices = noticesRes.data.data || [];
      setFeaturedCourses(courses);
      setRecentNotices(notices);
      setStats({
        courses: courses.length || 12,
        students: 486,
        certificates: 156,
        notices: notices.length || 24,
      });
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const features = [
    { icon: BookOpen,    title: 'Quality Education',  color: 'from-blue-500 to-indigo-600',   description: 'Comprehensive skill-based training programs designed for modern workforce requirements.' },
    { icon: Users,       title: 'Expert Faculty',     color: 'from-emerald-500 to-teal-600',  description: 'Learn from industry experts with years of practical experience in their fields.' },
    { icon: Award,       title: 'Certified Programs', color: 'from-purple-500 to-violet-600', description: 'Government-recognized certifications that enhance your career opportunities.' },
    { icon: GraduationCap, title: 'Career Support',  color: 'from-orange-500 to-amber-600',  description: 'Placement assistance and career guidance to achieve your professional goals.' },
  ];

  const statCards = [
    { icon: BookOpen,    label: 'Courses',      value: stats.courses,      suffix: '+', color: 'from-blue-500 to-indigo-500' },
    { icon: Users,       label: 'Students',     value: stats.students,     suffix: '+', color: 'from-emerald-500 to-teal-500' },
    { icon: Award,       label: 'Certificates', value: stats.certificates, suffix: '+', color: 'from-purple-500 to-violet-500' },
    { icon: Megaphone,   label: 'Notices',      value: stats.notices,      suffix: '+', color: 'from-orange-500 to-amber-500' },
  ];

  const priorityBorderColor = {
    high:   'border-l-red-500',
    medium: 'border-l-amber-500',
    low:    'border-l-green-500',
    default:'border-l-primary-500',
  };

  return (
    <div className="space-y-0">

      {/* ── Admission Ticker ── */}
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-indigo-900 text-white py-3 overflow-hidden shadow-xl relative">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 11px)' }} />
        <div className="flex whitespace-nowrap animate-scroll">
          {[1, 2].map((k) => (
            <div key={k} className="flex whitespace-nowrap space-x-16 pr-16">
              {[
                'Admissions Open for 2024‑25',
                'Limited Seats Available',
                'Apply Now for Vocational Courses',
                'Scholarships Available',
                'Last Date: 31st March 2024',
                'New Courses Available in Digital Marketing & E-Commerce!',
              ].map((msg, idx) => (
                <span key={idx} className="inline-flex items-center gap-2 font-semibold text-sm">
                  <Megaphone className="h-4 w-4 text-gold-400 animate-pulse flex-shrink-0" />
                  {msg}
                  <span className="text-gold-500 mx-4">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 text-white py-28 ring-1 ring-white/10">
        
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gold-500/20 rounded-full blur-3xl animate-blob animation-delay-3000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-morphism rounded-full text-sm font-semibold mb-8 animate-fadeInUp">
            <Star className="h-4 w-4 text-gold-400 fill-gold-400" />
            <span className="text-blue-100">Government Recognized • NSDC Certified</span>
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Atal Bihari Vajpayee
            <br />
            <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-200 bg-clip-text text-transparent drop-shadow-sm">
              Centre for Skill Training
            </span>
            <br />
            and Vocational Studies
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-200 max-w-3xl mx-auto font-medium animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Empowering Youth Through Quality Skill Education &amp; Government-Certified Programs
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/courses"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold bg-white text-primary-900 rounded-2xl
                         shadow-2xl hover:shadow-white/25 hover:-translate-y-1 transition-all duration-300 animate-pulseGlow"
            >
              Explore Courses
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold border-2 border-white/50
                         text-white rounded-2xl hover:bg-white/10 hover:border-white hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
            >
              Contact Us
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-200 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            {['100% Job Assistance', 'Govt. Recognized', 'Expert Faculty', 'Scholarship Available'].map((b) => (
              <span key={b} className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="py-16 bg-white dark:bg-slate-900/50 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 via-white dark:via-transparent to-indigo-50/30 dark:to-indigo-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statCards.map((stat, idx) => (
              <div
                key={idx}
                className={`group text-center p-6 rounded-2xl border border-secondary-100 dark:border-white/10 bg-white dark:bg-slate-800/50 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 reveal-scale stagger-${(idx % 4) + 1}`}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-4xl font-black text-secondary-900 dark:text-white mb-1">
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-semibold text-secondary-500 dark:text-slate-400 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50/30 dark:from-slate-950 dark:to-primary-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header reveal">
            <span className="section-badge">Why Choose Us</span>
            <h2 className="section-title">Why Choose ABVSTVS?</h2>
            <p className="section-subtitle">
              We provide comprehensive skill development programs that prepare you for the modern workforce.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`group card text-center hover:-translate-y-2 transition-all duration-300 reveal stagger-${(idx % 4) + 1}`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} shadow-xl mb-6 group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 mx-auto`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-3">{feature.title}</h3>
                <p className="text-secondary-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section className="py-20 bg-white dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 reveal-left">
            <div>
              <span className="section-badge">Our Programs</span>
              <h2 className="section-title mb-2">Popular Courses</h2>
              <p className="text-secondary-500 text-lg">Discover our most sought-after skill development programs</p>
            </div>
            <Link to="/courses" className="btn btn-outline hidden md:inline-flex flex-shrink-0 reveal-right">
              View All Courses <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCourses.map((course, idx) => {
                const colors = [
                  'from-blue-500 to-indigo-600',
                  'from-emerald-500 to-teal-600',
                  'from-purple-500 to-violet-600',
                ];
                return (
                  <div key={course._id} className="group card hover:-translate-y-2 transition-all duration-300 p-0 overflow-hidden">
                    <div className={`h-40 bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center relative`}>
                      <BookOpen className="h-16 w-16 text-white/80" />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold border border-white/30">
                        {course.category}
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <h3 className="text-lg font-bold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-secondary-500 text-sm line-clamp-2">{course.description}</p>
                      <div className="flex justify-between items-center pt-2 border-t border-secondary-100 dark:border-white/5">
                        <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">₹{course.fees?.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-secondary-400 dark:text-slate-500 bg-secondary-100 dark:bg-slate-800 px-2 py-1 rounded-full">{course.duration}</span>
                      </div>
                      <Link to="/courses" className="btn btn-primary w-full mt-2">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-secondary-400">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p>Courses loading... Make sure the server is running.</p>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link to="/courses" className="btn btn-outline">View All Courses <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* ── Recent Notices ── */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-primary-900/20 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 reveal-left">
            <div>
              <span className="section-badge">Updates</span>
              <h2 className="section-title mb-2 dark:text-white">Latest Notices</h2>
              <p className="text-secondary-500 dark:text-slate-400 text-lg">Stay updated with important announcements</p>
            </div>
            <Link to="/notices" className="btn btn-outline hidden md:inline-flex flex-shrink-0 reveal-right">
              View All Notices <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {recentNotices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentNotices.map((notice) => (
                <div
                  key={notice._id}
                  className={`card border-l-4 ${priorityBorderColor[notice.priority] || priorityBorderColor.default} hover:-translate-y-1 transition-all duration-300 p-6`}
                >
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span className="badge badge-primary capitalize">{notice.category}</span>
                    <span className={`badge capitalize shadow-sm ${
                      notice.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                      notice.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                      'bg-green-100 text-green-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    }`}>{notice.priority} priority</span>
                  </div>
                  <h3 className="font-bold text-secondary-900 mb-2 line-clamp-2">{notice.title}</h3>
                  <p className="text-sm text-secondary-500 mb-3 line-clamp-2">{notice.content}</p>
                  <p className="text-xs text-secondary-400">{new Date(notice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-secondary-400">
              <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p>Notices loading... Make sure the server is running.</p>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link to="/notices" className="btn btn-outline">View All Notices <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 text-white">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-semibold mb-6">
            <Zap className="h-4 w-4 text-gold-400" />
            <span>Limited Seats — Apply Today</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            Ready to Start Your
            <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent"> Journey?</span>
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Join hundreds of successful students who have transformed their careers through ABVSTVS programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold bg-white text-primary-900 rounded-2xl shadow-2xl hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300">
              Browse All Courses <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold border-2 border-white/50 text-white rounded-2xl hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
              Talk to Counselor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
