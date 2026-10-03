import React, { useState, useEffect } from 'react';
import { playTempleBell, playShankhDhwani } from '../utils/audio';

interface SplashScreenProps {
  onOpenComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onOpenComplete }) => {
  const [phase, setPhase] = useState<'showing' | 'opening' | 'finished'>('showing');
  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    // 5-second devotional display
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerOpening();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const triggerOpening = () => {
    if (phase !== 'showing') return;
    setPhase('opening');
    playTempleBell();
    setTimeout(() => {
      playShankhDhwani();
    }, 350);

    // Opening animation takes ~1.5s
    setTimeout(() => {
      setPhase('finished');
      onOpenComplete();
    }, 1500);
  };

  if (phase === 'finished') {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden select-none pointer-events-auto transition-opacity duration-700 ${
        phase === 'opening' ? 'pointer-events-none' : ''
      }`}
      aria-label="Welcome Devotional Splash"
    >
      {/* LEFT DOOR PANEL */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-[#200202] via-[#400606] to-[#1c0202] border-r border-[#d9a441]/40 shadow-2xl transition-transform duration-[1400ms] ease-in-out origin-left flex flex-col justify-between items-end pr-4 sm:pr-8 py-8 ${
          phase === 'opening' ? '-translate-x-full scale-95 opacity-90' : 'translate-x-0'
        }`}
        style={{
          boxShadow: phase === 'opening' ? 'inset -30px 0 60px rgba(217, 164, 65, 0.4)' : 'none',
        }}
      >
        {/* Left Hanging Brass Bells */}
        <div className="flex flex-col items-center gap-3 pt-6 opacity-85">
          <div className="w-[1px] h-20 bg-gradient-to-b from-[#d9a441]/70 to-[#d9a441] shadow-[0_0_8px_#ffd76a]"></div>
          <button
            onClick={() => playTempleBell()}
            className="text-2xl animate-bell-l hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title="Ring Temple Bell"
            aria-label="Ring Temple Bell"
          >
            🔔
          </button>
        </div>

        {/* Left Temple Motif Watermark */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffd76a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        {/* Ornate Left Border Tracery */}
        <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-b from-[#d9a441]/20 via-[#ffd76a]/60 to-[#d9a441]/20"></div>
      </div>

      {/* RIGHT DOOR PANEL */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#200202] via-[#400606] to-[#1c0202] border-l border-[#d9a441]/40 shadow-2xl transition-transform duration-[1400ms] ease-in-out origin-right flex flex-col justify-between items-start pl-4 sm:pr-8 py-8 ${
          phase === 'opening' ? 'translate-x-full scale-95 opacity-90' : 'translate-x-0'
        }`}
        style={{
          boxShadow: phase === 'opening' ? 'inset 30px 0 60px rgba(217, 164, 65, 0.4)' : 'none',
        }}
      >
        {/* Right Hanging Brass Bells */}
        <div className="flex flex-col items-center gap-3 pt-6 opacity-85">
          <div className="w-[1px] h-24 bg-gradient-to-b from-[#d9a441]/70 to-[#d9a441] shadow-[0_0_8px_#ffd76a]"></div>
          <button
            onClick={() => playTempleBell()}
            className="text-2xl animate-bell-r hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title="Ring Temple Bell"
            aria-label="Ring Temple Bell"
          >
            🔔
          </button>
        </div>

        {/* Right Temple Motif Watermark */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffd76a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        {/* Ornate Right Border Tracery */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-b from-[#d9a441]/20 via-[#ffd76a]/60 to-[#d9a441]/20"></div>
      </div>

      {/* CENTRAL DIVINE CONTENT (Fades and scales with golden divine radiance during opening) */}
      <div
        className={`relative z-20 flex flex-col items-center justify-between h-full py-10 px-4 text-center transition-all duration-1000 ${
          phase === 'opening' ? 'scale-110 opacity-0 blur-sm' : 'scale-100 opacity-100'
        }`}
      >
        {/* Floating Sparkles Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(14)].map((_, i) => (
            <span
              key={i}
              className="absolute text-[#ffd76a] text-xs pointer-events-none"
              style={{
                top: `${15 + ((i * 17) % 70)}%`,
                left: `${10 + ((i * 23) % 80)}%`,
                animation: `float-sparkle ${3 + (i % 4)}s infinite ease-in-out ${i * 0.4}s`,
                opacity: 0.6,
              }}
            >
              ✦
            </span>
          ))}
        </div>

        {/* Top Auspicious Symbol */}
        <div className="pt-4 flex flex-col items-center gap-1">
          <span className="text-[#ffd76a] text-sm tracking-widest uppercase font-serif opacity-80">
            ।। ॐ दुं दुर्गायै नमः ।।
          </span>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#ffd76a] to-transparent"></div>
        </div>

        {/* Central Maa Durga Motif & Golden Glow */}
        <div className="relative flex flex-col items-center my-auto max-w-md w-full">
          {/* Subtle Divine Halo Behind Motif */}
          <div className="absolute -inset-8 bg-radial from-[#ffd76a]/25 via-[#d9a441]/10 to-transparent blur-2xl rounded-full animate-halo pointer-events-none"></div>

          {/* Maa Durga Sacred Third Eye / Trinetra & Trishul Graphic */}
          <div className="relative mb-6 p-4 rounded-full bg-gradient-to-b from-[#5c0b0b]/60 to-[#350505]/80 border border-[#d9a441]/40 shadow-[0_0_35px_rgba(217,164,65,0.35)]">
            <svg
              className="w-24 h-24 sm:w-28 sm:h-28 text-[#ffd76a] drop-shadow-[0_0_15px_rgba(255,215,106,0.8)]"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Trishul Central Spear */}
              <path
                d="M60 8V95M60 8L50 26M60 8L70 26"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Trishul Prongs */}
              <path
                d="M38 28C38 48 50 62 60 62C70 62 82 48 82 28"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              {/* Sacred Third Eye (Trinetra) */}
              <path
                d="M60 40C66 48 66 54 60 60C54 54 54 48 60 40Z"
                fill="#ffea79"
                stroke="#d9a441"
                strokeWidth="1.5"
              />
              <circle cx="60" cy="50" r="3" fill="#8a0f0f" />

              {/* Durga Divine Left Eye */}
              <path
                d="M30 68C38 60 46 64 52 70C44 73 36 73 30 68Z"
                fill="#fff9e6"
                stroke="#d9a441"
                strokeWidth="1.2"
              />
              <circle cx="41" cy="67" r="3.2" fill="#2a0505" />

              {/* Durga Divine Right Eye */}
              <path
                d="M90 68C82 60 74 64 68 70C76 73 84 73 90 68Z"
                fill="#fff9e6"
                stroke="#d9a441"
                strokeWidth="1.2"
              />
              <circle cx="79" cy="67" r="3.2" fill="#2a0505" />

              {/* Red Chandan Bindi */}
              <circle cx="60" cy="34" r="3.5" fill="#dc2626" />
              <circle cx="60" cy="34" r="1.5" fill="#fef08a" />

              {/* Trishul Base Damru Knot */}
              <circle cx="60" cy="80" r="4" fill="#d9a441" />
            </svg>
          </div>

          {/* Samiti Title */}
          <h1 className="font-marcellus text-4xl sm:text-5xl font-bold tracking-wider gold-gradient-text drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            SHREE SHAKTI
          </h1>
          <h2 className="font-serif text-lg sm:text-xl text-[#f3e3be] tracking-widest mt-1 uppercase font-semibold">
            Durga Puja Samiti
          </h2>

          <div className="flex items-center gap-3 my-3">
            <span className="w-8 h-[1px] bg-[#d9a441]/50"></span>
            <span className="text-[#ffd76a] text-xs">🪷</span>
            <span className="w-8 h-[1px] bg-[#d9a441]/50"></span>
          </div>

          <p className="font-body text-xs sm:text-sm text-[#e8cda3] tracking-widest uppercase font-medium">
            Faith • Culture • Togetherness
          </p>

          <p className="font-body text-xs text-[#d9a441]/80 mt-2 flex items-center gap-1">
            <span>📍</span> Lucknow, Uttar Pradesh
          </p>
        </div>

        {/* Bottom Section: Glowing Diya & Enter CTA */}
        <div className="flex flex-col items-center gap-4 pb-2 w-full max-w-xs">
          {/* Glowing Devotional Diya */}
          <div className="relative flex flex-col items-center">
            {/* Diya Flame */}
            <div className="animate-flame w-6 h-10 bg-gradient-to-t from-[#ff4500] via-[#ffa500] to-[#ffff99] rounded-full [clip-path:polygon(50%_0%,100%_65%,75%_100%,25%_100%,0%_65%)] shadow-[0_0_20px_#ffd76a]"></div>

            {/* Diya Base (Brass bowl) */}
            <svg
              className="w-16 h-8 text-[#d9a441] -mt-1 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
              viewBox="0 0 64 28"
              fill="currentColor"
            >
              <path d="M4 8C4 8 16 26 32 26C48 26 60 8 60 8C60 8 50 14 32 14C14 14 4 8 4 8Z" fill="url(#diyaGrad)" />
              <ellipse cx="32" cy="10" rx="26" ry="4" fill="#a46d1b" />
              <defs>
                <linearGradient id="diyaGrad" x1="4" y1="8" x2="60" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffd76a" />
                  <stop offset="0.6" stopColor="#d9a441" />
                  <stop offset="1" stopColor="#7a4f10" />
                </linearGradient>
              </defs>
            </svg>

            {/* Glowing Floor Reflection */}
            <div className="w-24 h-3 bg-[#ffd76a]/20 rounded-full blur-sm -mt-1"></div>
          </div>

          {/* Quick Enter Button with Countdown ring */}
          <button
            onClick={triggerOpening}
            className="group relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#590a0a] via-[#851616] to-[#590a0a] border border-[#ffd76a]/60 text-[#fff4d1] text-xs font-semibold tracking-wider uppercase hover:border-[#ffd76a] hover:shadow-[0_0_20px_rgba(255,215,106,0.4)] active:scale-95 transition-all cursor-pointer"
          >
            <span>Enter Pandal</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffd76a] animate-ping"></span>
            <span className="text-[10px] text-[#ffd76a]/80 font-mono">({countdown}s)</span>
          </button>
        </div>
      </div>

      {/* Central Radiance Beam (flashes during door split) */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-[#fff5d0] to-transparent pointer-events-none transition-opacity duration-700 ${
          phase === 'opening' ? 'opacity-90 blur-xl scale-125' : 'opacity-0'
        }`}
      ></div>
    </div>
  );
};
