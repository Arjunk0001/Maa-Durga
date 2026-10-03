import React from 'react';
import { Users, Radio, Heart, Image as ImageIcon, Award, Calendar, MapPin, Sparkles } from 'lucide-react';
import { playTempleBell } from '../utils/audio';

interface QuickActionGridProps {
  onScrollTo: (elementId: string) => void;
  onOpenDarshan: () => void;
  onOpenDonation: () => void;
}

export const QuickActionGrid: React.FC<QuickActionGridProps> = ({
  onScrollTo,
  onOpenDarshan,
  onOpenDonation,
}) => {
  const actions = [
    {
      id: 'volunteers',
      label: 'Volunteers',
      icon: Users,
      gradient: 'from-[#b91c1c] via-[#851313] to-[#550b0b]',
      border: 'border-red-400/40',
      action: () => onScrollTo('volunteers-section'),
    },
    {
      id: 'live-events',
      label: 'Live Events',
      icon: Radio,
      gradient: 'from-[#c2410c] via-[#9a3412] to-[#6c240d]',
      border: 'border-orange-400/40',
      badge: 'LIVE',
      action: () => onScrollTo('live-updates-section'),
    },
    {
      id: 'donation',
      label: 'Donation',
      icon: Heart,
      gradient: 'from-[#dc2626] via-[#991b1b] to-[#651010]',
      border: 'border-rose-400/40',
      action: () => onOpenDonation(),
    },
    {
      id: 'gallery',
      label: 'Gallery',
      icon: ImageIcon,
      gradient: 'from-[#1e40af] via-[#1e3a8a] to-[#172554]',
      border: 'border-blue-400/40',
      action: () => onScrollTo('gallery-section'),
    },
    {
      id: 'committee',
      label: 'Committee',
      icon: Award,
      gradient: 'from-[#b45309] via-[#92400e] to-[#632a07]',
      border: 'border-amber-400/40',
      action: () => onScrollTo('committee-section'),
    },
    {
      id: 'events',
      label: 'Events',
      icon: Calendar,
      gradient: 'from-[#7c3aed] via-[#6d28d9] to-[#4c1d95]',
      border: 'border-purple-400/40',
      action: () => onScrollTo('events-section'),
    },
    {
      id: 'location',
      label: 'Location',
      icon: MapPin,
      gradient: 'from-[#047857] via-[#065f46] to-[#044332]',
      border: 'border-emerald-400/40',
      action: () => onScrollTo('location-section'),
    },
    {
      id: 'darshan',
      label: 'Darshan',
      icon: Sparkles,
      gradient: 'from-[#d97706] via-[#b45309] to-[#78350f]',
      border: 'border-yellow-400/40',
      badge: '360°',
      action: () => onOpenDarshan(),
    },
  ];

  return (
    <section className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4">
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4 justify-items-center">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                playTempleBell();
                item.action();
              }}
              className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer w-full"
            >
              {/* Circular Gradient Icon Container */}
              <div
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${item.gradient} border ${item.border} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-[0_0_18px_rgba(255,215,106,0.35)] active:scale-95 transition-all duration-300`}
              >
                {/* Subtle Inner Glow Ring */}
                <div className="absolute inset-1 rounded-full border border-white/20 pointer-events-none"></div>

                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#fff7e6] drop-shadow-md group-hover:text-[#ffd76a] transition-colors" />

                {item.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-bold border border-white/50 tracking-tighter shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="text-[11px] sm:text-xs font-medium text-[#f1ddbe] group-hover:text-[#ffd76a] tracking-tight transition-colors text-center truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
