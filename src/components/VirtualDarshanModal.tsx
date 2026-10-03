import React, { useState, useEffect } from 'react';
import { X, Sparkles, Flame, Volume2, VolumeX, Eye, Heart, Music, ExternalLink } from 'lucide-react';

interface VirtualDarshanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VirtualDarshanModal: React.FC<VirtualDarshanModalProps> = ({ isOpen, onClose }) => {
  const [isDiyaLit, setIsDiyaLit] = useState(true);
  const [flowers, setFlowers] = useState<{ id: number; left: number; delay: number }[]>([]);
  const [prayersCount, setPrayersCount] = useState(1482);
  const [hasOffered, setHasOffered] = useState(false);
  const [isPlayingBhajan, setIsPlayingBhajan] = useState(true);
  const [viewMode, setViewMode] = useState<'sanctum' | 'video'>('sanctum');

  const youtubeVideoId = '-rKAOaS7Q3I';
  const youtubeUrl = 'https://youtu.be/-rKAOaS7Q3I?si=HgXt8g4nhTOeR3__';

  useEffect(() => {
    if (isOpen) {
      setIsPlayingBhajan(true);
    } else {
      setIsPlayingBhajan(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOfferFlowers = () => {
    setHasOffered(true);
    setPrayersCount((prev) => prev + 1);

    // Create floating flower petals
    const newFlowers = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      left: 20 + Math.random() * 60,
      delay: Math.random() * 0.5,
    }));
    setFlowers(newFlowers);

    setTimeout(() => {
      setFlowers([]);
    }, 2800);
  };

  const toggleBhajan = () => {
    setIsPlayingBhajan((prev) => !prev);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#3d0606] via-[#2a0404] to-[#140101] border border-[#ffd76a]/60 p-4 sm:p-6 shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/50 hover:bg-black/80 text-[#ffd76a] transition-all cursor-pointer border border-[#ffd76a]/30"
          aria-label="Close Darshan"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🪷</span>
          <div>
            <h3 className="font-marcellus text-lg sm:text-xl font-bold text-[#fff7e6] flex items-center gap-2 flex-wrap">
              <span>Live Virtual Darshan</span>
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-bold animate-pulse">
                SANCTUM STREAM
              </span>
            </h3>
            <p className="text-[11px] text-[#ffd76a]/80">
              Maha Garbhagriha • Shree Shakti Durga Puja Samiti
            </p>
          </div>
        </div>

        {/* Devotional Music Bar playing requested song */}
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-gradient-to-r from-[#500a0a] via-[#3a0606] to-[#250303] border border-[#ffd76a]/40 mb-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
            <Music className="w-4 h-4 text-[#ffd76a] shrink-0" />
            <div className="truncate">
              <span className="text-[#ffd76a] font-semibold">Devotional Bhajan: </span>
              <span className="text-[#fff4d1] truncate">Mahishasura Mardini Stotram</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* View Mode Toggle: Idol vs Video */}
            <button
              onClick={() => setViewMode(viewMode === 'sanctum' ? 'video' : 'sanctum')}
              className="px-2.5 py-1 rounded-lg bg-[#2a0404] hover:bg-[#450707] border border-[#ffd76a]/30 text-[#ffd76a] text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1"
              title={viewMode === 'sanctum' ? 'Switch to Video View' : 'Switch to Idol View'}
            >
              <Eye className="w-3 h-3" />
              <span>{viewMode === 'sanctum' ? 'Watch Video' : 'Sanctum View'}</span>
            </button>

            {/* Play / Pause Bhajan Toggle */}
            <button
              onClick={toggleBhajan}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isPlayingBhajan
                  ? 'bg-emerald-800/60 border-emerald-400/50 text-emerald-200'
                  : 'bg-red-900/60 border-red-400/50 text-red-200'
              }`}
              title={isPlayingBhajan ? 'Mute/Pause Bhajan' : 'Play Bhajan'}
            >
              {isPlayingBhajan ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* YouTube external link */}
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-[#2a0404] hover:bg-[#450707] border border-[#ffd76a]/30 text-[#ffd76a] cursor-pointer"
              title="Open Bhajan in YouTube"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Sanctum Viewport or Video Viewport */}
        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden gold-border shadow-2xl bg-black">
          {viewMode === 'sanctum' ? (
            <>
              {/* Maa Durga Sanctum Idol Image */}
              <img
                src="/src/assets/images/hero_durga_idol_1790202168278.jpg"
                alt="Maa Durga Virtual Darshan"
                className="w-full h-full object-cover filter brightness-95"
              />

              {/* Devotional Light Overlay & Halos */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#200202] via-transparent to-black/30 pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-radial from-[#ffd76a]/20 to-transparent blur-xl pointer-events-none"></div>

              {/* Falling Flower Petals Animation */}
              {flowers.map((fl) => (
                <span
                  key={fl.id}
                  className="absolute text-xl pointer-events-none animate-bounce"
                  style={{
                    left: `${fl.left}%`,
                    top: `${15 + Math.random() * 50}%`,
                    transition: 'all 2s ease-in-out',
                    animationDuration: `${1.5 + fl.delay}s`,
                  }}
                >
                  🌸
                </span>
              ))}

              {/* Live Devotees Count */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-[#ffd76a]/30 text-[11px] text-[#ffd76a] flex items-center gap-1.5 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>{prayersCount.toLocaleString()} Devotees in Darshan</span>
              </div>

              {/* Bottom Offering Diya */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                {isDiyaLit && (
                  <div className="animate-flame w-4 h-7 bg-gradient-to-t from-red-600 via-amber-400 to-yellow-100 rounded-full [clip-path:polygon(50%_0%,100%_65%,75%_100%,25%_100%,0%_65%)] shadow-[0_0_15px_#ffd76a]"></div>
                )}
                <div className="w-10 h-3 bg-gradient-to-r from-[#ffd76a] to-[#781010] rounded-b-full"></div>
              </div>
            </>
          ) : (
            /* YouTube Bhajan Video Embed Frame */
            <div className="w-full h-full bg-black">
              {isPlayingBhajan && (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&enablejsapi=1&rel=0&playsinline=1`}
                  title="Maa Durga Bhajan"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          )}

          {/* Hidden Background Audio Player when in Sanctum View */}
          {viewMode === 'sanctum' && isPlayingBhajan && (
            <div className="hidden pointer-events-none opacity-0">
              <iframe
                width="1"
                height="1"
                src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&enablejsapi=1&rel=0&playsinline=1`}
                title="Maa Durga Bhajan Audio Track"
                allow="autoplay"
              ></iframe>
            </div>
          )}
        </div>

        {/* Interactive Devotional Actions */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
          {/* Pushpanjali Button */}
          <button
            onClick={handleOfferFlowers}
            className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-[#851313] to-[#590a0a] hover:from-[#a01616] hover:to-[#6b0c0c] border border-[#ffd76a]/40 text-[#fff7e6] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#ffd76a]" />
            <span>Offer Pushpanjali</span>
          </button>

          {/* Light Diya Button */}
          <button
            onClick={() => setIsDiyaLit(!isDiyaLit)}
            className={`py-2.5 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer ${
              isDiyaLit
                ? 'bg-gradient-to-r from-[#ffd76a] to-[#d9a441] text-[#2a0404] border-[#ffd76a]'
                : 'bg-[#2a0404] hover:bg-[#400707] border-[#ffd76a]/40 text-[#ffd76a]'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>{isDiyaLit ? 'Diya is Lit' : 'Light Diya'}</span>
          </button>

          {/* Pranam Button */}
          <button
            onClick={() => {
              setPrayersCount((prev) => prev + 1);
            }}
            className="py-2.5 px-2 rounded-xl bg-[#2a0404] hover:bg-[#400707] border border-[#ffd76a]/40 text-[#ffd76a] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>Pranam (प्रणाम)</span>
          </button>
        </div>

        {/* Shloka in modal */}
        <p className="font-hindi text-xs sm:text-sm text-center text-[#ffd76a] mt-3 pt-2 border-t border-[#d9a441]/20">
          सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥
        </p>
      </div>
    </div>
  );
};
