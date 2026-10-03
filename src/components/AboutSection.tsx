import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Heart, Users, CalendarCheck, Clock } from 'lucide-react';
import { PandalData } from '../data/pandalData';
import { playTempleBell } from '../utils/audio';

interface AboutSectionProps {
  data: PandalData;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    playTempleBell();
    setIsExpanded(!isExpanded);
  };

  return (
    <section id="about-section" className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 scroll-mt-20">
      {/* Decorative Section Lotus Header */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#d9a441]/60"></span>
        <span className="text-[#ffd76a] text-lg">🪷</span>
        <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#d9a441]/60"></span>
      </div>

      {/* Parchment-style Cream Card */}
      <div className="relative parchment-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 overflow-hidden shadow-2xl">
        {/* Subtle Temple Architecture Silhouette Watermark */}
        <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-15 pointer-events-none flex items-end justify-end">
          <svg
            className="w-72 h-72 text-[#8b4513]"
            viewBox="0 0 200 200"
            fill="currentColor"
          >
            {/* Traditional Indian Mandir Shikhara Outline */}
            <path d="M100 10 L115 50 L140 60 L130 90 L160 100 L150 140 L180 150 L180 190 L20 190 L20 150 L50 140 L40 100 L70 90 L60 60 L85 50 Z" />
            <circle cx="100" cy="8" r="4" />
            <path d="M70 190 L70 160 Q100 130 130 160 L130 190 Z" fill="#fff" opacity="0.3" />
          </svg>
        </div>

        {/* Card Header */}
        <div className="relative z-10 flex items-center gap-2 mb-3">
          <span className="text-xl sm:text-2xl drop-shadow-sm">🪔</span>
          <h2 className="font-marcellus text-xl sm:text-2xl font-bold text-[#450a0a] tracking-wide">
            About Our Pandal
          </h2>
        </div>

        {/* Lead Narrative */}
        <p className="relative z-10 font-body text-sm sm:text-base text-[#3d1515] leading-relaxed mb-4 max-w-2xl font-normal">
          {data.aboutText}
        </p>

        {/* Expandable Extended Narrative */}
        {isExpanded && (
          <div className="relative z-10 font-body text-sm text-[#4d1f1f] leading-relaxed mb-5 pt-3 border-t border-[#d4af37]/40 animate-fade-in space-y-3">
            <p>{data.fullDescription}</p>
            <div className="bg-[#fff7e6]/70 border border-[#d4af37]/50 rounded-xl p-3 text-xs text-[#591d1d] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-[#450a0a]">2026 Festive Theme: </strong>
                <span>{data.currentTheme}</span> — {data.themeDescription}
              </div>
            </div>
          </div>
        )}

        {/* Read More / Less Toggle Button */}
        <div className="relative z-10 mb-6">
          <button
            onClick={toggleExpand}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#590a0a] hover:bg-[#781010] text-[#fff4d1] text-xs font-semibold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Decorative Milestone Badges / Statistics */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#d4af37]/40">
          <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-[#d4af37]/30 shadow-xs">
            <Clock className="w-4 h-4 text-[#851313] mb-1" />
            <span className="font-marcellus text-xl sm:text-2xl font-bold text-[#450a0a] tabular-nums">
              {data.yearsOfCelebration}+
            </span>
            <span className="text-[11px] font-medium text-[#652020] uppercase tracking-wider">
              Years Devotion
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-[#d4af37]/30 shadow-xs">
            <Users className="w-4 h-4 text-[#851313] mb-1" />
            <span className="font-marcellus text-xl sm:text-2xl font-bold text-[#450a0a] tabular-nums">
              {data.communityMembers}+
            </span>
            <span className="text-[11px] font-medium text-[#652020] uppercase tracking-wider">
              Community
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-[#d4af37]/30 shadow-xs">
            <Heart className="w-4 h-4 text-[#851313] mb-1" />
            <span className="font-marcellus text-xl sm:text-2xl font-bold text-[#450a0a] tabular-nums">
              {data.volunteerCount}+
            </span>
            <span className="text-[11px] font-medium text-[#652020] uppercase tracking-wider">
              Volunteers
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-[#d4af37]/30 shadow-xs">
            <CalendarCheck className="w-4 h-4 text-[#851313] mb-1" />
            <span className="font-marcellus text-xl sm:text-2xl font-bold text-[#450a0a] tabular-nums">
              {data.totalEvents}+
            </span>
            <span className="text-[11px] font-medium text-[#652020] uppercase tracking-wider">
              Festive Events
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
