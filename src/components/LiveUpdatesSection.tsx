import React, { useState } from 'react';
import { Radio, Megaphone, Car, Users, Utensils, Sparkles, RefreshCw, Volume2 } from 'lucide-react';
import { LiveUpdate } from '../data/pandalData';
import { playTempleBell } from '../utils/audio';

interface LiveUpdatesSectionProps {
  updates: LiveUpdate[];
}

export const LiveUpdatesSection: React.FC<LiveUpdatesSectionProps> = ({ updates }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');

  const handleRefresh = () => {
    playTempleBell();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 600);
  };

  const getUpdateIcon = (type: string, isLive: boolean) => {
    if (isLive) {
      return (
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg animate-pulse">
            <Megaphone className="w-5 h-5" />
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-400 rounded-full animate-ping"></span>
        </div>
      );
    }
    switch (type) {
      case 'alert':
        return (
          <div className="w-10 h-10 rounded-full bg-amber-700/80 border border-amber-400/50 flex items-center justify-center text-white">
            <Users className="w-5 h-5 text-amber-200" />
          </div>
        );
      case 'info':
        return (
          <div className="w-10 h-10 rounded-full bg-orange-700/80 border border-orange-400/50 flex items-center justify-center text-white">
            <Car className="w-5 h-5 text-orange-200" />
          </div>
        );
      case 'prasad':
        return (
          <div className="w-10 h-10 rounded-full bg-emerald-700/80 border border-emerald-400/50 flex items-center justify-center text-white">
            <Utensils className="w-5 h-5 text-emerald-200" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-[#590a0a] flex items-center justify-center text-[#ffd76a]">
            <Radio className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <section id="live-updates-section" className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 scroll-mt-20">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <h2 className="font-marcellus text-xl sm:text-2xl font-bold tracking-wide gold-gradient-text">
            Live Updates
          </h2>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#400707] hover:bg-[#590a0a] border border-[#d9a441]/30 text-[#ffd76a] text-xs font-semibold cursor-pointer active:scale-95 transition-all"
          title="Refresh updates"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-300' : ''}`} />
          <span className="hidden sm:inline">Updated {lastRefreshed}</span>
        </button>
      </div>

      {/* List of Live Updates */}
      <div className="space-y-3">
        {updates.map((item) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 sm:gap-4 p-4 rounded-2xl border transition-all ${
              item.isLive
                ? 'bg-gradient-to-r from-[#5a0b0b] via-[#480808] to-[#300505] border-red-500/70 shadow-[0_0_20px_rgba(220,38,38,0.25)]'
                : 'bg-[#350505]/70 border-[#d9a441]/20 hover:border-[#ffd76a]/40'
            }`}
          >
            {/* Left Status Icon */}
            <div className="shrink-0 mt-0.5">
              {getUpdateIcon(item.type, item.isLive)}
            </div>

            {/* Update Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {item.isLive && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    LIVE
                  </span>
                )}
                <span className="font-semibold text-xs sm:text-sm text-[#fff7e6]">
                  {item.title}
                </span>
                <span className="text-[10px] font-mono text-[#ffd76a]/80 ml-auto">
                  {item.time}
                </span>
              </div>

              <p className="font-body text-xs sm:text-sm text-[#e6cfab] leading-relaxed">
                {item.message}
              </p>

              {item.crowdLevel && (
                <div className="flex items-center gap-2 mt-2 pt-1 text-[11px] text-[#ffd76a]/80">
                  <span className="text-[#d9a441]">Pandal Crowd:</span>
                  <span className={`px-2 py-0.2 rounded-full font-medium text-[10px] ${
                    item.crowdLevel === 'Heavy'
                      ? 'bg-red-900/60 text-red-200 border border-red-400/40'
                      : item.crowdLevel === 'Moderate'
                      ? 'bg-amber-900/60 text-amber-200 border border-amber-400/40'
                      : 'bg-emerald-900/60 text-emerald-200 border border-emerald-400/40'
                  }`}>
                    {item.crowdLevel} Density
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
