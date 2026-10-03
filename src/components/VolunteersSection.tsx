import React, { useState } from 'react';
import { Users, HeartHandshake, UserPlus, CheckCircle2, X, Sparkles, ShieldCheck, Crown, Code2, ExternalLink } from 'lucide-react';
import { Volunteer } from '../data/pandalData';
import { playTempleBell, playShankhDhwani } from '../utils/audio';

interface VolunteersSectionProps {
  volunteers: Volunteer[];
  onOpenArjunPoster?: () => void;
}

export const VolunteersSection: React.FC<VolunteersSectionProps> = ({ volunteers, onOpenArjunPoster }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    area: 'Bhog Prasad & Seva',
    availability: 'All 5 Days (Morning & Evening)',
  });
  const [generatedBadgeId, setGeneratedBadgeId] = useState('');

  // Strictly filter out Arjun from volunteers as requested
  const regularVolunteers = volunteers.filter(
    (vol) => !vol.isArjun && !vol.name?.toLowerCase().includes('arjun')
  );

  const handleOpenModal = () => {
    playTempleBell();
    setIsModalOpen(true);
    setIsSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    const badgeId = `SEVAK-${Math.floor(100 + Math.random() * 900)}`;
    setGeneratedBadgeId(badgeId);
    setIsSuccess(true);
    playTempleBell();
    playShankhDhwani();
  };

  const handleVolunteerClick = (vol: Volunteer) => {
    playTempleBell();
  };

  return (
    <section id="volunteers-section" className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 scroll-mt-20">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🪷</span>
          <h2 className="font-marcellus text-xl sm:text-2xl font-bold tracking-wide gold-gradient-text">
            Our Volunteers
          </h2>
        </div>

        <button
          onClick={handleOpenModal}
          className="text-xs font-semibold text-[#ffd76a] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Become a Volunteer</span>
          <UserPlus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Volunteer Profile Circles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-[#350505]/60 border border-[#d9a441]/25">
        {regularVolunteers.map((vol) => (
          <div
            key={vol.id}
            onClick={() => handleVolunteerClick(vol)}
            className="flex flex-col items-center text-center p-2 rounded-xl transition-all hover:bg-white/5"
            title={vol.name}
          >
            {/* Circle with green status dot */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#ffd76a] to-[#781010] shadow-md mb-2">
              {vol.isArjun && (
                <div className="absolute -top-2.5 -left-1 z-20 text-amber-400 animate-bounce">
                  <Crown className="w-4 h-4 fill-amber-400" />
                </div>
              )}

              <img
                src={vol.photo}
                alt={vol.name}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Online / Active Green Status Badge */}
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#2a0404] rounded-full shadow-xs" title={vol.status}></span>
            </div>

            <h4 className="font-semibold text-xs text-[#fff4d1] truncate w-full flex items-center justify-center gap-1">
              <span>{vol.name}</span>
              {vol.isArjun && <span className="text-[10px]">✨</span>}
            </h4>

            <span className={`text-[10px] truncate w-full ${vol.isArjun ? 'text-amber-300 font-bold' : 'text-[#ffd76a]/80'}`}>
              {vol.role}
            </span>

            {vol.isArjun && (
              <span className="mt-1 text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400 text-black font-bold uppercase tracking-wider animate-pulse">
                Click Poster
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Volunteer Action CTA Bar */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-[#400707] to-[#250303] border border-[#ffd76a]/30 text-xs">
        <div className="flex items-center gap-2 text-[#f3e3be]">
          <HeartHandshake className="w-5 h-5 text-[#ffd76a] shrink-0" />
          <span>
            <strong className="text-[#ffd76a]">65+ Active Volunteers</strong> serving with joy, discipline and devotion.
          </span>
        </div>

        <button
          onClick={handleOpenModal}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-[#ffd76a] to-[#d9a441] hover:from-[#ffe082] hover:to-[#e5b352] text-[#2a0404] font-bold tracking-wide uppercase transition-all shadow-md active:scale-95 whitespace-nowrap cursor-pointer"
        >
          Join Volunteer Brigade
        </button>
      </div>

      {/* VOLUNTEER APPLICATION MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#380606] to-[#1a0202] border border-[#ffd76a]/60 p-6 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#ffd76a] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">👥</span>
                  <h3 className="font-marcellus text-xl font-bold text-[#fff7e6]">
                    Volunteer Registration
                  </h3>
                </div>

                <p className="text-xs text-[#d9a441] mb-2">
                  Be a part of Maa Durga's sacred Seva team. We provide food, credentials, and volunteer certificates.
                </p>

                <div>
                  <label className="text-[11px] text-[#eedec5] block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-[#d9a441]/40 text-[#fff7e6] text-xs focus:outline-none focus:border-[#ffd76a]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-[#eedec5] block mb-1">Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-[#d9a441]/40 text-[#fff7e6] text-xs focus:outline-none focus:border-[#ffd76a]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#eedec5] block mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-[#d9a441]/40 text-[#fff7e6] text-xs focus:outline-none focus:border-[#ffd76a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#eedec5] block mb-1">Area of Interest</label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#250303] border border-[#d9a441]/40 text-[#fff7e6] text-xs focus:outline-none focus:border-[#ffd76a]"
                  >
                    <option value="Bhog Prasad & Seva">Bhog Prasad & Seva</option>
                    <option value="Queue & Crowd Guidance">Queue & Crowd Guidance</option>
                    <option value="Pandal Decoration & Flowers">Pandal Decoration & Flowers</option>
                    <option value="Cultural Stage & Sound">Cultural Stage & Sound</option>
                    <option value="Senior Citizen Assistance">Senior Citizen Assistance</option>
                    <option value="Digital Media & Photography">Digital Media & Photography</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-[#eedec5] block mb-1">Availability</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#250303] border border-[#d9a441]/40 text-[#fff7e6] text-xs focus:outline-none focus:border-[#ffd76a]"
                  >
                    <option value="All 5 Days (Full Time)">All 5 Days (Full Time)</option>
                    <option value="Evening Shift (4 PM - 10 PM)">Evening Shift (4 PM - 10 PM)</option>
                    <option value="Morning Shift (8 AM - 2 PM)">Morning Shift (8 AM - 2 PM)</option>
                    <option value="Weekend Only">Weekend Only</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 rounded-full bg-gradient-to-r from-[#ffd76a] to-[#d9a441] text-[#2a0404] font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_15px_rgba(255,215,106,0.5)] active:scale-95 transition-all cursor-pointer"
                >
                  Submit Volunteer Request
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4 animate-fade-in">
                <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="font-marcellus text-xl font-bold text-emerald-300">
                  Welcome to the Team, Sevak!
                </h3>

                <p className="text-xs text-[#fff4d1]">
                  Your volunteer pass has been generated. Our coordinator Ananya will contact you on {formData.phone}.
                </p>

                <div className="p-4 rounded-2xl bg-[#200202] border border-[#ffd76a]/50 text-left text-xs space-y-1.5 shadow-inner">
                  <div className="flex justify-between">
                    <span className="text-[#d9a441]">Badge ID:</span>
                    <span className="font-mono font-bold text-[#ffd76a]">{generatedBadgeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#eedec5]">Name:</span>
                    <span className="font-semibold text-white">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#eedec5]">Assigned Department:</span>
                    <span className="text-white">{formData.area}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ffd76a] to-[#d9a441] text-[#2a0404] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Close & View Schedule
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
