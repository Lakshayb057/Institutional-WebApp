import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Megaphone, Award, Users, TrendingUp,
  Plus, BarChart3, Clock, UserPlus, FileText, Activity,
  CheckCircle, AlertCircle
} from 'lucide-react';
import api from '../../utils/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    overview: { totalCourses: 0, activeCourses: 0, totalNotices: 0, totalCertificates: 0, totalStudents: 0 },
    recentActivity: { recentCourses: [], recentNotices: [], recentCertificates: [], recentStudents: [] },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/api/admin/stats');
      setStats(res.data.data);
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  const statCards = [
    { title: 'Total Courses',     value: stats.overview.totalCourses,     change: '+2 this month', icon: BookOpen, grad: 'from-primary-700 to-primary-900', ring: 'ring-primary-200' },
    { title: 'Total Notices',     value: stats.overview.totalNotices,     change: '+5 this month', icon: Megaphone,grad: 'from-emerald-600 to-teal-700',   ring: 'ring-emerald-200' },
    { title: 'Certificates',      value: stats.overview.totalCertificates,change: '+18 this month',icon: Award,    grad: 'from-primary-800 to-indigo-950', ring: 'ring-indigo-200' },
    { title: 'Students Enrolled', value: stats.overview.totalStudents,    change: '+32 this month',icon: Users,    grad: 'from-gold-500 to-gold-700',      ring: 'ring-gold-200', link: '/admin/students' },
  ];

  const quickActions = [
    { title: 'Add New Course',     desc: 'Create a new course',        icon: BookOpen,  link: '/admin/courses',      color: 'group-hover:bg-primary-700' },
    { title: 'Post Notice',        desc: 'Share an announcement',       icon: Megaphone, link: '/admin/notices',      color: 'group-hover:bg-emerald-600' },
    { title: 'Upload Certificate', desc: 'Add student certificates',    icon: Award,     link: '/admin/certificates', color: 'group-hover:bg-indigo-700' },
    { title: 'Manage Students',    desc: 'View & manage users',         icon: UserPlus,  link: '/admin/students',      color: 'group-hover:bg-gold-600' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <div className="loading-spinner h-14 w-14 mx-auto mb-4" />
          <p className="text-secondary-500 dark:text-slate-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-10">

        {/* Header */}
        <div className="mb-8 fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-secondary-500 dark:text-slate-400 text-sm font-semibold mb-1">{greeting} 👋</p>
              <h1 className="text-3xl md:text-4xl font-black text-gradient mb-1">Admin Dashboard</h1>
              <p className="text-secondary-500 dark:text-slate-400">
                Here's what's happening at ABVSTVS — {now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/admin/courses" className="btn btn-primary text-sm px-4 py-2.5">
                <Plus className="h-4 w-4 mr-2" />Add Course
              </Link>
              <Link to="/admin/notices" className="btn btn-outline text-sm px-4 py-2.5">
                <Megaphone className="h-4 w-4 mr-2" />Post Notice
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, idx) => (
            <Link key={idx} to={stat.link || '#'} className={`group relative p-8 bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-white dark:border-white/5 rounded-3xl shadow-xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-2 ring-2 ${stat.ring} ring-opacity-0 hover:ring-opacity-40`}>
              <div className="flex items-start justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.grad} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {stat.change}
                </div>
              </div>
              <div>
                <div className="text-4xl font-black text-secondary-900 dark:text-white mb-1 tracking-tight">{stat.value}</div>
                <div className="text-sm font-bold text-secondary-500 dark:text-slate-400 uppercase tracking-widest">{stat.title}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-secondary-900 dark:text-white mb-6 tracking-tight">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                to={action.link}
                className="group relative p-8 bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-secondary-100 dark:border-white/5 rounded-[32px] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-secondary-100 dark:bg-slate-800 ${action.color} mb-6 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg`}>
                    <action.icon className="h-8 w-8 text-secondary-600 dark:text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-black text-secondary-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{action.title}</h3>
                  <p className="text-xs font-medium text-secondary-500 dark:text-slate-400 leading-relaxed">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Courses */}
            {[
              {
                title: 'Recent Courses', icon: BookOpen, iconColor: 'text-primary-700', items: stats.recentActivity.recentCourses,
                render: (item) => ({ primary: item.title, secondary: new Date(item.createdAt).toLocaleDateString() }),
                badge: <Plus className="h-4 w-4 text-emerald-500" />,
                empty: 'No recent courses'
              },
              {
                title: 'Recent Notices', icon: FileText, iconColor: 'text-emerald-600', items: stats.recentActivity.recentNotices,
                render: (item) => ({ primary: item.title, secondary: `${new Date(item.createdAt).toLocaleDateString()} • ${item.author?.username || ''}` }),
                badge: <FileText className="h-4 w-4 text-blue-500" />,
                empty: 'No recent notices'
              },
              {
                title: 'Recent Certificates', icon: Award, iconColor: 'text-indigo-700', items: stats.recentActivity.recentCertificates,
                render: (item) => ({ primary: item.studentName, secondary: `${item.courseName} • ${new Date(item.createdAt).toLocaleDateString()}` }),
                badge: <Award className="h-4 w-4 text-indigo-500" />,
                empty: 'No recent certificates'
              },
              {
                title: 'Recent Students', icon: UserPlus, iconColor: 'text-gold-600', items: stats.recentActivity.recentStudents,
                render: (item) => ({ primary: item.username, secondary: `${item.email} • ${new Date(item.createdAt).toLocaleDateString()}` }),
                badge: <Users className="h-4 w-4 text-gold-500" />,
                empty: 'No recent students'
              },
            ].map((section, idx) => (
              <div key={idx} className="p-8 bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-secondary-100 dark:border-white/5 rounded-[40px] shadow-sm hover:shadow-xl transition-all duration-500">
                <h3 className="text-lg font-black text-secondary-900 dark:text-white mb-8 flex items-center gap-3 uppercase tracking-widest">
                  <div className={`p-2 rounded-lg bg-secondary-100 dark:bg-slate-800 ${section.iconColor.replace('text-', 'bg-').replace('700', '100').replace('600', '100')} bg-opacity-20`}>
                    <section.icon className={`h-5 w-5 ${section.iconColor}`} />
                  </div>
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.length > 0 ? (
                    section.items.map((item, j) => {
                      const { primary, secondary } = section.render(item);
                      return (
                        <div key={j} className="flex items-center justify-between py-2.5 border-b border-secondary-100 dark:border-white/5 last:border-0">
                          <div>
                            <p className="font-semibold text-secondary-900 dark:text-slate-200 text-sm">{primary}</p>
                            <p className="text-xs text-secondary-500 dark:text-slate-500">{secondary}</p>
                          </div>
                          {section.badge}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-secondary-400 text-sm text-center py-6">{section.empty}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="card dark:bg-slate-900/40">
          <h3 className="text-base font-bold text-secondary-900 dark:text-white mb-5 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            System Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Database',    status: 'Connected', ok: true },
              { label: 'API Server',  status: 'Online',    ok: true },
              { label: 'Last Backup', status: now.toLocaleDateString('en-IN'), ok: true },
            ].map(({ label, status, ok }) => (
              <div key={label} className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-slate-800/30 rounded-xl border border-secondary-100 dark:border-white/5">
                <span className="text-secondary-700 dark:text-slate-300 font-semibold text-sm">{label}</span>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${ok ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}>
                  {ok ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
