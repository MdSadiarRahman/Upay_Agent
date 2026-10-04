import React from 'react';
import { X, Info, User, Mail, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isBn = language === 'bn';

  if (!isOpen) return null;

  const developers = [
    {
      name: 'Kowshik Chandraw Roy',
      role: 'Full Stack Developer',
      description:
        'Responsible for designing, developing, and improving the UpayPulse AI platform, including application architecture, user experience, and system features.',
      email: 'kowshikroy2021@gmail.com',
    },
    {
      name: 'Md. Sadiar Rahman',
      role: 'AI & Software Developer',
      description:
        'Responsible for AI integration, intelligent features, software development, and improving the platform experience.',
      email: 'saiftkd3@gmail.com',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-400/30 shadow-xs">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isBn ? 'উপায়পালস এআই সম্পর্কে' : 'About UpayPulse AI'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn ? 'আমাদের প্ল্যাটফর্ম এবং ডেভেলপমেন্ট টিম' : 'Our Platform and Development Team'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
          {/* Section: Platform Info */}
          <section className="space-y-4 animate-slide-up" style={{ animationDelay: '50ms' }}>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {isBn ? 'উপায়পালস এআই কী?' : 'About UpayPulse AI'}
            </h4>
            <div className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                UpayPulse AI is an AI-powered fintech ecosystem designed to make digital financial services smarter, safer, and more efficient.
                The platform connects customers, merchants, and agents through intelligent AI solutions that provide financial insights, recommendations, and better service experiences.
              </p>
              
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'AI-powered financial assistance',
                  'Smart payment solutions',
                  'Merchant and agent intelligence',
                  'Personalized customer experience'
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section: Development Team */}
          <section className="space-y-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {isBn ? 'আমাদের ডেভেলপমেন্ট টিম' : 'Meet Our Development Team'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {developers.map((dev, idx) => (
                <div key={idx} className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-amber-400/50 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center border-2 border-amber-400 shadow-sm shrink-0">
                      <User className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-amber-500 transition-colors" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-base">{dev.name}</h5>
                      <span className="inline-block px-2.5 py-0.5 mt-1 bg-amber-400/10 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded-lg border border-amber-400/20">
                        {dev.role}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed min-h-[60px]">
                    {dev.description}
                  </p>
                  <a
                    href={`mailto:${dev.email}`}
                    className="mt-4 w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-950 hover:bg-amber-400 hover:text-slate-950 dark:hover:bg-amber-400 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Developer</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Contact */}
          <section className="space-y-4 animate-slide-up" style={{ animationDelay: '150ms' }}>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {isBn ? 'যোগাযোগ করুন' : 'Contact Our Team'}
            </h4>
            <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                For any questions, feedback, or technical support, contact our development team.
              </p>
              <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
                <a
                  href="mailto:kowshikroy2021@gmail.com"
                  className="px-4 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-xl text-xs font-bold transition flex items-center gap-2 justify-center"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Contact Kowshik
                </a>
                <a
                  href="mailto:saiftkd3@gmail.com"
                  className="px-4 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-xl text-xs font-bold transition flex items-center gap-2 justify-center"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Contact Sadiar
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
