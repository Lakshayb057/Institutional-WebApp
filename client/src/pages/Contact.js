import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    try {
      const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      messages.push({ ...formData, id: Date.now(), timestamp: new Date().toISOString() });
      localStorage.setItem('contactMessages', JSON.stringify(messages));
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: MapPin,  title: 'Address',      content: 'Education Complex, Sector 15, New Delhi - 110001', color: 'from-red-500 to-rose-600' },
    { icon: Phone,   title: 'Phone',        content: '+91 11 2345 6789',                                  color: 'from-green-500 to-emerald-600' },
    { icon: Mail,    title: 'Email',         content: 'info@abvstvs.edu.in',                               color: 'from-blue-500 to-indigo-600' },
    { icon: Clock,   title: 'Office Hours', content: 'Mon – Sat: 9:00 AM – 5:00 PM',                       color: 'from-purple-500 to-violet-600' },
  ];

  const departments = [
    { name: 'Admissions',       email: 'admissions@abvstvs.edu.in', phone: '+91 11 2345 6789', desc: 'For all admission related queries', color: 'border-l-blue-500 bg-blue-50' },
    { name: 'Academic Affairs', email: 'academics@abvstvs.edu.in',  phone: '+91 11 2345 6790', desc: 'For course and curriculum related queries', color: 'border-l-emerald-500 bg-emerald-50' },
    { name: 'Student Support',  email: 'support@abvstvs.edu.in',    phone: '+91 11 2345 6791', desc: 'For student services and support', color: 'border-l-purple-500 bg-purple-50' },
    { name: 'Administration',   email: 'admin@abvstvs.edu.in',      phone: '+91 11 2345 6792', desc: 'For administrative and general queries', color: 'border-l-orange-500 bg-orange-50' },
  ];

  const faqs = [
    { q: 'How do I apply for admission?',          a: 'You can apply by filling out the online application form on our portal or by visiting our campus during office hours (Mon–Sat, 9 AM–5 PM).' },
    { q: 'What are the admission requirements?',   a: 'Requirements vary by course. Generally, you need to have completed the minimum education level specified per program. Contact the admissions office for details.' },
    { q: 'Do you provide placement assistance?',   a: 'Yes! We provide 100% placement assistance and career guidance to all our students through our dedicated placement cell with industry partnerships.' },
    { q: 'Are scholarships available?',            a: 'Yes, we offer merit-based scholarships to eligible students. Please contact the admissions office or call +91 11 2345 6789 for scholarship details.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Hero Header - Increased depth and improved text balance */}
      <div className="relative pt-32 pb-24 overflow-hidden bg-slate-900 border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[160px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-primary-400 text-xs font-black mb-8 animate-fadeInUp tracking-[0.2em] shadow-xl">
            <MessageSquare className="h-4 w-4" />
            <span>GET IN TOUCH</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter animate-fadeInUp">
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-blue-400 to-indigo-400">Connect</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed animate-fadeInUp animation-delay-500 font-medium">
            Have a question or ready to start your journey? Our team is dedicated to providing you with the support you need.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-32">
        {/* Contact Info Cards - Perfectly balanced grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {contactInfo.map((info, idx) => (
            <div key={idx} className={`group p-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/60 dark:border-white/5 rounded-[32px] shadow-2xl hover:shadow-primary-500/20 transition-all duration-500 hover:-translate-y-3 flex flex-col items-center text-center reveal-scale stagger-${idx + 1}`}>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center text-white shadow-xl mb-8 group-hover:scale-115 transition-transform duration-500`}>
                <info.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-secondary-900 dark:text-white mb-3">{info.title}</h3>
              <p className="text-secondary-500 dark:text-slate-400 text-sm leading-relaxed font-bold">{info.content}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Contact Section - Enhanced Container Alignment */}
          <div className="lg:col-span-12 xl:col-span-8 reveal-left">
            <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Form Side - Improved padding and vertical alignment */}
                <div className="p-10 md:p-14 border-r border-secondary-100 dark:border-white/5 bg-white/50 dark:bg-transparent">
                  <div className="mb-12">
                    <h2 className="text-4xl font-black text-secondary-900 dark:text-white mb-3">Send Message</h2>
                    <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm">
                      <Clock className="h-4 w-4" />
                      <span>Usually responds within 24 hours</span>
                    </div>
                  </div>

                  {submitted ? (
                    <div className="py-24 text-center animate-fadeInUp">
                      <div className="w-28 h-28 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <CheckCircle className="h-14 w-14 text-emerald-500" />
                      </div>
                      <h3 className="text-3xl font-black text-secondary-900 dark:text-white mb-3">Goal Reached!</h3>
                      <p className="text-secondary-500 dark:text-slate-400 mb-10 max-w-xs mx-auto text-lg font-medium">Your inquiry has been successfully delivered to our team.</p>
                      <button onClick={() => setSubmitted(false)} className="btn-primary px-10 py-4 rounded-2xl font-black hover:scale-105 transition-all">SEND ANOTHER</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-sm font-black text-secondary-800 dark:text-slate-300 uppercase tracking-widest ml-1">Name</label>
                          <input name="name" type="text" required value={formData.name} onChange={handleChange} className="input h-16 px-6 text-lg rounded-2xl border-2 focus:border-primary-500 bg-secondary-50/50 dark:bg-slate-800/50" placeholder="Suryansh Singh" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-black text-secondary-800 dark:text-slate-300 uppercase tracking-widest ml-1">Email</label>
                          <input name="email" type="email" required value={formData.email} onChange={handleChange} className="input h-16 px-6 text-lg rounded-2xl border-2 focus:border-primary-500 bg-secondary-50/50 dark:bg-slate-800/50" placeholder="suryansh@example.com" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-sm font-black text-secondary-800 dark:text-slate-300 uppercase tracking-widest ml-1">Phone</label>
                          <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="input h-16 px-6 text-lg rounded-2xl border-2 focus:border-primary-500 bg-secondary-50/50 dark:bg-slate-800/50" placeholder="+91 98765 43210" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-black text-secondary-800 dark:text-slate-300 uppercase tracking-widest ml-1">Subject</label>
                          <input name="subject" type="text" required value={formData.subject} onChange={handleChange} className="input h-16 px-6 text-lg rounded-2xl border-2 focus:border-primary-500 bg-secondary-50/50 dark:bg-slate-800/50" placeholder="Admission Query" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-black text-secondary-800 dark:text-slate-300 uppercase tracking-widest ml-1">Message</label>
                        <textarea name="message" rows={5} required value={formData.message} onChange={handleChange} className="input resize-none py-5 px-6 text-lg rounded-2xl border-2 focus:border-primary-500 bg-secondary-50/50 dark:bg-slate-800/50" placeholder="Describe your inquiry in detail..." />
                      </div>
                      <button type="submit" disabled={loading} className="btn-primary w-full h-20 rounded-2xl text-xl font-black transition-all hover:scale-[1.03] active:scale-[0.97] shadow-xl hover:shadow-primary-500/40 disabled:opacity-50 flex items-center justify-center gap-4">
                        {loading ? <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="h-6 w-6" /> SEND MESSAGE</>}
                      </button>
                    </form>
                  )}
                </div>

                {/* Info Side - Harmonized with form height */}
                <div className="p-10 md:p-14 space-y-12 reveal-right">
                  <div>
                    <h3 className="text-3xl font-black text-secondary-900 dark:text-white mb-8">Departments</h3>
                    <div className="grid gap-5">
                      {departments.map((dept, idx) => (
                        <div key={idx} className={`p-6 bg-white dark:bg-slate-800/40 rounded-3xl border border-secondary-100 dark:border-white/5 hover:border-primary-500/50 hover:shadow-xl transition-all group cursor-default reveal-scale stagger-${(idx % 4) + 1}`}>
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-lg font-black text-secondary-900 dark:text-white group-hover:text-primary-500 transition-colors uppercase tracking-tight">{dept.name}</h4>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                          </div>
                          <p className="text-sm text-secondary-500 dark:text-slate-400 mb-6 font-medium leading-relaxed">{dept.desc}</p>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-secondary-700 dark:text-slate-300 group-hover:translate-x-1 transition-transform">
                              <div className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">@</div>
                              <span className="font-bold">{dept.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-secondary-700 dark:text-slate-300 group-hover:translate-x-1 transition-transform">
                              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">#</div>
                              <span className="font-bold">{dept.phone}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Section - Perfectly aligned column */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-12 reveal-right">
            {/* Map Card - Refined Depth */}
            <div className="bg-white dark:bg-slate-900/80 border border-white dark:border-white/10 rounded-[48px] shadow-2xl overflow-hidden group">
              <div className="relative h-[380px] overflow-hidden">
                <iframe
                  title="Map"
                  src="https://maps.google.com/maps?q=Connaught+Place+New+Delhi&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.1) brightness(0.9)' }}
                  allowFullScreen=""
                  loading="lazy"
                  className="grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 scale-105 group-hover:scale-100"
                />
                <div className="absolute top-6 left-6 right-6">
                  <div className="px-6 py-4 bg-slate-900/90 backdrop-blur-xl rounded-[24px] border border-white/10 flex items-center gap-4 shadow-2xl">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] mb-0.5">LOCATION</span>
                      <span className="block text-sm font-black text-white uppercase tracking-tight">Vist our Campus</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-10 text-center lg:text-left">
                <p className="text-secondary-700 dark:text-slate-300 text-lg font-black leading-tight mb-2">
                  Education Complex, Sector 15,
                </p>
                <p className="text-secondary-500 dark:text-slate-400 font-bold">
                  New Delhi - 110001, India
                </p>
              </div>
            </div>

            {/* Support Card - High impact alignment */}
            <div className="bg-gradient-to-br from-primary-600 via-indigo-700 to-blue-800 rounded-[48px] p-12 text-white shadow-[0_32px_64px_-16px_rgba(37,99,235,0.4)] relative overflow-hidden group border border-white/20">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl">
                  <Phone className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tighter">Immediate Support</h3>
                <p className="text-primary-100 mb-10 font-bold text-lg opacity-80 leading-relaxed">Available 24/7 for administrative or technical emergencies.</p>
                <a href="tel:+911123456789" className="flex items-center justify-center gap-4 bg-white text-primary-700 h-20 rounded-3xl font-black text-xl hover:bg-primary-50 hover:shadow-2xl transition-all active:scale-95">
                  CALL NOW
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section - Perfectly centered and sized */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <span className="text-primary-600 dark:text-primary-400 font-black tracking-[0.3em] uppercase text-xs mb-4 block">KNOWLEDGE BASE</span>
            <h2 className="text-5xl font-black text-secondary-900 dark:text-white mb-6">Common Questions</h2>
            <div className="h-2 w-32 bg-primary-500 mx-auto rounded-full shadow-lg shadow-primary-500/30" />
          </div>
          <div className="max-w-5xl mx-auto space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white/90 dark:bg-slate-900/60 border border-secondary-100/50 dark:border-white/5 rounded-[32px] overflow-hidden transition-all duration-300 hover:border-primary-500/40 shadow-xl group">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-10 text-left transition-all duration-300 group-hover:bg-primary-50/20 dark:group-hover:bg-white/5"
                >
                  <span className="text-xl font-black text-secondary-900 dark:text-slate-200 tracking-tight">{faq.q}</span>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${openFaq === idx ? 'bg-primary-500 text-white rotate-180 shadow-primary-500/40' : 'bg-secondary-100 dark:bg-slate-800 text-secondary-600 dark:text-slate-400 group-hover:text-primary-500'}`}>
                    <ChevronDown className="h-6 w-6" />
                  </div>
                </button>
                {openFaq === idx && (
                  <div className="px-10 pb-10 pt-0 animate-fadeInUp">
                    <div className="bg-slate-50 dark:bg-slate-800/40 p-8 rounded-[24px] border border-secondary-100 dark:border-white/5">
                      <p className="text-lg text-secondary-600 dark:text-slate-400 leading-relaxed font-bold">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
