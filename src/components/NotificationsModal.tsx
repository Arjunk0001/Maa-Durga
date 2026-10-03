import React, { useState } from 'react';
import {
  X,
  Bell,
  Sparkles,
  Flame,
  Users,
  AlertTriangle,
  Info,
  Clock,
  PhoneCall,
  Volume2,
  VolumeX,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { LiveUpdate, PandalData } from '../data/pandalData';
import { playTempleBell } from '../utils/audio';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  updates: LiveUpdate[];
  pandalState: PandalData;
  onNavigateToSection?: (sectionId: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  updates,
  pandalState,
  onNavigateToSection,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [audioEnabled, setAudioEnabled] = useState(true);

  if (!isOpen) return null;

  const liveNotices = updates.filter((u) => u.isLive);
  const filteredUpdates = updates.filter((u) => {
    if (filterType === 'all') return true;
    if (filterType === 'live') return u.isLive;
    return u.type === filterType;
  });

  const getNoticeBadge = (type: LiveUpdate['type'], isLive: boolean) => {
    if (isLive) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white animate-pulse shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
          लाइव घोषणा
        </span>
      );
    }
    switch (type) {
      case 'prasad':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            🍲 भोग वितरण
          </span>
        );
      case 'alert':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            महत्वपूर्ण अलर्ट
          </span>
        );
      case 'live':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Flame className="w-3 h-3 text-amber-400" />
            आरती व उत्सव
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
            <Info className="w-3 h-3 text-purple-400" />
            सामान्य सूचना
          </span>
        );
    }
  };

  const getNoticeIcon = (type: LiveUpdate['type']) => {
    switch (type) {
      case 'live':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'prasad':
        return <span className="text-lg">🍲</span>;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#d9a441]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div
        className="w-full max-w-2xl bg-gradient-to-b from-[#2a0404] via-[#1c0202] to-[#120101] text-[#fff8ea] rounded-t-3xl sm:rounded-3xl border border-[#d9a441]/40 shadow-[0_20px_60px_rgba(0,0,0,0.85)] max-h-[90vh] flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="relative px-5 py-4 border-b border-[#d9a441]/30 bg-gradient-to-r from-[#420808] to-[#290505] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative p-2 rounded-2xl bg-[#d9a441]/20 border border-[#d9a441]/40 text-[#ffd76a]">
              <Bell className="w-5 h-5" />
              {liveNotices.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-[#2a0404] animate-ping"></span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-marcellus text-base sm:text-lg font-bold text-[#ffd76a] tracking-wide">
                  मंदिर सूचनाएं व लाइव घोषणाएं
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffd76a]/20 text-[#ffd76a] border border-[#d9a441]/30">
                  {updates.length}
                </span>
              </div>
              <p className="text-[11px] text-[#f3e3be]/80 font-serif">
                {pandalState.name} • ताज़ा अपडेट्स
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAudioEnabled(!audioEnabled);
                if (!audioEnabled) playTempleBell();
              }}
              className="p-2 rounded-xl text-[#ffd76a]/80 hover:text-[#ffd76a] hover:bg-[#590a0a]/50 border border-[#d9a441]/20 transition-all cursor-pointer"
              title={audioEnabled ? 'ध्वनि बंद करें' : 'ध्वनि चालू करें'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-300" />}
            </button>
            <button
              onClick={() => {
                playTempleBell();
                onClose();
              }}
              className="p-2 rounded-xl text-[#ffd76a]/80 hover:text-white hover:bg-rose-900/40 border border-[#d9a441]/20 transition-all cursor-pointer"
              aria-label="Close Notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* QUICK FILTERS */}
        <div className="px-4 py-2.5 bg-[#180202] border-b border-[#d9a441]/20 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-gradient-to-r from-[#d9a441] to-[#b37e19] text-[#220303] shadow-sm'
                : 'bg-[#2f0606] text-[#ffd76a]/80 hover:bg-[#450909]'
            }`}
          >
            सभी सूचनाएं ({updates.length})
          </button>
          {liveNotices.length > 0 && (
            <button
              onClick={() => setFilterType('live')}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                filterType === 'live'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-red-950/60 text-red-300 border border-red-800/40 hover:bg-red-900/60'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
              लाइव ({liveNotices.length})
            </button>
          )}
          <button
            onClick={() => setFilterType('prasad')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterType === 'prasad'
                ? 'bg-emerald-600 text-white'
                : 'bg-[#2f0606] text-[#ffd76a]/80 hover:bg-[#450909]'
            }`}
          >
            भोग व प्रसाद
          </button>
          <button
            onClick={() => setFilterType('alert')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterType === 'alert'
                ? 'bg-rose-600 text-white'
                : 'bg-[#2f0606] text-[#ffd76a]/80 hover:bg-[#450909]'
            }`}
          >
            अलर्ट्स
          </button>
          <button
            onClick={() => setFilterType('info')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterType === 'info'
                ? 'bg-purple-600 text-white'
                : 'bg-[#2f0606] text-[#ffd76a]/80 hover:bg-[#450909]'
            }`}
          >
            सामान्य
          </button>
        </div>

        {/* NOTIFICATIONS LIST (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 custom-scrollbar">
          {filteredUpdates.length === 0 ? (
            <div className="py-12 text-center text-[#f3e3be]/60">
              <Bell className="w-10 h-10 mx-auto text-[#d9a441]/40 mb-2 stroke-1" />
              <p className="text-sm font-medium">इस श्रेणी में कोई नई सूचना उपलब्ध नहीं है।</p>
            </div>
          ) : (
            filteredUpdates.map((item) => (
              <div
                key={item.id}
                className={`relative rounded-2xl p-4 transition-all border ${
                  item.isLive
                    ? 'bg-gradient-to-r from-red-950/40 via-[#360606] to-[#250404] border-red-500/50 shadow-[0_4px_20px_rgba(239,68,68,0.15)]'
                    : 'bg-[#220404]/80 hover:bg-[#2c0505] border-[#d9a441]/25 hover:border-[#d9a441]/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#ffd76a]/10 border border-[#d9a441]/30 shrink-0">
                      {getNoticeIcon(item.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getNoticeBadge(item.type, item.isLive)}
                        {item.crowdLevel && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.crowdLevel === 'Heavy'
                                ? 'bg-red-900/60 text-red-200 border border-red-700/50'
                                : item.crowdLevel === 'Moderate'
                                ? 'bg-amber-900/60 text-amber-200 border border-amber-700/50'
                                : 'bg-emerald-900/60 text-emerald-200 border border-emerald-700/50'
                            }`}
                          >
                            भीड़: {item.crowdLevel}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-[#ffd76a] mt-1 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <span className="text-[11px] text-[#ffd76a]/70 font-mono whitespace-nowrap flex items-center gap-1 shrink-0 bg-[#3d0808] px-2 py-1 rounded-lg border border-[#d9a441]/20">
                    <Clock className="w-3 h-3 text-[#d9a441]" />
                    {item.timestamp || item.time}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#f3e3be]/90 leading-relaxed font-serif pl-11">
                  {item.message}
                </p>

                {/* Quick action button inside card */}
                {onNavigateToSection && (
                  <div className="mt-3 pl-11 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToSection('events-section');
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#ffd76a]/10 hover:bg-[#ffd76a]/20 text-[#ffd76a] text-xs font-semibold border border-[#d9a441]/30 transition-all cursor-pointer"
                    >
                      <span>कार्यक्रम तालिका देखें</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* MODAL FOOTER WITH HELPLINE & GATE STATUS */}
        <div className="p-4 bg-[#140202] border-t border-[#d9a441]/30 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-[#240404] p-2.5 rounded-xl border border-[#d9a441]/20 flex items-center justify-between">
              <span className="text-[#f3e3be]/80 font-medium">हेल्पलाइन:</span>
              <a
                href={`tel:${pandalState.parkingInfo.helpline}`}
                className="text-[#ffd76a] font-bold hover:underline flex items-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                {pandalState.parkingInfo.helpline}
              </a>
            </div>
            <div className="bg-[#240404] p-2.5 rounded-xl border border-[#d9a441]/20 flex items-center justify-between">
              <span className="text-[#f3e3be]/80 font-medium">आपातकालीन संपर्क:</span>
              <a
                href={`tel:${pandalState.parkingInfo.emergencyContact}`}
                className="text-red-300 font-bold hover:underline flex items-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                {pandalState.parkingInfo.emergencyContact}
              </a>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#f3e3be]/70 pt-2 border-t border-[#d9a441]/10">
            <span>🔴 ऑटो-रिफ्रेश: Firestore डेटाबेस से लाइव कनेक्टेड</span>
            <button
              onClick={() => {
                playTempleBell();
                onClose();
              }}
              className="text-[#ffd76a] font-bold hover:underline cursor-pointer"
            >
              बंद करें (Close)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
