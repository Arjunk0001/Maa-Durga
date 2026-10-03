import React from 'react';
import { playTempleBell } from '../utils/audio';

interface DevotionalFooterProps {
  onOpenSuperAdmin?: () => void;
  onOpenAdmin?: () => void;
}

export const DevotionalFooter: React.FC<DevotionalFooterProps> = ({
  onOpenSuperAdmin,
  onOpenAdmin,
}) => {
  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-b from-[#200202] via-[#350505] to-[#120101] border-t border-[#d9a441]/30 pt-10 pb-24 sm:pb-28 text-center">
      {/* Background Temple Silhouette & Diyas */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex items-end justify-center">
        <svg
          className="w-full max-w-4xl h-48 text-[#d9a441]"
          viewBox="0 0 1000 250"
          fill="currentColor"
        >
          {/* Temple Skyline Silhouettes */}
          <path d="M0 250 L80 250 L80 180 L120 140 L160 180 L160 250 L300 250 L350 160 L400 90 L450 160 L500 250 L650 250 L700 130 L750 70 L800 130 L850 250 L1000 250 Z" />
        </svg>
      </div>

      {/* Floating Golden Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-radial from-[#ffd76a]/15 to-transparent blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl mx-auto px-4">
        {/* Top Auspicious Motif */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-10 h-[1px] bg-[#d9a441]/50"></span>
          <span className="text-[#ffd76a] text-xl">🪷</span>
          <span className="w-10 h-[1px] bg-[#d9a441]/50"></span>
        </div>

        {/* Sacred Sanskrit Stotram (Framed in devotional quotation card) */}
        <div className="p-6 rounded-2xl bg-[#300505]/70 border border-[#d9a441]/30 shadow-xl backdrop-blur-xs mb-6">
          <p className="font-hindi text-lg sm:text-2xl text-[#ffe399] tracking-wide leading-relaxed drop-shadow-md">
            “या देवी सर्वभूतेषु शक्ति रूपेण संस्थिता,
          </p>
          <p className="font-hindi text-lg sm:text-2xl text-[#ffe399] tracking-wide leading-relaxed drop-shadow-md mt-1">
            नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥”
          </p>
        </div>

        {/* Jai Maa Durga Callout */}
        <div className="flex flex-col items-center gap-1 my-4">
          <span className="text-xl">🪷</span>
          <h3
            onClick={() => playTempleBell()}
            className="font-marcellus text-2xl sm:text-3xl font-bold tracking-widest gold-gradient-text uppercase cursor-pointer hover:scale-105 active:scale-95 transition-transform drop-shadow-lg"
          >
            Jai Maa Durga
          </h3>
          <p className="font-body text-xs sm:text-sm text-[#ffd76a]/80 tracking-wider mt-1">
            Together we celebrate faith, devotion & seva.
          </p>
        </div>

        {/* Flickering Devotional Diyas at bottom */}
        <div className="flex items-center justify-center gap-8 my-6">
          {/* Diya 1 */}
          <div className="flex flex-col items-center">
            <div className="animate-flame w-3.5 h-6 bg-gradient-to-t from-red-600 via-amber-400 to-yellow-100 rounded-full [clip-path:polygon(50%_0%,100%_65%,75%_100%,25%_100%,0%_65%)] shadow-[0_0_12px_#ffd76a]"></div>
            <div className="w-9 h-2.5 bg-[#d9a441] rounded-b-full shadow-sm"></div>
          </div>

          {/* Central Trishul */}
          <span className="text-lg text-[#ffd76a]/60 font-serif">🔱</span>

          {/* Diya 2 */}
          <div className="flex flex-col items-center">
            <div className="animate-flame w-3.5 h-6 bg-gradient-to-t from-red-600 via-amber-400 to-yellow-100 rounded-full [clip-path:polygon(50%_0%,100%_65%,75%_100%,25%_100%,0%_65%)] shadow-[0_0_12px_#ffd76a]" style={{ animationDelay: '0.4s' }}></div>
            <div className="w-9 h-2.5 bg-[#d9a441] rounded-b-full shadow-sm"></div>
          </div>
        </div>

        {/* Samiti Rights & Information */}
        <div className="text-[11px] text-[#cca574] space-y-1">
          <p>© 2026 Shree Shakti Durga Puja Samiti, Lucknow. All Devotional Rights Reserved.</p>
          <p className="text-[10px] text-[#ffd76a]/60">
            Registered Non-Profit Society • Sector 4, Gomti Nagar, Lucknow
          </p>

          {/* Discreet Admin Portal Access */}
          <div className="pt-3 flex items-center justify-center text-[11px]">
            {onOpenAdmin && (
              <button
                onClick={() => {
                  playTempleBell();
                  onOpenAdmin();
                }}
                className="text-[#ffd76a]/60 hover:text-[#ffd76a] hover:underline flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <span>समिति प्रबंधन कक्ष</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
