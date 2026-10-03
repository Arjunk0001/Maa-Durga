import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2, Sparkles } from 'lucide-react';
import { GalleryItem } from '../data/pandalData';
import { playTempleBell } from '../utils/audio';

interface GallerySectionProps {
  items: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Pratima', 'Pandal', 'Aarti', 'Cultural', 'Community'];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter((item) => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    playTempleBell();
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const handleLightboxPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTempleBell();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const handleLightboxNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTempleBell();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
    }
  };

  return (
    <section id="gallery-section" className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 scroll-mt-20">
      {/* Section Header with Ornate Motifs */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-[#ffd76a]/60 text-sm hidden sm:inline">✤ ———</span>
        <span className="text-xl">🪷</span>
        <h2 className="font-marcellus text-2xl sm:text-3xl font-bold tracking-wide gold-gradient-text text-center">
          Maa Durga Gallery
        </h2>
        <span className="text-xl">🪷</span>
        <span className="text-[#ffd76a]/60 text-sm hidden sm:inline">——— ✤</span>
      </div>

      <p className="text-center font-body text-xs sm:text-sm text-[#d4af37]/80 mb-4 max-w-lg mx-auto">
        Glimpses of sacred rituals, idol decorations, Dhunuchi dance, and festive celebrations.
      </p>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-3 mb-4 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              playTempleBell();
              setSelectedCategory(cat);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#ffd76a] to-[#d9a441] text-[#2a0404] font-semibold shadow-[0_0_12px_rgba(255,215,106,0.3)]'
                : 'bg-[#400707] text-[#eddab5] hover:bg-[#590a0a] border border-[#d9a441]/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Horizontal Scrollable Gallery Cards */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar snap-x snap-mandatory">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => openLightbox(index)}
            className="group relative flex-shrink-0 w-64 sm:w-72 aspect-[3/4] rounded-2xl overflow-hidden gold-border bg-[#1d0303] cursor-pointer snap-start hover:shadow-[0_0_20px_rgba(217,164,65,0.3)] transition-all duration-300"
          >
            {/* Gallery Image */}
            <img
              src={item.image}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0202] via-transparent to-black/30 group-hover:from-[#2a0404] transition-colors"></div>

            {/* Top Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-[#ffd76a]/30 text-[#ffd76a] text-[10px] uppercase font-semibold tracking-wider">
                {item.category}
              </span>
            </div>

            {/* Expand Icon */}
            <div className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/50 text-[#ffd76a] opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
              <h3 className="font-marcellus text-base sm:text-lg font-bold text-[#fff5e0] group-hover:text-[#ffd76a] transition-colors">
                {item.title}
              </h3>
              <p className="font-body text-xs text-[#d2b48c] line-clamp-2 mt-0.5">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {activeLightboxIndex !== null && filteredItems[activeLightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Lightbox Top Bar: Counter & Close Button */}
          <div className="w-full max-w-4xl flex items-center justify-between z-20 text-[#ffd76a]">
            <span className="font-mono text-sm tracking-wider px-3 py-1 rounded-full bg-white/10 border border-[#ffd76a]/30">
              {activeLightboxIndex + 1} / {filteredItems.length}
            </span>

            <button
              onClick={closeLightbox}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-[#ffd76a]/40 text-[#ffd76a] hover:scale-110 active:scale-95 transition-all cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Central Image & Controls */}
          <div
            className="relative flex items-center justify-center w-full max-w-4xl my-auto max-h-[75vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            <button
              onClick={handleLightboxPrev}
              className="absolute left-2 sm:-left-12 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-[#ffd76a]/50 text-[#ffd76a] transition-all hover:scale-110 cursor-pointer z-30"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Lightbox Image */}
            <img
              src={filteredItems[activeLightboxIndex].image}
              alt={filteredItems[activeLightboxIndex].title}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] max-w-full rounded-2xl object-contain gold-border-glow shadow-2xl"
            />

            {/* Next Button */}
            <button
              onClick={handleLightboxNext}
              className="absolute right-2 sm:-right-12 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-[#ffd76a]/50 text-[#ffd76a] transition-all hover:scale-110 cursor-pointer z-30"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Bottom Caption */}
          <div
            className="w-full max-w-xl text-center z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-marcellus text-lg sm:text-xl font-bold text-[#fff7e6]">
              {filteredItems[activeLightboxIndex].title}
            </h4>
            <p className="font-body text-xs sm:text-sm text-[#e0cbab] mt-1">
              {filteredItems[activeLightboxIndex].caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
