import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  const quickLinks = [
    { path: '/',            label: 'Home' },
    { path: '/courses',     label: 'Courses' },
    { path: '/notices',     label: 'Notices' },
    { path: '/certificate', label: 'Certificate Verification' },
    { path: '/contact',     label: 'Contact Us' },
  ];

  const socialLinks = [
    { icon: Facebook,  href: '#', label: 'Facebook',  color: 'hover:text-blue-400' },
    { icon: Twitter,   href: '#', label: 'Twitter',   color: 'hover:text-sky-400' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: Linkedin,  href: '#', label: 'LinkedIn',  color: 'hover:text-blue-300' },
  ];

  return (
    <footer className="relative bg-secondary-900 text-white overflow-hidden mt-0" style={{ background: 'linear-gradient(135deg, #001a33 0%, #002d5a 100%)' }}>
      {/* Top gradient border */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary-700 via-gold-500 to-primary-800" />

      {/* Background decoration */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary-900/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-900/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="group-hover:scale-110 transition-transform duration-300">
                <img src="/logo.png" alt="ABVSTVS Logo" className="h-20 w-20 object-contain filter drop-shadow-lg" />
              </div>
              <div>
                <div className="text-2xl font-black text-white italic">ABVSTVS</div>
                <div className="text-[10px] text-gold-400 font-bold uppercase tracking-[0.2em]">Building Skilled Bharat</div>
              </div>
            </div>
            <p className="text-secondary-400 text-sm leading-relaxed mb-5 max-w-sm">
              Atal Bihari Vajpayee Centre for Skill Training and Vocational Studies is committed to providing
              quality skill education to empower youth and build a skilled workforce for the future.
            </p>

            {/* Social Links */}
            <div className="flex gap-3 mb-6">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className={`w-11 h-11 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-gold-500/50 rounded-2xl flex items-center justify-center text-secondary-400 ${s.color} transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(230,153,0,0.2)]`}
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold mb-5 text-white">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-secondary-400 hover:text-primary-400 transition-colors text-sm group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-bold mb-5 text-white">Contact Info</h4>
            <div className="space-y-3.5">
              {[
                { icon: MapPin, text: 'Education Complex, Sector 15, New Delhi - 110001' },
                { icon: Phone,  text: '+91 11 2345 6789' },
                { icon: Mail,   text: 'info@abvstvs.edu.in' },
                { icon: Clock,  text: 'Mon – Sat: 9:00 AM – 5:00 PM' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-secondary-400">
                  <Icon className="h-4 w-4 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-secondary-500 text-sm">
            © {year} ABVSTVS. All rights reserved.
          </p>
          <p className="text-secondary-500 text-sm">
            Designed with ❤️ for skill development &amp; youth empowerment
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
