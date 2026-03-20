import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Notices from './pages/Notices';
import CertificateVerification from './pages/CertificateVerification';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminNotices from './pages/admin/AdminNotices';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminStudents from './pages/admin/AdminStudents';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

const App = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Optional: unobserve after animating once
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
      elements.forEach(el => observer.observe(el));
    };

    // Initial observation
    observeElements();

    // Mutation observer to handle dynamically loaded content (like courses/notices)
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/certificate" element={<CertificateVerification />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute role="admin">
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/courses" element={
                <ProtectedRoute role="admin">
                  <AdminCourses />
                </ProtectedRoute>
              } />
              <Route path="/admin/notices" element={
                <ProtectedRoute role="admin">
                  <AdminNotices />
                </ProtectedRoute>
              } />
              <Route path="/admin/certificates" element={
                <ProtectedRoute role="admin">
                  <AdminCertificates />
                </ProtectedRoute>
              } />
              <Route path="/admin/students" element={
                <ProtectedRoute role="admin">
                  <AdminStudents />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  </ThemeProvider>
  );
}

export default App;
