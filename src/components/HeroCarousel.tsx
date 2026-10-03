import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Eye } from 'lucide-react';
import { HeroSlide } from '../data/pandalData';
import { playTempleBell } from '../utils/audio';

interface HeroCarouselProps {
  slides: HeroSlide[];
  onOpenDarshan: () => void;
  onOpenLightbox: (index: number) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  onOpenDarshan,
  onOpenLightbox,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto transition every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [slides.length, isPaused]);

  const handlePrev = () => {
    playTempleBell();
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    playTempleBell();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 45) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  return (
    <div
      className="relative w-full max-w-4xl mx-auto px-3 sm:px-6 pt-4 pb-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden gold-border-glow bg-[#1a0202] shadow-2xl group">
        {/* Slides */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
            } transition-transform duration-[1200ms]`}
          >
            {/* Slide Image with fallback */}
            <img
              src={slide.image}
              alt={slide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-[0.9] group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                // Fallback to stylized devotional gradient
                e.currentTarget.style.display = 'none';
              }}
            />

            {/* Gradient Scrims for text contrast and devotional warmth */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#200202] via-black/30 to-transparent"></div>
            <div className="absolute inset-0 bg-radial from-transparent via-[#ffd76a]/5 to-[#2a0404]/50 pointer-events-none"></div>

            {/* Slide Overlay Text */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 right-16 z-20">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#590a0a]/80 backdrop-blur-sm border border-[#ffd76a]/40 text-[#ffd76a] text-[11px] font-semibold tracking-wider uppercase mb-2 shadow-md">
                <Sparkles className="w-3 h-3 text-[#ffd76a]" />
                {slide.tag}
              </span>

              <h2 className="font-marcellus text-xl sm:text-3xl font-bold text-[#fff7e6] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {slide.title}
              </h2>

              <p className="font-body text-xs sm:text-sm text-[#e6cfab] drop-shadow-md line-clamp-1 sm:line-clamp-2 max-w-xl">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}

        {/* Quick Action Overlay: Virtual Darshan & Lightbox */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          <button
            onClick={() => onOpenLightbox(currentIndex)}
            className="p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-[#ffd76a]/40 text-[#ffd76a] hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="View Fullscreen Photo"
            aria-label="View photo"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenDarshan}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#9b1c1c] to-[#700f0f] hover:from-[#b91c1c] hover:to-[#851313] border border-[#ffd76a]/60 text-[#ffd76a] text-xs font-semibold shadow-lg hover:shadow-[0_0_15px_rgba(255,215,106,0.5)] active:scale-95 transition-all cursor-pointer"
            title="Open Live Virtual Darshan"
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
            <span>Virtual Darshan</span>
          </button>
        </div>

        {/* Left / Right Chevron Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/75 border border-[#ffd76a]/30 text-[#ffd76a] hover:border-[#ffd76a] transition-all cursor-pointer opacity-80 group-hover:opacity-100"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/75 border border-[#ffd76a]/30 text-[#ffd76a] hover:border-[#ffd76a] transition-all cursor-pointer opacity-80 group-hover:opacity-100"
          aria-label="Next Image"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-[#d9a441]/20">
          {slides.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => {
                playTempleBell();
                setCurrentIndex(dotIdx);
              }}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                dotIdx === currentIndex
                  ? 'w-6 h-2 bg-[#ffd76a] shadow-[0_0_8px_#ffd76a]'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
