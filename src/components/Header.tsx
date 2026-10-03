import React, { useState } from 'react';
import { Menu, Bell, Share2, Volume2, VolumeX, Check, ShieldCheck } from 'lucide-react';
import { playTempleBell } from '../utils/audio';

interface HeaderProps {
  onOpenDrawer: () => void;
  onOpenNotifications: () => void;
  onOpenAdmin?: () => void;
  liveCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDrawer,
  onOpenNotifications,
  onOpenAdmin,
  liveCount,
}) => {
  const [copied, setCopied] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleShare = async () => {
    playTempleBell();
    const shareData = {
      title: 'Shree Shakti Durga Puja Samiti',
      text: 'Explore the divine digital pandal of Shree Shakti Durga Puja Samiti, Lucknow!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or not supported
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleBellRing = () => {
    if (soundEnabled) {
      playTempleBell();
    }
    onOpenNotifications();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#2a0404]/90 backdrop-blur-md border-b border-[#d9a441]/30 transition-all">
      {/* Decorative Hanging Bells on Top Bar Corners */}
      <div className="absolute left-2 -top-1 pointer-events-auto hidden sm:flex flex-col items-center">
        <div className="w-[1px] h-6 bg-[#d9a441]"></div>
        <button
          onClick={() => playTempleBell()}
          className="animate-bell-l text-base hover:scale-125 transition-transform cursor-pointer"
          title="Ring Sacred Bell"
        >
          🔔
        </button>
      </div>

      <div className="absolute right-2 -top-1 pointer-events-auto hidden sm:flex flex-col items-center">
        <div className="w-[1px] h-7 bg-[#d9a441]"></div>
        <button
          onClick={() => playTempleBell()}
          className="animate-bell-r text-base hover:scale-125 transition-transform cursor-pointer"
          title="Ring Sacred Bell"
        >
          🔔
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
        {/* LEFT: Hamburger Menu Button */}
        <button
          onClick={onOpenDrawer}
          className="p-2 rounded-xl text-[#ffd76a] hover:bg-[#590a0a]/50 active:scale-95 transition-all border border-[#d9a441]/20 cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* CENTER: Title & Location */}
        <div className="flex flex-col items-center text-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="text-[#ffd76a] text-xs sm:text-sm animate-pulse leading-none">🪷</span>
          <h1 className="font-marcellus text-base sm:text-xl font-bold tracking-wider gold-gradient-text uppercase leading-tight">
            Shree Shakti
          </h1>
          <span className="font-serif text-[10px] sm:text-xs text-[#f3e3be] tracking-wider uppercase font-medium">
            Durga Puja Samiti
          </span>
          <span className="text-[10px] sm:text-xs text-[#d9a441]/90 flex items-center gap-1 mt-0.5">
            <span className="text-red-400">📍</span> Lucknow, Uttar Pradesh
          </span>
        </div>

        {/* RIGHT: Sound, Notification & Share Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playTempleBell();
            }}
            className="p-2 rounded-xl text-[#ffd76a]/80 hover:text-[#ffd76a] hover:bg-[#590a0a]/50 active:scale-95 transition-all border border-[#d9a441]/20 cursor-pointer"
            title={soundEnabled ? "Mute Bell Chimes" : "Enable Bell Chimes"}
            aria-label="Toggle Audio"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-300" />}
          </button>

          {/* Notification Bell Icon */}
          <button
            onClick={handleBellRing}
            className="relative p-2 rounded-xl text-[#ffd76a] hover:bg-[#590a0a]/50 active:scale-95 transition-all border border-[#d9a441]/20 cursor-pointer"
            aria-label="Notifications"
            title="Live Updates & Announcements"
          >
            <Bell className="w-5 h-5" />
            {liveCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce shadow-md">
                {liveCount}
              </span>
            )}
          </button>

          {/* Admin Portal Button */}
          {onOpenAdmin && (
            <button
              onClick={() => {
                playTempleBell();
                onOpenAdmin();
              }}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#520909]/70 hover:bg-[#730d0d] text-[#ffd76a] active:scale-95 transition-all border border-[#d9a441]/50 cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(217,164,65,0.2)]"
              aria-label="Open Samiti Admin Portal"
              title="समिति प्रबंधन कक्ष • Samiti Admin Portal"
            >
              <ShieldCheck className="w-4 h-4 text-[#ffd76a]" />
              <span className="hidden sm:inline text-xs font-bold tracking-tight">Admin</span>
            </button>
          )}

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="relative p-2 rounded-xl text-[#ffd76a] hover:bg-[#590a0a]/50 active:scale-95 transition-all border border-[#d9a441]/20 cursor-pointer"
            aria-label="Share Pandal Page"
            title="Share with Devotees"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Copy Toast */}
      {copied && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-1.5 bg-[#400606] text-[#ffd76a] border border-[#d9a441] rounded-full text-xs shadow-lg animate-fade-in flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Pandal link copied to clipboard!</span>
        </div>
      )}
    </header>
  );
};
