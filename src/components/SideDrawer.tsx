import React from 'react';
import { X, Heart, Calendar, Image as ImageIcon, Users, MapPin, Sparkles, Clock, Phone, Bell, Info, ShieldCheck, Crown } from 'lucide-react';
import { playTempleBell } from '../utils/audio';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenDarshan: () => void;
  onOpenVolunteer: () => void;
  onOpenDonation: () => void;
  onOpenArjunPoster?: () => void;
  onOpenAdmin?: () => void;
  onOpenSuperAdmin?: () => void;
  onOpenNotifications?: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenDarshan,
  onOpenVolunteer,
  onOpenDonation,
  onOpenArjunPoster,
  onOpenAdmin,
  onOpenSuperAdmin,
  onOpenNotifications,
}) => {
  if (!isOpen) return null;

  const links = [
    { label: 'About Pandal', icon: Info, action: () => onNavigate('about-section') },
    { label: 'Virtual Darshan', icon: Sparkles, badge: 'Live', action: () => onOpenDarshan() },
    {
      label: 'Live Updates & Notices',
      icon: Bell,
      badge: 'Live',
      action: () => {
        if (onOpenNotifications) {
          onOpenNotifications();
        } else {
          onNavigate('live-updates-section');
        }
      },
    },
    { label: 'Upcoming Events', icon: Calendar, action: () => onNavigate('events-section') },
    { label: 'Photo Gallery', icon: ImageIcon, action: () => onNavigate('gallery-section') },
    { label: 'Key Committee', icon: Users, action: () => onNavigate('committee-section') },
    { label: 'Our Volunteers', icon: Users, action: () => onNavigate('volunteers-section') },
    {
      label: 'Tech Lead (Arjun Kushwaha)',
      icon: Sparkles,
      action: () => {
        onClose();
        if (onOpenArjunPoster) onOpenArjunPoster();
      },
    },
    {
      label: 'समिति प्रबंधन (Admin Portal)',
      icon: ShieldCheck,
      action: () => {
        onClose();
        if (onOpenAdmin) onOpenAdmin();
      },
    },
    { label: 'Support & Donate', icon: Heart, action: () => onOpenDonation() },
    { label: 'Location & Parking', icon: MapPin, action: () => onNavigate('location-section') },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-start animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-4/5 max-w-sm h-full bg-gradient-to-b from-[#350505] via-[#240303] to-[#120101] border-r border-[#d9a441]/40 shadow-2xl flex flex-col justify-between p-5 overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#d9a441]/30">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪷</span>
              <div>
                <h3 className="font-marcellus text-base font-bold text-[#fff4d1]">
                  Shree Shakti
                </h3>
                <span className="text-[10px] text-[#ffd76a] uppercase tracking-wider block">
                  Durga Puja Samiti
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#ffd76a] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="my-5 space-y-1">
            {links.map((link, idx) => {
              const Icon = link.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    playTempleBell();
                    onClose();
                    link.action();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium text-[#ecd6b3] hover:text-[#ffd76a] hover:bg-[#590a0a]/60 active:scale-98 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#ffd76a]/80 group-hover:text-[#ffd76a] group-hover:scale-110 transition-all" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-bold animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Daily Pandal Timings Card in Drawer */}
        <div className="space-y-4 pt-4 border-t border-[#d9a441]/25">
          <div className="p-3.5 rounded-xl bg-black/40 border border-[#d9a441]/30 text-xs text-[#ebd5b2] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#ffd76a] font-semibold pb-1 border-b border-[#ffd76a]/20">
              <Clock className="w-3.5 h-3.5" />
              <span>Daily Puja Schedule</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span>Sanctum Opens:</span>
              <span className="text-[#ffd76a]">6:00 AM</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span>Pushpanjali:</span>
              <span className="text-[#ffd76a]">9:30 AM & 11:30 AM</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span>Bhog Prasad:</span>
              <span className="text-[#ffd76a]">1:00 PM – 3:30 PM</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span>Sandhya Maha Aarti:</span>
              <span className="text-[#ffd76a]">7:30 PM</span>
            </div>
          </div>

          {/* Contact Helpline */}
          <div className="text-[11px] text-[#cca574] text-center">
            <p className="flex items-center justify-center gap-1.5 text-[#ffd76a]">
              <Phone className="w-3 h-3" />
              <span>Samiti Helpline: 1800 120 4455</span>
            </p>
            <p className="text-[10px] opacity-75 mt-0.5">Gomti Nagar, Lucknow, UP</p>
          </div>
        </div>
      </div>
    </div>
  );
};
